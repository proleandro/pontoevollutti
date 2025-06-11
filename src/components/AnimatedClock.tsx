
import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { formatInTimeZone } from 'date-fns-tz';

const TIMEZONE = 'America/Sao_Paulo';

export function AnimatedClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center justify-center space-x-3 py-4">
      <div className="relative">
        <Clock className="w-8 h-8 text-publievo-orange-500 animate-pulse" />
        <div className="absolute inset-0 w-8 h-8 rounded-full border-2 border-publievo-orange-200 animate-spin" 
             style={{
               animationDuration: '60s',
               borderTopColor: 'transparent',
               borderRightColor: 'transparent'
             }}
        />
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-publievo-purple-700 font-mono">
          {formatInTimeZone(time, TIMEZONE, 'HH:mm:ss')}
        </div>
        <div className="text-sm text-gray-600">
          {formatInTimeZone(time, TIMEZONE, 'EEEE, dd/MM/yyyy')}
        </div>
      </div>
    </div>
  );
}
