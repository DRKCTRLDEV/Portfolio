import { GitHubUser, GitHubRepo, GitHubStats } from '@/types'

const GITHUB_API_BASE = 'https://api.github.com'
const USERNAME = 'drkctrldev'

// Cache configuration
const CACHE_DURATION = 15 * 60 * 1000 // 15 minutes in milliseconds
const CACHE_KEYS = {
  USER: 'github_user_cache',
  REPOS: 'github_repos_cache'
}

interface CacheItem<T> {
  data: T
  timestamp: number
}

// Cache utilities
const setCache = <T>(key: string, data: T): void => {
  try {
    const cacheItem: CacheItem<T> = {
      data,
      timestamp: Date.now()
    }
    localStorage.setItem(key, JSON.stringify(cacheItem))
  } catch (error) {
    console.warn('Failed to set cache:', error)
  }
}

const getCache = <T>(key: string): T | null => {
  try {
    const cached = localStorage.getItem(key)
    if (!cached) return null

    const cacheItem: CacheItem<T> = JSON.parse(cached)
    const isExpired = Date.now() - cacheItem.timestamp > CACHE_DURATION

    if (isExpired) {
      localStorage.removeItem(key)
      return null
    }

    return cacheItem.data
  } catch (error) {
    console.warn('Failed to get cache:', error)
    // Clean up corrupted cache
    localStorage.removeItem(key)
    return null
  }
}

// Mock data as fallback when API is rate limited
const mockUser: GitHubUser = {
  login: 'DRKCTRLDEV',
  name: '𝓓𝓡𝓚',
  bio: 'Passionate about creating versatile utilities and exploring fun projects.',
  avatar_url: 'https://avatars.githubusercontent.com/u/101681809?v=4',
  html_url: 'https://github.com/DRKCTRLDEV',
  public_repos: 10,
  followers: 2,
  following: 22,
  created_at: '2022-03-20T00:00:00Z',
  location: 'United Kingdom',
  blog: '',
  company: ''
}

const mockRepos: GitHubRepo[] = [
  {
    id: 1,
    name: 'Mica4U',
    full_name: 'DRKCTRLDEV/Mica4U',
    description: 'A modern, user-friendly tool to apply Mica, Acrylic, and Blur effects to Windows Explorer — for Windows 10 and 11.',
    html_url: 'https://github.com/DRKCTRLDEV/Mica4U',
    stargazers_count: 32,
    forks_count: 1,
    language: 'Python',
    topics: ['windows', 'mica', 'acrylic', 'blur', 'explorer'],
    updated_at: '2025-09-15T00:00:00Z',
    created_at: '2024-08-01T00:00:00Z',
    size: 2048
  },
  {
    id: 2,
    name: 'NovaHub',
    full_name: 'DRKCTRLDEV/NovaHub',
    description: 'A versatile hub for managing and exploring various utilities and tools.',
    html_url: 'https://github.com/DRKCTRLDEV/NovaHub',
    stargazers_count: 1,
    forks_count: 0,
    language: 'JavaScript',
    topics: ['utilities', 'tools', 'hub'],
    updated_at: '2025-09-14T00:00:00Z',
    created_at: '2025-08-20T00:00:00Z',
    size: 512
  },
  {
    id: 3,
    name: 'MineSweeper',
    full_name: 'DRKCTRLDEV/MineSweeper',
    description: 'Simple Knockout JS Minesweeper game with intuitive interface and classic gameplay.',
    html_url: 'https://github.com/DRKCTRLDEV/MineSweeper',
    stargazers_count: 0,
    forks_count: 0,
    language: 'JavaScript',
    topics: ['game', 'minesweeper', 'knockout-js', 'web-game'],
    updated_at: '2025-09-12T00:00:00Z',
    created_at: '2025-07-10T00:00:00Z',
    size: 256
  },
  {
    id: 4,
    name: 'Sine',
    full_name: 'DRKCTRLDEV/Sine',
    description: 'Mathematical sine wave generator and visualization tool.',
    html_url: 'https://github.com/DRKCTRLDEV/Sine',
    stargazers_count: 0,
    forks_count: 0,
    language: 'JavaScript',
    topics: ['mathematics', 'visualization', 'sine-wave'],
    updated_at: '2025-09-15T00:00:00Z',
    created_at: '2025-09-15T00:00:00Z',
    size: 128
  },
  {
    id: 5,
    name: 'Darkly',
    full_name: 'DRKCTRLDEV/Darkly',
    description: 'A dark theme utility and customization tool.',
    html_url: 'https://github.com/DRKCTRLDEV/Darkly',
    stargazers_count: 0,
    forks_count: 0,
    language: 'C++',
    topics: ['dark-theme', 'customization', 'utility'],
    updated_at: '2025-09-07T00:00:00Z',
    created_at: '2025-09-07T00:00:00Z',
    size: 384
  },
  {
    id: 6,
    name: 'EeveeSpotify_IPA',
    full_name: 'DRKCTRLDEV/EeveeSpotify_IPA',
    description: 'A tweak to enhance Spotify experience with additional features and customizations.',
    html_url: 'https://github.com/DRKCTRLDEV/EeveeSpotify_IPA',
    stargazers_count: 1,
    forks_count: 0,
    language: 'Swift',
    topics: ['spotify', 'ios', 'tweak', 'enhancement'],
    updated_at: '2025-09-07T00:00:00Z',
    created_at: '2025-09-07T00:00:00Z',
    size: 1024
  }
]

