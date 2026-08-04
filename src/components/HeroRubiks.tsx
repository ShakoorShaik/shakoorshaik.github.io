import {
  Component,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type MutableRefObject,
  type PointerEvent,
  type ReactNode,
  type RefObject,
} from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {
  ACESFilmicToneMapping,
  Color,
  Group,
  MathUtils,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  Quaternion,
  SRGBColorSpace,
  Vector3,
} from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'

/** Cubie sizing — tight seams so lighting carves form */
const CUBIE_SIZE = 0.9
const CUBIE_GAP = 0.08
const STEP = CUBIE_SIZE + CUBIE_GAP
const STICKER = CUBIE_SIZE * 0.78
const STICKER_DEPTH = 0.045
const STICKER_LIFT = CUBIE_SIZE / 2 + STICKER_DEPTH * 0.35

/** Half-diagonal of assembled cube (corner from origin), unscaled */
const CUBE_RADIUS = (STEP + CUBIE_SIZE / 2) * Math.sqrt(3)

/** Slow, agency-style motion */
const TURN_DURATION = 1.25
const IDLE_TURN_MIN = 4.8
const IDLE_TURN_MAX = 7.2
const MAX_TILT = MathUtils.degToRad(9)
const YAW_SPEED = 0.1

/** Uniform scale — larger presence, frustum guard keeps corners in frame */
const FIT_SCALE = 0.58
const CAMERA_POS: [number, number, number] = [4.0, 2.9, 6.0]
const CAMERA_FOV = 30
const LOOK_Y = 0

/**
 * Seiko / Grand Seiko luxury dial palette —
 * champagne, moonlit navy, autumn burgundy, Atera emerald, snow ivory, gunmetal
 */
const BODY = '#121214'
const CORE = '#070709'

type FaceId = 'px' | 'nx' | 'py' | 'ny' | 'pz' | 'nz'

const FACE_COLORS: Record<FaceId, string> = {
  py: '#D4B06E', // champagne / Bantō gold — warmer, brighter
  ny: '#F0EBE0', // snow ivory
  pz: '#1A4570', // moonlit navy — richer blue
  nz: '#7A2438', // Boshū burgundy — deeper crimson lift
  px: '#1F6A52', // Atera emerald — clearer green
  nx: '#6A7078', // shadow gunmetal — slightly clearer
}

type Axis = 'x' | 'y' | 'z'
type FaceMove = { axis: Axis; layer: -1 | 1; dir: 1 | -1 }

const AXES: Axis[] = ['x', 'y', 'z']
const OUTER_LAYERS: Array<-1 | 1> = [-1, 1]

type CubieData = {
  id: number
  mesh: Group
  coords: Vector3
}

type TurnState = {
  active: boolean
  progress: number
  move: FaceMove
  cubies: CubieData[]
}

const stickerGeo = new RoundedBoxGeometry(STICKER, STICKER, STICKER_DEPTH, 2, 0.04)
const bodyGeo = new RoundedBoxGeometry(CUBIE_SIZE, CUBIE_SIZE, CUBIE_SIZE, 5, 0.09)
const coreGeo = new RoundedBoxGeometry(
  CUBIE_SIZE * 0.78,
  CUBIE_SIZE * 0.78,
  CUBIE_SIZE * 0.78,
  2,
  0.04,
)

/** Dark case plastic — soft matte like a Seiko mid-case */
const bodyMat = new MeshStandardMaterial({
  color: new Color(BODY),
  metalness: 0.12,
  roughness: 0.88,
})
const coreMat = new MeshStandardMaterial({
  color: new Color(CORE),
  metalness: 0.04,
  roughness: 0.96,
})

/** Lacquered dial stickers — deep color with soft clearcoat sheen */
function makeStickerMat(hex: string, opts?: { metalness?: number; roughness?: number }) {
  return new MeshPhysicalMaterial({
    color: new Color(hex),
    metalness: opts?.metalness ?? 0.18,
    roughness: opts?.roughness ?? 0.42,
    clearcoat: 0.55,
    clearcoatRoughness: 0.28,
    reflectivity: 0.45,
  })
}

