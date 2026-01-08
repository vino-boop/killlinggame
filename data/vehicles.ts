
import { VehicleSpec } from '../types';

export const VEHICLE_LISTINGS: VehicleSpec[] = [
  {
    id: 'electric-scooter',
    name: '米家电动滑板车 (九成新)',
    description: '最后一公里的神器，虽然慢但能让你准时送达。',
    price: 450,
    value: 300,
    condition: 90,
    fuel: 100,
    efficiency: 0.1,
    type: 'ebike'
  },
  {
    id: 'ebike-rent',
    name: 'Lime 共享单车 (私自解锁)',
    description: '城市穿梭的首选，虽然外观磨损但性能稳定。',
    price: 1200,
    value: 800,
    condition: 85,
    fuel: 100,
    efficiency: 0.2,
    type: 'ebike'
  },
  {
    id: 'honda-civic-old',
    name: '1998 本田思域',
    description: '虽然漏油严重，但它能跑。西雅图雨夜的移动城堡。',
    price: 2500,
    value: 1500,
    condition: 40,
    fuel: 40,
    efficiency: 1.8,
    type: 'car'
  },
  {
    id: 'toyota-prius',
    name: '2015 丰田普锐斯',
    description: '极其省油，外卖员的梦幻座驾。',
    price: 9500,
    value: 8000,
    condition: 70,
    fuel: 80,
    efficiency: 0.8,
    type: 'car'
  },
  {
    id: 'f150-truck',
    name: '福特 F-150 (战损版)',
    description: '油耗惊人但能装载很多垃圾/物资。',
    price: 15000,
    value: 12000,
    condition: 55,
    fuel: 100,
    efficiency: 3.5,
    type: 'car'
  },
  {
    id: 'model-3-used',
    name: 'Tesla Model 3 (高里程)',
    description: '中产的社交入场券，即使是二手的。',
    price: 22000,
    value: 18000,
    condition: 60,
    fuel: 50,
    efficiency: 0.5,
    type: 'luxury'
  }
];
