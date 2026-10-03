/**
 * Warning signal reference catalogue (Track A + E).
 * Human-readable descriptions used on the Check page and in guidance panels.
 */

export const SIGNAL_CATALOGUE = [
  {
    id: 'guaranteed-return',
    title: 'Guaranteed returns',
    short: 'An outcome promised as certain.',
    detail: 'Real investment outcomes carry uncertainty. A promise of a fixed, certain result should be checked before you act.',
  },
  {
    id: 'high-return-claim',
    title: 'Unusually high returns',
    short: 'Large short-term gains claimed.',
    detail: 'Very high short-term returns are difficult to sustain. Ask where the figure comes from and whether it is independently published.',
  },
  {
    id: 'urgency',
    title: 'Urgency',
    short: 'Pressure to decide right now.',
    detail: 'Urgency reduces the time you have to verify. A genuine opportunity normally survives a pause.',
  },
  {
    id: 'limited-slots',
    title: 'Limited slots',
    short: 'Artificial scarcity of places.',
    detail: 'Scarcity nudges you to act before checking. Treat it as a cue to slow down.',
  },
  {
    id: 'private-group',
    title: 'Private group redirect',
    short: 'Move to a closed channel.',
    detail: 'Claims made in private groups leave little public record and are harder to verify or report.',
  },
  {
    id: 'investment-request',
    title: 'Request to invest or pay',
    short: 'Money asked for up front.',
    detail: 'A payment demand before verification is one of the most significant practical warning signals.',
  },
  {
    id: 'registration-claim',
    title: 'Registration claim',
    short: 'Regulatory approval asserted.',
    detail: 'Verify registration on the regulator\u2019s own public register — reached by searching for it yourself.',
  },
  {
    id: 'social-proof',
    title: 'Social proof',
    short: 'Testimonials and member counts.',
    detail: 'Other people\u2019s apparent success does not show that a result is repeatable for you.',
  },
  {
    id: 'get-rich-quick',
    title: 'Get-rich-quick language',
    short: 'Big gains, little effort.',
    detail: 'Shortcut language is a widely recognised warning sign in financial promotions.',
  },
  {
    id: 'immediate-pressure',
    title: 'Pressure to enrol',
    short: 'Sign up without delay.',
    detail: 'Legitimate offers normally allow time for questions, documents and independent checks.',
  },
  {
    id: 'recovery-pressure',
    title: 'Money-recovery pressure',
    short: 'Offer to get money back.',
    detail: 'People who have lost money are often targeted a second time. Treat any recovery fee demand with particular care.',
  },
  {
    id: 'insider-tip',
    title: 'Secret or insider tip',
    short: 'Exclusive information claimed.',
    detail: 'Tips distributed widely cannot be verified in advance.',
  },
  {
    id: 'unsolicited-buy-sell',
    title: 'Buy / sell instruction',
    short: 'Direction given without reasoning.',
    detail: 'An instruction you cannot check independently warrants verification before any action.',
  },
  {
    id: 'payment-method',
    title: 'Hard-to-trace payment method',
    short: 'Wallet, crypto or personal account.',
    detail: 'How you are asked to pay is a practical factor to check before sending money.',
  },
  {
    id: 'impersonation',
    title: 'Authority claim',
    short: 'Regulator, bank or celebrity name used.',
    detail: 'Confirm identity through the organisation\u2019s own published channels, never through the message.',
  },
  {
    id: 'forward-share',
    title: 'Forward request',
    short: 'Asked to mass-share.',
    detail: 'Forwarding makes the original source harder to trace and spreads unverified information.',
  },
  {
    id: 'income-claim',
    title: 'Income figure without mechanism',
    short: 'Amount to earn, no explanation.',
    detail: 'An income figure with no transparent explanation of how it is generated is hard to verify.',
  },
  {
    id: 'no-risk-disclosure',
    title: 'No risk disclosure',
    short: 'Money discussed, risk never mentioned.',
    detail: 'A promotion that never mentions the possibility of loss leaves out information you need.',
  },
]

export const SIGNAL_MAP = Object.fromEntries(SIGNAL_CATALOGUE.map((s) => [s.id, s]))

export const CONTENT_TYPES = ['Education', 'Promotion', 'Opinion', 'Prediction', 'Mixed']

export const CONTENT_TYPE_DESC = {
  Education: 'The content primarily explains a concept or process.',
  Promotion: 'The content primarily tries to get you to act, join, pay or register.',
  Opinion: 'The content primarily expresses a personal view rather than verifiable fact.',
  Prediction: 'The content primarily forecasts a future price, return or outcome.',
  Mixed: 'The content blends more than one of these purposes.',
}

export default SIGNAL_CATALOGUE