const faceMats: Record<FaceId, MeshPhysicalMaterial> = {
  py: makeStickerMat(FACE_COLORS.py, { metalness: 0.32, roughness: 0.38 }),
  ny: makeStickerMat(FACE_COLORS.ny, { metalness: 0.1, roughness: 0.48 }),
  pz: makeStickerMat(FACE_COLORS.pz, { metalness: 0.22, roughness: 0.4 }),
  nz: makeStickerMat(FACE_COLORS.nz, { metalness: 0.2, roughness: 0.44 }),
  px: makeStickerMat(FACE_COLORS.px, { metalness: 0.2, roughness: 0.42 }),
  nx: makeStickerMat(FACE_COLORS.nx, { metalness: 0.35, roughness: 0.36 }),
}

const SHARED_GEOS = new Set([stickerGeo, bodyGeo, coreGeo])

function easeInOutExpo(t: number) {
  if (t === 0 || t === 1) return t
  return t < 0.5
    ? Math.pow(2, 20 * t - 10) / 2
    : (2 - Math.pow(2, -20 * t + 10)) / 2
}

function easeInOutQuint(t: number) {
  return t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2
}

function easeFluid(t: number) {
  return easeInOutQuint(t) * 0.55 + easeInOutExpo(Math.min(1, Math.max(0, t))) * 0.45
}

function randomMove(exclude?: FaceMove | null): FaceMove {
  let move: FaceMove
  do {
    move = {
      axis: AXES[Math.floor(Math.random() * 3)],
      layer: OUTER_LAYERS[Math.floor(Math.random() * 2)],
      dir: Math.random() < 0.5 ? 1 : -1,
    }
  } while (
    exclude &&
    move.axis === exclude.axis &&
    move.layer === exclude.layer &&
    move.dir === -exclude.dir
  )
  return move
}

function rotateCoords(coords: Vector3, axis: Axis, dir: 1 | -1) {
  const { x, y, z } = coords
  if (axis === 'x') {
    if (dir === 1) coords.set(x, -z, y)
    else coords.set(x, z, -y)
  } else if (axis === 'y') {
    if (dir === 1) coords.set(z, y, -x)
    else coords.set(-z, y, x)
  } else {
    if (dir === 1) coords.set(-y, x, z)
    else coords.set(y, -x, z)
  }
  coords.x = Math.round(coords.x)
  coords.y = Math.round(coords.y)
  coords.z = Math.round(coords.z)
}

function addSticker(
  group: Group,
  face: FaceId,
  pos: [number, number, number],
  rot: [number, number, number],
) {
  const mesh = new Mesh(stickerGeo, faceMats[face])
  mesh.position.set(...pos)
  mesh.rotation.set(...rot)
  group.add(mesh)
}

function createCubie(x: number, y: number, z: number): Group {
  const group = new Group()

  group.add(new Mesh(bodyGeo, bodyMat))
  group.add(new Mesh(coreGeo, coreMat))

  if (x === 1) addSticker(group, 'px', [STICKER_LIFT, 0, 0], [0, Math.PI / 2, 0])
  if (x === -1) addSticker(group, 'nx', [-STICKER_LIFT, 0, 0], [0, -Math.PI / 2, 0])
  if (y === 1) addSticker(group, 'py', [0, STICKER_LIFT, 0], [-Math.PI / 2, 0, 0])
  if (y === -1) addSticker(group, 'ny', [0, -STICKER_LIFT, 0], [Math.PI / 2, 0, 0])
  if (z === 1) addSticker(group, 'pz', [0, 0, STICKER_LIFT], [0, 0, 0])
  if (z === -1) addSticker(group, 'nz', [0, 0, -STICKER_LIFT], [0, Math.PI, 0])

  group.position.set(x * STEP, y * STEP, z * STEP)
  return group
}

function disposeCubie(group: Group) {
  group.traverse((obj) => {
    if (!(obj instanceof Mesh)) return
    if (!SHARED_GEOS.has(obj.geometry)) obj.geometry?.dispose()
  })
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return reduced
}

