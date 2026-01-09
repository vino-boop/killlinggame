
import React, { useEffect, useRef } from 'react';
import { GameHistoryEntry } from '../types';

interface HistoryPanelProps {
  history: GameHistoryEntry[];
  currentHour: number;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, currentHour }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const formatTime = (hour: number) => {
    const h = Math.floor(hour);
    const m = Math.round((hour % 1) * 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-[400px] bg-[#0a0c10] p-8 overflow-hidden flex flex-col gap-8 shrink-0 border-l border-white/5 shadow-2xl">
      <div className="flex justify-between items-center border-b border-white/5 pb-4">
        <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] italic">Temporal Data Log</h3>
        <span className="text-[9px] text-blue-500 font-black mono animate-pulse">● LIVE FEED</span>
      </div>
      
      <div ref={scrollRef} className="flex-1 overflow-y-auto pr-4 flex flex-col gap-12 custom-scrollbar scroll-smooth">
        {history.map((event, idx) => (
          <div key={idx} className="relative pl-8 border-l border-white/10 pb-2 group animate-in slide-in-from-bottom-2 duration-500">
            <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full ring-4 ring-[#0a0c10] bg-slate-700 group-hover:bg-blue-500 transition-colors"></div>
            
            <div className="flex justify-between items-center mb-3">
              <h4 className={`font-black text-[10px] uppercase tracking-wider ${event.type === 'job' ? 'text-indigo-400' : event.type === 'billing' ? 'text-red-400' : 'text-white'}`}>
                {event.title}
              </h4>
              <span className="text-[9px] text-slate-700 mono font-bold bg-white/5 px-2 py-0.5 rounded">{formatTime(event.hour)}</span>
            </div>
            
            <p className="text-slate-400 text-xs leading-relaxed mb-4 font-medium italic opacity-80 group-hover:opacity-100 transition-opacity">
              "{event.description}"
            </p>
            
            {event.consequence && (
              <div className="p-3 bg-blue-600/5 rounded-xl border border-blue-500/10">
                <p className="text-blue-500 text-[10px] font-black uppercase italic leading-tight">
                  <span className="opacity-50">Outcome >> </span>{event.consequence}
                </p>
              </div>
            )}
          </div>
        ))}
        <div className="h-20 shrink-0 flex items-center justify-center">
            <div className="w-1 h-1 bg-slate-800 rounded-full mx-1"></div>
            <div className="w-1 h-1 bg-slate-800 rounded-full mx-1"></div>
            <div className="w-1 h-1 bg-slate-800 rounded-full mx-1"></div>
        </div>
      </div>
    </div>
  );
};

export default HistoryPanel;
