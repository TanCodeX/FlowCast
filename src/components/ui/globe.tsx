import { useEffect, useRef, useState } from "react"
import createGlobe, { type COBEOptions } from "cobe"
import { useMotionValue, useSpring } from "motion/react"

import { cn } from "@/src/lib/utils"

const MOVEMENT_DAMPING = 1400

const GLOBE_CONFIG: COBEOptions = {
  width: 800,
  height: 800,
  onRender: () => {},
  devicePixelRatio: 2,
  phi: 0,
  theta: 0.3,
  dark: 0,
  diffuse: 0.4,
  mapSamples: 16000,
  mapBrightness: 1.2,
  baseColor: [1, 1, 1],
  markerColor: [251 / 255, 100 / 255, 21 / 255],
  glowColor: [1, 1, 1],
  markers: [
    { location: [14.5995, 120.9842], size: 0.03 },
    { location: [19.076, 72.8777], size: 0.1 },
    { location: [23.8103, 90.4125], size: 0.05 },
    { location: [30.0444, 31.2357], size: 0.07 },
    { location: [39.9042, 116.4074], size: 0.08 },
    { location: [-23.5505, -46.6333], size: 0.1 },
    { location: [19.4326, -99.1332], size: 0.1 },
    { location: [40.7128, -74.006], size: 0.1 },
    { location: [34.6937, 135.5022], size: 0.05 },
    { location: [41.0082, 28.9784], size: 0.06 },
  ],
}

export function Globe({
  className,
  config = GLOBE_CONFIG,
}: {
  className?: string
  config?: COBEOptions
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const phiRef = useRef(0)
  const widthRef = useRef(0)
  const pointerInteracting = useRef<number | null>(null)
  const pointerInteractionMovement = useRef(0)
  const [isSupported, setIsSupported] = useState(true)

  const r = useMotionValue(0)
  const rs = useSpring(r, {
    mass: 1,
    damping: 30,
    stiffness: 100,
  })

  const updatePointerInteraction = (value: number | null) => {
    pointerInteracting.current = value
    if (canvasRef.current) {
      canvasRef.current.style.cursor = value !== null ? "grabbing" : "grab"
    }
  }

  const updateMovement = (clientX: number) => {
    if (pointerInteracting.current !== null) {
      const delta = clientX - pointerInteracting.current
      pointerInteractionMovement.current = delta
      r.set(r.get() + delta / MOVEMENT_DAMPING)
    }
  }

  useEffect(() => {
    const onResize = () => {
      if (canvasRef.current) {
        widthRef.current = canvasRef.current.offsetWidth
      }
    }

    window.addEventListener("resize", onResize)
    onResize()

    const canvas = canvasRef.current
    if (!canvas) return

    const testCanvas = document.createElement("canvas")
    const supportsWebGL =
      testCanvas.getContext("webgl2") ||
      testCanvas.getContext("webgl") ||
      testCanvas.getContext("experimental-webgl")
    if (!supportsWebGL) {
      setIsSupported(false)
      window.removeEventListener("resize", onResize)
      return
    }

    let globe: ReturnType<typeof createGlobe>
    try {
      globe = createGlobe(canvas, {
        ...config,
        width: widthRef.current * 2,
        height: widthRef.current * 2,
        onRender: (state) => {
          if (!pointerInteracting.current) phiRef.current += 0.005
          state.phi = phiRef.current + rs.get()
          state.width = widthRef.current * 2
          state.height = widthRef.current * 2
        },
      })
    } catch {
      setIsSupported(false)
      window.removeEventListener("resize", onResize)
      return
    }

    setTimeout(() => (canvas.style.opacity = "1"), 0)
    return () => {
      globe.destroy()
      window.removeEventListener("resize", onResize)
    }
  }, [rs, config])

  return (
    <div
      className={cn(
        "absolute inset-0 mx-auto aspect-square w-full max-w-150",
        className
      )}
    >
      <canvas
        className={cn(
          "size-full opacity-0 transition-opacity duration-500 contain-[layout_paint_size]",
          !isSupported && "hidden"
        )}
        ref={canvasRef}
        onPointerDown={(e) => {
          pointerInteracting.current = e.clientX
          updatePointerInteraction(e.clientX)
        }}
        onPointerUp={() => updatePointerInteraction(null)}
        onPointerOut={() => updatePointerInteraction(null)}
        onMouseMove={(e) => updateMovement(e.clientX)}
        onTouchMove={(e) =>
          e.touches[0] && updateMovement(e.touches[0].clientX)
        }
      />
      {!isSupported && (
        <div className="absolute inset-0 rounded-full border border-[#F2F0EB]/20 bg-[radial-gradient(circle_at_50%_45%,rgba(242,240,235,0.2),rgba(242,240,235,0.04)_34%,rgba(16,20,21,0)_66%),conic-gradient(from_150deg,rgba(217,59,45,0.3),rgba(242,240,235,0.08),rgba(217,59,45,0.18),rgba(242,240,235,0.08),rgba(217,59,45,0.3))] opacity-80 shadow-[0_0_90px_rgba(217,59,45,0.18)]">
          <span className="absolute left-[48%] top-[18%] h-2 w-2 rounded-full bg-[#D93B2D]" />
          <span className="absolute left-[58%] top-[38%] h-3 w-3 rounded-full bg-[#D93B2D]" />
          <span className="absolute left-[39%] top-[52%] h-2.5 w-2.5 rounded-full bg-[#D93B2D]" />
          <span className="absolute left-[53%] top-[66%] h-2 w-2 rounded-full bg-[#D93B2D]" />
          <span className="absolute inset-x-[16%] top-1/2 border-t border-[#F2F0EB]/15" />
          <span className="absolute inset-y-[14%] left-1/2 border-l border-[#F2F0EB]/15" />
          <span className="absolute inset-[18%] rounded-full border border-[#F2F0EB]/12" />
          <span className="absolute inset-[32%] rounded-full border border-[#F2F0EB]/10" />
        </div>
      )}
    </div>
  )
}
