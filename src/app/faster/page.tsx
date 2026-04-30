'use client'
import dynamic from 'next/dynamic'

const FasterPage = dynamic(() => import('@/components/tabs/FasterTab'), { ssr: false })

export default function Page() {
  return <FasterPage />
}
