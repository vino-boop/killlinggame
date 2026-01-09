
import { Location } from '../types';
import { ITEMS } from './items';

export const LOCATIONS: Location[] = [
  {
    id: 'downtown',
    name: '市中心 (Downtown)',
    description: '玻璃丛林，西雅图的心脏。',
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
          { id: 'deep-sleep', label: '深度睡眠 (8h)', description: '在席梦思上最后的回味。能大幅缓解压力，但饥饿如期而至。', costMoney: 0, costTime: 8, effect: (s) => ({ stress: s.stress - 50, health: s.health, hunger: s.hunger }) }
        ],
        characters: [
          { id: 'neighbor-leo', name: '里奥', role: '焦虑的邻居', avatar: '👱', dialogues: { default: '嘿 Ryan，听说你们部门... 哎。' } },
          { id: 'concierge-claire', name: '克莱尔', role: '前台主管', avatar: '👩‍💼', dialogues: { default: '早安，您的房租逾期提醒已发送。' } }
        ]
      },
      {
        id: 'shell-downtown',
        name: 'Shell (Downtown)',
        type: 'commercial',
        description: '位于 4 街的加油站，治安相对较好。',
        safetyLevel: 7,
        actions: [
          { id: 'refuel-dt', label: '加满燃油', description: '虽然价格贵，但这里的油品最好。', costMoney: 85, costTime: 0.5, effect: (s) => ({ vehicle: s.vehicle ? { ...s.vehicle, fuel: 100 } : null }) },
          { id: 'buy-can-dt', label: '购买汽油桶', description: '应急必备。', costMoney: 55, costTime: 0.2, gainItem: ITEMS['gasoline-can'], effect: (s) => ({}) }
        ],
        characters: [
          { id: 'attendant-joe', name: '老乔', role: '加油站店员', avatar: '👨‍🔧', dialogues: { default: '又是那些该死的大排量 SUV... 刷卡请到里面。' } }
        ]
      },
      { 
        id: 'downtown-target', 
        name: 'Target 旗舰店', 
        type: 'commercial',
        description: '物资补给站。', 
        safetyLevel: 7, 
        actions: [
          { id: 'buy-noodles-dt', label: '购买辛拉面', description: '虽然贵，但管饱。', costMoney: 5, costTime: 0.2, gainItem: ITEMS['instant-noodles'], effect: (s) => ({}) },
          { id: 'buy-water-dt', label: '瓶装水', description: '生活必需品。', costMoney: 3, costTime: 0.1, gainItem: ITEMS['water-bottle'], effect: (s) => ({}) }
        ]
      }
    ]
  },
  {
    id: 'bellevue',
    name: '贝尔维尤 (Bellevue)',
    description: '科技巨头的避风港。',
    survivalDifficulty: 1,
    priceMultiplier: 1.8,
    coords: { x: 80, y: 45 },
    subLocations: [
      {
        id: 'bellevue-cafe',
        name: 'The French Pastry',
        type: 'commercial',
        description: '人均消费 $50 的高端咖啡厅，杰西卡常出现在这里。',
        safetyLevel: 9,
        actions: [
          { id: 'buy-suit-bv', label: '购买定制西装', description: '找回昔日的体面。', costMoney: 1200, costTime: 2, gainItem: ITEMS['custom-suit'], effect: (s) => ({}) }
        ],
        characters: [
          { id: 'jessica-ex', name: '杰西卡', role: '分居的妻子', avatar: '👸', dialogues: { default: '如果你给不出抚养费，下周法庭见。' } },
          { id: 'recruiter-holloway', name: '霍洛威', role: '顶级猎头', avatar: '🧐', dialogues: { default: '简历不错，但你的精神状态...' } }
        ]
      }
    ]
  },
  {
    id: 'pioneer-square',
    name: '先锋广场 (Pioneer Square)',
    description: '流浪者的避难所。',
    survivalDifficulty: 8,
    priceMultiplier: 0.8,
    coords: { x: 52, y: 55 },
    subLocations: [
      {
        id: 'gas-station-ps',
        name: 'Shell 先锋广场店',
        type: 'commercial',
        description: '极其危险的加油站，聚集了大量流浪者。',
        safetyLevel: 2,
        actions: [
            { id: 'refuel-ps', label: '加满燃油 (廉价)', description: '油质存疑，但便宜。', costMoney: 45, costTime: 0.4, effect: (s) => ({ vehicle: s.vehicle ? { ...s.vehicle, fuel: 100 } : null }) },
            { id: 'buy-blue-ps', label: '秘密交易', description: '店员在柜台下塞给你的蓝色小药片。', costMoney: 25, costTime: 0.1, gainItem: ITEMS['blue-pill'], effect: (s) => ({}) }
        ],
        characters: [
          { id: 'twitchy-ray', name: '“抽搐”雷', role: '情报贩子', avatar: '🧟', dialogues: { default: '嘿... 想要点带劲的吗？' } }
        ]
      }
    ]
  },
  {
    id: 'ballard',
    name: '巴拉德 (Ballard)',
    description: '历史悠久的渔港，工业感极强。',
    survivalDifficulty: 5,
    priceMultiplier: 1.1,
    coords: { x: 30, y: 25 },
    subLocations: [
      {
        id: 'chevron-ballard',
        name: 'Chevron (Ballard)',
        type: 'commercial',
        description: '码头工人和大货车司机的最爱。',
        safetyLevel: 5,
        actions: [
            { id: 'refuel-ba', label: '加满燃油', description: '标准的工业级服务。', costMoney: 60, costTime: 0.5, effect: (s) => ({ vehicle: s.vehicle ? { ...s.vehicle, fuel: 100 } : null }) },
            { id: 'buy-junk-ba', label: '购买补给包', description: '一堆高热量的垃圾食品。', costMoney: 12, costTime: 0.2, gainItem: ITEMS['junk-food-bundle'], effect: (s) => ({}) }
        ],
        characters: [
          { id: 'big-greg', name: '大格雷格', role: '码头工头', avatar: '🧔', dialogues: { default: '只要能动，我就给你活干。' } }
        ]
      },
      {
        id: 'fishing-docks',
        name: '渔港码头',
        type: 'industrial',
        description: '繁忙、粗犷。',
        safetyLevel: 3
      }
    ]
  },
  {
    id: 'rainier-valley',
    name: '雷尼尔谷 (Rainier Valley)',
    description: '西雅图物价洼地。',
    survivalDifficulty: 6,
    priceMultiplier: 0.7,
    coords: { x: 60, y: 80 },
    subLocations: [
      {
        id: 'arco-rainier',
        name: 'ARCO (Rainier Valley)',
        type: 'commercial',
        description: '全西雅图最便宜的油站，只收现金。',
        safetyLevel: 3,
        actions: [
            { id: 'refuel-rv', label: '加满燃油 (现金特惠)', description: '几乎是市中心价格的一半。', costMoney: 40, costTime: 0.6, effect: (s) => ({ vehicle: s.vehicle ? { ...s.vehicle, fuel: 100 } : null }) },
            { id: 'buy-spam-rv', label: '临期午餐肉', description: '性价比极高。', costMoney: 4, costTime: 0.2, gainItem: ITEMS['expired-spam'], effect: (s) => ({}) }
        ],
        characters: [
          { id: 'cashier-malik', name: '马利克', role: '守店店员', avatar: '🏾', dialogues: { default: '加完赶紧走，别在外面熄火，那群家伙盯着你的轮胎呢。' } }
        ]
      }
    ]
  },
  {
    id: 'fremont',
    name: '弗里蒙特 (Fremont)',
    description: '艺术与科技的中心。',
    survivalDifficulty: 4,
    priceMultiplier: 1.2,
    coords: { x: 45, y: 35 },
    subLocations: [
      {
        id: 'tech-gas-fremont',
        name: 'Fremont Fuel Stop',
        type: 'commercial',
        description: '充满科技感的加油站，甚至提供免费的 5G Wi-Fi。',
        safetyLevel: 7,
        actions: [
            { id: 'refuel-fr', label: '加满燃油', description: '支持 Apple Pay，虽然价格略贵。', costMoney: 75, costTime: 0.5, effect: (s) => ({ vehicle: s.vehicle ? { ...s.vehicle, fuel: 100 } : null }) },
            { id: 'buy-can-fr', label: '购买备用油桶', description: '以防你在贝尔维尤没钱加油。', costMoney: 48, costTime: 0.2, gainItem: ITEMS['gasoline-can'], effect: (s) => ({}) }
        ],
        characters: [
          { id: 'dev-kevin', name: '凯文', role: 'SDE-2', avatar: '👓', dialogues: { default: '我的期权快要解禁了... 真担心股价波动。' } }
        ]
      }
    ]
  },
  {
    id: 'capitol-hill',
    name: '国会山 (Capitol Hill)',
    description: '西雅图的潮流心脏。',
    survivalDifficulty: 4,
    priceMultiplier: 1.3,
    coords: { x: 65, y: 40 },
    subLocations: [
      {
        id: '711-caphill',
        name: '7-Eleven (Broadway)',
        type: 'commercial',
        description: '无论何时都人满为患的油站兼便利店。',
        safetyLevel: 6,
        actions: [
            { id: 'refuel-ch', label: '加满燃油', description: '在派对开始前加满。', costMoney: 70, costTime: 0.5, effect: (s) => ({ vehicle: s.vehicle ? { ...s.vehicle, fuel: 100 } : null }) },
            { id: 'buy-junk-ch', label: '购买深夜补给', description: '高热量，高快乐。', costMoney: 15, costTime: 0.2, gainItem: ITEMS['junk-food-bundle'], effect: (s) => ({}) }
        ],
        characters: [
          { id: 'barista-luna', name: '露娜', role: '咖啡师', avatar: '☕', dialogues: { default: '拿铁好了。下一位。' } }
        ]
      }
    ]
  }
];