function useWebGLSupport() {
  return useMemo(() => {
    try {
      const canvas = document.createElement('canvas')
      return !!(
        canvas.getContext('webgl2') ||
        canvas.getContext('webgl') ||
        canvas.getContext('experimental-webgl')
      )
    } catch {
      return false
    }
  }, [])
}

function useInView(ref: RefObject<HTMLElement | null>) {
  const [inView, setInView] = useState(true)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: '80px', threshold: 0.05 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref])

  return inView
}

function StudioLights() {
  return (
    <>
      {/* Jewelry-case studio wash — lets lacquered dials read rich */}
      <ambientLight intensity={0.34} color="#e8e0d4" />
      <hemisphereLight args={['#fff4e8', '#0a0c10', 0.62]} />

      {/* Warm key — champagne & ivory catch light */}
      <directionalLight position={[4.4, 6.8, 3.0]} intensity={2.85} color="#fff6ea" />
      {/* Cool fill — navy & emerald stay deep */}
      <directionalLight position={[-4.6, 2.4, 2.8]} intensity={1.25} color="#b0c0d8" />
      {/* Soft under-bounce */}
      <directionalLight position={[0.3, -4.0, 1.5]} intensity={0.48} color="#6a7382" />

      {/* Color-aware rims — emerald + burgundy accents */}
      <pointLight position={[-3.6, 2.2, -2.6]} intensity={1.55} color="#2f8f6e" distance={22} decay={2} />
      <pointLight position={[3.5, 0.8, -2.0]} intensity={1.35} color="#8b3a4a" distance={22} decay={2} />
      {/* Champagne kiss from above-right */}
      <pointLight position={[2.8, 4.2, 3.2]} intensity={1.2} color="#e8c98a" distance={18} decay={2} />

      <spotLight
        position={[1.2, 7.2, 2.6]}
        angle={0.46}
        penumbra={0.86}
        intensity={1.9}
        color="#fffaf2"
        distance={28}
      />
      <pointLight position={[0.3, 1.3, 5.0]} intensity={1.05} color="#f0ebe3" distance={16} decay={2} />
    </>
  )
}

