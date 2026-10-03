/**
 * Demo content for the Check Content page.
 * "Try Demo" loads the first entry.
 */

export const DEMO_MESSAGE = `SEBI registered expert.
Guaranteed 25% monthly return.
Join our private Telegram group.
Only 10 slots left.
Invest ₹20,000 today.`

export const DEMO_MESSAGES = [
  {
    id: 'demo-1',
    title: 'Telegram investment offer',
    text: DEMO_MESSAGE,
  },
  {
    id: 'demo-2',
    title: 'Forwarded WhatsApp message',
    text: `Forward to all groups.
Our members have made ₹45,000 in 3 days with zero loss.
Limited slots — only 7 seats left today.
Message us on WhatsApp to get the secret strategy.
No experience needed, work from home and earn daily.`,
  },
  {
    id: 'demo-3',
    title: 'Recovery offer after a loss',
    text: `We can recover your lost money.
Our SEBI registered experts have helped 1200+ clients get their funds back.
Pay a small clearance fee of ₹4,999 to unlock your account.
Contact us on Telegram immediately — offer expires in 6 hours.`,
  },
  {
    id: 'demo-4',
    title: 'Plain educational content',
    text: `What is NAV in a mutual fund?
NAV stands for Net Asset Value. It is the per-unit value of a fund's assets minus its liabilities.
You can find the official NAV published each working day on the asset manager's website.
Remember, NAV alone does not tell you whether a fund is a good fit for you — risk, time horizon and costs also matter.`,
  },
]

export default DEMO_MESSAGES
