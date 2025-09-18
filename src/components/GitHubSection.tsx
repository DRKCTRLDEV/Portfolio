import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Star,
  GitBranch,
  Calendar,
  MapPin,
  Globe,
  Building,
} from "lucide-react";
import { GlassCard } from "@/components/GlassComponents";
import { GitHubUser, GitHubRepo, GitHubStats } from "@/types";
import {
  fetchGitHubUser,
  fetchGitHubRepos,
  calculateGitHubStats,
  getTopLanguages,
} from "@/utils/github";

export const GitHubSection = () => {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGitHubData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [userData, reposData] = await Promise.all([
          fetchGitHubUser(),
          fetchGitHubRepos(),
        ]);

        setUser(userData);
        setRepos(reposData);
        setStats(calculateGitHubStats(reposData));
      } catch (err) {
        console.error("Error loading GitHub data:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load GitHub data"
        );
      } finally {
        setLoading(false);
      }
    };

    loadGitHubData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  // Don't show error if we have fallback data
  if (error && (!user || !stats)) {
    return (
      <GlassCard className="p-6 text-center">
        <p className="text-yellow-500 dark:text-yellow-400 mb-2">
          Using demo data - GitHub API temporarily unavailable
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">{error}</p>
      </GlassCard>
    );
  }

  if (!user || !stats) return null;

  const topLanguages = getTopLanguages(stats.languages);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      {/* Profile Header */}
      <GlassCard className="p-8" glowEffect>
        <div className="flex flex-col md:flex-row items-center gap-6">
          <motion.img
            src={user.avatar_url}
            alt={user.name}
            className="w-36 h-36 rounded-full border-4 border-white/20 shadow-lg"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          />
          <div className="flex-1 text-center md:text-left">
            <motion.h1
              className="text-3xl font-bold text-gray-900 dark:text-white mb-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              {user.name}
            </motion.h1>
            <motion.p
              className="text-lg text-gray-600 dark:text-gray-400 mb-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              @{user.login}
            </motion.p>
            {user.bio && (
              <motion.p
                className="text-gray-700 dark:text-gray-300 mb-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                {user.bio}
              </motion.p>
            )}
            <motion.div
              className="flex flex-wrap gap-4 justify-center md:justify-start text-sm text-gray-600 dark:text-gray-400"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              {user.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {user.location}
                </span>
              )}
              {user.company && (
                <span className="flex items-center gap-1">
                  <Building className="w-4 h-4" />
                  {user.company}
                </span>
              )}
              {user.blog && (
                <a
                  href={user.blog}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-blue-500 transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  Website
                </a>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Joined {new Date(user.created_at).getFullYear()}
              </span>
            </motion.div>
          </div>
        </div>
      </GlassCard>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard className="p-6 text-center group" glowEffect>
          <div className="flex flex-col items-center justify-center h-full min-h-[120px]">
            <div className="flex flex-col items-center space-y-3 translate-y-3 group-hover:translate-y-1 transition-transform duration-300">
              <div className="text-3xl text-blue-500 dark:text-blue-400">
                <GitBranch />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalRepos}
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Repositories
              </h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
              Public repositories
            </p>
          </div>
        </GlassCard>

        <GlassCard className="p-6 text-center group" glowEffect>
          <div className="flex flex-col items-center justify-center h-full min-h-[120px]">
            <div className="flex flex-col items-center space-y-3 translate-y-3 group-hover:translate-y-1 transition-transform duration-300">
              <div className="text-3xl text-blue-500 dark:text-blue-400">
                <Star />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalStars}
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Total Stars
              </h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
              Stars received
            </p>
          </div>
        </GlassCard>

        <GlassCard className="p-6 text-center group" glowEffect>
          <div className="flex flex-col items-center justify-center h-full min-h-[120px]">
            <div className="flex flex-col items-center space-y-3 translate-y-3 group-hover:translate-y-1 transition-transform duration-300">
              <div className="text-3xl text-blue-500 dark:text-blue-400">
                <Users />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {user.followers}
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Followers
              </h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
              GitHub followers
            </p>
          </div>
        </GlassCard>

        <GlassCard className="p-6 text-center group" glowEffect>
          <div className="flex flex-col items-center justify-center h-full min-h-[120px]">
            <div className="flex flex-col items-center space-y-3 translate-y-3 group-hover:translate-y-1 transition-transform duration-300">
              <div className="text-3xl text-blue-500 dark:text-blue-400">
                <Users />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {user.following}
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Following
              </h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
              Following users
            </p>
          </div>
        </GlassCard>
      </div>

      {/* Top Languages */}
      <GlassCard className="p-6" glowEffect>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Top Languages
        </h3>
        <div className="space-y-4">
          {topLanguages.map(({ language, count }, index) => (
            <motion.div
              key={language}
              className="flex items-center justify-between"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <span className="text-gray-700 dark:text-gray-300">
                {language}
              </span>
              <div className="flex items-center gap-2">
                <div className="w-32 md:w-48 lg:w-56 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <motion.div
                    className="bg-blue-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(count / topLanguages[0].count) * 100}%`,
                    }}
                    transition={{ delay: index * 0.1 + 0.3, duration: 0.8 }}
                  />
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400 w-8">
                  {count}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </GlassCard>

      {/* Recent Repositories */}
      <GlassCard className="p-6" glowEffect>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Recent Repositories
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          {repos.slice(0, 6).map((repo, index) => (
            <motion.a
              key={repo.id}
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 rounded-lg bg-white/10 dark:bg-black/10 hover:bg-white/20 dark:hover:bg-black/20 transition-colors border border-white/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                {repo.name}
              </h4>
              {repo.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                  {repo.description}
                </p>
              )}
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
                <span className="flex items-center gap-1">
                  {repo.language && (
                    <>
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      {repo.language}
                    </>
                  )}
                </span>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    {repo.stargazers_count}
                  </span>
                  <span className="flex items-center gap-1">
                    <GitBranch className="w-3 h-3" />
                    {repo.forks_count}
                  </span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </GlassCard>
    </motion.section>
  );
};
