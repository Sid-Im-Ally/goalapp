import { ImageResponse } from 'next/og'

export const size = { width: 512, height: 512 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 512,
          height: 512,
          background: '#dc2626',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 112,
        }}
      >
        <span
          style={{
            fontFamily: 'monospace',
            fontWeight: 700,
            fontSize: 280,
            color: 'white',
            lineHeight: 1,
          }}
        >
          G
        </span>
      </div>
    ),
    { width: 512, height: 512 }
  )
}