function RubiksCube({
  reducedMotion,
  pointer,
  triggerTurn,
  scrollProgress,
}: {
  reducedMotion: boolean
  pointer: MutableRefObject<{ x: number; y: number }>
  triggerTurn: MutableRefObject<(() => void) | null>
  scrollProgress: MutableRefObject<number>
}) {
  const outerRef = useRef<Group>(null)
  const cubeRootRef = useRef<Group>(null)
  const pivotRef = useRef<Group>(null)
  const cubiesRef = useRef<CubieData[]>([])
  const yaw = useRef(0.55)
  const elapsed = useRef(0)
  const nextTurnAt = useRef(3.2)
  const lastMove = useRef<FaceMove | null>(null)
  const tilt = useRef({ x: 0, z: 0 })
  const tiltVel = useRef({ x: 0, z: 0 })
  const floatY = useRef(0)
  const scrollYaw = useRef(0)
  const scrollPitch = useRef(0)
  const scrollRoll = useRef(0)
  const turn = useRef<TurnState>({
    active: false,
    progress: 0,
    move: { axis: 'y', layer: 1, dir: 1 },
    cubies: [],
  })

  const worldPos = useMemo(() => new Vector3(), [])
  const worldQuat = useMemo(() => new Quaternion(), [])
  const parentWorldQuat = useMemo(() => new Quaternion(), [])

  useEffect(() => {
    const root = cubeRootRef.current
    if (!root) return

    const cubies: CubieData[] = []
    let id = 0

    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          if (x === 0 && y === 0 && z === 0) continue
          const mesh = createCubie(x, y, z)
          root.add(mesh)
          cubies.push({ id: id++, mesh, coords: new Vector3(x, y, z) })
        }
      }
    }

    cubiesRef.current = cubies

    return () => {
      for (const c of cubiesRef.current) {
        root.remove(c.mesh)
        disposeCubie(c.mesh)
      }
      cubiesRef.current = []
    }
  }, [])

  const beginTurn = useCallback(
    (move: FaceMove) => {
      const pivot = pivotRef.current
      const root = cubeRootRef.current
      if (!pivot || !root || turn.current.active) return false

      const layerCubies = cubiesRef.current.filter(
        (c) => Math.abs(c.coords[move.axis] - move.layer) < 0.01,
      )
      if (layerCubies.length === 0) return false

      pivot.rotation.set(0, 0, 0)
      pivot.updateMatrixWorld(true)
      root.updateMatrixWorld(true)

      for (const c of layerCubies) {
        c.mesh.updateMatrixWorld(true)
        c.mesh.getWorldPosition(worldPos)
        c.mesh.getWorldQuaternion(worldQuat)

        root.remove(c.mesh)
        pivot.add(c.mesh)

        pivot.worldToLocal(worldPos)
        c.mesh.position.copy(worldPos)

        pivot.getWorldQuaternion(parentWorldQuat)
        c.mesh.quaternion.copy(parentWorldQuat.invert().multiply(worldQuat))
      }

      turn.current = { active: true, progress: 0, move, cubies: layerCubies }
      lastMove.current = move
      return true
    },
    [parentWorldQuat, worldPos, worldQuat],
  )

  const finishTurn = useCallback(() => {
    const pivot = pivotRef.current
    const root = cubeRootRef.current
    const state = turn.current
    if (!pivot || !root || !state.active) return

    const { move, cubies } = state
    const angle = (Math.PI / 2) * move.dir

    pivot.rotation.set(0, 0, 0)
    if (move.axis === 'x') pivot.rotation.x = angle
    else if (move.axis === 'y') pivot.rotation.y = angle
    else pivot.rotation.z = angle
    pivot.updateMatrixWorld(true)
    root.updateMatrixWorld(true)

    for (const c of cubies) {
      c.mesh.updateMatrixWorld(true)
      c.mesh.getWorldPosition(worldPos)
      c.mesh.getWorldQuaternion(worldQuat)

      pivot.remove(c.mesh)
      root.add(c.mesh)

      root.worldToLocal(worldPos)
      c.mesh.position.set(
        Math.round(worldPos.x / STEP) * STEP,
        Math.round(worldPos.y / STEP) * STEP,
        Math.round(worldPos.z / STEP) * STEP,
      )

      root.getWorldQuaternion(parentWorldQuat)
      c.mesh.quaternion.copy(parentWorldQuat.invert().multiply(worldQuat))

      rotateCoords(c.coords, move.axis, move.dir)
    }

    pivot.rotation.set(0, 0, 0)
    turn.current.active = false
    turn.current.progress = 0
    turn.current.cubies = []
  }, [parentWorldQuat, worldPos, worldQuat])

  useEffect(() => {
    triggerTurn.current = () => {
      if (reducedMotion || turn.current.active) return
      beginTurn(randomMove(lastMove.current))
    }
    return () => {
      triggerTurn.current = null
    }
  }, [beginTurn, reducedMotion, triggerTurn])

  useFrame((_, delta) => {
    const outer = outerRef.current
    const pivot = pivotRef.current
    if (!outer) return

    const dt = Math.min(delta, 0.05)
    elapsed.current += dt

    const targetFloat =
      Math.sin(elapsed.current * 0.4) * 0.028 + Math.sin(elapsed.current * 0.72) * 0.01
    floatY.current = MathUtils.lerp(floatY.current, targetFloat, 0.08)
    outer.position.y = floatY.current

    // Scroll-driven 3D parallax — tip, yaw, and subtle roll as you leave the hero
    const sp = scrollProgress.current
    scrollYaw.current = MathUtils.lerp(scrollYaw.current, sp * 1.15, 0.075)
    scrollPitch.current = MathUtils.lerp(scrollPitch.current, sp * -0.62, 0.075)
    scrollRoll.current = MathUtils.lerp(scrollRoll.current, sp * 0.18, 0.075)

    if (reducedMotion) {
      yaw.current += dt * 0.045
      outer.rotation.y = yaw.current + scrollYaw.current
      outer.rotation.x = MathUtils.lerp(outer.rotation.x, 0.2 + scrollPitch.current, 0.04)
      outer.rotation.z = MathUtils.lerp(outer.rotation.z, 0.04 + scrollRoll.current, 0.04)
      outer.scale.setScalar(FIT_SCALE)
      return
    }

    yaw.current += dt * YAW_SPEED

    const breatheX = 0.2 + Math.sin(elapsed.current * 0.18) * 0.035
    const breatheZ = 0.05 + Math.sin(elapsed.current * 0.14) * 0.025

    const targetTiltX = -pointer.current.y * MAX_TILT
    const targetTiltZ = pointer.current.x * MAX_TILT * 0.5
    const stiffness = 14
    const damping = 7
    tiltVel.current.x += (targetTiltX - tilt.current.x) * stiffness * dt
    tiltVel.current.z += (targetTiltZ - tilt.current.z) * stiffness * dt
    tiltVel.current.x *= Math.exp(-damping * dt)
    tiltVel.current.z *= Math.exp(-damping * dt)
    tilt.current.x += tiltVel.current.x * dt
    tilt.current.z += tiltVel.current.z * dt

    outer.rotation.y = yaw.current + scrollYaw.current
    outer.rotation.x = breatheX + tilt.current.x + scrollPitch.current
    outer.rotation.z = breatheZ + tilt.current.z + scrollRoll.current

    // Soft depth shrink on scroll
    const targetScale = FIT_SCALE * (1 - Math.min(0.12, Math.abs(sp) * 0.08))
    outer.scale.setScalar(MathUtils.lerp(outer.scale.x || FIT_SCALE, targetScale, 0.08))

    if (turn.current.active && pivot) {
      turn.current.progress += dt / TURN_DURATION
      const t = Math.min(1, turn.current.progress)
      const e = easeFluid(t)
      const angle = (Math.PI / 2) * turn.current.move.dir * e
      const { axis } = turn.current.move

      pivot.rotation.set(0, 0, 0)
      if (axis === 'x') pivot.rotation.x = angle
      else if (axis === 'y') pivot.rotation.y = angle
      else pivot.rotation.z = angle

      if (t >= 1) {
        finishTurn()
        nextTurnAt.current =
          IDLE_TURN_MIN + Math.random() * (IDLE_TURN_MAX - IDLE_TURN_MIN)
      }
    } else if (nextTurnAt.current <= 0) {
      if (beginTurn(randomMove(lastMove.current))) {
        nextTurnAt.current =
          IDLE_TURN_MIN + Math.random() * (IDLE_TURN_MAX - IDLE_TURN_MIN)
      } else {
        nextTurnAt.current = 0.4
      }
    } else {
      nextTurnAt.current -= dt
    }
  })

  return (
    <>
      <StudioLights />
      <group ref={outerRef} position={[0, LOOK_Y, 0]} scale={FIT_SCALE}>
        <group ref={cubeRootRef} />
        <group ref={pivotRef} />
      </group>
    </>
  )
}

