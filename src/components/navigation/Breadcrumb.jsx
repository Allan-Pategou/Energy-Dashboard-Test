import { ChevronRight, Home, Building2, MapPin } from 'lucide-react';

/**
 * Fil d'Ariane pour la navigation hiérarchique
 * @param {Array} path - Chemin de navigation [{type, id, name}, ...]
 * @param {Function} onNavigate - Callback lors du clic sur un élément
 */
const Breadcrumb = ({ path = [], onNavigate }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'global':
        return <Home className="w-4 h-4" />;
      case 'site':
        return <Home className="w-4 h-4" />;
      case 'building':
        return <Building2 className="w-4 h-4" />;
      case 'zone':
        return <MapPin className="w-4 h-4" />;
      default:
        return <Home className="w-4 h-4" />;
    }
  };

  if (!path || path.length === 0) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 text-sm">
      {path.map((item, index) => {
        const isLast = index === path.length - 1;
        
        return (
          <div key={item.id} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-600 mx-2" />
            )}
            
            <button
              onClick={() => !isLast && onNavigate(item)}
              disabled={isLast}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
                isLast
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-semibold cursor-default'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {getIcon(item.type)}
              <span>{item.name}</span>
            </button>
          </div>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;