
import React from 'react';
import { PlayerState, Location, SubLocation, SubLocationAction, Character } from '../types';

interface ScenePanelProps {
  state: PlayerState;
  currentLocData?: Location;
  currentSubLocData?: SubLocation;
  onAction: (action: SubLocationAction) => void;
  onWait: () => void;
  onInteract: (char: Character) => void;
  onShowStorage: (type: 'home') => void;
}

const ScenePanel: React.FC<ScenePanelProps> = ({ 
  state, 
  currentLocData, 
  currentSubLocData, 
  onAction, 
  onWait, 
  onInteract, 
  onShowStorage 
}) => {
  if (!currentSubLocData) return null;

  return (
    <div className="flex-1 flex flex-col items-center justify-start p-12 overflow-y-auto custom-scrollbar bg-[#050608]">
      <div className="max-w-4xl w-full flex flex-col gap-12 pt-12">
        <div className="text-center space-y-2">
            <h1 className="text-7xl font-black text-white/5 italic uppercase tracking-tighter select-none leading-none mb-4">
              {currentSubLocData.name}
            </h1>
            <p className="text-blue-500/40 text-xs font-black tracking-[0.5em] uppercase italic">District Scan: {currentLocData?.name}</p>
        </div>

        {currentSubLocData.characters && currentSubLocData.characters.length > 0 && (
          <div className="flex justify-center gap-12 py-4">
            {currentSubLocData.characters.map(char => (
              <button 
                key={char.id} 
                onClick={() => onInteract(char)} 
                className="flex flex-col items-center group relative"
              >
                <div className="w-24 h-24 bg-[#0a0c10] border border-white/10 rounded-full flex items-center justify-center text-4xl group-hover:bg-blue-600/10 group-hover:border-blue-500 group-hover:shadow-[0_0_30px_rgba(37,99,235,0.2)] transition-all duration-500 overflow-hidden">
                   <span className="group-hover:scale-110 transition-transform">{char.avatar}</span>
                </div>
                <div className="mt-4 flex flex-col items-center">
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest group-hover:text-white transition-colors">{char.name}</span>
                    <span className="text-[9px] text-blue-500/60 font-black uppercase tracking-tighter italic">{char.role}</span>
                </div>
              </button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 gap-6">
          {currentSubLocData.actions?.map(action => {
            const adjustedCost = Math.round(action.costMoney * (currentLocData?.priceMultiplier || 1));
            const canAfford = state.cash >= adjustedCost;
            return (
              <button 
                key={action.id} 
                onClick={() => onAction(action)} 
                disabled={!canAfford} 
                className={`p-8 bg-[#0a0c10] border border-white/5 hover:border-blue-500/50 rounded-[2.5rem] text-left transition-all relative group flex flex-col ${!canAfford ? 'opacity-50 grayscale cursor-not-allowed' : 'hover:bg-white/[0.02] active:scale-[0.98]'}`}
              >
                {action.gainItem && <span className="absolute top-6 right-8 text-2xl opacity-20 group-hover:opacity-100 group-hover:scale-110 transition-all">{action.gainItem.icon}</span>}
                <div className="flex justify-between items-start mb-4">
                    <h4 className="font-black text-white text-lg uppercase italic tracking-tight">{action.label}</h4>
                    <span className="text-[10px] font-black text-slate-700 bg-white/5 px-2 py-1 rounded-md mono">{action.costTime}H</span>
                </div>
                <p className="text-xs text-slate-500 mb-8 flex-1 leading-relaxed italic">"{action.description}"</p>
                <div className="flex justify-between items-center pt-6 border-t border-white/5">
                  <span className={`text-sm font-black mono ${canAfford ? 'text-emerald-500' : 'text-red-600'}`}>
                    {adjustedCost === 0 ? 'FREE' : `$${adjustedCost.toLocaleString()}`}
                  </span>
                  {!canAfford && <span className="text-[8px] font-black text-red-600 uppercase tracking-widest">余额不足</span>}
                </div>
              </button>
            );
          })}

          <button 
            onClick={onWait} 
            className="p-8 bg-white/5 border border-white/5 rounded-[2.5rem] text-center group transition-all flex flex-col items-center justify-center gap-4 hover:bg-white/10"
          >
            <span className="text-3xl opacity-20 group-hover:opacity-100 group-hover:rotate-12 transition-all">🕒</span>
            <div className="flex flex-col items-center">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">原地待机 (1小时)</span>
                <span className="text-[9px] text-slate-600 font-black uppercase">Wait and Observe</span>
            </div>
          </button>

          {currentSubLocData.isHome && (
            <button 
                onClick={() => onShowStorage('home')} 
                className="p-8 bg-emerald-950/10 border border-emerald-500/20 hover:bg-emerald-600/20 rounded-[2.5rem] text-center flex flex-col items-center justify-center gap-4 group transition-all"
            >
              <span className="text-3xl group-hover:scale-110 transition-transform">📦</span>
              <div className="flex flex-col items-center">
                  <span className="text-[11px] font-black text-emerald-400 uppercase tracking-widest">长期物资仓储</span>
                  <span className="text-[9px] text-emerald-600 font-black uppercase">Safe Stash</span>
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScenePanel;
