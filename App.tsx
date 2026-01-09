
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { PlayerState, GameHistoryEntry, GameEvent, Stats, LocationId, Location, InventoryItem, Item, Weather, SubLocation, Weather as WeatherType, Vehicle, MonthlyBill, Character, SubLocationAction, PendingDelivery } from './types';
import { getRandomEvent, EVENTS } from './data/events';
import { ITEMS } from './data/items';
import { LOCATIONS } from './data/locations';
import RadarChart from './components/RadarChart';
import InventoryGrid from './components/InventoryGrid';
import DeviceOverlay from './components/DeviceOverlay';
import MapSystem from './components/MapSystem';

const START_DATE = new Date('2026-07-27');

const WEATHER_ICONS: Record<WeatherType, string> = {
  'Sunny': '☀️',
  'Cloudy': '☁️',
  'Rainy': '🌧️',
  'Stormy': '⛈️',
  'Foggy': '🌫️',
};

const INITIAL_STATE: PlayerState = {
  day: 1,
  hour: 14,
  weather: 'Cloudy',
  cash: 5500,
  debt: 0,
  health: 95,
  stress: 40,
  hunger: 80,
  bodyTemp: 98,
  addiction: 0,
  addictionTolerance: 0,
  currentLocation: 'downtown',
  currentSubLocationId: 'belltown-apt',
  vehicle: {
    name: "BMW 3系 (5年车龄)",
    condition: 75,
    fuel: 60,
    efficiency: 1.2,
    value: 12000,
    type: 'car'
  },
  bills: [
    { id: 'rent', name: 'Belltown 公寓房租', amount: 3800, dueDate: 1, description: '地段税，西雅图的入场券。', isCancellable: true, isActive: true, consequenceIfCancelled: '房东将立即启动驱逐程序。' },
    { id: 'loan', name: '学生贷款 (MBA)', amount: 1200, dueDate: 15, description: '当初以为是投资，现在是枷锁。', isCancellable: true, isActive: true, consequenceIfCancelled: '逾期利息将翻倍。' },
    { id: 'insurance', name: '医保', amount: 200, dueDate: 10, description: '维持体面生活的最低标准。', isCancellable: true, isActive: true, consequenceIfCancelled: '医疗开支将极其昂贵。' },
  ],
  stats: { survival: 10, intellect: 85, social: 65, sanity: 75, luck: 40 },
  traits: ['中产精英', '刚离职', '咖啡重度依赖'],
  history: [{ day: 1, hour: 14, title: "第一章 · 消失的缓冲带", description: "你坐在西湖中心的长椅上，手机开始疯狂震动。西雅图的雨正如期而至。", type: 'narrative' }],
  inventory: [
    { ...ITEMS['macbook-pro'], x: 0, y: 0 },
    { ...ITEMS['smartphone'], x: 0, y: 2 },
    { ...ITEMS['identity-card'], x: 1, y: 2 },
    { ...ITEMS['water-bottle'], x: 2, y: 0 },
  ],
  vehicleInventory: [],
  homeInventory: [],
  inventorySize: { rows: 5, cols: 5 },
  pendingEvents: [
    ...EVENTS.filter(e => ['hr-dismissal', 'ex-wife-tuition', 'landlord-rent-hike', 'bank-linkedin-backstab'].includes(e.id))
  ],
  pendingDeliveries: [],
  job: null
};

const findFreeSpot = (gridSize: {rows: number, cols: number}, items: InventoryItem[], itemToPlace: Item) => {
  const grid = Array(gridSize.rows).fill(null).map(() => Array(gridSize.cols).fill(false));
  items.forEach(item => {
    for (let r = 0; r < item.height; r++) {
      for (let c = 0; c < item.width; c++) {
        if (item.y + r < gridSize.rows && item.x + c < gridSize.cols) {
          grid[item.y + r][item.x + c] = true;
        }
      }
    }
  });

  for (let r = 0; r <= gridSize.rows - itemToPlace.height; r++) {
    for (let c = 0; c <= gridSize.cols - itemToPlace.width; c++) {
      let canFit = true;
      for (let ir = 0; ir < itemToPlace.height; ir++) {
        for (let ic = 0; ic < itemToPlace.width; ic++) {
          if (grid[r + ir][c + ic]) {
            canFit = false;
            break;
          }
        }
        if (!canFit) break;
      }
      if (canFit) return { x: c, y: r };
    }
  }
  return null;
};

