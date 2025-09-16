import { useEffect, useRef } from 'react'

export const GradientBackground = () => {
  const interactiveRef = useRef<HTMLDivElement>(null)
  const interactive2Ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const interactive = interactiveRef.current
    const interactive2 = interactive2Ref.current
    if (!interactive || !interactive2) return

    let curX = 0
    let curY = 0
    let cur2X = 0
    let cur2Y = 0
    let tgX = 0
    let tgY = 0
    let time = 0

    const move = () => {
      time += 0.005  // Much slower time increment
      
      // Add very subtle autonomous movement using sine waves
      const autoX1 = Math.sin(time * 0.5) * 5  // Reduced from 20 to 5
      const autoY1 = Math.cos(time * 0.3) * 4  // Reduced from 15 to 4
      const autoX2 = Math.sin(time * 0.4) * 6  // Reduced from 25 to 6
      const autoY2 = Math.cos(time * 0.6) * 5  // Reduced from 18 to 5
      
      curX += (tgX + autoX1 - curX) / 100
      curY += (tgY + autoY1 - curY) / 110
      cur2X += (tgX + autoX2 - cur2X) / 110  // Slower movement for second orb
      cur2Y += (tgY + autoY2 - cur2Y) / 115
      
      interactive.style.transform = `translate(${Math.round(curX)}px, ${Math.round(curY)}px)`
      interactive2.style.transform = `translate(${Math.round(cur2X)}px, ${Math.round(cur2Y)}px)`
      requestAnimationFrame(move)
    }

    const handleMouseMove = (event: MouseEvent) => {
      // Reduce mouse influence by scaling down the movement
      tgX = (event.clientX - window.innerWidth / 2) * 0.2  // Only 20% of actual movement
      tgY = (event.clientY - window.innerHeight / 2) * 0.3 // Only 30% of actual movement
    }

    window.addEventListener('mousemove', handleMouseMove)
    move()

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <div className="gradient-bg">
      <svg xmlns="http://www.w3.org/2000/svg" className="fixed top-0 left-0 w-0 h-0">
        <defs>
          <filter id="goo" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="20" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>
      <div className="gradients-container">
        <div className="gradient-orb g1"></div>
        <div className="gradient-orb g2"></div>
        <div className="gradient-orb g3"></div>
        <div className="gradient-orb g4"></div>
        <div className="gradient-orb g5"></div>
        <div className="gradient-orb interactive" ref={interactiveRef}></div>
        <div className="gradient-orb interactive2" ref={interactive2Ref}></div>
      </div>
    </div>
  )
}