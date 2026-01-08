import React, { useState } from 'react';
import { PlayerState, InventoryItem, GameEvent, Job, Stats, VehicleSpec, Item, PendingDelivery } from '../types';
import { JOBS } from '../data/jobs';
import { ITEMS } from '../data/items';
import { VEHICLE_LISTINGS } from '../data/vehicles';

interface DeviceOverlayProps {
  type: 'laptop' | 'phone';
  state: PlayerState;
  onClose: () => void;
  setGameState: React.Dispatch<React.SetStateAction<PlayerState>>;
  onEventChoice: (event: GameEvent, choiceIndex: number) => void;
}

type AppId = 'messages' | 'yard' | 'jobs' | 'wheels' | 'amaze';

// Added DeviceAppIcon component to fix "Cannot find name 'DeviceAppIcon'" error
interface DeviceAppIconProps {
  id: AppId;
  icon: string;
  label: string;
  onClick: (id: AppId) => void;
  color: string;
  badgeCount?: number;
}

const DeviceAppIcon: React.FC<DeviceAppIconProps> = ({ id, icon, label, onClick, color, badgeCount }) => (
  <button 
    onClick={() => onClick(id)}
    className="flex flex-col items-center gap-3 group relative"
  >
    <div className={`w-20 h-20 ${color} rounded-[2rem] flex items-center justify-center text-4xl shadow-2xl transition-all group-hover:scale-110 group-active:scale-95 group-hover:shadow-[0_0_30px_rgba(255,255,255,0.1)]`}>
      {icon}
      {badgeCount !== undefined && badgeCount > 0 && (
        <div className="absolute -top-1 -right-1 w-7 h-7 bg-red-600 border-4 border-black rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-xl">
          {badgeCount}
        </div>
      )}
    </div>
    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-white transition-colors">{label}</span>
  </button>
);

