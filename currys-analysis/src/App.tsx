import React from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import CompetitiveAnalysisDashboard from './components/CompetitiveAnalysisDashboard';
import { getClientConfig } from './config/clients';
import './App.css';

const DashboardWrapper: React.FC = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const config = clientId ? getClientConfig(clientId) : null;

  if (!config) {
    return (
      <div className="p-4 max-w-6xl mx-auto">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Error:</strong> Client "{clientId}" not found.
        </div>
        <p className="mt-4">
          <a href="/" className="text-blue-600 hover:text-blue-800">← Back to Dashboard Selection</a>
        </p>
      </div>
    );
  }

  return <CompetitiveAnalysisDashboard config={config} />;
};

function App() {
  return (
    <Router>
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