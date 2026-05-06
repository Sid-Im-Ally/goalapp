'use client'
import dynamic from 'next/dynamic'

const NutritionPage = dynamic(() => import('@/components/tabs/NutritionTab'), { ssr: false })

export default function Page() {
  return <NutritionPage />
}
