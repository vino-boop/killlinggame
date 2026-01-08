
import { Item } from '../types';

export const ITEMS: Record<string, Item> = {
  // --- 基础食物 (Food) ---
  'instant-noodles': {
    id: 'instant-noodles',
    name: '辛拉面',
    description: '生存必备，只需要一点热水。',
    width: 1,
    height: 1,
    color: '#ef4444',
    icon: '🍜',
    baseValue: 1,
    price: 3,
    effect: (s) => ({ hunger: s.hunger + 35, health: s.health - 2 })
  },
  'organic-salad': {
    id: 'organic-salad',
    name: '有机羽衣甘蓝沙拉',
    description: '中产阶级的心理安慰剂，除了贵没毛病。',
    width: 2,
    height: 1,
    color: '#10b981',
    icon: '🥗',
    baseValue: 5,
    price: 24,
    effect: (s) => ({ hunger: s.hunger + 20, health: s.health + 10, stress: s.stress - 15, stats: { sanity: s.stats.sanity + 2 } })
  },
  'expired-spam': {
    id: 'expired-spam',
    name: '临期午餐肉',
    description: '味道很重，但热量很高。',
    width: 1,
    height: 1,
    color: '#fb7185',
    icon: '🥩',
    baseValue: 2,
    price: 4,
    effect: (s) => ({ hunger: s.hunger + 40, health: s.health - 5 })
  },

  // --- 医疗与强化剂 (Meds & Reinforcements) ---
  'painkillers': {
    id: 'painkillers',
    name: '强效止痛片',
    description: '麻木身体的痛苦。大幅降压，但会损耗理智。',
    width: 1,
    height: 1,
    color: '#f87171',
    icon: '🩹',
    baseValue: 5,
    price: 35,
    effect: (s) => ({ stress: s.stress - 35, health: s.health + 5, stats: { sanity: s.stats.sanity - 5 }, addictionTolerance: s.addictionTolerance + 5 })
  },
  'blue-pill': {
    id: 'blue-pill',
    name: '“蓝色强化剂”',
    description: '先锋广场的特产。让你暂时忘记饥饿与寒冷，但灵魂正在枯萎。',
    width: 1,
    height: 1,
    color: '#60a5fa',
    icon: '🔹',
    baseValue: 15,
    price: 25,
    effect: (s) => ({ stress: s.stress - 60, hunger: s.hunger + 20, health: s.health - 10, addiction: s.addiction + 15, stats: { sanity: s.stats.sanity - 10 } })
  },

  // --- 装备与电子产品 (Gear & Electronics) ---
  'noise-canceling-headphones': {
    id: 'noise-canceling-headphones',
    name: 'Bose 降噪耳机',
    description: '屏蔽噪音，屏蔽这个正在崩塌的世界。',
    width: 2,
    height: 2,
    color: '#1e293b',
    icon: '🎧',
    baseValue: 250,
    price: 399,
    effect: (s) => ({ stress: s.stress - 25, stats: { intellect: s.stats.intellect + 5, sanity: s.stats.sanity + 10 } })
  },
  'sharp-knife': {
    id: 'sharp-knife',
    name: '折叠刀',
    description: '在西雅图的阴影里，这能给你一点安全感。',
    width: 1,
    height: 1,
    color: '#94a3b8',
    icon: '🔪',
    baseValue: 10,
    price: 45,
    effect: (s) => ({ stats: { survival: s.stats.survival + 10, luck: s.stats.luck + 5 } })
  },
  'custom-suit': {
    id: 'custom-suit',
    name: '高定西装',
    description: '当你穿上它，那些猎头才会把你当人看。',
    width: 2,
    height: 3,
    color: '#1e293b',
    icon: '👔',
    baseValue: 500,
    price: 1200,
    effect: (s) => ({ stats: { social: s.stats.social + 25, sanity: s.stats.sanity + 10 } })
  },

  // --- 剧情与特殊物品 (Story/Special) ---
  'legal-papers': {
    id: 'legal-papers',
    name: '离婚补充协议',
    description: '杰西卡留下的文书。上面写满了对你无能的审判。',
    width: 2,
    height: 2,
    color: '#ffffff',
    icon: '📄',
    baseValue: 0,
    effect: (s) => ({ stress: s.stress + 20, stats: { sanity: s.stats.sanity - 15 } })
  },
  'macbook-pro': {
    id: 'macbook-pro',
    name: 'MacBook Pro',
    description: '你最后的生产力工具。',
    width: 2,
    height: 2,
    color: '#94a3b8',
    icon: '💻',
    isElectronic: true,
    baseValue: 1200,
  },
  'smartphone': {
    id: 'smartphone',
    name: 'iPhone 15 Pro',
    description: '联系外界的唯一窗口。',
    width: 1,
    height: 1,
    color: '#334155',
    icon: '📱',
    isElectronic: true,
    baseValue: 800,
  },
  'identity-card': {
    id: 'identity-card',
    name: '员工工牌',
    description: '曾经的辉煌。',
    width: 1,
    height: 1,
    color: '#f59e0b',
    icon: '🆔',
    baseValue: 0,
    effect: (s) => ({ stats: { sanity: s.stats.sanity + 5 } })
  },
  'water-bottle': {
    id: 'water-bottle',
    name: '瓶装水',
    description: '干净的饮用水。',
    width: 1,
    height: 2,
    color: '#3b82f6',
    icon: '💧',
    baseValue: 1,
    price: 2,
    effect: (s) => ({ hunger: s.hunger + 10 })
  },
  'hot-dog': {
    id: 'hot-dog',
    name: '热狗',
    description: '街头快餐。',
    width: 1,
    height: 1,
    color: '#fbbf24',
    icon: '🌭',
    baseValue: 1,
    price: 8,
    effect: (s) => ({ hunger: s.hunger + 30 })
  },
  'melatonin-ultra': {
    id: 'melatonin-ultra',
    name: '褪黑素',
    description: '助眠药物。',
    width: 1,
    height: 1,
    color: '#818cf8',
    icon: '🌙',
    baseValue: 15,
    price: 55,
    effect: (s) => ({ stress: s.stress - 30 })
  }
};
