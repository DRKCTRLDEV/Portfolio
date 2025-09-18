import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { ThemeProvider } from '@/hooks/useTheme'
import { useKonamiCode } from '@/hooks/useKonamiCode'
import { GradientBackground } from '@/components/GradientBackground'
import { GitHubSection } from '@/components/GitHubSection'
import { DetailsSection } from '@/components/DetailsSection'
import { DraggableWindow } from '@/components/DraggableWindow'
import { GitHubStats } from '@/types'
import { fetchGitHubRepos, calculateGitHubStats } from '@/utils/github'
import { GlassButton } from '@/components/GlassComponents'

function App() {
  const [showDetails, setShowDetails] = useState(false)
  const [stats, setStats] = useState<GitHubStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [konamiActivated, setKonamiActivated] = useState(false)

  // Konami Code Easter Egg
  useKonamiCode(() => {
    setKonamiActivated(true)
  })

  useEffect(() => {
    const loadGitHubData = async () => {
      try {
        setLoading(true)
        const reposData = await fetchGitHubRepos()
        setStats(calculateGitHubStats(reposData))
      } catch (error) {
        console.error('Error loading GitHub data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadGitHubData()
  }, [])

  const handleShowDetails = () => {
    setShowDetails(true)
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen relative">
        <GradientBackground />
        
        {/* Konami Code Easter Egg Window */}
        <AnimatePresence>
          {konamiActivated && (
            <DraggableWindow
              isOpen={konamiActivated}
              onClose={() => setKonamiActivated(false)}
              title="Konami Launcher"
              initialPosition={{ x: "50vw", y: "50vh" }}
              initialSize={{ width: "400px", height: "500px" }}
              minSize={{ width: "320px", height: "400px" }}
              maxSize={{ width: "75vw", height: "60vh" }}
              resizable={true}
              showControls={true}
            >
              {/* UI Note */}
              <div className="mb-4 text-center text-xs text-gray-500 dark:text-gray-400">
          This is simply a placeholder for the Konami Code Easter Egg window.
              </div>
              {/* Dynamic Glassy Grid of Buttons */}
              <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          }}
              >
          {[
            { label: 'Start Game', icon: '🎲' },
            { label: 'Leaderboard', icon: '🏆' },
            { label: 'Settings', icon: '⚙️' },
            { label: 'Help', icon: '❓' },
            { label: 'About', icon: 'ℹ️' },
          ].map((btn) => (
            <GlassButton
              key={btn.label}
              className="flex flex-col items-center justify-center h-32"
            >
              <span className="text-3xl mb-2">{btn.icon}</span>
              <span className="font-semibold text-gray-800 dark:text-gray-100">{btn.label}</span>
            </GlassButton>
          ))}
              </div>
            </DraggableWindow>
          )}
        </AnimatePresence>
        
        {/* Main Content */}
        <main className="relative z-10 container mx-auto px-4 py-20 max-w-6xl">
          {/* GitHub Section */}
          <GitHubSection />
          
          {/* More Details Button */}
          <AnimatePresence>
            {!showDetails && (
              <motion.div
                className="flex flex-col items-center mt-8 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <motion.button
                  onClick={handleShowDetails}
                  className="group text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-300"
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ChevronDown className="w-7 h-7 group-hover:scale-110 transition-transform duration-300" />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Detailed About Section */}
          <AnimatePresence>
            {showDetails && (
              <DetailsSection stats={stats} loading={loading} />
            )}
          </AnimatePresence>
        </main>
      </div>
    </ThemeProvider>
  )
}

export default App