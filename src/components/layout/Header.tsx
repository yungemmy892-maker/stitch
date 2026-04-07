import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Home, LayoutDashboard, LogIn, User, LogOut } from 'lucide-react'
import useAppStore from '../../contexts/AppContext'
import Button from '../common/Button'
import { useModal } from '../../hooks/useModal'
import SignupModal from '../auth/SignupModal'

const Header = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated, user, logout } = useAppStore()
  const { isOpen, open, close } = useModal()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <nav className="container-custom py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 gradient-bg rounded-lg group-hover:scale-110 transition" />
              <span className="text-xl font-bold gradient-text">Stitch</span>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                className={`flex items-center space-x-1 transition-colors ${
                  location.pathname === '/'
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                <Home size={18} />
                <span>Home</span>
              </Link>
              {isAuthenticated && (
                <Link
                  to="/demo"
                  className={`flex items-center space-x-1 transition-colors ${
                    location.pathname === '/demo'
                      ? 'text-blue-600'
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  <LayoutDashboard size={18} />
                  <span>Dashboard</span>
                </Link>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 gradient-bg rounded-full flex items-center justify-center">
                      <User size={16} className="text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 hidden sm:inline">
                      {user?.name?.split(' ')[0] || 'User'}
                    </span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleLogout}>
                    <LogOut size={18} />
                  </Button>
                </div>
              ) : (
                <Button variant="primary" size="sm" onClick={open}>
                  <LogIn size={18} className="mr-2" />
                  Sign Up
                </Button>
              )}
            </div>
          </div>
        </nav>
      </header>

      <SignupModal isOpen={isOpen} onClose={close} />
    </>
  )
}

export default Header