
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { PlayerState, GameHistoryEntry, GameEvent, Stats, LocationId, Location, InventoryItem, Item, Weather, SubLocation, Vehicle, MonthlyBill, Character, SubLocationAction, PendingDelivery } from './types';
import { EVENTS } from './data/events';
import { ITEMS } from './data/items';
import { LOCATIONS } from './data/locations';
import StatusPanel from './components/StatusPanel';
import ScenePanel from './components/ScenePanel';
import HistoryPanel from './components/HistoryPanel';
import DeviceOverlay from './components/DeviceOverlay';
import MapSystem from './components/MapSystem';
import InventoryGrid from './components/InventoryGrid';

const START_DATE = new Date('2026-07-27');
const WEATHER_ICONS: Record<Weather, string> = {
  'Sunny': '☀️', 'Cloudy': '☁️', 'Rainy': '🌧️', 'Stormy': '⛈️', 'Foggy': '🌫️',
};

const INITIAL_STATE: PlayerState = {
  day: 1, hour: 14, weather: 'Cloudy', cash: 5500, debt: 0, health: 95, stress: 40, hunger: 80, bodyTemp: 98, addiction: 0, addictionTolerance: 0,
  currentLocation: 'downtown', currentSubLocationId: 'belltown-apt',
  vehicle: { name: "BMW 3系 (5年车龄)", condition: 75, fuel: 60, efficiency: 1.2, value: 12000, type: 'car' },
  bills: [
    { id: 'rent', name: 'Belltown 公寓房租', amount: 3800, dueDate: 1, description: '地段税，西雅图的入场券。', isCancellable: true, isActive: true, consequenceIfCancelled: '房东将立即启动驱逐程序。' },
    { id: 'loan', name: '学生贷款 (MBA)', amount: 1200, dueDate: 15, description: '当初以为是投资，现在是枷锁。', isCancellable: true, isActive: true, consequenceIfCancelled: '逾期利息将翻倍。' },
    { id: 'insurance', name: '医保', amount: 200, dueDate: 10, description: '维持体面生活的最低标准。', isCancellable: true, isActive: true, consequenceIfCancelled: '医疗开支将极其昂贵。' },
  ],
  stats: { survival: 10, intellect: 85, social: 65, sanity: 75, luck: 40 },
  traits: ['中产精英', '刚离职', '咖啡重度依赖'],
  history: [{ day: 1, hour: 14, title: "第一章 · 消失的缓冲带", description: "你坐在西湖中心的长椅上，手机开始疯狂震动。西雅图的雨正如期而至。", type: 'narrative' }],
  inventory: [{ ...ITEMS['macbook-pro'], x: 0, y: 0 }, { ...ITEMS['smartphone'], x: 0, y: 2 }, { ...ITEMS['identity-card'], x: 1, y: 2 }, { ...ITEMS['water-bottle'], x: 2, y: 0 }],
  vehicleInventory: [], homeInventory: [], inventorySize: { rows: 5, cols: 5 },
  pendingEvents: [...EVENTS.filter(e => ['hr-dismissal', 'ex-wife-tuition', 'landlord-rent-hike', 'bank-linkedin-backstab'].includes(e.id))],
  pendingDeliveries: [], job: null
};

