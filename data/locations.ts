
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
          { id: 'deep-sleep', label: '深度睡眠 (6h)', description: '最后的回味。', costMoney: 0, costTime: 6, effect: (s) => ({ stress: -30, health: 15, hunger: -20 }) }
        ],
        characters: [
          { 
            id: 'neighbor-leo', name: '里奥', role: '焦虑的邻居', avatar: '👱', 
            dialogues: { 
              default: '嘿 Ryan，听说你们部门... 哎。西雅图这地方，停下来就是死。',
              highStress: '伙计，你看起来糟透了。'
            } 
          },
          { 
            id: 'concierge-claire', name: '克莱尔', role: '前台主管', avatar: '👩‍💼', 
            dialogues: { 
              default: '早安，Ryan 先生。您的房租逾期提醒已经发到您的邮箱了。' 
            } 
          }
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
        ],
        characters: [
          { 
            id: 'security-mike', name: '麦克', role: '保安主管', avatar: '👮', 
            dialogues: { 
              default: '正常购物就没事。别逗留。'
            } 
          },
          { 
            id: 'intern-sam', name: '萨姆', role: '流浪的实习生', avatar: '👦', 
            dialogues: { 
              default: '我刚从亚马逊的 SDE 岗位被裁... 甚至没拿到赔偿金。我现在只能住在车里。',
              lowCash: '你还有车？真羡慕你。'
            } 
          }
        ]
      }
    ]
  },
  {
    id: 'bellevue',
    name: '贝尔维尤 (Bellevue)',
    description: '科技巨头的避风港，干净、富有。',
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
          { 
            id: 'jessica-ex', name: '杰西卡', role: '分居的妻子', avatar: '👸', 
            dialogues: { 
              default: 'Ryan？你怎么穿成这样出现在这儿？如果你给不出抚养费，下周法庭见。',
              lowCash: '看着你这样子，我真庆幸我当初的决定。别再联系孩子了。',
              highStress: '你疯了吗？你的眼神让我害怕。我要叫保安了。'
            } 
          },
          { 
            id: 'recruiter-holloway', name: '霍洛威', role: '顶级猎头', avatar: '🧐', 
            dialogues: { 
              default: '简历不错，但你的精神状态... 现在的行情，我们需要的是能连续工作 18 小时的“战士”。' 
            } 
          }
        ]
      },
      {
        id: 'safe-way-bv',
        name: 'Safeway (Bellevue)',
        type: 'commercial',
        description: '高价超市。',
        safetyLevel: 9,
        actions: [
            { id: 'buy-melatonin-bv', label: '高级褪黑素', description: '解决精英阶层的失眠。', costMoney: 65, costTime: 0.2, gainItem: ITEMS['melatonin-ultra'], effect: (s) => ({}) },
            { id: 'buy-salad-bv', label: '有机沙拉', description: '特级供应。', costMoney: 32, costTime: 0.2, gainItem: ITEMS['organic-salad'], effect: (s) => ({}) }
        ],
        characters: [
          { 
            id: 'agent-smith', name: '史密斯', role: '私人安保', avatar: '🕶️', 
            dialogues: { 
              default: '此区域仅限住户。三分钟内离开。'
            } 
          }
        ]
      }
    ]
  },
  {
    id: 'pioneer-square',
    name: '先锋广场 (Pioneer Square)',
    description: '流浪者的避难所，充满了旧时代的建筑。',
    survivalDifficulty: 8,
    priceMultiplier: 0.8,
    coords: { x: 52, y: 55 },
    subLocations: [
      {
        id: 'gas-station-ps',
        name: 'Shell 便利店',
        type: 'commercial',
        description: '昏暗、危险。',
        safetyLevel: 2,
        actions: [
            { id: 'buy-pain-ps', label: '强效止痛片', description: '应急之选。', costMoney: 25, costTime: 0.1, gainItem: ITEMS['painkillers'], effect: (s) => ({}) },
            { id: 'buy-blue-ps', label: '购买“蓝色强化剂”', description: '极其危险。', costMoney: 25, costTime: 0.2, gainItem: ITEMS['blue-pill'], effect: (s) => ({}) },
            { id: 'buy-knife-ps', label: '折叠刀', description: '为了自卫。', costMoney: 45, costTime: 0.3, gainItem: ITEMS['sharp-knife'], effect: (s) => ({}) }
        ],
        characters: [
          { 
            id: 'twitchy-ray', name: '“抽搐”雷', role: '情报贩子', avatar: '🧟', 
            dialogues: { 
              default: '嘿... 想要点带劲的吗？蓝色的小药丸，包你满意。',
              highStress: '你需要它，伙计，我能闻到你脑子里焦糊的味道。'
            } 
          },
          { 
            id: 'blind-vet', name: '老哈里', role: '失明老兵', avatar: '👨‍🦳', 
            dialogues: { 
              default: '在这个广场，只有两种人：猎人，和猎物。你属于哪种？' 
            } 
          }
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
        id: 'fishing-docks',
        name: '渔港码头',
        type: 'industrial',
        description: '繁忙、粗犷。',
        safetyLevel: 3,
        characters: [
          { 
            id: 'big-greg', name: '大格雷格', role: '码头工头', avatar: '🧔', 
            dialogues: { 
              default: '只要能动，我就给你活干。别在那儿磨蹭。' 
            } 
          },
          { 
            id: 'captain-olav', name: '奥拉夫船长', role: '挪威老船长', avatar: '⚓', 
            dialogues: { 
              default: '大海不会同情弱者，西雅图也不会。' 
            } 
          }
        ]
      },
      {
        id: 'ballard-market',
        name: 'Ballard Market',
        type: 'commercial',
        description: '本地超市。',
        safetyLevel: 6,
        actions: [
            { id: 'buy-hotdog-ba', label: '西雅图热狗', description: '量大管饱。', costMoney: 8, costTime: 0.3, gainItem: ITEMS['hot-dog'], effect: (s) => ({}) }
        ]
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
        id: 'asian-market',
        name: '雷尼尔海鲜超市',
        type: 'commercial',
        description: '便宜的补给。',
        safetyLevel: 5,
        actions: [
            { id: 'buy-spam-rv', label: '临期午餐肉', description: '性价比极高。', costMoney: 4, costTime: 0.2, gainItem: ITEMS['expired-spam'], effect: (s) => ({}) }
        ],
        characters: [
          { 
            id: 'aunty-mei', name: '梅姨', role: '超市老板', avatar: '👩‍🍳', 
            dialogues: { 
              default: '孩子，拿上这袋米，算你便宜点。' 
            } 
          },
          { 
            id: 'paco-labor', name: '帕科', role: '日结短工', avatar: '👷', 
            dialogues: { 
              default: '今天没抢到活... 看来晚上只能喝自来水了。' 
            } 
          }
        ]
      }
    ]
  },
  {
    id: 'u-district',
    name: '大学城 (U-District)',
    description: '年轻人的领地。',
    survivalDifficulty: 4,
    priceMultiplier: 0.9,
    coords: { x: 55, y: 30 },
    subLocations: [
      {
        id: 'trader-joes-ud',
        name: "Trader Joe's",
        type: 'commercial',
        description: '廉价超市。',
        safetyLevel: 6,
        characters: [
          { 
            id: 'student-emily', name: '艾米丽', role: '在读博士', avatar: '👩‍🎓', 
            dialogues: { 
              default: '生活真难，不是吗？' 
            } 
          },
          { 
            id: 'activist-jax', name: '贾克斯', role: '抗议领袖', avatar: '📣', 
            dialogues: { 
              default: '我们要烧掉这些大楼！重新分配财富！... 嘿，你有烟吗？' 
            } 
          }
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
        id: 'pcc-fremont',
        name: 'PCC 超市',
        type: 'commercial',
        description: '健康食品。',
        safetyLevel: 8,
        characters: [
          { 
            id: 'dev-kevin', name: '凯文', role: 'SDE-2', avatar: '👓', 
            dialogues: { 
              default: '我的期权快要解禁了... 真担心股价波动。' 
            } 
          }
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
        id: 'whole-foods-ch',
        name: 'Whole Foods',
        type: 'commercial',
        description: '有机食品店。',
        safetyLevel: 7,
        characters: [
          { 
            id: 'barista-luna', name: '露娜', role: '咖啡师', avatar: '☕', 
            dialogues: { 
              default: '拿铁好了。下一位。' 
            } 
          },
          { 
            id: 'shadow-designer', name: '“影子”', role: '自由设计师', avatar: '🎨', 
            dialogues: { 
              default: '我现在的时薪还没洗盘子高。' 
            } 
          }
        ]
      }
    ]
  }
];
