'use client'
import dynamic from 'next/dynamic'

const StrongerPage = dynamic(() => import('@/components/tabs/StrongerTab'), { ssr: false })

export default function Page() {
  return <StrongerPage />
}
