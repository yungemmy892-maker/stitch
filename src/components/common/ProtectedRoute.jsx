import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAppStore from '../../contexts/AppContext'

export const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAppStore()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  if (!isAuthenticated) return null

  return children
}

export default ProtectedRoute