function CssFallback() {
  return (
    <div
      className="h-full w-full"
      style={{
        background: [
          'radial-gradient(ellipse 50% 48% at 48% 42%, rgba(74,222,128,0.1), transparent 65%)',
          'radial-gradient(ellipse 46% 44% at 58% 58%, rgba(59,130,246,0.08), transparent 62%)',
          'radial-gradient(circle at 50% 48%, #1a1a1c 0%, transparent 55%)',
        ].join(', '),
      }}
      aria-hidden="true"
    />
  )
}

class CanvasErrorBoundary extends Component<
  { children: ReactNode; onError: () => void },
  { failed: boolean }
> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch() {
    this.props.onError()
  }

  render() {
    if (this.state.failed) return <CssFallback />
    return this.props.children
  }
}

function RendererSetup() {
  const { gl } = useThree()

  useEffect(() => {
    gl.toneMapping = ACESFilmicToneMapping
    gl.toneMappingExposure = 1.38
    gl.outputColorSpace = SRGBColorSpace
    // Transparent clear so page atmosphere (glows) shows through — no flat “canvas box”
    gl.setClearColor(0x000000, 0)
  }, [gl])

  return null
}

function CameraRig() {
  useFrame((state) => {
    state.camera.lookAt(0, LOOK_Y, 0)
  })
  return null
}

