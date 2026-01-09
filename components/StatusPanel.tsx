
import React from 'react';
import { PlayerState, MonthlyBill } from '../types';
import RadarChart from './RadarChart';
import InventoryGrid from './InventoryGrid';

interface StatusPanelProps {
  state: PlayerState;
  onShowBills: () => void;
  onShowStorage: (type: 'vehicle' | 'home') => void;
  onUseItem: (item: any) => void;
  onUpdateInventory: (items: any[]) => void;
}

const StatItem = ({ label, value, color, unit = "%" }: { label: string, value: number, color: string, unit?: string }) => (
  <div className="flex flex-col gap-2">
    <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
      <span>{label}</span>
      <span className="text-white mono">{Math.round(value)}{unit}</span>
    </div>
    <div className="h-1 bg-black/40 rounded-full overflow-hidden border border-white/5 shadow-inner">
      <div className={`h-full ${color} transition-all duration-700 ease-out`} style={{ width: `${Math.min(100, Math.max(0, value))}%` }}></div>
    </div>
  </div>
);

const StatusPanel: React.FC<StatusPanelProps> = ({ state, onShowBills, onShowStorage, onUseItem, onUpdateInventory }) => {
  const totalBills = state.bills.reduce((sum, b) => sum + b.amount, 0);
  const isLiquidityCrisis = state.cash < totalBills;

  return (
    <div className="w-85 border-r border-white/5 p-6 flex flex-col gap-6 bg-[#0a0c10] overflow-y-auto shrink-0 z-30 shadow-2xl custom-scrollbar">
      <div className="flex items-center gap-4 mb-2">
        <div className="relative">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center text-2xl shadow-lg border border-white/10">👤</div>
            {state.stress > 80 && <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 rounded-full animate-ping"></div>}
        </div>
        <div>
          <h2 className="font-black text-xl text-white tracking-tighter italic">RYAN WANG</h2>
          <p className="text-[10px] text-blue-400 uppercase tracking-widest font-black opacity-80">Lv. 35 Former PM</p>
        </div>
      </div>

      <RadarChart stats={state.stats} />
      
      <div className="space-y-5 bg-white/[0.02] p-4 rounded-2xl border border-white/5">
        <StatItem label="核心健康" value={state.health} color={state.health < 30 ? "bg-red-500" : "bg-emerald-500"} />
        <StatItem label="生存代谢" value={state.hunger} color="bg-orange-400" />
        <StatItem label="认知负荷" value={state.stress} color={state.stress > 80 ? "bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.5)]" : "bg-purple-500"} />
      </div>

      <button 
        onClick={onShowBills}
        className={`w-full flex flex-col gap-2 p-4 rounded-2xl border transition-all hover:bg-white/[0.04] group ${isLiquidityCrisis ? 'border-red-500/20 bg-red-950/5' : 'border-white/5'}`}
      >
         <div className="flex justify-between items-end">
            <div className="flex flex-col items-start">
                <span className="text-[8px] text-gray-500 uppercase font-black tracking-widest">Liquid Cash</span>
                <span className="text-lg font-black text-white mono">${state.cash.toLocaleString()}</span>
            </div>
            <div className="flex flex-col text-right group-hover:translate-x-1 transition-transform">
              <span className={`text-[8px] uppercase font-black tracking-widest ${isLiquidityCrisis ? 'text-red-500' : 'text-slate-600'}`}>Est. Debt</span>
              <span className={`text-sm font-black mono ${isLiquidityCrisis ? 'text-red-500' : 'text-slate-400'}`}>${totalBills.toLocaleString()} →</span>
            </div>
         </div>
         {isLiquidityCrisis && (
            <div className="px-2 py-1 bg-red-600/10 border border-red-600/20 rounded text-[7px] text-red-500 font-black uppercase text-center animate-pulse tracking-widest">斩杀线临界 (Critical Liquidity Alert)</div>
         )}
      </button>

      {state.vehicle && (
        <button onClick={() => onShowStorage('vehicle')} className="bg-white/5 border border-white/5 rounded-2xl p-4 text-left hover:bg-blue-600/10 transition-all group">
           <div className="flex justify-between items-center mb-3">
             <span className="text-[9px] text-blue-400 font-black uppercase tracking-widest flex items-center gap-2">🚗 {state.vehicle.name}</span>
             <span className="text-[10px] text-blue-500 font-black group-hover:translate-x-1 transition-transform italic">TRUNK</span>
           </div>
           <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[8px] font-bold text-slate-500 uppercase"><span>Energy/Fuel {state.vehicle.fuel}%</span></div>
              <div className="h-1 bg-black/40 rounded-full overflow-hidden"><div className="h-full bg-blue-600" style={{ width: `${state.vehicle.fuel}%` }}></div></div>
           </div>
        </button>
      )}

      <div className="flex-1 min-h-0 flex flex-col">
        <InventoryGrid 
            items={state.inventory} 
            rows={5} 
            cols={5} 
            title="随身存储 (Backpack)" 
            gridId="backpack" 
            onUseItem={onUseItem} 
            onUpdateItems={onUpdateInventory} 
        />
      </div>
    </div>
  );
};

export default StatusPanel;
