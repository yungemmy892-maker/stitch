import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from './contexts/ThemeContext'
import ErrorBoundary from './components/common/ErrorBoundary'
import Layout from './components/layout/Layout'
import ProtectedRoute from './components/common/ProtectedRoute'
import Landing from './pages/Landing'
import DemoDashboard from './pages/DemoDashboard'
import Login from './pages/Login'
import Signup from './pages/Signup'

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Router>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#1f2937',
                color: '#fff',
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
              },
              success: {
                style: {
                  background: '#059669',
                },
                iconTheme: {
                  primary: '#fff',
                  secondary: '#059669',
                },
              },
              error: {
                style: {
                  background: '#dc2626',
                },
                iconTheme: {
                  primary: '#fff',
                  secondary: '#dc2626',
                },
              },
            }}
          />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<Landing />} />
              <Route
                path="demo"
                element={
                  <ProtectedRoute>
                    <DemoDashboard />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App