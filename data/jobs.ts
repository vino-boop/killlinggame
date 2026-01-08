
import { Job } from '../types';

export const JOBS: Job[] = [
  // --- Gigs / Part-time ---
  {
    id: 'flyer-distributor',
    title: '传单派发 (日结)',
    company: '派悦广告',
    funding: '个体经营',
    scale: '0-20人',
    salary: '150/天',
    dailyIncome: 150,
    isGig: true,
    tags: ['日结', '无需经验', '体力活'],
    hrName: '王哥',
    hrTitle: '领队',
    location: 'downtown',
    requirements: [{ type: 'stat', key: 'survival', min: 10 }]
  },
  {
    id: 'dock-loader-ballard',
    title: '码头装卸工 (急聘)',
    company: 'Ballard Maritime',
    funding: '自负盈亏',
    scale: '50-99人',
    salary: '280/天',
    dailyIncome: 280,
    isGig: true,
    tags: ['体力活', '当日结算', '周薪制'],
    hrName: '索伦',
    hrTitle: '工头',
    location: 'ballard',
    requirements: [{ type: 'stat', key: 'survival', min: 30 }]
  },
  {
    id: 'nightclub-security-ch',
    title: '夜店安保 (Bouncer)',
    company: 'Neon Nights',
    funding: 'A轮',
    scale: '20-99人',
    salary: '220/天',
    dailyIncome: 220,
    isGig: true,
    tags: ['夜班', '需体格', '小费分成'],
    hrName: 'Mike',
    hrTitle: '安保主管',
    location: 'capitol-hill',
    requirements: [{ type: 'stat', key: 'survival', min: 45 }, { type: 'stat', key: 'social', min: 20 }]
  },
  {
    id: 'studio-assistant-fr',
    title: '艺术工作室助理',
    company: 'Fremont Arts Collective',
    funding: '天使轮',
    scale: '1-10人',
    salary: '180/天',
    dailyIncome: 180,
    isGig: true,
    tags: ['兼职', '审美要求', '弹性工时'],
    hrName: 'Chloe',
    hrTitle: '主创',
    location: 'fremont',
    requirements: [{ type: 'stat', key: 'intellect', min: 40 }]
  },
  {
    id: 'delivery-gig',
    title: '众包跑腿员 (全城)',
    company: '闪电配送',
    funding: 'B轮',
    scale: '1000人以上',
    salary: '300-600/天',
    dailyIncome: 450,
    isGig: true,
    tags: ['多劳多得', '自带车', '全时段'],
    hrName: 'AI调度员',
    hrTitle: '智能中心',
    location: 'downtown', // 可以在市中心接单
    requirements: [{ type: 'item', key: 'ebike' }]
  },
  // --- Professional ---
  {
    id: 'video-manager-bv',
    title: '视频总监',
    company: '某上市科技巨头',
    funding: 'D轮',
    scale: '10000人以上',
    salary: '35-50K',
    dailyIncome: 1500,
    tags: ['精英计划', '股票期权', '管理岗'],
    hrName: '张总',
    hrTitle: 'VP',
    location: 'bellevue',
    requirements: [
      { type: 'stat', key: 'intellect', min: 95 },
      { type: 'stat', key: 'social', min: 80 },
      { type: 'trait', key: '中产精英' }
    ]
  }
];
