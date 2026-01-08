
import { GameEvent, LocationId } from '../types';
import { ITEMS } from './items';

export const EVENTS: GameEvent[] = [
  {
    id: 'hr-dismissal',
    title: '【公司 HR 的通知】',
    description: 'Ryan，很抱歉地通知您，由于公司业务架构重组，您所在的部门已被整体撤销。您的 Last Day 为今日。请于下午 5 点前完成办公用品交接，赔偿金细节已发至您的私人邮箱。明天起您的工牌权限将失效。',
    locationRestriction: ['downtown'],
    choices: [
      {
        text: '【职业克制】准时交接并索要推荐信',
        impact: '你在HR面前表现得很专业。',
        timeSpent: 1,
        statChanges: { stress: 10, stats: { intellect: 5, social: 10 } }
      },
      {
        text: '【情绪爆发】宣泄压力并质疑赔偿',
        impact: '你大吼了一顿。虽然爽了，但HR表示额外奖金将被重新评估。',
        timeSpent: 2,
        statChanges: { stress: -20, cash: -2000, stats: { sanity: -10 } }
      },
      {
        text: '【卑微挽留】寻求降薪转岗或外包',
        impact: '你放下了所有尊严，但换来的只有HR同情的目光。',
        timeSpent: 1,
        statChanges: { stress: 15, stats: { sanity: -15, social: -10 } }
      }
    ]
  },
  {
    id: 'ex-wife-tuition',
    title: '【前妻的消息：情感绑架】',
    description: '瑞恩下学期的私立学校押金要交了，$5,000。既然你拿了赔偿金，这笔钱你应该没问题吧？不要让孩子觉得他爸爸是个失败者，他真的很期待那个科技夏令营。',
    locationRestriction: ['downtown', 'bellevue', 'capitol-hill'],
    choices: [
      {
        text: '【硬扛到底】没问题，下午转过去 (-$5,000)',
        impact: '你在孩子面前保住了人设，维持了名存实亡的婚姻。',
        timeSpent: 1,
        statChanges: { cash: -5000, stress: 30, stats: { social: 20, sanity: 5 } }
      },
      {
        text: '【实话实说】刚裁员，能否分担？(触发离婚)',
        impact: '这成了压死骆驼的最后一根稻草。前妻正式提出离婚，法律强制抚养费账单生效。',
        timeSpent: 1,
        statChanges: { 
          stress: 50, 
          stats: { social: -30, sanity: -30 },
          bills: [{ 
            id: 'alimony', 
            name: '法律强制抚养费', 
            amount: 2500, 
            dueDate: 5, 
            description: '由于正式离婚，法院裁定的每月必须支付的费用。', 
            isCancellable: false, 
            isActive: true, 
            consequenceIfCancelled: '警方将介入并冻结你的所有剩余资产。' 
          }]
        }
      },
      {
        text: '【拖延战术】资金还没到账，下周再说',
        impact: '暂时的宁静，但你感觉到暴风雨正在积压。',
        timeSpent: 1,
        statChanges: { stress: 10, stats: { luck: -5 } }
      }
    ]
  },
  {
    id: 'landlord-rent-hike',
    title: '【房东的邮件：涨租通牒】',
    description: 'Ryan 您好，鉴于西雅图市中心房产租赁市场持续走高，您的租期即将到期。下个租期的月租金将从 $3,800 上调至 $4,100（+8%）。请在下周五前确认是否续租，否则我们将开始安排新的租客看房。',
    locationRestriction: ['downtown'],
    choices: [
      {
        text: '【直接解约】不租了，下周搬走',
        impact: '你决定离开体面的市中心。未来的现金流压力减轻，但搬家会让你筋疲力尽。',
        timeSpent: 4,
        statChanges: { stress: 20, stats: { survival: 10, sanity: -5 } }
      },
      {
        text: '【试图讲价】作为老租客，能否维持原价？',
        impact: '房东冷冰冰地回复：外面排队的人多得是。',
        timeSpent: 1,
        statChanges: { stress: 15, stats: { luck: 2 } }
      },
      {
        text: '【默认续租】收到了，请发合同',
        impact: '你选择了维持现状，尽管你已经付不起了。',
        timeSpent: 1,
        statChanges: { stress: 10, stats: { sanity: 5 } }
      }
    ]
  },
  {
    id: 'bank-linkedin-backstab',
    title: '【银行的背刺：账单扣费】',
    description: '【Chase Bank】您的信用卡于 14:12 完成一笔交易，金额为 $499.00，收款方为 LinkedIn Premium Annual Selection。',
    locationRestriction: ['downtown', 'bellevue', 'capitol-hill'],
    choices: [
      {
        text: '【认命接受】既然扣了就拼命投简历',
        impact: '你看着那金色的图标，感觉这是你最后的稻草。',
        timeSpent: 0,
        statChanges: { cash: -499, stress: 5, stats: { intellect: 10, luck: 5 } }
      },
      {
        text: '【疯狂投诉】联系客服要求退款',
        impact: '你排队等待了很久，客服一直复读公司政策。',
        timeSpent: 2,
        statChanges: { stress: 20, stats: { sanity: -10 } }
      },
      {
        text: '【冻结卡片】挂失卡片以阻止扣费',
        impact: '虽然阻止了这笔钱，但你的自动扣款房租也失败了。',
        timeSpent: 1,
        statChanges: { stress: 15, stats: { luck: -10 } }
      }
    ]
  }
];

export const getRandomEvent = (location: LocationId): GameEvent => {
  const possible = EVENTS.filter(e => !e.locationRestriction || e.locationRestriction.includes(location));
  return possible[Math.floor(Math.random() * possible.length)] || EVENTS[0];
};
