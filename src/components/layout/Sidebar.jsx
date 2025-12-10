import { 
  LayoutDashboard, 
  Activity, 
  BarChart3, 
  Settings, 
  Building2,
  ChevronRight
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ isOpen, onClose }) => {
  // Menu items avec icônes
  // Chaque item a : id (unique), label (texte affiché), icon (composant icône),
  // path (route react-router) et badge (texte de badge ou null)
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/',
      badge: null,
    },
    {
      id: 'monitoring',
      label: 'Monitoring',
      icon: Activity,
      path: '/monitoring',
      badge: 'Live',
    },
    {
      id: 'comparison',
      label: 'Comparaison',
      icon: BarChart3,
      path: '/comparison',
      badge: null,
    },
    {
      id: 'sites',
      label: 'Sites & Bâtiments',
      icon: Building2,
      path: '/sites',
      badge: null,
    },
    {
      id: 'settings',
      label: 'Paramètres',
      icon: Settings,
      path: '/settings',
      badge: null,
    },
  ];

  return (
    <>
      {/* Overlay pour mobile
          Affiché uniquement si isOpen === true.
          - fixed inset-0 : recouvre tout l'écran
          - bg-black/50 : fond semi-transparent
          - z-40 : sous la sidebar (qui a z-50)
          - lg:hidden : caché sur grands écrans (desktop)
          onClick={onClose} : permet de fermer la sidebar en cliquant sur l'overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-white dark:bg-gray-800 
          border-r border-gray-200 dark:border-gray-700
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Navigation principale verticale */}
        <nav className="flex flex-col h-full py-6 px-3">
          {/* Partie menu principale qui prend l'espace restant */}
          <div className="flex-1 space-y-1">
            {menuItems.map((item) => {
              // Récupère le composant icône (ex: LayoutDashboard)
              const Icon = item.icon;

              return (
                // NavLink de react-router-dom : gère la navigation et fournit isActive
                <NavLink
                  key={item.id}
                  to={item.path}
                  onClick={() => onClose()} // ferme la sidebar (utile sur mobile)
                  className={({ isActive }) =>
                    `flex items-center justify-between px-4 py-3 rounded-lg transition-all group
                    ${
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`
                  }
                >
                  {/* NavLink supporte une fonction en enfants pour accéder à isActive */}
                  {({ isActive }) => (
                    <>
                      {/* Partie gauche : icone + label */}
                      <div className="flex items-center gap-3">
                        {/* Icon affichée, conditionne sa couleur selon isActive */}
                        <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600 dark:text-blue-400' : ''}`} />
                        <span className="font-medium">{item.label}</span>
                      </div>
                      
                      {/* Partie droite : badge (ex: "Live") ou chevron */}
                      {item.badge ? (
                        /* Si badge présent : petit badge rouge animé */
                        <span className="px-2 py-0.5 text-xs font-semibold bg-red-500 text-white rounded-full animate-pulse-slow">
                          {item.badge}
                        </span>
                      ) : (
                        /* Sinon on affiche une flèche ChevronRight :
                           - translate-x-1 si actif (légère translation)
                           - sinon opacity-0 pour la masquer et la montrer au hover (group-hover) */
                        <ChevronRight 
                          className={`w-4 h-4 transition-transform ${
                            isActive ? 'translate-x-1' : 'opacity-0 group-hover:opacity-100'
                          }`} 
                        />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* Section inférieure de la sidebar (statique) */}
          <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
              {/* Petite carte récap consommation :
                  - titre (Consommation Globale)
                  - valeur grande (1,250 kW)
                  - texte de mise à jour */}
              <p className="text-xs font-semibold text-gray-900 dark:text-white mb-1">
                Consommation Globale
              </p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                1,250 kW
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Mise à jour il y a 5s
              </p>
            </div>
          </div>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
