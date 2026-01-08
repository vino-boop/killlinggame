
import { Location } from '../types';
import { ITEMS } from './items';

export const LOCATIONS: Location[] = [
  {
    id: 'downtown',
    name: '市中心 (Downtown)',
    description: '玻璃丛林，西雅图的心脏。治安良好但生活成本极高。',
    survivalDifficulty: 3,
    priceMultiplier: 1.4,
    coords: { x: 50, y: 50 },
    subLocations: [
      { 
        id: 'belltown-apt', 
        name: 'Belltown 高级公寓', 
        type: 'residential',
        description: '你目前的租处。', 
        safetyLevel: 8, 
        isHome: true,
        actions: [
          { id: 'deep-sleep', label: '深度睡眠 (6h)', description: '在席梦思上最后的回味。', costMoney: 0, costTime: 6, effect: (s) => ({ stress: -30, health: 15, hunger: -20 }) }
        ]
      },
      { 
        id: 'downtown-target', 
        name: 'Target 旗舰店', 
        type: 'commercial',
        description: '琳琅满目的中产消费陷阱。', 
        safetyLevel: 7, 
        actions: [
          { id: 'buy-noodles-dt', label: '购买辛拉面', description: '市中心的便利溢价。', costMoney: 5, costTime: 0.2, gainItem: ITEMS['instant-noodles'], effect: (s) => ({}) },
          { id: 'buy-water-dt', label: '瓶装纯净水', description: '口渴是生存的第一步。', costMoney: 3, costTime: 0.1, gainItem: ITEMS['water-bottle'], effect: (s) => ({}) }
        ]
      }
    ]
  },
  {
    id: 'capitol-hill',
    name: '国会山 (Capitol Hill)',
    description: '西雅图的潮流心脏。遍地是酒吧、彩虹旗和昂贵的有机食品。',
    survivalDifficulty: 4,
    priceMultiplier: 1.3,
    coords: { x: 65, y: 40 },
    subLocations: [
      {
        id: 'whole-foods-ch',
        name: 'Whole Foods (Cap Hill)',
        type: 'commercial',
        description: '不仅卖食物，还卖生活方式。',
        safetyLevel: 7,
        actions: [
            { id: 'buy-latte-ch', label: '购买拿铁咖啡', description: '找回一点昔日的体面。', costMoney: 7, costTime: 0.5, gainItem: ITEMS['starbucks-latte'], effect: (s) => ({}) },
            { id: 'buy-vitamin-ch', label: '复合维生素片', description: '在高压下维持免疫力。', costMoney: 40, costTime: 0.1, gainItem: ITEMS['vitamin-pack'], effect: (s) => ({}) }
        ]
      },
      {
        id: 'pike-bars',
        name: 'Pike St 酒吧街',
        type: 'special',
        description: '夜晚这里灯火通明，但对失业者来说充满敌意。',
        safetyLevel: 4,
        actions: [
            { id: 'drink-away', label: '来杯便宜威士忌', description: '酒精是唯一的慰藉。', costMoney: 12, costTime: 1, gainItem: ITEMS['cheap-whiskey'], effect: (s) => ({}) }
        ]
      }
    ]
  },
  {
    id: 'ballard',
    name: '巴拉德 (Ballard)',
    description: '历史悠久的渔港，工业感极强，充满了手工酿酒厂。',
    survivalDifficulty: 5,
    priceMultiplier: 1.1,
    coords: { x: 30, y: 25 },
    subLocations: [
      {
        id: 'ballard-market',
        name: 'Ballard Market',
        type: 'commercial',
        description: '充满海鱼味的本地超市。',
        safetyLevel: 6,
        actions: [
            { id: 'buy-hotdog-ba', label: '西雅图热狗', description: '码头工人的标准午餐。', costMoney: 8, costTime: 0.3, gainItem: ITEMS['hot-dog'], effect: (s) => ({}) },
            { id: 'buy-bulk-food', label: '大包燕麦片', description: '在这里囤货比较划算。', costMoney: 15, costTime: 0.5, gainItem: ITEMS['instant-noodles'], effect: (s) => ({}) }
        ]
      },
      {
        id: 'fishing-docks',
        name: '巴拉德渔港码头',
        type: 'industrial',
        description: '凌晨三点这里就开始忙碌了。',
        safetyLevel: 3,
        characters: [{ id: 'old-fisherman', name: '老索伦', role: '老船长', avatar: '🧔', dialogues: { default: '只要你不怕水和血，船上永远缺一双手。' } }]
      }
    ]
  },
  {
    id: 'fremont',
    name: '弗里蒙特 (Fremont)',
    description: '“宇宙中心”，充满了初创公司、列宁雕像和怪异的桥下巨魔。',
    survivalDifficulty: 4,
    priceMultiplier: 1.2,
    coords: { x: 45, y: 35 },
    subLocations: [
      {
        id: 'pcc-fremont',
        name: 'PCC 社区超市',
        type: 'commercial',
        description: '深受科技新贵喜爱的健康食品店。',
        safetyLevel: 8,
        actions: [
            { id: 'buy-patch-fr', label: '咖啡因贴片', description: '为了下一次面试保持清醒。', costMoney: 12, costTime: 0.1, gainItem: ITEMS['caffeine-patch'], effect: (s) => ({}) }
        ]
      }
    ]
  },
  {
    id: 'u-district',
    name: '大学城 (U-District)',
    description: '年轻人的领地。二手店、廉价酒吧和无尽的雨伞。',
    survivalDifficulty: 4,
    priceMultiplier: 0.9,
    coords: { x: 55, y: 30 },
    subLocations: [
      {
        id: 'ave-thrift',
        name: 'The Ave 二手店',
        type: 'commercial',
        description: '你可以用几块钱买到过时的尊严。',
        safetyLevel: 6,
        actions: [
            { id: 'buy-coat', label: '买件厚外套 ($15)', description: '西雅图的雨很冷。', costMoney: 15, costTime: 1, effect: (s) => ({ health: 10, stats: { survival: 5 } }) }
        ]
      },
      {
        id: 'trader-joes-ud',
        name: "Trader Joe's (U-District)",
        type: 'commercial',
        description: '学生们最爱的廉价超市，在这里没人会评判你的寒酸。',
        safetyLevel: 6,
        actions: [
            { id: 'buy-onigiri-ud', label: '临期饭团', description: '性价比极高。', costMoney: 3, costTime: 0.2, gainItem: ITEMS['onigiri-expired'], effect: (s) => ({}) }
        ]
      }
    ]
  },
  {
    id: 'bellevue',
    name: '贝尔维尤 (Bellevue)',
    description: '科技巨头的避风港，干净、富有且对穷人极度排斥。',
    survivalDifficulty: 1,
    priceMultiplier: 1.8,
    coords: { x: 80, y: 45 },
    subLocations: [
      { 
        id: 'bellevue-square', 
        name: 'Bellevue Square', 
        type: 'commercial',
        description: '这里的空气里都飘着钱的味道。', 
        safetyLevel: 9,
        actions: [
          { id: 'luxury-coffee', label: '手工极简咖啡 ($18)', description: '如果你穿着寒酸，保安会盯着你看。', costMoney: 18, costTime: 1, effect: (s) => ({ stress: -25, stats: { sanity: 5 } }) }
        ]
      },
      {
        id: 'safe-way-bv',
        name: 'Safeway (Bellevue)',
        type: 'commercial',
        description: '即便是连锁超市，在这一区的价格也令人咋舌。',
        safetyLevel: 9,
        actions: [
            { id: 'buy-vit-bv', label: '进口维生素', description: '这里的保质期比较新鲜。', costMoney: 65, costTime: 0.2, gainItem: ITEMS['vitamin-pack'], effect: (s) => ({}) }
        ]
      }
    ]
  },
  {
    id: 'pioneer-square',
    name: '先锋广场 (Pioneer Square)',
    description: '流浪者的避难所，充满了旧时代的建筑和被遗忘的人。',
    survivalDifficulty: 8,
    priceMultiplier: 0.8,
    coords: { x: 52, y: 55 },
    subLocations: [
      { 
        id: 'pawn-shop-pioneer', 
        name: '老乔典当行', 
        type: 'commercial',
        description: '只要有价值，老乔什么都吃。', 
        safetyLevel: 3, 
        characters: [{ id: 'pawn-old-joe', name: '老乔', role: '黑市商人', avatar: '🕶️', dialogues: { default: '没货就滚，别挡着光。' } }]
      },
      {
        id: 'gas-station-ps',
        name: 'Shell 加油站便利店',
        type: 'commercial',
        description: '昏暗的灯光，防弹玻璃后的店员。',
        safetyLevel: 2,
        actions: [
            { id: 'buy-pain-ps', label: '强效止痛片', description: '这里不需要处方。', costMoney: 25, costTime: 0.1, gainItem: ITEMS['painkillers'], effect: (s) => ({}) }
        ]
      }
    ]
  },
  {
    id: 'rainier-valley',
    name: '雷尼尔谷 (Rainier Valley)',
    description: '多元文化聚居地，西雅图物价洼地，交通不便。',
    survivalDifficulty: 6,
    priceMultiplier: 0.7,
    coords: { x: 60, y: 80 },
    subLocations: [
      {
        id: 'asian-market',
        name: '雷尼尔海鲜超市',
        type: 'commercial',
        description: '堆满廉价碳水化合物的天堂。',
        safetyLevel: 5,
        actions: [
            { id: 'buy-rice-rv', label: '袋装方便面 (x5)', description: '活着最重要。', costMoney: 4, costTime: 0.5, gainItem: ITEMS['instant-noodles'], effect: (s) => ({}) }
        ]
      }
    ]
  }
];