const DeviceOverlay: React.FC<DeviceOverlayProps> = ({ type, state, onClose, setGameState, onEventChoice }) => {
  const [activeApp, setActiveApp] = useState<AppId | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<GameEvent | null>(null);

  const checkRequirements = (job: Job) => {
    return job.requirements.every(req => {
      if (req.type === 'stat') {
        const statKey = req.key as keyof Stats;
        return state.stats[statKey] >= (req.min || 0);
      }
      if (req.type === 'trait') {
        return state.traits.includes(req.key as string);
      }
      if (req.type === 'item') {
        if (req.key === 'ebike') return state.vehicle !== null;
        return state.inventory.some(i => i.id === req.key);
      }
      return false;
    });
  };

  const handleApply = (job: Job) => {
    const interviewTime = Math.floor(Math.random() * 4) + 9; // 9:00 - 12:00
    
    const messageEvent: GameEvent = {
      id: `job-msg-${job.id}-${Date.now()}`,
      title: `面试邀约: ${job.company}`,
      description: `Ryan你好，我是 ${job.company} 的 ${job.hrName}。我们收到了你的简历，初步看下来很匹配。\n\n不知道你明天 ${interviewTime}:00 方便来 ${job.location} 面谈吗？请确认。`,
      choices: [
        {
          text: `【确认面试】没问题，我会准时到达。`,
          impact: `你接受了面试。为了明天的 ${interviewTime}:00，你开始在脑海中模拟可能的问答。`,
          timeSpent: 0.5,
          statChanges: {
            stress: 10,
            ...(Math.random() < 0.3 ? {
              job: job as any,
              stats: { social: 10, intellect: 5, sanity: 5 }
            } : {
              stats: { sanity: -5, social: 2 }
            })
          }
        },
        {
          text: "【请求调整】那个时间我有其他安排，可以换个时间吗？",
          impact: "HR过了很久才回复：'那我们再看看其他候选人吧。' 机会溜走了。",
          statChanges: { stress: 5, stats: { luck: -2 } }
        }
      ]
    };

    setGameState(prev => ({
      ...prev,
      pendingEvents: [messageEvent, ...prev.pendingEvents],
      history: [...prev.history, {
        day: prev.day, hour: prev.hour,
        title: '职位沟通',
        description: `发起了与 ${job.company} 的初步沟通，等待面试确认。`,
        type: 'job'
      }]
    }));
    
    setActiveApp('messages');
  };

  const buyItem = (item: Item) => {
    if (state.cash < (item.price || 0)) return;

    const orderId = Math.floor(Math.random() * 90000000) + 10000000;
    
    // Stage 1: Confirmation Message
    const confirmationEvent: GameEvent = {
      id: `confirm-${item.id}-${Date.now()}`,
      title: `订单已确认: #${orderId}`,
      description: `感谢您在 Amaze 购物。商品 [${item.name}] 正在处理中。\n\n由于目前的物流压力，预计将于 5 天后送达。`,
      choices: [
        {
          text: `【好的知道了】`,
          impact: `订单已进入系统，现金已扣除。`,
          statChanges: { }
        }
      ]
    };

    // Stage 2: Schedule the delivery
    const delivery: PendingDelivery = {
      id: `pkg-${orderId}`,
      item: item,
      deliveryDay: state.day + 5
    };

    setGameState(prev => ({
      ...prev,
      cash: prev.cash - (item.price || 0),
      pendingEvents: [confirmationEvent, ...prev.pendingEvents],
      pendingDeliveries: [...prev.pendingDeliveries, delivery],
      history: [...prev.history, { 
        day: prev.day, hour: prev.hour, title: '在线支付', 
        description: `在 Amaze 支付了 $${item.price} 购买 ${item.name}。`, type: 'transaction' 
      }]
    }));

    setActiveApp('messages');
  };

  const buyVehicle = (v: VehicleSpec) => {
    if (state.cash < v.price) return;
    setGameState(prev => ({
      ...prev,
      cash: prev.cash - v.price,
      vehicle: { ...v },
      history: [...prev.history, { 
        day: prev.day, hour: prev.hour, title: '大额交易', 
        description: `全款购入 ${v.name}。这是你在这个城市的最后一道掩体。`, type: 'transaction' 
      }]
    }));
  };

  const renderApp = () => {
    switch (activeApp) {
      case 'messages':
        return (
          <div className="flex flex-col h-full bg-[#0a0a0c] text-white animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center gap-3 p-4 border-b border-white/5 bg-slate-900/20">
              <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center font-bold text-lg shadow-lg shadow-indigo-500/20">M</div>
              <div>
                <h3 className="font-bold tracking-tight text-sm">Lumi Messages</h3>
                <p className="text-[8px] text-indigo-400 font-black uppercase tracking-widest">End-to-end Encrypted</p>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto pr-1">
              {selectedEvent ? (
                <div className="p-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <button onClick={() => setSelectedEvent(null)} className="mb-6 text-indigo-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    <span className="text-sm">←</span> BACK TO INBOX
                  </button>
                  <div className="mb-8">
                    <h4 className="text-2xl font-black text-white mb-2 italic leading-tight uppercase tracking-tighter">{selectedEvent.title}</h4>
                    <div className="h-1 w-12 bg-indigo-500 mb-6"></div>
                    <div className="text-sm text-slate-400 leading-relaxed bg-[#111] p-6 rounded-3xl border border-white/5 whitespace-pre-line shadow-inner italic">
                      {selectedEvent.description}
                    </div>
                  </div>
                  <div className="space-y-3">
                    {selectedEvent.choices.map((choice, i) => (
                      <button 
                        key={i} 
                        onClick={() => { onEventChoice(selectedEvent, i); setSelectedEvent(null); }}
                        className="w-full p-5 bg-white/5 hover:bg-indigo-600/20 border border-white/10 hover:border-indigo-500 rounded-2xl text-left transition-all active:scale-[0.98] group"
                      >
                        <div className="text-sm font-bold text-white mb-1 group-hover:text-indigo-400 transition-colors">{choice.text}</div>
                        <div className="text-[10px] text-slate-500 italic opacity-60">{choice.impact}</div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {state.pendingEvents.length === 0 && (
                    <div className="p-20 text-center flex flex-col items-center gap-4">
                      <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-4xl grayscale opacity-20">📭</div>
                      <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.3em]">No New Notifications</p>
                    </div>
                  )}
                  {state.pendingEvents.map((event) => (
                    <button key={event.id} onClick={() => setSelectedEvent(event)} className="w-full p-6 hover:bg-white/5 text-left transition-all flex items-start gap-4 relative group">
                      <div className={`absolute left-0 top-2 bottom-2 w-1 transition-all ${event.id.startsWith('confirm') || event.id.startsWith('arrival') ? 'bg-orange-500' : 'bg-indigo-500'} group-hover:w-2`}></div>
                      <div className={`w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center text-xl shadow-lg ${event.id.startsWith('confirm') || event.id.startsWith('arrival') ? 'bg-orange-900/20 text-orange-500' : 'bg-indigo-900/20 text-indigo-500'}`}>
                        {event.id.startsWith('confirm') || event.id.startsWith('arrival') ? '📦' : '📩'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-1">
                          <span className={`font-black text-[9px] uppercase tracking-widest ${event.id.startsWith('confirm') || event.id.startsWith('arrival') ? 'text-orange-500' : 'text-indigo-500'}`}>
                            {event.id.startsWith('confirm') || event.id.startsWith('arrival') ? 'Amaze Logistics' : 'Professional HR'}
                          </span>
                          <span className="text-[9px] text-slate-700 mono font-bold italic">{state.hour}:00</span>
                        </div>
                        <h4 className="font-bold text-base text-white truncate mb-0.5">{event.title}</h4>
                        <p className="text-xs text-slate-500 line-clamp-1 truncate opacity-60 font-medium italic">"{event.description.substring(0, 50)}..."</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      case 'jobs':
        return (
          <div className="flex flex-col h-full bg-[#0f1115] text-slate-300 animate-in fade-in duration-300">
            <div className="bg-[#161b22] px-5 pt-6 pb-3 shadow-md z-10 border-b border-white/5">
               <div className="flex justify-between items-center mb-5">
                  <div className="text-2xl font-black text-[#00bebd] italic tracking-tighter">BOSS</div>
                  <div className="flex gap-5 text-xl text-slate-500">🔍</div>
               </div>
               <div className="flex gap-8 text-sm font-bold text-slate-500">
                  <span className="text-white border-b-4 border-[#00bebd] pb-2">推荐</span>
                  <span>附近</span>
                  <span>最新</span>
               </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0a0c0f]">
              {JOBS.map(job => {
                const meetsReqs = checkRequirements(job);
                const isCurrent = state.job?.id === job.id;
                const isApplying = state.pendingEvents.some(e => e.id.includes(job.id));
                return (
                  <div key={job.id} className="bg-[#1c2128] rounded-3xl p-6 shadow-sm border border-white/5 hover:border-white/10 transition-all group">
                    <div className="flex justify-between items-start mb-3">
                       <h4 className="text-xl font-black text-white leading-tight flex-1 italic group-hover:text-[#00bebd] transition-colors">{job.title}</h4>
                       <span className="text-[#00bebd] font-black text-lg mono italic">{job.salary}</span>
                    </div>
                    <div className="text-[10px] font-black text-slate-500 mb-4 uppercase tracking-widest">{job.company} · {job.scale}</div>
                    <div className="flex flex-wrap gap-2 mb-6">
                       {job.tags.map(tag => <span key={tag} className="px-3 py-1 bg-white/5 border border-white/5 rounded-full text-[9px] font-black text-slate-400 uppercase tracking-tighter">{tag}</span>)}
                    </div>
                    <div className="flex items-center justify-between pt-6 border-t border-white/5">
                       <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-[#00bebd]/10 flex items-center justify-center text-2xl shadow-inner group-hover:bg-[#00bebd]/20 transition-all">👤</div>
                          <div className="flex flex-col">
                             <span className="text-sm font-black text-slate-300">{job.hrName}</span>
                             <span className="text-[10px] text-[#00bebd] font-bold uppercase tracking-widest italic">{job.hrTitle}</span>
                          </div>
                       </div>
                       <button 
                        disabled={!meetsReqs || isApplying || isCurrent}
                        onClick={() => handleApply(job)}
                        className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase transition-all tracking-[0.1em] ${
                          isCurrent ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          !meetsReqs ? 'bg-white/5 text-slate-600 cursor-not-allowed' : 
                          isApplying ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 
                          'bg-[#00bebd] text-white shadow-xl shadow-[#00bebd]/20 active:scale-95 hover:bg-[#00d1d0]'
                        }`}
                       >
                         {isCurrent ? '工作中' : (isApplying ? '面试邀约中' : '立即沟通')}
                       </button>
                    </div>
                    {!meetsReqs && <p className="mt-4 text-[9px] text-red-500/80 font-black italic tracking-widest uppercase">⚠️ 核心指标不匹配 (Insufficient Stats)</p>}
                  </div>
                );
              })}
              <div className="h-20 flex items-center justify-center text-[10px] text-slate-700 uppercase tracking-[0.5em] font-black italic">End of Feed</div>
            </div>
          </div>
        );
      case 'amaze':
        const shopItems = Object.values(ITEMS).filter(i => i.price !== undefined);
        return (
          <div className="flex flex-col h-full bg-[#f4f4f4] text-slate-900 animate-in fade-in duration-300">
             <div className="p-6 bg-[#232f3e] shrink-0 shadow-xl border-b-[8px] border-orange-400">
                <div className="flex justify-between items-center mb-6">
                   <div className="text-3xl font-black text-white italic tracking-tighter">amaze <span className="text-orange-400">prime</span></div>
                   <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white text-xl">🛒</div>
                </div>
                <div className="bg-white rounded-2xl flex items-center p-4 text-black text-sm shadow-inner border border-black/5">
                   <span className="mr-3 text-slate-400 text-lg">🔍</span>
                   <span className="text-slate-400 font-medium">Find deals in Seattle...</span>
                </div>
             </div>
             <div className="flex-1 overflow-y-auto p-5 grid grid-cols-2 gap-5">
                {shopItems.map(item => (
                  <div key={item.id} className="bg-white rounded-[2.5rem] p-6 flex flex-col shadow-sm hover:shadow-xl transition-all group border border-transparent hover:border-orange-400/20">
                     <div className="text-6xl mb-6 flex justify-center bg-slate-50 p-8 rounded-3xl group-hover:scale-110 transition-transform group-hover:bg-orange-50">{item.icon}</div>
                     <div className="text-base font-black text-slate-900 truncate mb-1 italic uppercase tracking-tighter">{item.name}</div>
                     <div className="text-[10px] text-slate-500 h-8 line-clamp-2 leading-snug mb-6 font-medium italic opacity-70">{item.description}</div>
                     <div className="mt-auto flex justify-between items-center">
                        <span className="text-xl font-black text-slate-900 mono">${item.price}</span>
                        <button 
                          onClick={() => buyItem(item)}
                          disabled={state.cash < (item.price || 0)}
                          className={`px-6 py-3 rounded-full text-[10px] font-black uppercase transition-all tracking-widest ${state.cash >= (item.price || 0) ? 'bg-[#ff9900] text-slate-900 shadow-lg shadow-orange-500/20 active:scale-95 hover:bg-[#ffb340]' : 'bg-slate-100 text-slate-300'}`}
                        >
                          Buy Now
                        </button>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        );
      case 'wheels':
        return (
          <div className="flex flex-col h-full bg-[#111] text-white animate-in fade-in duration-300">
             <div className="p-8 bg-gradient-to-br from-blue-900 to-indigo-950 shrink-0 border-b border-white/5">
                <div className="text-4xl font-black italic tracking-tighter mb-1 uppercase">Wheels<span className="text-blue-500">.net</span></div>
                <div className="text-[9px] text-blue-400 uppercase font-black tracking-[0.4em] opacity-80">Certified Pre-Owned Selection</div>
             </div>
             <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {state.vehicle && (
                  <div className="bg-blue-600/10 border border-blue-500/20 p-6 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl group-hover:scale-125 transition-transform">🚗</div>
                     <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-4">Registered Owner: Ryan</div>
                     <div className="flex justify-between items-end mb-6">
                        <div>
                          <h4 className="text-2xl font-black italic text-white uppercase tracking-tighter">{state.vehicle.name}</h4>
                          <p className="text-[11px] text-blue-400 font-bold italic opacity-60 mt-1">Market Valuation: ${state.vehicle.value}</p>
                        </div>
                     </div>
                     <div className="space-y-2">
                        <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-slate-500">
                           <span>Battery/Fuel Cell</span>
                           <span className="text-blue-500 mono">{state.vehicle.fuel}%</span>
                        </div>
                        <div className="h-2 bg-black/60 rounded-full overflow-hidden border border-white/5">
                           <div className="h-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)] transition-all duration-1000" style={{ width: `${state.vehicle.fuel}%` }}></div>
                        </div>
                     </div>
                  </div>
                )}
                <h4 className="text-[10px] font-black text-slate-600 uppercase px-1 tracking-[0.3em]">Latest Listings</h4>
                {VEHICLE_LISTINGS.map(v => (
                  <div key={v.id} className="bg-white/5 rounded-[2.5rem] p-8 border border-white/5 flex flex-col hover:border-blue-500 transition-all hover:bg-white/10 group">
                     <div className="flex justify-between items-start mb-6">
                        <h5 className="text-xl font-black text-white italic group-hover:text-blue-500 transition-colors uppercase tracking-tight">{v.name}</h5>
                        <div className="text-right">
                           <span className="text-2xl font-black text-blue-500 mono">${v.price}</span>
                        </div>
                     </div>
                     <p className="text-xs text-slate-500 mb-8 leading-relaxed font-medium italic opacity-80">"{v.description}"</p>
                     <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-black/40 p-5 rounded-3xl border border-white/5">
                           <p className="text-[8px] text-slate-600 uppercase font-black mb-1 tracking-widest">Durability</p>
                           <p className="text-base font-black text-white mono">{v.condition}%</p>
                        </div>
                        <div className="bg-black/40 p-5 rounded-3xl border border-white/5">
                           <p className="text-[8px] text-slate-600 uppercase font-black mb-1 tracking-widest">Efficiency</p>
                           <p className="text-base font-black text-white mono">{v.efficiency} kWh</p>
                        </div>
                     </div>
                     <button 
                        disabled={state.cash < v.price}
                        onClick={() => buyVehicle(v)}
                        className={`w-full py-5 rounded-3xl text-xs font-black uppercase tracking-[0.2em] transition-all ${state.cash >= v.price ? 'bg-blue-600 text-white shadow-2xl shadow-blue-600/30 active:scale-95 hover:bg-blue-500' : 'bg-white/5 text-slate-700 cursor-not-allowed border border-white/5'}`}
                      >
                        {state.cash >= v.price ? 'Finalize Purchase' : 'Liquidity Insufficient'}
                     </button>
                  </div>
                ))}
             </div>
          </div>
        );
      case 'yard':
        return (
          <div className="flex flex-col h-full bg-[#0d110f] text-emerald-100 animate-in fade-in duration-300">
            <div className="p-10 border-b border-emerald-900/30 bg-gradient-to-br from-[#111a14] to-black">
              <h3 className="text-5xl font-black text-emerald-500 italic leading-none mb-2 uppercase tracking-tighter">Yard.</h3>
              <p className="text-[9px] text-emerald-800 uppercase font-black tracking-[0.4em]">Liquidate Assets • Instant Payout • Final Sale</p>
            </div>
            <div className="flex-1 overflow-y-auto p-8 space-y-5">
              {state.inventory.filter(i => i.baseValue > 0).length === 0 && (
                <div className="flex flex-col items-center justify-center py-24 opacity-20 gap-4">
                  <span className="text-6xl grayscale">💨</span>
                  <p className="text-[10px] font-black uppercase tracking-widest">No Liquid Assets Detected</p>
                </div>
              )}
              {state.inventory.filter(i => i.baseValue > 0).map(item => (
                <div key={item.id} className="p-6 bg-emerald-950/5 border border-emerald-900/10 rounded-[2rem] flex justify-between items-center group hover:border-emerald-500/40 hover:bg-emerald-950/10 transition-all shadow-lg">
                  <div className="flex items-center gap-6">
                    <span className="text-6xl group-hover:scale-110 transition-transform filter drop-shadow-[0_0_15px_rgba(16,185,129,0.2)]">{item.icon}</span>
                    <div>
                      <p className="font-black text-white text-xl italic uppercase tracking-tight">{item.name}</p>
                      <p className="text-xs text-emerald-500 font-mono italic font-bold">Offer: <span className="text-white">${item.baseValue}</span></p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setGameState(prev => ({
                        ...prev,
                        cash: prev.cash + item.baseValue,
                        inventory: prev.inventory.filter(i => i !== item),
                        history: [...prev.history, { 
                          day: prev.day, hour: prev.hour, title: `资产清理: ${item.name}`, 
                          description: `以 $${item.baseValue} 的低价变卖了随身物品。`, type: 'transaction' 
                        }]
                      }));
                    }}
                    className="px-8 py-4 bg-emerald-600/10 border border-emerald-600/30 text-emerald-500 text-[10px] font-black rounded-2xl hover:bg-emerald-600 hover:text-white transition-all active:scale-95 uppercase tracking-widest"
                  >
                    Sell Asset
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return (
          <div className="grid grid-cols-3 gap-10 p-12 h-full content-start justify-items-center bg-[#0a0a0c]/90 backdrop-blur-3xl animate-in zoom-in-95 duration-500">
            <DeviceAppIcon id="messages" icon="💬" label="Messages" onClick={setActiveApp} badgeCount={state.pendingEvents.length} color="bg-indigo-600" />
            <DeviceAppIcon id="yard" icon="🤝" label="Yard" onClick={setActiveApp} color="bg-emerald-800" />
            <DeviceAppIcon id="jobs" icon="🏢" label="BOSS" onClick={setActiveApp} color="bg-[#00bebd]" />
            <DeviceAppIcon id="wheels" icon="🚗" label="Wheels" onClick={setActiveApp} color="bg-blue-700" />
            <DeviceAppIcon id="amaze" icon="🛒" label="Amaze" onClick={setActiveApp} color="bg-slate-700" />
          </div>
        );
    }
  };

  return (
    <div className="absolute inset-0 z-[100] flex items-center justify-center p-12 animate-in fade-in zoom-in-95 duration-500">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={onClose} />
      <div className={`relative ${type === 'laptop' ? 'w-[1000px] aspect-[1.6/1]' : 'w-[450px] aspect-[1/2]'} bg-[#050505] border-[16px] border-[#1a1a1a] rounded-[4rem] shadow-[0_0_150px_rgba(0,0,0,1)] flex flex-col overflow-hidden ring-1 ring-white/10 group`}>
        <div className="h-14 bg-black flex items-center justify-between px-12 border-b border-white/5 shrink-0">
           <div className="text-[11px] font-black text-slate-500 mono italic tracking-widest">{state.hour}:00 HOURS</div>
           <div className="flex gap-4">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-800 group-hover:bg-red-500 transition-colors" />
              <div className="w-8 h-2.5 rounded-full bg-slate-800" />
              <div className="w-2.5 h-2.5 rounded-full bg-slate-800 group-hover:bg-blue-500 transition-colors" />
           </div>
        </div>
        <div className="flex-1 relative overflow-hidden bg-black">
           {activeApp && (
             <button 
              onClick={() => { setActiveApp(null); setSelectedEvent(null); }} 
              className="absolute top-8 left-8 z-[120] w-12 h-12 bg-black/40 backdrop-blur-xl text-white rounded-2xl flex items-center justify-center hover:bg-white/10 transition-all border border-white/10 active:scale-90 shadow-2xl"
             >
              <span className="text-xl">←</span>
             </button>
           )}
           {renderApp()}
        </div>
        <div className="h-16 bg-black flex items-center justify-center shrink-0">
           <button onClick={onClose} className="w-24 h-1.5 bg-slate-800 rounded-full hover:bg-slate-600 transition-all active:scale-x-125 shadow-lg" />
        </div>
      </div>
    </div>
  );
};

export default DeviceOverlay;