const findFreeSpot = (gridSize: {rows: number, cols: number}, items: InventoryItem[], itemToPlace: Item) => {
  const grid = Array(gridSize.rows).fill(null).map(() => Array(gridSize.cols).fill(false));
  items.forEach(item => {
    for (let r = 0; r < item.height; r++) {
      for (let c = 0; c < item.width; c++) {
        if (item.y + r < gridSize.rows && item.x + c < gridSize.cols) grid[item.y + r][item.x + c] = true;
      }
    }
  });
  for (let r = 0; r <= gridSize.rows - itemToPlace.height; r++) {
    for (let c = 0; c <= gridSize.cols - itemToPlace.width; c++) {
      let canFit = true;
      for (let ir = 0; ir < itemToPlace.height; ir++) {
        for (let ic = 0; ic < itemToPlace.width; ic++) {
          if (grid[r + ir][c + ic]) { canFit = false; break; }
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

  useEffect(() => {
    if (gameState.health <= 0) setGameOver({ code: "BIO_CRITICAL", reason: "身体机能彻底停摆。你在寒冷的雨夜中合上了双眼。" });
    else if (gameState.stress >= 100) setGameOver({ code: "COG_BREACH", reason: "理智之弦彻底绷断。现在的你只是一个对着虚空咆哮的躯壳。" });
  }, [gameState.health, gameState.stress]);

  const advanceTime = (hours: number) => {
    setGameState(prev => {
      const totalHours = prev.hour + hours;
      const daysPassed = Math.floor(totalHours / 24);
      return { 
        ...prev, hour: totalHours % 24, day: prev.day + daysPassed, 
        hunger: Math.max(0, prev.hunger - (hours * 3.5)), 
        health: prev.hunger < 10 ? Math.max(0, prev.health - (hours * 4)) : prev.health 
      };
    });
  };

  const handleAction = (action: SubLocationAction) => {
    const loc = LOCATIONS.find(l => l.id === gameState.currentLocation);
    const cost = Math.round(action.costMoney * (loc?.priceMultiplier || 1));
    if (gameState.cash < cost) return;

    setGameState(prev => {
      const effect = action.effect(prev);
      const { stats, ...others } = effect;
      let newInv = [...prev.inventory];
      if (action.gainItem) {
        const spot = findFreeSpot(prev.inventorySize, prev.inventory, action.gainItem);
        if (spot) newInv.push({ ...action.gainItem, ...spot });
      }
      return { 
        ...prev, ...others, cash: prev.cash - cost, inventory: newInv, 
        stats: { ...prev.stats, ...(stats || {}) },
        hour: (prev.hour + action.costTime) % 24, 
        day: prev.day + Math.floor((prev.hour + action.costTime) / 24),
        history: [...prev.history, { day: prev.day, hour: prev.hour, title: action.label, description: action.description, type: 'action' }]
      };
    });
  };

  const transferItem = (item: InventoryItem, from: string) => {
    if (!showStorage) return;
    setGameState(prev => {
      const targetGrid = from === 'backpack' ? (showStorage === 'vehicle' ? 'vehicle' : 'home') : 'backpack';
      const targetRows = targetGrid === 'backpack' ? 5 : (targetGrid === 'vehicle' ? 8 : 15);
      const targetCols = targetGrid === 'backpack' ? 5 : (targetGrid === 'vehicle' ? 8 : 15);
      const targetItems = targetGrid === 'backpack' ? prev.inventory : (targetGrid === 'vehicle' ? prev.vehicleInventory : prev.homeInventory);
      const spot = findFreeSpot({ rows: targetRows, cols: targetCols }, targetItems, item);
      if (!spot) return prev;
      const newItem = { ...item, ...spot };
      return {
        ...prev,
        inventory: from === 'backpack' ? prev.inventory.filter(i => i !== item) : (targetGrid === 'backpack' ? [...prev.inventory, newItem] : prev.inventory),
        vehicleInventory: from === 'vehicle' ? prev.vehicleInventory.filter(i => i !== item) : (targetGrid === 'vehicle' ? [...prev.vehicleInventory, newItem] : prev.vehicleInventory),
        homeInventory: from === 'home' ? prev.homeInventory.filter(i => i !== item) : (targetGrid === 'home' ? [...prev.homeInventory, newItem] : prev.homeInventory)
      };
    });
  };

  const currentLocData = LOCATIONS.find(l => l.id === gameState.currentLocation);
  const currentSubLocData = currentLocData?.subLocations.find(s => s.id === gameState.currentSubLocationId);

  return (
    <div className="flex h-screen w-full bg-[#050608] text-slate-300 select-none overflow-hidden font-sans relative">
      {!gameOver ? (
        <>
          <StatusPanel 
            state={gameState} 
            onShowBills={() => setShowBills(true)} 
            onShowStorage={setShowStorage} 
            onUseItem={(item) => item.id === 'macbook-pro' ? setActiveDevice('laptop') : item.id === 'smartphone' ? setActiveDevice('phone') : null}
            onUpdateInventory={(newItems) => setGameState(prev => ({ ...prev, inventory: newItems }))}
          />

          <div className="flex-1 flex flex-col relative bg-[#050608] overflow-hidden">
            <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-[#0a0c10]/90 backdrop-blur-md shrink-0 z-20">
              <div className="flex items-center gap-10">
                <div className="flex flex-col"><span className="mono text-blue-500 font-black text-xl leading-none">{START_DATE.toLocaleDateString()}</span><span className="text-[10px] mono text-gray-500 font-bold uppercase tracking-widest mt-1">H: {gameState.hour.toFixed(0)}</span></div>
                <div className="flex items-center gap-4"><span className="text-3xl filter drop-shadow-lg">{WEATHER_ICONS[gameState.weather]}</span><div className="flex flex-col"><span className="text-xs font-black text-white uppercase tracking-wider">{currentLocData?.name}</span><span className="text-[10px] text-blue-400 font-bold italic">{currentSubLocData?.name}</span></div></div>
              </div>
              <div className="flex gap-4">
                  <button onClick={() => setShowMap(true)} className="px-6 py-2 bg-blue-600/10 border border-blue-500/20 text-blue-500 text-[10px] font-black rounded-full uppercase hover:bg-blue-600 hover:text-white transition-all">🗺️ Map System</button>
              </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
              <ScenePanel 
                state={gameState} currentLocData={currentLocData} currentSubLocData={currentSubLocData} 
                onAction={handleAction} onWait={() => advanceTime(1)} onShowStorage={setShowStorage}
                onInteract={(char) => setActiveDialogue({ char, text: char.dialogues.default })}
              />
              <HistoryPanel history={gameState.history} currentHour={gameState.hour} />
            </div>
          </div>

          {/* Overlays */}
          {activeDevice && <DeviceOverlay type={activeDevice} state={gameState} onClose={() => setActiveDevice(null)} setGameState={setGameState} onEventChoice={(event, idx) => {}} />}
          {showMap && <MapSystem state={gameState} onClose={() => setShowMap(false)} onTravel={(loc, sub, fuel, time) => { setGameState(prev => ({ ...prev, currentLocation: loc.id, currentSubLocationId: sub.id, hour: (prev.hour + time)%24, vehicle: prev.vehicle ? {...prev.vehicle, fuel: prev.vehicle.fuel - fuel} : null })); setShowMap(false); }} />}
          {showStorage && (
             <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-3xl p-12 animate-in zoom-in">
                <div className="max-w-[1400px] w-full bg-[#0a0c10] border border-white/5 rounded-[4rem] overflow-hidden flex flex-col max-h-[95vh] shadow-2xl">
                   <div className="p-12 border-b border-white/5 flex justify-between items-center"><h2 className="text-5xl font-black text-white italic uppercase tracking-tighter">Inventory Transfer</h2><button onClick={() => setShowStorage(null)} className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center text-white text-2xl hover:bg-white/10">✕</button></div>
                   <div className="flex-1 overflow-auto p-12 flex justify-center gap-16">
                      <InventoryGrid items={gameState.inventory} rows={5} cols={5} title="Backpack" gridId="backpack" onItemClick={(item) => transferItem(item, 'backpack')} onUpdateItems={(newItems) => setGameState(prev => ({ ...prev, inventory: newItems }))} />
                      <div className="flex flex-col items-center justify-center pt-32 opacity-20"><span className="text-4xl my-8">⇄</span></div>
                      <InventoryGrid items={showStorage === 'vehicle' ? gameState.vehicleInventory : gameState.homeInventory} rows={showStorage === 'vehicle' ? 8 : 15} cols={showStorage === 'vehicle' ? 8 : 15} title={showStorage === 'vehicle' ? "Trunk" : "Safe Stash"} gridId={showStorage} onItemClick={(item) => transferItem(item, showStorage)} onUpdateItems={(newItems) => showStorage === 'vehicle' ? setGameState(prev => ({ ...prev, vehicleInventory: newItems })) : setGameState(prev => ({ ...prev, homeInventory: newItems }))} accentColor="text-emerald-500" />
                   </div>
                </div>
             </div>
          )}
          {activeDialogue && (
            <div className="absolute inset-0 z-[110] flex items-center justify-center p-12 bg-black/80 backdrop-blur-md animate-in fade-in">
                <div className="max-w-2xl w-full bg-[#0a0c10] border border-white/5 rounded-[3rem] p-12 shadow-2xl">
                    <div className="flex items-center gap-6 mb-8"><div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center text-5xl border border-white/10">{activeDialogue.char.avatar}</div><div><h2 className="text-3xl font-black text-white italic uppercase">{activeDialogue.char.name}</h2><p className="text-sm text-blue-500 font-bold uppercase tracking-widest">{activeDialogue.char.role}</p></div></div>
                    <div className="p-8 bg-white/5 rounded-3xl border border-white/5 italic text-slate-300 leading-relaxed mb-10 text-lg">"{activeDialogue.text}"</div>
                    <button onClick={() => setActiveDialogue(null)} className="w-full py-5 bg-blue-600 text-white font-black rounded-full uppercase tracking-widest hover:bg-blue-500 transition-all shadow-xl">End Conversation</button>
                </div>
            </div>
          )}
          {showBills && (
            <div className="absolute inset-0 z-[120] flex items-center justify-center p-12 bg-black/80 backdrop-blur-md animate-in fade-in">
               <div className="max-w-xl w-full bg-[#0a0c10] border border-white/5 rounded-[3rem] p-10 shadow-2xl flex flex-col gap-8">
                  <div className="flex justify-between items-start"><div><h2 className="text-3xl font-black text-white italic uppercase">Pending Obligations</h2></div><button onClick={() => setShowBills(false)} className="text-xl">✕</button></div>
                  <div className="space-y-4 max-h-[50vh] overflow-y-auto">
                    {gameState.bills.map(bill => (
                      <div key={bill.id} className="p-6 bg-white/[0.03] border border-white/5 rounded-3xl flex flex-col gap-4">
                        <div className="flex justify-between items-start"><div><h4 className="font-black text-white">{bill.name}</h4><p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Due Day {bill.dueDate}</p></div><span className="text-xl font-black text-red-500 mono">${bill.amount}</span></div>
                        <button onClick={() => { if(gameState.cash >= bill.amount) setGameState(prev => ({ ...prev, cash: prev.cash - bill.amount, bills: prev.bills.filter(b => b.id !== bill.id) })); }} disabled={gameState.cash < bill.amount} className={`w-full py-4 rounded-xl text-[10px] font-black uppercase ${gameState.cash >= bill.amount ? 'bg-blue-600 text-white' : 'bg-white/5 text-slate-700 cursor-not-allowed'}`}>Pay Now</button>
                      </div>
                    ))}
                  </div>
                  <div className="p-6 bg-blue-600/10 border border-blue-500/20 rounded-3xl flex justify-between items-center"><span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Liquid Balance</span><span className="text-2xl font-black text-white mono">${gameState.cash.toLocaleString()}</span></div>
               </div>
            </div>
          )}
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-[#050608]">
          <h1 className="text-[10rem] font-black text-red-600/20 italic uppercase leading-none mb-4 animate-pulse">DELETED</h1>
          <p className="text-slate-300 text-3xl max-w-3xl font-black mb-12 italic tracking-tight leading-snug">{gameOver.reason}</p>
          <button onClick={() => window.location.reload()} className="px-20 py-8 bg-white text-black font-black rounded-full hover:bg-red-600 hover:text-white transition-all text-2xl uppercase shadow-[0_0_50px_rgba(255,255,255,0.2)]">Restart Life Simulation</button>
        </div>
      )}
    </div>
  );
};

export default App;
