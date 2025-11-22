import { useDevice } from '@/context/DeviceContext'

export function useIsMobile(): boolean {
  const { isMobile } = useDevice()
  return isMobile
}
