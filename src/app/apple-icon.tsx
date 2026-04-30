import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          background: '#dc2626',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            fontFamily: 'monospace',
            fontWeight: 700,
            fontSize: 100,
            color: 'white',
            lineHeight: 1,
          }}
        >
          G
        </span>
      </div>
    ),
    { width: 180, height: 180 }
  )
}
