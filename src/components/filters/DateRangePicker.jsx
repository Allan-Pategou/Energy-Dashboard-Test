import { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Sélecteur de plage de dates avec calendrier
 * @param {Date} startDate - Date de début
 * @param {Date} endDate - Date de fin
 * @param {Function} onChange - Callback ({ startDate, endDate })
 */
const DateRangePicker = ({ startDate, endDate, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectingStart, setSelectingStart] = useState(true);
  const [tempStartDate, setTempStartDate] = useState(startDate);
  const [tempEndDate, setTempEndDate] = useState(endDate);
  const dropdownRef = useRef(null);

  // Presets de dates
  const presets = [
    {
      label: "Aujourd'hui",
      getValue: () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return { startDate: today, endDate: new Date() };
      },
    },
    {
      label: '7 derniers jours',
      getValue: () => {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - 7);
        return { startDate: start, endDate: end };
      },
    },
    {
      label: '30 derniers jours',
      getValue: () => {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - 30);
        return { startDate: start, endDate: end };
      },
    },
    {
      label: 'Ce mois',
      getValue: () => {
        const now = new Date();
        return {
          startDate: startOfMonth(now),
          endDate: new Date(),
        };
      },
    },
    {
      label: 'Mois dernier',
      getValue: () => {
        const lastMonth = subMonths(new Date(), 1);
        return {
          startDate: startOfMonth(lastMonth),
          endDate: endOfMonth(lastMonth),
        };
      },
    },
  ];

  // Fermer au clic extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Réinitialiser les dates temporaires à l'ouverture
  useEffect(() => {
    if (isOpen) {
      setTempStartDate(startDate);
      setTempEndDate(endDate);
      setSelectingStart(true);
    }
  }, [isOpen, startDate, endDate]);

  // Générer les jours du mois
  const getDaysInMonth = () => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  };

  // Générer les jours vides au début (pour aligner le calendrier)
  const getEmptyDays = () => {
    const firstDay = startOfMonth(currentMonth);
    const dayOfWeek = firstDay.getDay();
    // Dimanche = 0, on veut Lundi = 0
    return dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  };

  // Gérer la sélection d'une date
  const handleDateClick = (date) => {
    if (selectingStart) {
      setTempStartDate(date);
      setTempEndDate(null);
      setSelectingStart(false);
    } else {
      if (date < tempStartDate) {
        setTempEndDate(tempStartDate);
        setTempStartDate(date);
      } else {
        setTempEndDate(date);
      }
      setSelectingStart(true);
    }
  };

  // Vérifier si une date est dans la plage
  const isInRange = (date) => {
    if (!tempStartDate || !tempEndDate) return false;
    return date >= tempStartDate && date <= tempEndDate;
  };

  // Appliquer la sélection
  const handleApply = () => {
    if (tempStartDate && tempEndDate) {
      onChange({ startDate: tempStartDate, endDate: tempEndDate });
      setIsOpen(false);
    }
  };

  // Appliquer un preset
  const handlePreset = (preset) => {
    const { startDate: start, endDate: end } = preset.getValue();
    onChange({ startDate: start, endDate: end });
    setIsOpen(false);
  };

  // Réinitialiser
  const handleClear = () => {
    const today = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(today.getDate() - 7);
    onChange({ startDate: weekAgo, endDate: today });
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bouton d'ouverture */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 transition-colors"
      >
        <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        <span className="text-sm font-medium text-gray-900 dark:text-white">
          {format(startDate, 'dd MMM', { locale: fr })} - {format(endDate, 'dd MMM yyyy', { locale: fr })}
        </span>
      </button>

      {/* Dropdown du calendrier */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 z-50 p-4 min-w-[320px]">
          
          {/* Presets */}
          <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">
              Raccourcis
            </p>
            <div className="grid grid-cols-2 gap-2">
              {presets.map((preset, index) => (
                <button
                  key={index}
                  onClick={() => handlePreset(preset)}
                  className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-colors text-left"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* En-tête du calendrier */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {format(currentMonth, 'MMMM yyyy', { locale: fr })}
            </span>
            
            <button
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* Jours de la semaine */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, index) => (
              <div key={index} className="text-center text-xs font-semibold text-gray-500 dark:text-gray-400 py-1">
                {day}
              </div>
            ))}
          </div>

          {/* Grille du calendrier */}
          <div className="grid grid-cols-7 gap-1">
            {/* Jours vides */}
            {Array.from({ length: getEmptyDays() }).map((_, index) => (
              <div key={`empty-${index}`} />
            ))}

            {/* Jours du mois */}
            {getDaysInMonth().map((day) => {
              const isStart = tempStartDate && isSameDay(day, tempStartDate);
              const isEnd = tempEndDate && isSameDay(day, tempEndDate);
              const inRange = isInRange(day);
              const isToday = isSameDay(day, new Date());
              const isCurrentMonth = isSameMonth(day, currentMonth);

              return (
                <button
                  key={day.toISOString()}
                  onClick={() => handleDateClick(day)}
                  disabled={!isCurrentMonth}
                  className={`
                    p-2 text-sm rounded-lg transition-all
                    ${!isCurrentMonth ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed' : ''}
                    ${isStart || isEnd ? 'bg-blue-600 text-white font-bold' : ''}
                    ${inRange && !isStart && !isEnd ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100' : ''}
                    ${!isStart && !isEnd && !inRange && isCurrentMonth ? 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white' : ''}
                    ${isToday && !isStart && !isEnd ? 'border-2 border-blue-600' : ''}
                  `}
                >
                  {format(day, 'd')}
                </button>
              );
            })}
          </div>

          {/* Actions */}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between gap-2">
            <button
              onClick={handleClear}
              className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
              Réinitialiser
            </button>

            <div className="flex gap-2">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleApply}
                disabled={!tempStartDate || !tempEndDate}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Appliquer
              </button>
            </div>
          </div>

          {/* Indication */}
          <p className="mt-2 text-xs text-center text-gray-500 dark:text-gray-400">
            {selectingStart ? 'Sélectionnez la date de début' : 'Sélectionnez la date de fin'}
          </p>
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;