/** Keep camera distance safe for the cube's bounding sphere + motion padding */
function FrustumGuard() {
  const { camera, size } = useThree()

  useEffect(() => {
    const cam = camera as PerspectiveCamera
    // Extra padding for float + pointer tilt + scroll pitch
    const padding = 1.28
    const radius = CUBE_RADIUS * FIT_SCALE * padding
    const vFov = MathUtils.degToRad(cam.fov)
    const aspect = size.width / Math.max(1, size.height)
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * aspect)
    const distV = radius / Math.sin(vFov / 2)
    const distH = radius / Math.sin(hFov / 2)
    const need = Math.max(distV, distH)

    const target = new Vector3(0, LOOK_Y, 0)
    const dir = new Vector3(...CAMERA_POS).sub(target).normalize()
    // Always fit to current viewport — don't lock to a previously farther distance
    camera.position.copy(target).addScaledVector(dir, need)
    camera.lookAt(target)
    camera.updateProjectionMatrix()
  }, [camera, size.width, size.height])

  return null
}

export default function HeroRubiks() {
  const containerRef = useRef<HTMLDivElement>(null)
  const pointer = useRef({ x: 0, y: 0 })
  const triggerTurn = useRef<(() => void) | null>(null)
  const scrollProgress = useRef(0)
  const reducedMotion = usePrefersReducedMotion()
  const webgl = useWebGLSupport()
  const inView = useInView(containerRef)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (reducedMotion) return

    const onScroll = () => {
      const el = containerRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const viewportH = window.innerHeight || 1
      const mid = rect.top + rect.height * 0.5
      scrollProgress.current = MathUtils.clamp((viewportH * 0.45 - mid) / viewportH, -0.15, 1.6)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [reducedMotion])

  const frameloop: 'always' | 'demand' | 'never' = !inView
    ? 'never'
    : reducedMotion
      ? 'demand'
      : 'always'

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reducedMotion) return
    const rect = e.currentTarget.getBoundingClientRect()
    const w = Math.max(1, rect.width)
    const h = Math.max(1, rect.height)
    pointer.current.x = ((e.clientX - rect.left) / w) * 2 - 1
    pointer.current.y = ((e.clientY - rect.top) / h) * 2 - 1
  }

  const onPointerLeave = () => {
    pointer.current.x = 0
    pointer.current.y = 0
  }

  const onActivate = () => {
    triggerTurn.current?.()
  }

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Enter' && e.key !== ' ') return
    e.preventDefault()
    onActivate()
  }

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full min-h-[inherit] overflow-visible cursor-pointer"
      role="button"
      tabIndex={0}
      aria-label="Seiko-inspired colored Rubik's cube — press to turn a face"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      onClick={onActivate}
      onKeyDown={onKeyDown}
    >
      {!webgl || failed ? (
        <CssFallback />
      ) : (
        <CanvasErrorBoundary onError={() => setFailed(true)}>
          <Canvas
            dpr={[1, 1.75]}
            frameloop={frameloop}
            gl={{
              antialias: true,
              alpha: true,
              premultipliedAlpha: true,
              powerPreference: 'high-performance',
              failIfMajorPerformanceCaveat: false,
            }}
            camera={{ position: CAMERA_POS, fov: CAMERA_FOV, near: 0.1, far: 80 }}
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              overflow: 'visible',
              background: 'transparent',
              display: 'block',
            }}
            onCreated={({ gl, camera }) => {
              gl.setClearColor(0x000000, 0)
              camera.lookAt(0, LOOK_Y, 0)
            }}
          >
            <Suspense fallback={null}>
              <RendererSetup />
              <FrustumGuard />
              <CameraRig />
              <RubiksCube
                reducedMotion={reducedMotion}
                pointer={pointer}
                triggerTurn={triggerTurn}
                scrollProgress={scrollProgress}
              />
            </Suspense>
          </Canvas>
        </CanvasErrorBoundary>
      )}
    </div>
  )
}
