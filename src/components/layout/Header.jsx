import { useState } from 'react';
import { Menu, X, Sun, Moon, Zap } from 'lucide-react';

const Header = ({ onMenuToggle, isSidebarOpen }) => {
  const [isDark, setIsDark] = useState(false);

  // Gestion du thème
  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        
        {/* Partie gauche : Menu burger + Logo */}
        <div className="flex items-center gap-4">
          {/* Bouton Menu (mobile/tablet) */}
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle menu"
          >
            {isSidebarOpen ? (
              <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            )}
          </button>

          {/* Logo et titre */}
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Energy Dashboard
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Monitoring en temps réel
              </p>
            </div>
          </div>
        </div>

        {/* Partie centrale : Info ou badge Live */}
        <div className="hidden md:flex items-center gap-2">
          <span className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-sm font-semibold rounded-full flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse-slow"></span>
            Système opérationnel
          </span>
        </div>

        {/* Partie droite : Thème + Utilisateur */}
        <div className="flex items-center gap-2">
          {/* Toggle thème clair/sombre */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle theme"
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-yellow-500" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600" />
            )}
          </button>

          {/* Avatar utilisateur */}
          <div className="hidden sm:flex items-center gap-2 ml-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">JD</span>
            </div>
            <div className="hidden lg:block">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                John Doe
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Admin
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;