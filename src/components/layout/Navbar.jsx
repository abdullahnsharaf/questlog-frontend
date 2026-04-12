import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

const languages = [
  { code: 'en', label: 'EN', flag: '🇬🇧' },
  { code: 'ar', label: 'AR', flag: '🇸🇦' },
  { code: 'my', label: 'MY', flag: '🇲🇾' },
];

function Navbar() {
  const { isLoggedIn, logout, user } = useAuth();
  const { language, changeLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 20);
    }
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'glass border-b border-indigo-500/20 py-3' : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm" style={{ fontFamily: 'Orbitron' }}>Q</span>
          </div>
          <span className="text-xl font-bold gradient-text hidden sm:block" style={{ fontFamily: 'Orbitron' }}>
            QuestLog
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-6">
          {!isLoggedIn ? (
            <>
              <a href="#features" className="text-gray-400 hover:text-indigo-400 transition text-sm font-medium">
                {t.nav.features}
              </a>
              <a href="#contact" className="text-gray-400 hover:text-indigo-400 transition text-sm font-medium">
                {t.nav.contact}
              </a>
            </>
          ) : (
            <>
              <Link to="/search" className="text-gray-400 hover:text-indigo-400 transition text-sm font-medium">Search</Link>
              <Link to="/library" className="text-gray-400 hover:text-indigo-400 transition text-sm font-medium">Library</Link>
              <Link to="/friends" className="text-gray-400 hover:text-indigo-400 transition text-sm font-medium">Friends</Link>
            </>
          )}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">

          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1 text-gray-400 hover:text-white transition text-sm px-2 py-1 rounded-lg hover:bg-white/5"
            >
              <span>{languages.find((l) => l.code === language)?.flag}</span>
              <span className="text-xs font-medium">{language.toUpperCase()}</span>
              <svg className={`w-3 h-3 transition-transform ${langOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {langOpen && (
              <div className="absolute right-0 top-10 glass rounded-xl p-1 min-w-[100px] border border-indigo-500/20">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => { changeLanguage(lang.code); setLangOpen(false); }}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition ${
                      language === lang.code
                        ? 'bg-indigo-500/20 text-indigo-400'
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {!isLoggedIn ? (
            <>
              <Link to="/login" className="btn-outline text-sm py-2 px-4 hidden sm:block">
                {t.nav.login}
              </Link>
              <Link to="/register" className="btn-primary text-sm py-2 px-4">
                {t.nav.getStarted}
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/profile" className="flex items-center gap-2 glass px-3 py-2 rounded-xl hover:border-indigo-500/50 transition">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
                  {user?.username?.[0]?.toUpperCase() || 'U'}
                </div>
                <span className="text-sm text-gray-300 hidden sm:block">{user?.username}</span>
              </Link>
              <button onClick={handleLogout} className="text-gray-500 hover:text-red-400 transition p-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-gray-400 hover:text-white">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden glass border-t border-indigo-500/20 px-4 py-4 flex flex-col gap-3">
          {!isLoggedIn ? (
            <>
              <a href="#features" className="text-gray-400 hover:text-indigo-400 py-2">{t.nav.features}</a>
              <a href="#contact" className="text-gray-400 hover:text-indigo-400 py-2">{t.nav.contact}</a>
              <Link to="/login" className="btn-outline text-center py-2">{t.nav.login}</Link>
              <Link to="/register" className="btn-primary text-center py-2">{t.nav.getStarted}</Link>
            </>
          ) : (
            <>
              <Link to="/search" className="text-gray-400 hover:text-indigo-400 py-2">Search</Link>
              <Link to="/library" className="text-gray-400 hover:text-indigo-400 py-2">Library</Link>
              <Link to="/friends" className="text-gray-400 hover:text-indigo-400 py-2">Friends</Link>
              <button onClick={handleLogout} className="text-red-400 py-2 text-left">Logout</button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;