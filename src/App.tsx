import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Github } from 'lucide-react'
import { ThemeProvider } from '@/hooks/useTheme'
import { GradientBackground } from '@/components/GradientBackground'
import { GitHubSection } from '@/components/GitHubSection'
import { GlassCard } from '@/components/GlassComponents'
import { GitHubStats } from '@/types'
import { fetchGitHubRepos, calculateGitHubStats, getTopLanguages } from '@/utils/github'

// Custom Discord Icon Component
const DiscordIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.211.375-.445.865-.608 1.249a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.249a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
  </svg>
)

// Custom X (Twitter) Icon Component
const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)

function App() {
  const [showDetails, setShowDetails] = useState(false)
  const [stats, setStats] = useState<GitHubStats | null>(null)
  const [loading, setLoading] = useState(true)

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
              <motion.div
                className="mt-8 space-y-8"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                {/* About Me Section */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  <GlassCard className="p-8" glowEffect>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">About Me</h2>
                    <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                      I like things to be nice and neat, and love a project that speeds up my workflow. I enjoy building tools that help me stay organized and make everyday tasks easier.
                    </p>
                    <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                      When I'm not coding, you'll find me immersed in exciting games like The Finals, Call of Duty, or Delta Force. These fast-paced shooters are packed with action and strategy, making every match a thrilling experience. I love how they let me unwind and forget about responsibilities for a while, offering pure fun and adrenaline.
                    </p>
                  </GlassCard>
                </motion.div>

                {/* Skills Section */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  <GlassCard className="p-8" glowEffect>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Skills & Technologies</h2>
                    {loading ? (
                      <div className="flex items-center justify-center py-8">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full"
                        />
                        <span className="ml-3 text-gray-600 dark:text-gray-400">Loading skills from GitHub...</span>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {(() => {
                          // Get top languages from GitHub repos
                          const topLanguages = stats ? getTopLanguages(stats.languages, 12) : []
                          
                          // Add some common technologies that might not be in primary languages
                            const additionalSkills = [
                            'TypeScript',
                            'React',
                            'Next.js',
                            'Tailwind CSS',
                            'Node.js',
                            'Bun',
                            'Git',
                            'HTML',
                            'CSS',
                            'Vite',
                            ]
                          
                          // Combine GitHub languages with additional skills
                          const allSkills = [
                            ...topLanguages.map(lang => lang.language),
                            ...additionalSkills
                          ].slice(0, 16) // Limit to 16 skills total
                          
                          return allSkills.map((skill, index) => (
                            <motion.div
                              key={skill}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.6 + index * 0.05, duration: 0.3 }}
                            >
                              <GlassCard 
                                className="p-3 text-center group hover:shadow-xl transition-all duration-300"
                                glowEffect
                                whileHover={{ scale: 1.03, y: -2 }}
                              >
                                <span className="text-gray-800 dark:text-gray-200 font-medium">{skill}</span>
                              </GlassCard>
                            </motion.div>
                          ))
                        })()}
                      </div>
                    )}
                  </GlassCard>
                </motion.div>

                {/* Experience Section */}
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                >
                  <GlassCard className="p-8" glowEffect>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Experience</h2>
                    <div className="space-y-6">
                        <motion.div
                        className="border-l-4 border-blue-500 dark:border-blue-400 pl-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                        >
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Project Creator</h3>
                        <p className="text-blue-600 dark:text-blue-400 font-medium">Personal Projects</p>
                        <p className="text-gray-700 dark:text-gray-300 mt-2">
                          I enjoy creating small projects to solve everyday tasks and speed up my workflow. 
                          These tools help automate repetitive actions and make my development process smoother.
                        </p>
                        </motion.div>
                      
                      <motion.div
                        className="border-l-4 border-purple-500 dark:border-purple-400 pl-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.0, duration: 0.5 }}
                      >
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Open Source Contributor</h3>
                        <p className="text-purple-600 dark:text-purple-400 font-medium">Ongoing</p>
                        <p className="text-gray-700 dark:text-gray-300 mt-2">
                          Semi-active contributor to a variety of open-source projects. 
                          Passionate about collaborative development and learning from the community.
                        </p>
                      </motion.div>
                    </div>
                  </GlassCard>
                </motion.div>

                {/* Contact Section */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                >
                  <GlassCard className="p-8 text-center" glowEffect>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Let's Connect</h2>
                    <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
                      Always interested in new opportunities and collaborations. 
                      Feel free to reach out if you'd like to work together or just have a chat!
                    </p>
                    
                    {/* Contact Links */}
                    <div className="flex justify-center gap-6">
                      <motion.a
                        href="https://github.com/drkctrldev"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group"
                        whileHover={{ scale: 1.05, y: -3 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0, duration: 0.25 }}
                      >
                        <GlassCard className="p-4 hover:shadow-xl transition-transform duration-200 flex items-center justify-center" glowEffect>
                          <Github className="w-8 h-8 text-gray-700 dark:text-gray-300" />
                        </GlassCard>
                      </motion.a>

                      <motion.a
                        href="https://discord.com/users/drkctrldev"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group"
                        whileHover={{ scale: 1.05, y: -3 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0, duration: 0.25 }}
                      >
                        <GlassCard className="p-4 hover:shadow-xl transition-transform duration-200 flex items-center justify-center" glowEffect>
                          <DiscordIcon className="w-8 h-8 text-gray-700 dark:text-gray-300" />
                        </GlassCard>
                      </motion.a>

                      <motion.a
                        href="https://twitter.com/drkctrldev"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group"
                        whileHover={{ scale: 1.05, y: -3 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0, duration: 0.25 }}
                      >
                        <GlassCard className="p-4 hover:shadow-xl transition-transform duration-200 flex items-center justify-center" glowEffect>
                          <XIcon className="w-8 h-8 text-gray-700 dark:text-gray-300" />
                        </GlassCard>
                      </motion.a>
                    </div>
                  </GlassCard>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </ThemeProvider>
  )
}

export default App