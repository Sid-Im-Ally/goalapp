import type { Metadata, Viewport } from 'next'
import { IOSDevice } from '@/components/IOSFrame'
import { BottomNav } from '@/components/BottomNav'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'GOAL',
  description: 'Personal fitness training app',
  appleWebApp: {
    capable: true,
    title: 'GOAL',
    statusBarStyle: 'black-translucent',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="goal-outer">
          <IOSDevice>
            <div className="goal-app">
              <div className="goal-scroll">
                {children}
              </div>
              <BottomNav />
            </div>
          </IOSDevice>
        </div>
      </body>
    </html>
  )
}
