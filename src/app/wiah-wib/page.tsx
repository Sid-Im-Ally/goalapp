'use client'
import dynamic from 'next/dynamic'

const WiahWibPage = dynamic(() => import('@/components/tabs/WiahWibTab'), { ssr: false })

export default function Page() {
  return <WiahWibPage />
}