export const fetchGitHubUser = async (): Promise<GitHubUser> => {
  // Check cache first
  const cachedUser = getCache<GitHubUser>(CACHE_KEYS.USER)
  if (cachedUser) {
    console.log('Using cached GitHub user data')
    return cachedUser
  }

  try {
    const response = await fetch(`${GITHUB_API_BASE}/users/${USERNAME}`)
    if (!response.ok) {
      if (response.status === 403) {
        console.warn('GitHub API rate limit exceeded, using mock data')
        return mockUser
      }
      throw new Error(`GitHub API error: ${response.status}`)
    }
    
    const userData = await response.json()
    // Cache the successful response
    setCache(CACHE_KEYS.USER, userData)
    console.log('Fetched fresh GitHub user data and cached it')
    return userData
  } catch (error) {
    console.warn('Failed to fetch GitHub user data, using mock data:', error)
    return mockUser
  }
}

export const fetchGitHubRepos = async (): Promise<GitHubRepo[]> => {
  // Check cache first
  const cachedRepos = getCache<GitHubRepo[]>(CACHE_KEYS.REPOS)
  if (cachedRepos) {
    console.log('Using cached GitHub repos data')
    return cachedRepos
  }

  try {
    const response = await fetch(`${GITHUB_API_BASE}/users/${USERNAME}/repos?sort=updated&per_page=100`)
    if (!response.ok) {
      if (response.status === 403) {
        console.warn('GitHub API rate limit exceeded, using mock data')
        return mockRepos
      }
      throw new Error(`GitHub API error: ${response.status}`)
    }
    
    const reposData = await response.json()
    // Cache the successful response
    setCache(CACHE_KEYS.REPOS, reposData)
    console.log('Fetched fresh GitHub repos data and cached it')
    return reposData
  } catch (error) {
    console.warn('Failed to fetch GitHub repos, using mock data:', error)
    return mockRepos
  }
}

export const calculateGitHubStats = (repos: GitHubRepo[]): GitHubStats => {
  const stats: GitHubStats = {
    totalStars: 0,
    totalForks: 0,
    totalRepos: repos.length,
    languages: {},
    contributions: 0
  }

  repos.forEach(repo => {
    stats.totalStars += repo.stargazers_count
    stats.totalForks += repo.forks_count
    
    if (repo.language) {
      stats.languages[repo.language] = (stats.languages[repo.language] || 0) + 1
    }
  })

  return stats
}

export const getTopLanguages = (languages: Record<string, number>, limit: number = 5) => {
  return Object.entries(languages)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([language, count]) => ({ language, count }))
}

// Cache management utilities
export const clearGitHubCache = (): void => {
  try {
    localStorage.removeItem(CACHE_KEYS.USER)
    localStorage.removeItem(CACHE_KEYS.REPOS)
    console.log('GitHub cache cleared')
  } catch (error) {
    console.warn('Failed to clear cache:', error)
  }
}

export const getCacheStatus = () => {
  const userCache = localStorage.getItem(CACHE_KEYS.USER)
  const reposCache = localStorage.getItem(CACHE_KEYS.REPOS)
  
  return {
    hasUserCache: !!userCache,
    hasReposCache: !!reposCache,
    userCacheAge: userCache ? Date.now() - JSON.parse(userCache).timestamp : null,
    reposCacheAge: reposCache ? Date.now() - JSON.parse(reposCache).timestamp : null
  }
}

// Force refresh data by clearing cache and refetching
export const forceRefreshGitHubData = async () => {
  clearGitHubCache()
  const [userData, reposData] = await Promise.all([
    fetchGitHubUser(),
    fetchGitHubRepos()
  ])
  return { userData, reposData }
}