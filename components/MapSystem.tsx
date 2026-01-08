
import React, { useState } from 'react';
import { Location, LocationId, PlayerState, SubLocation } from '../types';
import { LOCATIONS } from '../data/locations';

interface MapSystemProps {
  state: PlayerState;
  onTravel: (location: Location, sub: SubLocation, costFuel: number, costTime: number) => void;
  onClose: () => void;
}

const MapSystem: React.FC<MapSystemProps> = ({ state, onTravel, onClose }) => {
  const [selectedLoc, setSelectedLoc] = useState<Location | null>(null);

  const calculateDistance = (l1: LocationId, l2: LocationId) => {
    const loc1 = LOCATIONS.find(l => l.id === l1);
    const loc2 = LOCATIONS.find(l => l.id === l2);
    if (!loc1 || !loc2) return 10;
    return Math.sqrt(Math.pow(loc1.coords.x - loc2.coords.x, 2) + Math.pow(loc1.coords.y - loc2.coords.y, 2));
  };

  const getTravelCosts = (targetLocId: LocationId) => {
    if (targetLocId === state.currentLocation) return { fuel: 0, time: 0.5 };
    
    const distance = calculateDistance(state.currentLocation, targetLocId);
    
    if (state.vehicle) {
      // 有车：消耗燃油，时间较短
      const fuelCost = Math.round(distance * state.vehicle.efficiency * 0.5);
      return { fuel: fuelCost, time: 1 };
    } else {
      // 无车：消耗大量时间（模拟公交/走路），且增加压力
      return { fuel: 0, time: Math.round(distance / 10) + 1.5 };
    }
  };

  return (
    <div className="absolute inset-0 z-[150] flex items-center justify-center p-8 bg-black/95 backdrop-blur-xl animate-in fade-in">
      <div className="max-w-6xl w-full h-[85vh] bg-[#0a0c10] border border-white/10 rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,1)] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-black/20">
          <div>
            <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Seattle Navigation</h2>
            <p className="text-[10px] text-blue-500 font-black uppercase tracking-[0.4em] mt-2">
              Current: {LOCATIONS.find(l => l.id === state.currentLocation)?.name} • 
              {state.vehicle ? ` Mode: ${state.vehicle.name}` : " Mode: Public Transit"}
            </p>
          </div>
          <button onClick={onClose} className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center text-white text-2xl hover:bg-white/10 transition-all">✕</button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Map Grid Side */}
          <div className="flex-1 relative bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] bg-slate-900/50 p-8">
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #4a5568 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
            
            {LOCATIONS.map(loc => {
              const isActive = state.currentLocation === loc.id;
              const isSelected = selectedLoc?.id === loc.id;
              const costs = getTravelCosts(loc.id);

              return (
                <button
                  key={loc.id}
                  onClick={() => setSelectedLoc(loc)}
                  className={`absolute group transition-all duration-500`}
                  style={{ left: `${loc.coords.x}%`, top: `${loc.coords.y}%`, transform: 'translate(-50%, -50%)' }}
                >
                  <div className={`relative flex flex-col items-center`}>
                    <div className={`w-6 h-6 rounded-full border-4 ${isActive ? 'bg-blue-500 border-blue-200' : 'bg-slate-700 border-slate-800'} ${isSelected ? 'scale-150 ring-8 ring-blue-500/20' : 'group-hover:scale-125'} transition-all`} />
                    <span className={`mt-2 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${isSelected ? 'bg-blue-600 text-white' : 'bg-black/60 text-slate-400'} border border-white/5`}>
                      {loc.name}
                    </span>
                    {isActive && <div className="absolute -top-10 animate-bounce text-xl">📍</div>}
                  </div>
                </button>
              );
            })}
          </div>

          {/* District Details Side */}
          <div className="w-[450px] border-l border-white/5 bg-black/40 p-10 overflow-y-auto">
            {selectedLoc ? (
              <div className="animate-in slide-in-from-right duration-300">
                <div className="mb-8">
                  <h3 className="text-3xl font-black text-white italic uppercase mb-2">{selectedLoc.name}</h3>
                  <div className="flex gap-4 mb-6">
                    <div className="bg-white/5 px-4 py-2 rounded-2xl border border-white/5">
                        <p className="text-[8px] text-slate-500 uppercase font-black">Price Index</p>
                        <p className={`text-lg font-black mono ${selectedLoc.priceMultiplier > 1 ? 'text-red-400' : 'text-emerald-400'}`}>{selectedLoc.priceMultiplier}x</p>
                    </div>
                    <div className="bg-white/5 px-4 py-2 rounded-2xl border border-white/5">
                        <p className="text-[8px] text-slate-500 uppercase font-black">Safety</p>
                        <p className="text-lg font-black text-blue-400 mono">{10 - selectedLoc.survivalDifficulty}/10</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed italic border-l-4 border-blue-600 pl-4">{selectedLoc.description}</p>
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-2">Sub-Locations</p>
                  {selectedLoc.subLocations.map(sub => {
                    const costs = getTravelCosts(selectedLoc.id);
                    const canAffordFuel = !state.vehicle || state.vehicle.fuel >= costs.fuel;

                    return (
                      <button
                        key={sub.id}
                        disabled={!canAffordFuel}
                        onClick={() => onTravel(selectedLoc, sub, costs.fuel, costs.time)}
                        className={`w-full p-6 rounded-3xl border border-white/5 text-left transition-all group ${state.currentSubLocationId === sub.id ? 'bg-blue-600/20 border-blue-500' : 'bg-white/5 hover:bg-white/10'}`}
                      >
                        <div className="flex justify-between items-start mb-2">
                           <div>
                              <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest">{sub.type}</span>
                              <h4 className="font-bold text-white text-lg uppercase italic">{sub.name}</h4>
                           </div>
                           <div className="text-right">
                              {costs.fuel > 0 && <span className="block text-[10px] font-black text-orange-500 mono">-{costs.fuel}% FUEL</span>}
                              {costs.time > 0 && <span className="block text-[10px] font-black text-slate-500 mono">+{costs.time}H TRAVEL</span>}
                           </div>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-2 italic">{sub.description}</p>
                        {state.currentSubLocationId === sub.id && <p className="mt-4 text-[10px] font-black text-blue-400 uppercase italic">CURRENT POSITION</p>}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center opacity-20 text-center">
                 <div className="text-8xl mb-6">📡</div>
                 <p className="text-xs font-black uppercase tracking-[0.3em]">Select a district on the map to scan for sub-locations</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapSystem;
