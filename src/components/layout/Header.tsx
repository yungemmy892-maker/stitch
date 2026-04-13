import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Home, LayoutDashboard, LogOut } from 'lucide-react'
import useAppStore from '../../contexts/AppContext'
import Button from '../common/Button'
import ThemeToggle from '../common/ThemeToggle'
import { authService } from '@/services/authService'

const Header = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated, user, logout } = useAppStore()

  const handleLogout = async () => {
    try {
      await authService.logout()
      logout()
      navigate('/')
    } catch (error) {
      console.error('Logout failed:', error)
      logout()
      navigate('/')
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-dark-800 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-800 dark:from-primary-500 dark:to-primary-700 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-200">
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L9 4.414V16a1 1 0 102 0V4.414l5.293 5.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-400 dark:to-primary-600 bg-clip-text text-transparent">
              Stitch
            </span>
          </Link>

          {/* Center Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                location.pathname === '/'
                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-semibold'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Home size={18} />
                <span>Home</span>
              </div>
            </Link>
            {isAuthenticated && (
              <Link
                to="/demo"
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                  location.pathname === '/demo'
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-semibold'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-700'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <LayoutDashboard size={18} />
                  <span>Dashboard</span>
                </div>
              </Link>
            )}
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <ThemeToggle />

            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                {/* User Info */}
                <div className="hidden sm:flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-dark-700 rounded-lg">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-800 dark:from-primary-500 dark:to-primary-700 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {user?.name?.split(' ')[0] || 'User'}
                  </span>
                </div>

                {/* Logout Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700"
                  title="Logout"
                >
                  <LogOut size={18} />
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/login')}
                  className="text-gray-700 dark:text-gray-300"
                >
                  Sign In
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/signup')}
                >
                  Get Started
                </Button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header