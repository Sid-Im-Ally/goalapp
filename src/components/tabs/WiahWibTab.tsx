'use client'
import { useState, useEffect } from 'react'
import { Header } from '@/components/Header'
import { ImageCarousel } from '@/components/ImageCarousel'

export default function WiahWibTab() {
  const [images, setImages] = useState<string[] | null>(null)

  useEffect(() => {
    fetch('/images/wiah-wib/manifest.json')
      .then((r) => r.json())
      .then((data: string[]) => setImages(data))
      .catch(() => setImages([]))
  }, [])

  const hasImages = images !== null && images.length > 0

  return (
    <div className="goal-tabview goal-theme-wiahwib">
      <Header
        tab="WIAHWIB"
        subtitle="WHO I AM · HOW I'LL BE"
        current={hasImages ? images!.length : 0}
        total={hasImages ? images!.length : 0}
        accent="#d97706"
      />

      {images === null && (
        <div style={{ padding: 32, textAlign: 'center', fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--muted)' }}>
          LOADING...
        </div>
      )}

      {images !== null && images.length === 0 && (
        <div className="goal-why-stage">
          <div className="goal-why-card tone-neutral">
            <div className="goal-why-placeholder">
              <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 100">
                <defs>
                  <pattern id="stripes-empty" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
                    <line x1="0" y1="0" x2="0" y2="6" stroke="rgba(0,0,0,0.06)" strokeWidth="3" />
                  </pattern>
                </defs>
                <rect width="100" height="100" fill="url(#stripes-empty)" />
              </svg>
              <div className="goal-why-caption">
                <div className="goal-why-id">NO IMAGES YET</div>
                <div className="goal-why-text">Add your motivation photos to get started</div>
                <div className="goal-why-hint">[ see instructions below ]</div>
              </div>
            </div>
          </div>

          <div className="goal-why-empty" style={{ padding: '24px 0 0' }}>
            <div className="goal-why-empty-title">HOW TO ADD IMAGES</div>
            <div className="goal-why-empty-desc">Drop your photos into the folder, then list the filenames in the manifest.</div>
            <div className="goal-why-empty-code">public/images/wiah-wib/</div>
            <div className="goal-why-empty-desc" style={{ marginTop: 12, fontSize: 11 }}>
              Then update <code style={{ fontFamily: 'var(--mono)', background: 'var(--done-bg)', padding: '1px 4px' }}>manifest.json</code>:
            </div>
            <div className="goal-why-empty-code" style={{ marginTop: 8, textAlign: 'left', lineHeight: 1.6 }}>
              {`["photo1.jpg", "photo2.jpg"]`}
            </div>
          </div>
        </div>
      )}

      {hasImages && <ImageCarousel images={images!} />}

      <div className="goal-bottom-spacer" />
    </div>
  )
}
