import { Activity } from 'lucide-react';

/**
 * Indicateur Live avec animation de pulsation
 * @param {boolean} isLive - État live actif/inactif
 * @param {string} lastUpdate - Timestamp dernière mise à jour
 */
const LiveIndicator = ({ isLive = true, lastUpdate = null }) => {
  return (
    <div className="flex items-center gap-2">
      {isLive ? (
        <>
          <div className="relative flex items-center justify-center">
            {/* Cercle pulsant extérieur */}
            <span className="absolute inline-flex h-4 w-4 rounded-full bg-red-400 opacity-75 animate-ping"></span>
            {/* Cercle intérieur fixe */}
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-red-600 dark:text-red-400" />
            <span className="text-sm font-semibold text-red-600 dark:text-red-400 uppercase tracking-wide">
              Live
            </span>
          </div>
        </>
      ) : (
        <>
          <div className="relative flex items-center justify-center">
            <span className="relative inline-flex rounded-full h-3 w-3 bg-gray-400 dark:bg-gray-600"></span>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Pause
            </span>
          </div>
        </>
      )}
      
      {lastUpdate && (
        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
          • {lastUpdate}
        </span>
      )}
    </div>
  );
};

export default LiveIndicator;