const App: React.FC = () => {
  const [gameState, setGameState] = useState<PlayerState>(INITIAL_STATE);
  const [gameOver, setGameOver] = useState<{reason: string, code: string} | null>(null);
  const [activeDevice, setActiveDevice] = useState<'laptop' | 'phone' | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [showStorage, setShowStorage] = useState<'vehicle' | 'home' | null>(null);
  const [showBills, setShowBills] = useState(false);
  const [activeDialogue, setActiveDialogue] = useState<{char: Character, text: string} | null>(null);
  const historyEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (historyEndRef.current) historyEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [gameState.history]);

  useEffect(() => {
    if (gameState.health <= 0) setGameOver({ code: "BIOLOGICAL_CRITICAL", reason: "你的身体支撑不住高强度的压力与饥饿..." });
    else if (gameState.stress >= 100) setGameOver({ code: "COGNITIVE_BREACH", reason: "你的理智已经彻底断裂..." });
  }, [gameState.health, gameState.stress]);

  const formatTime = (hour: number) => {
    const h = Math.floor(hour);
    const m = Math.round((hour % 1) * 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  const advanceTime = (hours: number, isSleeping: boolean = false) => {
    setGameState(prev => {
      let newHealth = prev.health;
      let newHunger = Math.max(0, prev.hunger - (hours * 3.75));
      let newStress = prev.stress;

      if (!isSleeping && newHunger < 10) {
        newHealth -= (hours * 5);
      }
      
      if (!isSleeping && newHealth < prev.health && prev.stress > 80) {
        newHealth -= (prev.health - newHealth) * 0.2;
      }

      const totalHours = prev.hour + hours;
      const daysPassed = Math.floor(totalHours / 24);
      return { 
        ...prev, 
        hour: totalHours % 24, 
        day: prev.day + daysPassed, 
        hunger: newHunger,
        health: Math.max(0, newHealth)
      };
    });
  };

  const handlePayBill = (bill: MonthlyBill) => {
    if (gameState.cash < bill.amount) return;
    setGameState(prev => ({
      ...prev,
      cash: prev.cash - bill.amount,
      bills: prev.bills.filter(b => b.id !== bill.id),
      history: [...prev.history, {
        day: prev.day, hour: prev.hour,
        title: "账单支付",
        description: `支付了 ${bill.name}，金额: $${bill.amount.toLocaleString()}。暂时解除了危机。`,
        type: 'billing'
      }]
    }));
  };

  const handleSubAction = (action: SubLocationAction) => {
    const currentLoc = LOCATIONS.find(l => l.id === gameState.currentLocation);
    const adjustedCost = Math.round(action.costMoney * (currentLoc?.priceMultiplier || 1));
    
    if (gameState.cash < adjustedCost) return;

    setGameState(prev => {
      let newInventory = [...prev.inventory];
      let historyMsg = action.description;

      if (action.gainItem) {
        const spot = findFreeSpot(prev.inventorySize, prev.inventory, action.gainItem);
        if (!spot) {
          alert("背囊空间不足！");
          return prev;
        }
        newInventory.push({ ...action.gainItem, ...spot });
        historyMsg = `获得了 ${action.gainItem.icon || ''} ${action.gainItem.name}。${action.description}`;
      }

      const effectResult = action.effect(prev);
      const { stats: effectStats, ...otherChanges } = effectResult;
      const newStats: Stats = { ...prev.stats, ...(effectStats || {}) };
      const isSleepAction = action.id.includes('sleep');

      let targetHealth = (otherChanges.health !== undefined ? otherChanges.health : prev.health);
      
      if (!isSleepAction && targetHealth < prev.health && prev.stress > 80) {
        targetHealth -= (prev.health - targetHealth) * 0.2;
      }

      const totalHours = prev.hour + action.costTime;
      const daysPassed = Math.floor(totalHours / 24);
      
      const hungerDecay = action.costTime * 3.75;
      const newHunger = Math.max(0, (otherChanges.hunger !== undefined ? otherChanges.hunger : prev.hunger) - hungerDecay);

      return { 
        ...prev, 
        ...otherChanges, 
        inventory: newInventory,
        health: Math.max(0, targetHealth),
        hunger: newHunger,
        cash: prev.cash - adjustedCost, 
        hour: totalHours % 24, 
        day: prev.day + daysPassed,
        stats: newStats, 
        history: [...prev.history, { 
          day: prev.day, hour: prev.hour, 
          title: `行动: ${action.label}`, 
          description: historyMsg, 
          type: action.gainItem ? 'transaction' : 'action' 
        }] 
      };
    });
  };

  const handleTravel = (location: Location, sub: SubLocation, costFuel: number, costTime: number) => {
    setGameState(prev => {
      const newVehicle = prev.vehicle ? { ...prev.vehicle, fuel: Math.max(0, prev.vehicle.fuel - costFuel) } : null;
      const totalHours = prev.hour + costTime;
      const daysPassed = Math.floor(totalHours / 24);
      const hungerDecay = costTime * 3.75;
      const newHunger = Math.max(0, prev.hunger - hungerDecay);
      const stressImpact = costFuel === 0 ? 10 : 2;

      return {
        ...prev,
        currentLocation: location.id,
        currentSubLocationId: sub.id,
        vehicle: newVehicle,
        hour: totalHours % 24,
        day: prev.day + daysPassed,
        hunger: newHunger,
        stress: Math.min(100, prev.stress + stressImpact),
        history: [...prev.history, { 
          day: prev.day, hour: prev.hour, 
          title: "跨区移动", 
          description: `你${costFuel > 0 ? '驾驶车辆' : '搭乘公共交通'}前往了 ${location.name} 的 ${sub.name}。`, 
          type: 'location-change' 
        }]
      };
    });
    setShowMap(false);
  };

  const handleEventChoice = (event: GameEvent, choiceIndex: number) => {
    const choice = event.choices[choiceIndex];
    setGameState(prev => {
      const newState = { ...prev };
      if (choice.gainItem) {
        const spot = findFreeSpot(newState.inventorySize, newState.inventory, choice.gainItem);
        if (spot) newState.inventory = [...newState.inventory, { ...choice.gainItem, ...spot }];
      }
      newState.history = [...newState.history, { day: prev.day, hour: prev.hour, title: event.title, description: choice.text, consequence: choice.impact, type: 'outcome' }];
      newState.pendingEvents = prev.pendingEvents.filter(e => e.id !== event.id);
      return newState;
    });
  };

  const useItem = (item: InventoryItem) => {
    if (item.id === 'macbook-pro') setActiveDevice('laptop');
    else if (item.id === 'smartphone') setActiveDevice('phone');
    else if (item.effect) {
      setGameState(prev => {
        const effectResult = item.effect!(prev);
        const { stats: effectStats, ...otherChanges } = effectResult;
        return { ...prev, ...otherChanges, stats: { ...prev.stats, ...(effectStats || {}) }, inventory: prev.inventory.filter(i => i !== item) };
      });
    }
  };

  const transferItem = (item: InventoryItem, from: string) => {
    if (!showStorage) return;
    setGameState(prev => {
      const isFromBackpack = from === 'backpack';
      const targetGrid = isFromBackpack ? (showStorage === 'vehicle' ? 'vehicle' : 'home') : 'backpack';
      const targetRows = targetGrid === 'backpack' ? 5 : (targetGrid === 'vehicle' ? 8 : 15);
      const targetCols = targetGrid === 'backpack' ? 5 : (targetGrid === 'vehicle' ? 8 : 15);
      const targetItems = targetGrid === 'backpack' ? prev.inventory : (targetGrid === 'vehicle' ? prev.vehicleInventory : prev.homeInventory);
      const spot = findFreeSpot({ rows: targetRows, cols: targetCols }, targetItems, item);
      if (!spot) return prev;
      const newItem = { ...item, ...spot };
      let newInv = from === 'backpack' ? prev.inventory.filter(i => i !== item) : (targetGrid === 'backpack' ? [...prev.inventory, newItem] : prev.inventory);
      let newVehicle = from === 'vehicle' ? prev.vehicleInventory.filter(i => i !== item) : (targetGrid === 'vehicle' ? [...prev.vehicleInventory, newItem] : prev.vehicleInventory);
      let newHome = from === 'home' ? prev.homeInventory.filter(i => i !== item) : (targetGrid === 'home' ? [...prev.homeInventory, newItem] : prev.homeInventory);
      return { ...prev, inventory: newInv, vehicleInventory: newVehicle, homeInventory: newHome };
    });
  };

  const currentLocData = LOCATIONS.find(loc => loc.id === gameState.currentLocation);
  const currentSubLocData = currentLocData?.subLocations.find(sub => sub.id === gameState.currentSubLocationId);

  const interactWithCharacter = (char: Character) => {
      let dialogue = char.dialogues.default;
      if (gameState.cash < 500 && char.dialogues.lowCash) dialogue = char.dialogues.lowCash;
      if (gameState.stress > 70 && char.dialogues.highStress) dialogue = char.dialogues.highStress;
      setActiveDialogue({ char, text: dialogue });
  };

  const totalBills = gameState.bills.reduce((sum, b) => sum + b.amount, 0);

  return (
    <div className="flex h-screen w-full bg-[#050608] text-slate-300 select-none overflow-hidden font-sans relative">
      <div className="w-80 border-r border-white/5 p-6 flex flex-col gap-6 bg-[#0a0c10] overflow-y-auto shrink-0 z-30 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-xl shadow-lg">👤</div>
          <div><h2 className="font-bold text-lg text-white">Ryan (35)</h2><p className="text-[10px] text-blue-400 uppercase tracking-widest font-black">中产残响</p></div>
        </div>
        <RadarChart stats={gameState.stats} />
        
        <div className="space-y-4">
          <StatItem label="健康" value={gameState.health} color="bg-emerald-500" />
          <StatItem label="饥饿" value={gameState.hunger} color="bg-orange-400" />
          <StatItem label="压力" value={gameState.stress} color="bg-purple-500" />
          
          <button 
            onClick={() => setShowBills(true)}
            className="w-full flex flex-col gap-2 pt-4 border-t border-white/5 text-left group hover:bg-white/[0.02] rounded-xl transition-all p-2 -mx-2"
          >
             <div className="flex justify-between items-end">
                <div className="flex flex-col"><span className="text-[8px] text-gray-500 uppercase font-black tracking-widest">CASH</span><span className="text-sm font-black text-white mono">${gameState.cash.toLocaleString()}</span></div>
                <div className="flex flex-col text-right group-hover:translate-x-1 transition-transform">
                  <span className="text-[8px] text-red-500 uppercase font-black tracking-widest">TOTAL DEBT</span>
                  <span className="text-sm font-black text-red-500 mono">${totalBills.toLocaleString()} →</span>
                </div>
             </div>
             {gameState.cash < totalBills && (
                <div className="px-2 py-1 bg-red-950/30 border border-red-500/20 rounded text-[8px] text-red-400 font-black uppercase text-center animate-pulse">流动性危机 (Liquidity Crisis)</div>
             )}
          </button>
        </div>

        {gameState.vehicle && (
          <button onClick={() => setShowStorage('vehicle')} className="bg-white/5 border border-white/5 rounded-2xl p-4 text-left hover:bg-blue-600/10 transition-all group mt-auto">
             <div className="flex justify-between items-center mb-3"><span className="text-[9px] text-blue-400 font-black uppercase tracking-widest">VEHICLE</span><span className="text-[10px] text-blue-500 font-black group-hover:translate-x-1 transition-transform">TRUNK →</span></div>
             <div className="flex flex-col gap-1">
                <div className="flex justify-between text-[8px] font-bold text-slate-500 uppercase"><span>Fuel {gameState.vehicle.fuel}%</span></div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden"><div className={`h-full bg-blue-600`} style={{ width: `${gameState.vehicle.fuel}%` }}></div></div>
             </div>
          </button>
        )}
        <InventoryGrid items={gameState.inventory} rows={5} cols={5} title="随身背囊" gridId="backpack" onUseItem={useItem} onUpdateItems={(newItems) => setGameState(prev => ({ ...prev, inventory: newItems }))} />
        <button onClick={() => setShowMap(true)} className="py-4 px-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl">🗺️ OPEN SEATTLE MAP</button>
      </div>

      <div className="flex-1 flex flex-col relative bg-[#050608] overflow-hidden">
        <div className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-[#0a0c10]/90 backdrop-blur-md shrink-0 z-20">
            <div className="flex items-center gap-8">
                <div className="flex flex-col items-center"><span className="mono text-blue-500 font-black text-xl">{START_DATE.toLocaleDateString()}</span><span className="text-[10px] mono text-gray-500 font-bold uppercase tracking-widest">{formatTime(gameState.hour)}</span></div>
                <div className="flex items-center gap-4"><span className="text-3xl">{WEATHER_ICONS[gameState.weather]}</span><div className="flex flex-col"><span className="text-xs font-black text-white uppercase tracking-wider">{currentLocData?.name}</span><span className="text-[10px] text-blue-400 font-bold italic">{currentSubLocData?.name}</span></div></div>
            </div>
            {currentLocData && <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest bg-white/5 px-4 py-2 rounded-full border border-white/5">Market Index: {currentLocData.priceMultiplier}x</span>}
        </div>

        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 p-12 flex flex-col overflow-y-auto">
             {!gameOver ? (
               <div className="flex-1 flex flex-col items-center justify-center gap-12 max-w-4xl mx-auto w-full">
                 <h1 className="text-6xl font-black text-white/5 italic uppercase tracking-tighter text-center">{currentSubLocData?.name}</h1>
                 
                 {currentSubLocData?.characters && currentSubLocData.characters.length > 0 && (
                     <div className="w-full flex justify-center gap-8 mb-4">
                         {currentSubLocData.characters.map(char => (
                             <button key={char.id} onClick={() => interactWithCharacter(char)} className="flex flex-col items-center group">
                                 <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-4xl group-hover:bg-blue-600/20 group-hover:border-blue-500 transition-all shadow-xl">{char.avatar}</div>
                                 <span className="mt-2 text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-white transition-colors">{char.name}</span>
                                 <span className="text-[8px] text-blue-400 font-bold italic">{char.role}</span>
                             </button>
                         ))}
                     </div>
                 )}

                 <div className="w-full grid grid-cols-2 gap-4">
                    {currentSubLocData?.actions?.map(action => {
                      const adjustedCost = Math.round(action.costMoney * (currentLocData?.priceMultiplier || 1));
                      return (
                        <button key={action.id} onClick={() => handleSubAction(action)} disabled={gameState.cash < adjustedCost} className="p-6 bg-[#0a0c10] border border-white/5 hover:border-blue-500/50 rounded-[2rem] text-left transition-all relative group">
                          {action.gainItem && <span className="absolute top-4 right-4 text-2xl opacity-40 group-hover:opacity-100 group-hover:scale-125 transition-all">🛒</span>}
                          <div className="flex justify-between items-start mb-2"><h4 className="font-black text-white text-base uppercase italic">{action.label}</h4><span className="text-xs font-black text-slate-600 mono">{action.costTime}H</span></div>
                          <p className="text-[11px] text-slate-500 mb-4 h-8 line-clamp-2">{action.description}</p>
                          <div className="flex justify-between items-center pt-4 border-t border-white/5"><span className={`text-xs font-black mono ${gameState.cash < adjustedCost ? 'text-red-500' : 'text-emerald-500'}`}>${adjustedCost}</span></div>
                        </button>
                      );
                    })}
                    <button onClick={() => advanceTime(1)} className="p-6 bg-white/5 border border-white/5 rounded-[2rem] text-center group transition-all flex flex-col items-center justify-center gap-2"><span className="text-2xl opacity-40 group-hover:opacity-100">🕒</span><span className="text-[10px] font-black text-slate-500 uppercase">Wait 1 Hour</span></button>
                    {currentSubLocData?.isHome && (
                      <button onClick={() => setShowStorage('home')} className="p-6 bg-emerald-900/10 border border-emerald-500/30 hover:bg-emerald-600/20 rounded-[2rem] text-center flex flex-col items-center justify-center gap-2">
                        <span className="text-2xl">📦</span><span className="text-[10px] font-black text-emerald-400 uppercase">房间储藏室</span>
                      </button>
                    )}
                 </div>
               </div>
             ) : (
               <div className="flex-1 flex flex-col items-center justify-center text-center animate-in zoom-in">
                 <h1 className="text-[8rem] font-black text-red-600/20 italic uppercase leading-none mb-2">TERMINATED</h1>
                 <p className="text-slate-300 text-2xl max-w-2xl font-bold mb-12 italic">{gameOver.reason}</p>
                 <button onClick={() => window.location.reload()} className="px-16 py-6 bg-white text-black font-black rounded-full hover:bg-red-600 hover:text-white transition-all text-xl uppercase shadow-2xl">REBOOT SYSTEM</button>
               </div>
             )}
          </div>
          <div className="w-[400px] bg-[#0a0c10] p-8 overflow-y-auto flex flex-col gap-8 shrink-0 border-l border-white/5">
            <h3 className="text-[10px] font-black text-slate-700 uppercase tracking-[0.3em]">Temporal Logs</h3>
            <div className="flex flex-col gap-10">
              {gameState.history.map((event, idx) => (
                <div key={idx} className="relative pl-8 border-l border-white/5 pb-2">
                  <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full ring-4 ring-[#0a0c10] bg-slate-700"></div>
                  <div className="flex justify-between items-center mb-2"><h4 className="font-black text-white text-[10px] uppercase tracking-wider">{event.title}</h4><span className="text-[9px] text-slate-700 mono">{formatTime(event.hour)}</span></div>
                  <p className="text-slate-500 text-xs leading-relaxed mb-2 font-medium">{event.description}</p>
                  {event.consequence && <p className="text-blue-400 text-[10px] font-black uppercase italic">>> {event.consequence}</p>}
                </div>
              ))}
              <div ref={historyEndRef} />
            </div>
          </div>
        </div>

        {activeDialogue && (
            <div className="absolute inset-0 z-[110] flex items-center justify-center p-12 animate-in fade-in bg-black/80 backdrop-blur-md">
                <div className="max-w-2xl w-full bg-[#0a0c10] border border-white/5 rounded-[3rem] p-12 shadow-2xl">
                    <div className="flex items-center gap-6 mb-8">
                        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center text-5xl border border-white/10 shadow-2xl">{activeDialogue.char.avatar}</div>
                        <div>
                            <h2 className="text-3xl font-black text-white italic uppercase">{activeDialogue.char.name}</h2>
                            <p className="text-sm text-blue-500 font-bold uppercase tracking-widest">{activeDialogue.char.role}</p>
                        </div>
                    </div>
                    <div className="p-8 bg-white/5 rounded-3xl border border-white/5 italic text-slate-300 leading-relaxed mb-10 text-lg">"{activeDialogue.text}"</div>
                    <button onClick={() => setActiveDialogue(null)} className="w-full py-5 bg-blue-600 text-white font-black rounded-full uppercase tracking-[0.2em] shadow-2xl hover:bg-blue-500 transition-all">End Conversation</button>
                </div>
            </div>
        )}

        {showBills && (
          <div className="absolute inset-0 z-[120] flex items-center justify-center p-12 animate-in fade-in bg-black/80 backdrop-blur-md">
            <div className="max-w-xl w-full bg-[#0a0c10] border border-white/5 rounded-[3rem] p-10 shadow-2xl flex flex-col gap-8">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">待扣款项目 (Pending Bills)</h2>
                  <p className="text-[10px] text-red-500 font-black uppercase tracking-[0.3em] mt-2">Financial Obligations Log</p>
                </div>
                <button onClick={() => setShowBills(false)} className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all text-xl">✕</button>
              </div>
              
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                {gameState.bills.length > 0 ? (
                  gameState.bills.map(bill => (
                    <div key={bill.id} className="p-6 bg-white/[0.03] border border-white/5 rounded-[2rem] flex flex-col gap-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-black text-white text-base uppercase italic">{bill.name}</h4>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Due Day {bill.dueDate}</p>
                        </div>
                        <span className="text-xl font-black text-red-500 mono">${bill.amount.toLocaleString()}</span>
                      </div>
                      <p className="text-xs text-slate-400 italic font-medium leading-relaxed opacity-60">"{bill.description}"</p>
                      <button 
                        onClick={() => handlePayBill(bill)}
                        disabled={gameState.cash < bill.amount}
                        className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${gameState.cash >= bill.amount ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20 active:scale-95' : 'bg-white/5 text-slate-700 cursor-not-allowed border border-white/5'}`}
                      >
                        {gameState.cash >= bill.amount ? '立刻结算 (Pay Now)' : '资金不足 (Insufficient Funds)'}
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="p-20 text-center opacity-20 flex flex-col items-center gap-4">
                    <span className="text-6xl">💸</span>
                    <p className="text-[10px] font-black uppercase tracking-[0.5em]">No Pending Debts</p>
                  </div>
                )}
              </div>
              
              <div className="p-6 bg-blue-600/5 border border-blue-500/20 rounded-3xl flex justify-between items-center">
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Available Balance</span>
                <span className="text-2xl font-black text-white mono">${gameState.cash.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        {showStorage && (
          <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-3xl p-12 animate-in zoom-in duration-300">
             <div className="max-w-[1400px] w-full bg-[#0a0c10] border border-white/5 rounded-[4rem] overflow-hidden flex flex-col max-h-[95vh] shadow-2xl">
                <div className="p-12 border-b border-white/5 flex justify-between items-center bg-black/20">
                   <div>
                      <h2 className="text-5xl font-black text-white italic uppercase tracking-tighter">{showStorage === 'vehicle' ? '物资转移: 后备箱' : '物资转移: 房间储藏室'}</h2>
                      <p className="text-[11px] text-slate-500 font-black uppercase tracking-[0.4em] mt-3">Click on items to transfer between containers • Right-click to rotate</p>
                   </div>
                   <button onClick={() => setShowStorage(null)} className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center text-white text-2xl hover:bg-white/10 transition-all">✕</button>
                </div>
                <div className="flex-1 overflow-auto p-12 flex justify-center gap-16 items-start">
                   <InventoryGrid items={gameState.inventory} rows={5} cols={5} title="随身背囊" gridId="backpack" onItemClick={(item) => transferItem(item, 'backpack')} onUpdateItems={(newItems) => setGameState(prev => ({ ...prev, inventory: newItems }))} accentColor="text-blue-500" />
                   <div className="flex flex-col items-center justify-center pt-32 opacity-20"><div className="w-px h-64 bg-gradient-to-b from-transparent via-white/40 to-transparent"></div><span className="text-4xl my-8">⇄</span><div className="w-px h-64 bg-gradient-to-b from-transparent via-white/40 to-transparent"></div></div>
                   <InventoryGrid items={showStorage === 'vehicle' ? gameState.vehicleInventory : gameState.homeInventory} rows={showStorage === 'vehicle' ? 8 : 15} cols={showStorage === 'vehicle' ? 8 : 15} title={showStorage === 'vehicle' ? "后备箱 (Trunk)" : "长期储藏 (Stash)"} gridId={showStorage === 'vehicle' ? 'vehicle' : 'home'} onItemClick={(item) => transferItem(item, showStorage === 'vehicle' ? 'vehicle' : 'home')} onUpdateItems={(newItems) => showStorage === 'vehicle' ? setGameState(prev => ({ ...prev, vehicleInventory: newItems })) : setGameState(prev => ({ ...prev, homeInventory: newItems }))} accentColor={showStorage === 'vehicle' ? "text-blue-400" : "text-emerald-400"} />
                </div>
             </div>
          </div>
        )}
      </div>

      {activeDevice && (
        <DeviceOverlay type={activeDevice} state={gameState} onClose={() => setActiveDevice(null)} onEventChoice={handleEventChoice} setGameState={setGameState} />
      )}
      {showMap && (
        <MapSystem state={gameState} onTravel={handleTravel} onClose={() => setShowMap(false)} />
      )}
    </div>
  );
};

const StatItem = ({ label, value, color }: { label: string, value: number, color: string }) => (
  <div className="flex flex-col gap-2">
    <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-widest"><span>{label}</span><span className="text-white mono">{Math.round(value)}%</span></div>
    <div className="h-1 bg-black/40 rounded-full overflow-hidden border border-white/5"><div className={`h-full ${color} transition-all duration-1000`} style={{ width: `${Math.min(100, Math.max(0, value))}%` }}></div></div>
  </div>
);

export default App;
