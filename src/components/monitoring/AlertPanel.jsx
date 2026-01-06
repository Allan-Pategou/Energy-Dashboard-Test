import { AlertTriangle, Info, CheckCircle, XCircle, Bell } from 'lucide-react';
import { formatRelativeTime } from '../../utils/formatters';

/**
 * Panel d'alertes en temps réel
 * @param {Array} alerts - Liste des alertes [{type, message, timestamp}, ...]
 */
const AlertPanel = ({ alerts = [] }) => {
  const getAlertIcon = (type) => {
    switch (type) {
      case 'critical':
        return <XCircle className="w-5 h-5" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />;
      case 'info':
        return <Info className="w-5 h-5" />;
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getAlertColors = (type) => {
    switch (type) {
      case 'critical':
        return {
          bg: 'bg-red-50 dark:bg-red-900/20',
          border: 'border-red-200 dark:border-red-800',
          text: 'text-red-800 dark:text-red-200',
          icon: 'text-red-600 dark:text-red-400',
        };
      case 'warning':
        return {
          bg: 'bg-orange-50 dark:bg-orange-900/20',
          border: 'border-orange-200 dark:border-orange-800',
          text: 'text-orange-800 dark:text-orange-200',
          icon: 'text-orange-600 dark:text-orange-400',
        };
      case 'info':
        return {
          bg: 'bg-blue-50 dark:bg-blue-900/20',
          border: 'border-blue-200 dark:border-blue-800',
          text: 'text-blue-800 dark:text-blue-200',
          icon: 'text-blue-600 dark:text-blue-400',
        };
      case 'success':
        return {
          bg: 'bg-green-50 dark:bg-green-900/20',
          border: 'border-green-200 dark:border-green-800',
          text: 'text-green-800 dark:text-green-200',
          icon: 'text-green-600 dark:text-green-400',
        };
      default:
        return {
          bg: 'bg-gray-50 dark:bg-gray-800',
          border: 'border-gray-200 dark:border-gray-700',
          text: 'text-gray-800 dark:text-gray-200',
          icon: 'text-gray-600 dark:text-gray-400',
        };
    }
  };

  if (alerts.length === 0) {
    return (
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Alertes
          </h3>
          <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-semibold rounded-full">
            0
          </span>
        </div>
        <div className="text-center py-8">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <p className="text-gray-600 dark:text-gray-400">
            Aucune alerte active
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
            Tous les systèmes fonctionnent normalement
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Alertes
        </h3>
        <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-sm font-semibold rounded-full animate-pulse">
          {alerts.length}
        </span>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {alerts.map((alert, index) => {
          const colors = getAlertColors(alert.type);
          
          return (
            <div
              key={index}
              className={`
                p-4 rounded-lg border-l-4 
                ${colors.bg} ${colors.border}
                transition-all duration-300
                hover:shadow-md
              `}
            >
              <div className="flex items-start gap-3">
                <div className={colors.icon}>
                  {getAlertIcon(alert.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-medium ${colors.text}`}>
                      {alert.message}
                    </p>
                    {alert.value && (
                      <span className={`text-sm font-bold ${colors.text} whitespace-nowrap`}>
                        {alert.value}
                      </span>
                    )}
                  </div>
                  {alert.timestamp && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {formatRelativeTime(alert.timestamp)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AlertPanel;