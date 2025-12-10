import { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon, Zap } from 'lucide-react'; //import des icônes

const Header = ({ onMenuToggle, isSidebarOpen }) => {
  // État du thème (clair/sombre)
  // Utilisé pour savoir quelle icône afficher (Sun ou Moon)
  const [isDark, setIsDark] = useState(false);

  // État du site sélectionné dans le menu déroulant
  const [selectedSite, setSelectedSite] = useState('all');

  // Liste des sites affichés dans le sélecteur
  // Ce sont des données "mock" (non reliées à une API)
  const sites = [
    { id: 'all', name: 'Tous les Sites' },
    { id: 'site_1', name: 'Site Paris' },
    { id: 'site_2', name: 'Site Lyon' },
    { id: 'site_3', name: 'Site Marseille' },
  ];

  /**
   * Au chargement du composant, on regarde dans localStorage
   * si l'utilisateur avait déjà choisi un thème.
   * Si oui → on l'applique.
   */
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  /**
   * Fonction qui bascule du thème clair au thème sombre.
   * - Met à jour l'état local React
   * - Ajoute / retire la classe "dark" sur <html> (utilisé par Tailwind)
   * - Enregistre le choix dans localStorage
   */
  const toggleTheme = () => {
    const newValue = !isDark;
    setIsDark(newValue);
    document.documentElement.classList.toggle('dark');

    localStorage.setItem("theme", newValue ? "dark" : "light");
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        
        {/* =========================
            PARTIE GAUCHE DU HEADER
           ========================= */}
        <div className="flex items-center gap-4">

          {/* Bouton Menu (affiché uniquement sur mobile/tablette)
             - Appelle la fonction parent "onMenuToggle"
             - Affiche Menu ou X selon si la sidebar est ouverte */}
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

          {/* Logo + titre du dashboard */}
          <div className="flex items-center gap-3">

            {/* Petit carré coloré contenant une icône */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>

            {/* Titre (masqué sur très petits écrans) */}
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

        {/* =========================
            SELECTEUR DE SITE (Desktop)
           ========================= */}
        <div className="hidden md:flex items-center gap-2">
          <label 
            htmlFor="site-selector" 
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Site :
          </label>

          {/* Sélecteur contrôlé (lié à selectedSite) */}
          <select
            id="site-selector"
            value={selectedSite}
            onChange={(e) => setSelectedSite(e.target.value)}
            className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            {sites.map((site) => (
              <option key={site.id} value={site.id}>
                {site.name}
              </option>
            ))}
          </select>
        </div>

        {/* =========================
            PARTIE DROITE DU HEADER
           ========================= */}
        <div className="flex items-center gap-2">

          {/* Bascule thème clair/sombre */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle theme"
          >
            {isDark ? (
              // Icône affichée quand le thème sombre est actif
              <Sun className="w-5 h-5 text-yellow-500" />
            ) : (
              // Icône affichée quand le thème clair est actif
              <Moon className="w-5 h-5 text-gray-600" />
            )}
          </button>

          {/* Bloc utilisateur (avatar + nom)
             - Affiché à partir des écrans "sm" */}
          <div className="hidden sm:flex items-center gap-2 ml-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              {/* Initiales de l’utilisateur (statique ici) */}
              <span className="text-white text-sm font-semibold">JD</span>
            </div>

            {/* Nom + rôle (affiché seulement en grand écran) */}
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

      {/* =========================
          SELECTEUR DE SITE (Mobile)
         ========================= */}
      <div className="md:hidden px-4 pb-3">
        <select
          value={selectedSite}
          onChange={(e) => setSelectedSite(e.target.value)}
          className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
        >
          {sites.map((site) => (
            <option key={site.id} value={site.id}>
              {site.name}
            </option>
          ))}
        </select>
      </div>
    </header>
  );
};

export default Header;
