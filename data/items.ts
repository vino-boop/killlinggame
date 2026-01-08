
import { Item } from '../types';

export const ITEMS: Record<string, Item> = {
  // Consumables (Shop)
  'hot-dog': {
    id: 'hot-dog',
    name: '街头热狗',
    description: '西雅图路边摊，虽然全是添加剂但真香。',
    width: 1,
    height: 1,
    color: '#fbbf24',
    icon: '🌭',
    baseValue: 1,
    price: 8,
    effect: (s) => ({ hunger: s.hunger + 30, stress: s.stress - 5, health: s.health - 1 })
  },
  'onigiri-expired': {
    id: 'onigiri-expired',
    name: '打折临期饭团',
    description: '便利店深夜的最后恩赐，可能拉肚子。',
    width: 1,
    height: 1,
    color: '#94a3b8',
    icon: '🍙',
    baseValue: 0.5,
    price: 2,
    effect: (s) => ({ hunger: s.hunger + 25, health: s.health - 5 })
  },
  'starbucks-latte': {
    id: 'starbucks-latte',
    name: '星巴克拿铁',
    description: '熟悉的味道，能让你找回一点中产的感觉。',
    width: 1,
    height: 1,
    color: '#059669',
    icon: '☕',
    baseValue: 2,
    price: 6,
    effect: (s) => ({ stress: s.stress - 15, stats: { sanity: s.stats.sanity + 2 } })
  },
  'vitamin-pack': {
    id: 'vitamin-pack',
    name: '综合维生素',
    description: '补充长期营养不良带来的亏空。',
    width: 1,
    height: 1,
    color: '#60a5fa',
    icon: '💊',
    baseValue: 10,
    price: 45,
    effect: (s) => ({ health: s.health + 15, stats: { survival: s.stats.survival + 1 } })
  },
  'painkillers': {
    id: 'painkillers',
    name: '强效止痛片 (强化剂)',
    description: '麻木身体的痛苦。大幅降压，但会增加抗性并加剧饥饿。',
    width: 1,
    height: 1,
    color: '#f87171',
    icon: '🩹',
    baseValue: 5,
    price: 35,
    // 强化剂逻辑：效果受耐受度影响
    effect: (s) => {
        const reduction = 40 * (1 - s.addictionTolerance/100);
        return { 
            health: s.health + 5, 
            stress: s.stress - reduction, 
            hunger: s.hunger - 15, // 加剧饥饿
            addictionTolerance: s.addictionTolerance + 10,
            stats: { sanity: s.stats.sanity - 2 } 
        };
    }
  },
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
    effect: (s) => ({ hunger: s.hunger + 40, health: s.health - 2 })
  },
  'cheap-whiskey': {
    id: 'cheap-whiskey',
    name: '平价威士忌 (强化剂)',
    description: '度数很高，用来消毒还是麻痹自己？大幅降压，但损耗健康。',
    width: 1,
    height: 2,
    color: '#92400e',
    icon: '🥃',
    baseValue: 15,
    price: 28,
    effect: (s) => {
        const reduction = 60 * (1 - s.addictionTolerance/100);
        return { 
            stress: s.stress - reduction, 
            health: s.health - 15, 
            hunger: s.hunger - 10,
            addictionTolerance: s.addictionTolerance + 5,
            stats: { sanity: s.stats.sanity - 5 } 
        };
    }
  },
  'caffeine-patch': {
    id: 'caffeine-patch',
    name: '高浓度咖啡因贴片',
    description: '让你保持清醒，但代价是心脏负荷。',
    width: 1,
    height: 1,
    color: '#fbbf24',
    icon: '⚡',
    baseValue: 3,
    price: 15,
    effect: (s) => ({ stress: s.stress - 10, health: s.health - 5, stats: { survival: s.stats.survival + 2 } })
  },
  // Electronics
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
    name: '保温瓶',
    description: '装水的容器。',
    width: 1,
    height: 2,
    color: '#3b82f6',
    baseValue: 15,
    icon: '🍼'
  }
};
