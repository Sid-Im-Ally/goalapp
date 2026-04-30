'use client'
import { useState, useRef } from 'react'
import Image from 'next/image'

interface ImageCarouselProps {
  images: string[]
}

export function ImageCarousel({ images }: ImageCarouselProps) {
  const [idx, setIdx] = useState(0)
  const startX = useRef(0)

  const prev = () => setIdx((i) => (i - 1 + images.length) % images.length)
  const next = () => setIdx((i) => (i + 1) % images.length)

  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - startX.current
    if (dx > 50) prev()
    if (dx < -50) next()
  }

  if (images.length === 0) return null

  const total = images.length

  return (
    <div className="goal-why-stage" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div className="goal-why-card">
        <Image
          src={`/images/wiah-wib/${images[idx]}`}
          alt={`Image ${idx + 1}`}
          fill
          className="goal-why-img"
          style={{ objectFit: 'cover' }}
          priority
        />
      </div>

      <div className="goal-why-meta">
        <div className="goal-why-label">WIAH / WIB</div>
        <div className="goal-why-counter">
          {String(idx + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </div>
      </div>

      <div className="goal-why-controls">
        <button className="goal-why-btn" onClick={prev} aria-label="Previous">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15,4 7,12 15,20" />
          </svg>
        </button>
        <div className="goal-why-dots">
          {images.map((_, i) => (
            <button
              key={i}
              className={`goal-why-dot ${i === idx ? 'active' : ''}`}
              onClick={() => setIdx(i)}
              aria-label={`Go to image ${i + 1}`}
            />
          ))}
        </div>
        <button className="goal-why-btn" onClick={next} aria-label="Next">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9,4 17,12 9,20" />
          </svg>
        </button>
      </div>
    </div>
  )
}
