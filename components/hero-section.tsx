'use client'

import { useState, useEffect } from 'react'
import HeroDesktop from './desktop/HeroSection'
import HeroMobile from './mobile/HeroSection'

export default function HeroSection() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Show nothing during SSR, then correct version on client
  if (isMobile === null) {
    return null
  }

  return isMobile ? <HeroMobile /> : <HeroDesktop />
}
