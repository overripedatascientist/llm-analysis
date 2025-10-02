import React from 'react';
import { BrowserRouter as Router, Routes, Route, useParams, useNavigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import CompetitiveAnalysisDashboard from './components/CompetitiveAnalysisDashboard';
import { getClientConfig } from './config/clients';
import './App.css';
import { ADMIN_PASSWORD } from './config/admin';

const DashboardWrapper: React.FC = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const config = clientId ? getClientConfig(clientId) : null;

  if (!config) {
    return (
      <div className="p-4 max-w-6xl mx-auto">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Error:</strong> Client "{clientId}" not found.
        </div>
        <p className="mt-4">
          <a
            href="/"
            className="text-blue-600 hover:text-blue-800"
            onClick={(e) => {
              e.preventDefault();
              const pwd = prompt('Enter admin password to access dashboard selection:');
              if (pwd === ADMIN_PASSWORD) {
                navigate('/');
              } else if (pwd !== null) {
                alert('Incorrect password. Please try again.');
              }
            }}
          >
            ← Back to Dashboard Selection
          </a>
        </p>
      </div>
    );
  }

  return <CompetitiveAnalysisDashboard config={config} />;
};

// Get the basename for the router
const getBasename = () => {
  if (process.env.NODE_ENV === 'development') {
    return '/';
  }
  // In production, extract the pathname from PUBLIC_URL
  if (process.env.PUBLIC_URL) {
    const url = new URL(process.env.PUBLIC_URL);
    return url.pathname;
  }
  return '/';
};

function App() {
  return (
    <Router basename={getBasename()}>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard/:clientId" element={<DashboardWrapper />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
