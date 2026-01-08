
export type LocationId = 'pioneer-square' | 'downtown' | 'capitol-hill' | 'ballard' | 'rainier-valley' | 'bellevue' | 'u-district' | 'fremont';

export type Weather = 'Sunny' | 'Cloudy' | 'Rainy' | 'Stormy' | 'Foggy';

export type SubLocationType = 'residential' | 'commercial' | 'industrial' | 'nature' | 'special';

export interface MonthlyBill {
  id: string;
  name: string;
  amount: number;
  dueDate: number;
  description: string;
  isCancellable: boolean;
  isActive: boolean;
  consequenceIfCancelled?: string;
}

export interface PendingDelivery {
  id: string;
  item: Item;
  deliveryDay: number;
}

export interface Vehicle {
  name: string;
  condition: number;
  fuel: number;
  efficiency: number;
  value: number;
  type: 'ebike' | 'car' | 'luxury';
}

export interface VehicleSpec extends Vehicle {
  id: string;
  price: number;
  description: string;
}

export interface SubLocationAction {
  id: string;
  label: string;
  description: string;
  costMoney: number;
  costTime: number;
  gainItem?: Item; // 新增：执行动作后获得的物品
  effect: (state: PlayerState) => Partial<Omit<PlayerState, 'stats'>> & { stats?: Partial<Stats> };
}

export interface Character {
  id: string;
  name: string;
  role: string;
  avatar: string;
  dialogues: {
    default: string;
    lowCash?: string;
    highStress?: string;
  };
}

export interface SubLocation {
  id: string;
  name: string;
  type: SubLocationType;
  description: string;
  safetyLevel: number;
  isHome?: boolean;
  actions?: SubLocationAction[];
  characters?: Character[];
}

export interface Location {
  id: LocationId;
  name: string;
  description: string;
  survivalDifficulty: number;
  priceMultiplier: number; // 影响该区域所有商店的价格
  coords: { x: number; y: number }; // 用于计算距离
  subLocations: SubLocation[];
}

export interface Item {
  id: string;
  name: string;
  description: string;
  width: number;
  height: number;
  color: string;
  icon: string;
  isElectronic?: boolean;
  baseValue: number;
  price?: number;
  effect?: (state: PlayerState) => Partial<Omit<PlayerState, 'stats'>> & { stats?: Partial<Stats> };
}

export interface InventoryItem extends Item {
  x: number;
  y: number;
}

export interface Stats {
  survival: number;
  intellect: number;
  social: number;
  sanity: number;
  luck: number;
}

export interface JobRequirement {
  type: 'stat' | 'trait' | 'item';
  key: keyof Stats | string;
  min?: number;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  funding: string;
  scale: string;
  salary: string;
  dailyIncome: number;
  isGig?: boolean;
  tags: string[];
  hrName: string;
  hrTitle: string;
  location: LocationId; // 更改为 LocationId 以便逻辑检查
  requirements: JobRequirement[];
}

export interface PlayerState {
  day: number;
  hour: number;
  weather: Weather;
  cash: number;
  debt: number;
  health: number;
  stress: number;
  hunger: number;
  bodyTemp: number;
  addiction: number;
  addictionTolerance: number;
  currentLocation: LocationId;
  currentSubLocationId?: string;
  vehicle: Vehicle | null;
  bills: MonthlyBill[];
  stats: Stats;
  traits: string[];
  history: GameHistoryEntry[];
  inventory: InventoryItem[];
  vehicleInventory: InventoryItem[];
  homeInventory: InventoryItem[];
  inventorySize: { rows: number; cols: number };
  pendingEvents: GameEvent[];
  pendingDeliveries: PendingDelivery[];
  job: Job | null;
}

export interface GameHistoryEntry {
  day: number;
  hour: number;
  title: string;
  description: string;
  consequence?: string;
  type: 'narrative' | 'choice' | 'outcome' | 'location-change' | 'transaction' | 'billing' | 'job' | 'action';
}

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  locationRestriction?: LocationId[];
  subLocationRestriction?: string[];
  choices: EventChoice[];
}

export interface EventChoice {
  text: string;
  impact: string;
  isReinforcement?: boolean;
  nextEventId?: string;
  timeSpent?: number;
  statChanges: Partial<Omit<PlayerState, 'stats'>> & { stats?: Partial<Stats> };
  gainItem?: Item;
}

export interface AIScenario {
  title: string;
  description: string;
  choices: AIScenarioChoice[];
}

export interface AIScenarioChoice {
  text: string;
  impact: string;
  isReinforcement?: boolean;
  statChanges: Partial<Omit<PlayerState, 'stats'>> & { stats?: Partial<Stats> };
}
