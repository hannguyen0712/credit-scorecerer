import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import SignUp from './components/SignUp';
import AuthGuard from './components/AuthGuard';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import './index.css';

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [showSignUp, setShowSignUp] = useState(false);

  // Show loading while checking authentication
  if (isLoading) {
    return null; // AuthGuard will handle loading state
  }

  // Show auth forms if not authenticated
  if (!isAuthenticated) {
    return showSignUp ? (
      <SignUp onSwitchToLogin={() => setShowSignUp(false)} />
    ) : (
      <Login onSwitchToSignUp={() => setShowSignUp(true)} />
    );
  }

  // Show protected content if authenticated
  return (
    <AuthGuard>
      <Dashboard />
    </AuthGuard>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="App">
          <AppContent />
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
