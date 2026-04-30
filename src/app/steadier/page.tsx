'use client'
import dynamic from 'next/dynamic'

const SteadierPage = dynamic(() => import('@/components/tabs/SteadierTab'), { ssr: false })

export default function Page() {
  return <SteadierPage />
}
