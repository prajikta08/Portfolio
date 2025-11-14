"use client"

import React, { useEffect, useRef, useState } from "react"
import { twMerge } from "tailwind-merge";

function useMousePosition() {
  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0,
  })

  useEffect(() => {
    const handleMouseMove = (event) => {
      setMousePosition({ x: event.clientX, y: event.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return mousePosition
}

function hexToRgb(hex) {
  hex = hex.replace("#", "")

  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((char) => char + char)
      .join("")
  }

  const hexInt = parseInt(hex, 16)
  const red = (hexInt >> 16) & 255
  const green = (hexInt >> 8) & 255
  const blue = hexInt & 255
  return [red, green, blue]
}

export const Particles = ({
  className = "",
  quantity = 100,
  staticity = 50,
  ease = 50,
  size = 0.4,
  refresh = false,
  color = "#ffffff",
  vx = 0,
  vy = 0,
  ...props
}) => {
  const canvasRef = useRef(null)
  const canvasContainerRef = useRef(null)
  const context = useRef(null)
  const circles = useRef([])
  const mousePosition = useMousePosition()
  const mouse = useRef({ x: 0, y: 0 })
  const canvasSize = useRef({ w: 0, h: 0 })
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1
  const rafID = useRef(null)
  const resizeTimeout = useRef(null)

  useEffect(() => {
    if (canvasRef.current) {
      context.current = canvasRef.current.getContext("2d")
    }

    initCanvas()
    animate()

    const handleResize = () => {
      if (resizeTimeout.current) clearTimeout(resizeTimeout.current)
      resizeTimeout.current = setTimeout(() => initCanvas(), 200)
    }

    window.addEventListener("resize", handleResize)

    return () => {
      if (rafID.current) window.cancelAnimationFrame(rafID.current)
      if (resizeTimeout.current) clearTimeout(resizeTimeout.current)
      window.removeEventListener("resize", handleResize)
    }
  }, [color])

  useEffect(() => {
    updateMouse()
  }, [mousePosition.x, mousePosition.y])

  useEffect(() => {
    initCanvas()
  }, [refresh])

  function initCanvas() {
    resizeCanvas()
    drawParticles()
  }

  function updateMouse() {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect()
      const w = canvasSize.current.w
      const h = canvasSize.current.h

      const x = mousePosition.x - rect.left - w / 2
      const y = mousePosition.y - rect.top - h / 2
      const inside = x < w / 2 && x > -w / 2 && y < h / 2 && y > -h / 2

      if (inside) {
        mouse.current.x = x
        mouse.current.y = y
      }
    }
  }

  function resizeCanvas() {
    if (!canvasContainerRef.current || !canvasRef.current || !context.current)
      return

    canvasSize.current.w = canvasContainerRef.current.offsetWidth
    canvasSize.current.h = canvasContainerRef.current.offsetHeight

    canvasRef.current.width = canvasSize.current.w * dpr
    canvasRef.current.height = canvasSize.current.h * dpr
    canvasRef.current.style.width = `${canvasSize.current.w}px`
    canvasRef.current.style.height = `${canvasSize.current.h}px`

    context.current.scale(dpr, dpr)

    circles.current = []

    for (let i = 0; i < quantity; i++) {
      const circle = createCircle()
      drawCircle(circle)
    }
  }

  function createCircle() {
    const w = canvasSize.current.w
    const h = canvasSize.current.h

    return {
      x: Math.random() * w,
      y: Math.random() * h,
      translateX: 0,
      translateY: 0,
      size: Math.random() * 2 + size,
      alpha: 0,
      targetAlpha: parseFloat((Math.random() * 0.6 + 0.1).toFixed(1)),
      dx: (Math.random() - 0.5) * 0.1,
      dy: (Math.random() - 0.5) * 0.1,
      magnetism: 0.1 + Math.random() * 4,
    }
  }

  const rgb = hexToRgb(color)

  function drawCircle(circle, updating = false) {
    if (!context.current) return

    const { x, y, translateX, translateY, size, alpha } = circle

    context.current.translate(translateX, translateY)
    context.current.beginPath()
    context.current.arc(x, y, size, 0, 2 * Math.PI)
    context.current.fillStyle = `rgba(${rgb.join(", ")}, ${alpha})`
    context.current.fill()
    context.current.setTransform(dpr, 0, 0, dpr, 0, 0)

    if (!updating) circles.current.push(circle)
  }

  function clear() {
    if (context.current) {
      context.current.clearRect(0, 0, canvasSize.current.w, canvasSize.current.h)
    }
  }

  function drawParticles() {
    clear()
    for (let i = 0; i < quantity; i++) {
      const circle = createCircle()
      drawCircle(circle)
    }
  }

  function remap(value, start1, end1, start2, end2) {
    const v = ((value - start1) * (end2 - start2)) / (end1 - start1) + start2
    return v > 0 ? v : 0
  }

  function animate() {
    clear()

    circles.current.forEach((circle, i) => {
      const edges = [
        circle.x + circle.translateX - circle.size,
        canvasSize.current.w - circle.x - circle.translateX - circle.size,
        circle.y + circle.translateY - circle.size,
        canvasSize.current.h - circle.y - circle.translateY - circle.size,
      ]

      const closest = Math.min(...edges)
      const mapped = parseFloat(remap(closest, 0, 20, 0, 1).toFixed(2))

      if (mapped > 1) {
        circle.alpha = Math.min(circle.alpha + 0.02, circle.targetAlpha)
      } else {
        circle.alpha = circle.targetAlpha * mapped
      }

      circle.x += circle.dx + vx
      circle.y += circle.dy + vy

      circle.translateX +=
        (mouse.current.x / (staticity / circle.magnetism) - circle.translateX) /
        ease

      circle.translateY +=
        (mouse.current.y / (staticity / circle.magnetism) - circle.translateY) /
        ease

      drawCircle(circle, true)

      const out =
        circle.x < -circle.size ||
        circle.x > canvasSize.current.w + circle.size ||
        circle.y < -circle.size ||
        circle.y > canvasSize.current.h + circle.size

      if (out) {
        circles.current.splice(i, 1)
        const newCircle = createCircle()
        drawCircle(newCircle)
      }
    })

    rafID.current = window.requestAnimationFrame(animate)
  }

  return (
    <div
      className={twMerge("pointer-events-none", className)}
      ref={canvasContainerRef}
      aria-hidden="true"
      {...props}
    >
      <canvas ref={canvasRef} className="size-full" />
    </div>
  )
}
