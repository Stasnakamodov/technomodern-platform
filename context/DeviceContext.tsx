'use client'

import { createContext, useContext, ReactNode, useState, useEffect } from 'react'

interface DeviceContextType {
  isMobile: boolean
}

const DeviceContext = createContext<DeviceContextType>({ isMobile: false })

export function DeviceProvider({
  children,
  isMobile: initialIsMobile
}: {
  children: ReactNode
  isMobile: boolean
}) {
  const [isMobile, setIsMobile] = useState(initialIsMobile)

  useEffect(() => {
    // Client-side detection as fallback
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <DeviceContext.Provider value={{ isMobile }}>
      {children}
    </DeviceContext.Provider>
  )
}

export function useDevice() {
  return useContext(DeviceContext)
}
