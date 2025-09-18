import { useEffect, useCallback, useState } from 'react'

const KONAMI_CODE = [
  'ArrowUp',
  'ArrowUp', 
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'KeyB',
  'KeyA',
  'Enter'
]

export const useKonamiCode = (callback: () => void) => {
  const [, setKeys] = useState<string[]>([])

  const resetKeys = useCallback(() => {
    setKeys([])
  }, [])

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    setKeys(currentKeys => {
      const newKeys = [...currentKeys, event.code]
      
      // Keep only the last 11 keys (length of Konami code)
      if (newKeys.length > KONAMI_CODE.length) {
        newKeys.splice(0, newKeys.length - KONAMI_CODE.length)
      }
      
      // Check if the sequence matches
      if (newKeys.length === KONAMI_CODE.length) {
        const matches = KONAMI_CODE.every((key, index) => key === newKeys[index])
        
        if (matches) {
          callback()
          return [] // Reset after successful match
        }
      }
      
      return newKeys
    })
  }, [callback])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])

  return { resetKeys }
}