import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/layout/Navbar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SearchPage from './pages/SearchPage';
import GameDetailPage from './pages/GameDetailPage';
import LibraryPage from './pages/LibraryPage';

function ComingSoon({ page }) {
  return (
    <div className="min-h-screen flex items-center justify-center text-white text-2xl">
      {page} — Coming Soon
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <Navbar />
          <main className="pt-20">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/game/:gameId" element={<GameDetailPage />} />
              <Route path="/library" element={<LibraryPage />} />
              <Route path="/dashboard" element={<ComingSoon page="Dashboard" />} />
              <Route path="/friends" element={<ComingSoon page="Friends" />} />
              <Route path="/profile" element={<ComingSoon page="Profile" />} />
            </Routes>
          </main>
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;