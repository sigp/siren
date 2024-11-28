'use client'

import { perlin2D } from '@leodeslf/perlin-noise'
import React, { useRef, useEffect, useState, FC, useCallback } from 'react'
import hashToRange from '../../../utilities/hashToRange'
import stringToHash from '../../../utilities/stringToHash'

export interface TopographyCanvasProps {
  height: number
  width: number
  name: string
  animate?: boolean | undefined
  color?: string
  flex?: boolean
  speed?: number | undefined
}

const TopographyCanvas: FC<TopographyCanvasProps> = ({
  width,
  height,
  name,
  animate,
  color = 'white',
  speed = 0.3,
  flex = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const requestRef = useRef<number | null>(null)
  const [shift, setShift] = useState(0)
  const [canvasWidth, setCanvasWidth] = useState(width)

  const nameHash = stringToHash(name)
  const lineSpacing = hashToRange(nameHash, 4, 8)
  const initialShift = Math.abs(nameHash) % (lineSpacing * 100)
  const noiseScale = hashToRange(nameHash, 0.005, 0.01)
  const elevationScale = hashToRange(nameHash, 50, 90)

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, shift: number) => {
      ctx.clearRect(0, 0, canvasWidth, height)

      for (let y = 0; y < height; y += lineSpacing) {
        ctx.beginPath()
        for (let x = 0; x < canvasWidth; x++) {
          const noiseValue = perlin2D(x * noiseScale, (y + shift) * noiseScale)
          const elevation = noiseValue * elevationScale
          ctx.lineTo(x, y - elevation)
        }
        ctx.stroke()
      }
    },
    [canvasWidth, lineSpacing, noiseScale, elevationScale, height],
  )

  useEffect(() => {
    const canvas = canvasRef.current
    if (flex && canvas) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
          const { width: newWidth } = entry.contentRect
          setCanvasWidth(newWidth)
        }
      })
      resizeObserver.observe(canvas.parentNode as any)
      return () => resizeObserver.disconnect()
    } else {
      setCanvasWidth(width)
    }
  }, [flex, width])

  useEffect(() => {
    setShift(initialShift)
  }, [name, initialShift])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    if (!context) return
    context.strokeStyle = color as any
    context.lineWidth = 1

    draw(context, shift)
  }, [shift, name, canvasWidth, height, color, draw])

  useEffect(() => {
    const animateCanvas = () => {
      if (!animate) return

      const totalShift = lineSpacing * 100

      setShift((prevShift) => (prevShift + speed) % totalShift)

      requestRef.current = requestAnimationFrame(animateCanvas)
    }

    if (animate) {
      requestRef.current = requestAnimationFrame(animateCanvas)
    }

    return () => {
      const request = requestRef.current
      if (request) {
        cancelAnimationFrame(request)
      }
    }
  }, [animate, lineSpacing, name, speed])

  return <canvas ref={canvasRef} width={canvasWidth} height={height} />
}

export default TopographyCanvas
