/**
 * ===========================================================================
 * NiveshSaathi — Rule-based Content Analyzer (Tracks E + A)
 * ===========================================================================
 *
 * A local, deterministic JavaScript analyzer. No AI API, no network calls.
 *
 * Design rules (must be preserved):
 *  - NEVER output a "scam probability %" or a TRUE/FALSE verdict.
 *  - NEVER declare content fraudulent on the basis of a single signal.
 *  - Every signal must explain WHY it was detected.
 *  - A warning signal is NOT proof of fraud.
 *  - The output is an Evidence Card: what is claimed, what evidence exists,
 *    what evidence is missing, and what cannot be established.
 */

const normalize = (text) =>
  String(text || '')
    .replace(/[ ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const lower = (text) => normalize(text).toLowerCase()

/** Count non-overlapping matches of a pattern in the text. */
const count = (text, pattern) => {
  const flags = pattern.flags.includes('g') ? pattern.flags : pattern.flags + 'g'
  const re = new RegExp(pattern.source, flags)
  return (text.match(re) || []).length
}

/** Extract short quoted snippets that triggered a pattern (for transparency). */
const snippets = (raw, pattern, limit = 2) => {
  const flags = pattern.flags.includes('g') ? pattern.flags : pattern.flags + 'g'
  const re = new RegExp(pattern.source, flags)
  const out = []
  let m
  while ((m = re.exec(raw)) !== null && out.length < limit) {
    const start = Math.max(0, m.index - 45)
    const end = Math.min(raw.length, m.index + m[0].length + 45)
    const piece = raw.slice(start, end).trim()
    if (piece) out.push((start > 0 ? '…' : '') + piece + (end < raw.length ? '…' : ''))
    if (m.index === re.lastIndex) re.lastIndex++
  }
  return out
}

/* ==========================================================================
   1. SIGNAL RULES
   Each rule: id, label, severity, why (static explanation), patterns.
   `why` explains WHY this is a warning signal — never that it proves fraud.
   ========================================================================== */

export const SIGNAL_RULES = [
  {
    id: 'guaranteed-return',
    label: 'Guaranteed return claim',
    severity: 'high',
    why: 'The message presents an outcome as guaranteed. Investment outcomes normally involve uncertainty, so a guarantee is a warning signal worth verifying — on its own it is not proof of fraud.',
    patterns: [
      /\bguaranteed\b/i,
      /\bassured\s+(returns?|profit|income)\b/i,
      /\b100\s*%\s*(guaranteed|sure|safe|profit|returns?|secure)\b/i,
      /\bno[- ]loss\b/i,
      /\bzero\s+loss\b/i,
      /\bcapital\s+guarantee\b/i,
      /\brisk[- ]free\s+(returns?|profit|income)\b/i,
      /\bfixed\s+(returns?|profit|income)\s*(of|at|@\)?)/i,
      /\bcannot\s+lose\b/i,
      /\bmoney[- ]back\s+guarantee\b/i,
    ],
  },
  {
    id: 'high-return-claim',
    label: 'Very high or unusually precise return claim',
    severity: 'high',
    why: 'The message presents an unusually high or unusually precise short-term return. Returns of this size are uncommon and hard to sustain, so the figure should be independently checked against published records. Stating a large figure does not by itself prove the content is fraudulent.',
    patterns: [
      /\b\d{1,3}(?:\.\d+)?\s*%\s*(per|a|each|every)?\s*(month|monthly|week|weekly|day|daily)\b/i,
      /\b\d{1,3}(?:\.\d+)?\s*%\s*(returns?|profit|income|p\.?a\.?|annually|yearly)\b/i,
      /\b(?:monthly|weekly|daily|per\s*month|per\s*week|per\s*day)\s+(returns?|profit|income)\s*(of|:)?\s*\d/i,
      /\byield\s*(of|at)\s*\d{1,3}\s*%/i,
      /\bdouble\s+(your|my)\s+(money|investment|amount)/i,
      /\b\d+\s*x\s+returns?\b/i,
    ],
  },
  {
    id: 'urgency',
    label: 'Pressure to act immediately',
    severity: 'high',
    why: 'The message pushes the reader to act fast. Urgency reduces the time available to verify a claim, which is a common pressure tactic in financial promotions.',
    patterns: [
      /\bact\s+(now|today|fast|immediately|quickly)\b/i,
      /\b(?:don'?t|do not|dont)\s+(wait|delay|miss)\b/i,
      /\blast\s+(chance|day|hour|call|warning)\b/i,
      /\burgent(ly)?\b/i,
      /\bhurry\b/i,
      /\bonly\s+(today|tonight|this\s+hour)\b/i,
      /\bexpires?\b/i,
      /\btime[- ]sensitive\b/i,
      /\bwithin\s+\d+\s*(hours?|minutes?|hrs?|mins?)\b/i,
      /\blimited\s+time\s+(only|offer)\b/i,
      /\bimmediately\s+(transfer|pay|invest|deposit|send)\b/i,
    ],
  },
  {
    id: 'limited-slots',
    label: 'Limited slots or artificial scarcity',
    severity: 'medium',
    why: 'The message claims a small number of remaining places. Scarcity nudges people to decide before checking — it is a signal to slow down, not evidence of wrongdoing.',
    patterns: [
      /\bonly\s+\d+\s*(slots?|seats?|spots?|positions?|openings?|places?)\b/i,
      /\blimited\s+(slots?|seats?|spots?|positions?|places?)\b/i,
      /\bfew\s+(slots?|seats?|spots?)\s+(left|remaining)\b/i,
      /\b\d+\s*(slots?|seats?|spots?)\s+(left|remaining|open)\b/i,
      /\bfirst\s+\d+\s*(people|users|members|clients)\b/i,
      /\bclosing\s+(soon|today)\b/i,
      /\blast\s+\d+\s*(slots?|seats?|spots?)\b/i,
      /\bregistry\s+closing\b/i,
    ],
  },
  {
    id: 'private-group',
    label: 'Redirect to a private group or direct message',
    severity: 'high',
    why: 'The message moves the conversation to a private channel. Private groups are harder to verify or report, and claims made there rarely leave a public record. Being directed to a private group does not by itself prove the content is fraudulent.',
    patterns: [
      /\bjoin\s+our\s+(private\s+)?(telegram|whatsapp|whats\s?app|signal|instagram)\b/i,
      /\bprivate\s+(telegram|whatsapp|whats\s?app)\s+group\b/i,
      /\b(telegram|whatsapp|whats\s?app)\s+group\b/i,
      /\bjoin\s+the\s+group\b/i,
      /\bdm\s+(me|us)\b/i,
      /\bmessage\s+(me|us)\s+(on|directly|privately)\b/i,
      /\bdirect\s+message\b/i,
      /\bbroadcast\s+list\b/i,
      /\bping\s+us\s+on\b/i,
      /\bcontact\s+us\s+on\s+(telegram|whatsapp|whats\s?app)\b/i,
    ],
  },
  {
    id: 'investment-request',
    label: 'Direct request to invest or send money',
    severity: 'high',
    why: 'The message asks for money to be committed or transferred. A request for payment before you have independently verified the offer is a significant warning signal. Many legitimate investments also ask for money, so asking for payment does not by itself prove the content is fraudulent.',
    patterns: [
      /\binvest\s*(₹|rs\.?|inr)?\s*[\d,]+/i,
      /\bdeposit\s*(₹|rs\.?|inr)?\s*[\d,]+/i,
      /\btransfer\s*(₹|rs\.?|inr)?\s*[\d,]+/i,
      /\bpay\s*(₹|rs\.?|inr)\s*[\d,]+/i,
      /\bsend\s+(₹|rs\.?|inr)\s*[\d,]+/i,
      /\bminimum\s+(deposit|investment|amount)\b/i,
      /\bstart\s+(investing\s+)?with\s*(₹|rs\.?|inr)\s*[\d,]+/i,
      /\bregistration\s+fee\b/i,
      /\benrollment\s+fee\b/i,
      /\bplan\s+(starts?|starting)\s*(at|from)?\s*(₹|rs\.?|inr)/i,
      /\b(?:pay|deposit|transfer)\s+(today|now|immediately)\b/i,
    ],
  },
  {
    id: 'registration-claim',
    label: 'Regulatory registration or endorsement claim',
    severity: 'medium',
    why: 'The message asserts regulatory approval or registration. Such claims should be checked directly on the regulator\u2019s own public register, using details found there rather than details supplied by the sender. Many genuine firms make this claim, so claiming registration does not by itself prove the content is fraudulent.',
    patterns: [
      /\bsebi\s+registered\b/i,
      /\bregistered\s+with\s+sebi\b/i,
      /\bsebi\s+(approved|certified|licensed|recognised|authorized|authorised)\b/i,
      /\brbi\s+(approved|registered|licensed)\b/i,
      /\b(irdda?|irda)\s+registered\b/i,
      /\bmfi\s+registered\b/i,
      /\b(amfi|nse|bse|mcx|ncdex)\s+(registered|approved|certified)\b/i,
      /\bsec\s+registered\b/i,
      /\blicensed\s+by\b/i,
      /\bofficially\s+approved\b/i,
      /\bgovernment\s+approved\b/i,
      /\brbi\s+approved\s+(scheme|plan|scheme)\b/i,
    ],
  },
  {
    id: 'social-proof',
    label: 'Social proof or testimonial evidence',
    severity: 'medium',
    why: 'The message relies on other people\u2019s apparent success rather than verifiable data. Testimonials and member counts do not show that a result is repeatable for you.',
    patterns: [
      /\btop\s+perform(er|ing)\b/i,
      /\bbest\s+perform(er|ing)\b/i,
      /\b\d{2,4}\s*\+?\s*(members?|clients?|investors?|users?|followers?)\b/i,
      /\btrusted\s+by\s+\d/i,
      /\bsuccess\s+stories?\b/i,
      /\btestimonials?\b/i,
      /\bour\s+(members?|clients?|students?)\s+(earn|made|received|got)\b/i,
      /\bproven\s+results?\b/i,
      /\bverified\s+profits?\b/i,
      /\bpayout\s+(proof|screenshots?)\b/i,
      /\bdaily\s+payouts?\b/i,
      /\bprofits?\s+(credited|paid\s+out|distributed)\b/i,
    ],
  },
  {
    id: 'get-rich-quick',
    label: 'Get-rich-quick or secret-strategy language',
    severity: 'high',
    why: 'The message promises large gains with little effort or knowledge. Wealth-building normally takes time, cost and risk — shortcut language is a recognised warning sign.',
    patterns: [
      /\bget\s+rich\s+quick\b/i,
      /\bbecome\s+(a\s+)?crorepati\b/i,
      /\bfinancial\s+freedom\s+(in|within)\b/i,
      /\bearn\s+(₹|rs\.?|inr)?\s*[\d,]+\s*(per|a|each)?\s*(day|month|week)\b/i,
      /\bpassive\s+income\s+(of|that|which)\b/i,
      /\bzero\s+effort\b/i,
      /\bno\s+(experience|knowledge|skills?)\s+(needed|required)\b/i,
      /\bwork\s+from\s+home.* earn/i,
      /\bsecret\s+(strategy|strategy|tip|method|formula|system)\b/i,
      /\bexposed\s+system\b/i,
      /\b100\s*%\s+free\s+money\b/i,
      /\beasy\s+money\b/i,
      /\brich\s+quick(ly)?\b/i,
      /\bforex\s+trading\s+(course|signal|bot)\b/i,
      /\bai\s+trading\s+bot\b/i,
    ],
  },
  {
    id: 'immediate-pressure',
    label: 'Pressure to enrol or register right now',
    severity: 'medium',
    why: 'The message tells you to sign up without delay. Real opportunities normally allow time for questions, documents and independent checks.',
    patterns: [
      /\b(join|enrol|enroll|register|sign\s*up)\s+(now|today|immediately|fast)\b/i,
      /\bjoin\s+now\b/i,
      /\benrol+?\s+now\b/i,
      /\bregister\s+(now|today)\b/i,
      /\bsign\s*up\s+(now|today|before)\b/i,
      /\bclick\s+(the\s+)?link\s+(now|below|before)\b/i,
      /\bdownload\s+(the\s+)?app\s+(now|before)\b/i,
    ],
  },
  {
    id: 'recovery-pressure',
    label: 'Money-recovery or refund pressure',
    severity: 'high',
    why: 'The message offers to return or recover money. People who have already lost money are frequently targeted again — a second payment demand in this context needs particular care.',
    patterns: [
      /\brecover\s+(your|all|the)?\s*(lost\s+)?(money|funds|amount|investment)\b/i,
      /\bget\s+your\s+money\s+back\b/i,
      /\bloss\s+recovery\b/i,
      /\brecovery\s+(of\s+)?(funds?|money|amount)\b/i,
      /\brefund\s+(guaranteed|assured|within)\b/i,
      /\bwe\s+can\s+recover\b/i,
      /\bpay\s+(a\s+)?(fee|charges?)\s+(to|for)\s+recover\b/i,
      /\bunlock\s+your\s+(funds?|money|account)\b/i,
      /\brelease\s+your\s+(funds?|money)\b/i,
      /\bclearance\s+fee\b/i,
      /\btax\s+(payment|fee)\s+(to\s+)?release\b/i,
    ],
  },
  {
    id: 'insider-tip',
    label: 'Insider tip, secret or exclusive-tip language',
    severity: 'high',
    why: 'The message presents information as secret or exclusive. Tips distributed to the public cannot normally be verified in advance, and acting on them carries significant risk.',
    patterns: [
      /\binsider\s+(tip|info|information|deal)\b/i,
      /\bhot\s+tip\b/i,
      /\bexclusive\s+tip\b/i,
      /\bsecret\s+(tip|stock|pick|trade|information|news)\b/i,
      /\bguaranteed\s+tip\b/i,
      /\bstock\s+tip\b/i,
      /\btarget\s+price\s+(of|is)?\s*₹?\s*\d/i,
      /\bwill\s+(reach|hit|touch)\s+₹?\s*\d/i,
    ],
  },
  {
    id: 'unsolicited-buy-sell',
    label: 'Unsolicited instruction to buy or sell',
    severity: 'high',
    why: 'The message tells you to buy or sell without showing reasoning you can check. Direct trading instructions from an unverified source warrant independent verification.',
    patterns: [
      /\b(buy|sell)\s+(this|these|it|now|today|immediately)\b/i,
      /\bbuy\s+[A-Z]{2,10}\b/,
      /\braise\s+your\s+(holding|position)\b/i,
      /\bexit\s+(your\s+)?(position|stock|investment)\b/i,
      /\baccumulate\s+(more)?\s*(shares?|stock)?\b/i,
      /\bprice\s+target\b/i,
    ],
  },
  {
    id: 'payment-method',
    label: 'Unusual or hard-to-trace payment method',
    severity: 'high',
    why: 'The message suggests payment through channels that are difficult to reverse or trace. Payment method is a practical factor to check before sending money anywhere.',
    patterns: [
      /\bupi\s*(id)?\s*[:@-]/i,
      /\b(gpay|google\s*pay|paytm|phonepe|bhim)\b/i,
      /\bbitcoin|btc\b/i,
      /\busdt|tether|crypto\s+payment\b/i,
      /\bwallet\s+transfer\b/i,
      /\bbank\s+transfer\s+to\b/i,
      /\baccount\s+number\s*[:\-]\s*\d/i,
      /\bifsc\b/i,
      /\bpromoter'?s?\s+personal\s+account\b/i,
    ],
  },
  {
    id: 'impersonation',
    label: 'Claim of official or celebrity authority',
    severity: 'high',
    why: 'The message borrows authority from a regulator, bank, official or public figure. Identity claims should be confirmed through the organisation\u2019s own published channels.',
    patterns: [
      /\bfrom\s+the\s+desk\s+of\b/i,
      /\b(official|authorised|authorized)\s+(partner|representative|agent|channel)\b/i,
      /\bwe\s+are\s+(the\s+)?official\b/i,
      /\bcelebrity\s+(endorse|endorsement|investment)\b/i,
      /\b(actor|actress|cricketer|bollywood|politician)\s+(endorsement|backed|investment)\b/i,
      /\breserve\s+bank\s+of\s+india\s+(scheme|offer|plan)\b/i,
      /\bministry\s+of\s+finance\s+(approved|scheme|plan)\b/i,
      /\bsebi\s+(has\s+)?approved\b/i,
    ],
  },
  {
    id: 'forward-share',
    label: 'Request to forward or mass-share',
    severity: 'medium',
    why: 'The message asks to be spread widely. Requests to forward financial claims make it harder to trace the original source and can amplify unverified information.',
    patterns: [
      /\bforward\s+(this|it|to\s+all|to\s+everyone)\b/i,
      /\bshare\s+(this\s+)?with\s+(all|everyone|your\s+(friends|family|group))\b/i,
      /\bforward\s+to\s+all\b/i,
      /\bviral\s+message\b/i,
      /\bcopy\s+and\s+share\b/i,
    ],
  },
  {
    id: 'income-claim',
    label: 'Specific income promise without mechanism',
    severity: 'medium',
    why: 'The message states an amount you can earn without explaining how the money is generated. An income figure without a transparent mechanism is hard to verify.',
    patterns: [
      /\bearn\s+(₹|rs\.?|inr)\s*[\d,]+\s*(per|a|each)?\s*(day|month|week|year)\b/i,
      /\b(?:monthly|weekly|daily)\s+income\s*(of|:)?\s*(₹|rs\.?|inr)?\s*[\d,]+/i,
      /\bincome\s+(of|up\s+to)\s*(₹|rs\.?|inr)\s*[\d,]+/i,
      /\bmake\s+(₹|rs\.?|inr)\s*[\d,]+\s*(per|a|each)?\s*(day|month|week)\b/i,
      /\b₹\s*[\d,]+\s*(per|a|each)?\s*(day|month|week)\s+(guaranteed|income|profit|returns?)\b/i,
    ],
  },
  {
    id: 'no-risk-disclosure',
    label: 'No risk or loss disclosure present',
    severity: 'medium',
    why: 'The message discusses money but does not mention that values can fall or that loss is possible. Promotion without risk disclosure makes a balanced judgement harder.',
    patterns: [],
    // Negation rule — handled specially below.
    negative: true,
  },
]

/* ==========================================================================
   2. EVIDENCE — what the content actually provides
   ========================================================================== */

const EVIDENCE_TESTS = [
  {
    key: 'registration-number',
    test: /registration\s*(no|number|#|:)\s*[:\-]?\s*[A-Za-z0-9\/-]+/i,
    text: 'A registration or licence number is quoted.',
  },
  {
    key: 'cin',
    test: /\bcin\b\s*[:\-]?\s*[A-Za-z0-9]+/i,
    text: 'A CIN (company identification number) is quoted.',
  },
  {
    key: 'sebi-reg-number',
    test: /sebi\s*(registration|regd?\.?|no|number)\s*(no|number|#)?\s*[:\-]?\s*[A-Za-z0-9\/-]+/i,
    text: 'A SEBI registration number is quoted.',
  },
  {
    key: 'audited-statements',
    test: /\b(audited|audit(ed)?\s+by|auditor|financial\s+statements?)\b/i,
    text: 'Audited financial statements or an auditor are referenced.',
  },
  {
    key: 'official-document',
    test: /\b(prospectus|fund\s+fact\s+sheet|factsheet|key\s+information\s+document|kfd)\b/i,
    text: 'An official document (prospectus / fact sheet / KID) is referenced.',
  },
  {
    key: 'risk-disclosure',
    test: /\b(risk\s+(disclosure|warning|statement)|values?\s+can\s+(fall|go\s+down)|capital\s+at\s+risk|past\s+(performance|returns))\b/i,
    text: 'A risk disclosure or past-performance caveat is present.',
  },
  {
    key: 'terms-conditions',
    test: /\b(terms\s+and\s+conditions|t&c|policy|disclosure)\b/i,
    text: 'Terms, conditions or a disclosure document are referenced.',
  },
  {
    key: 'web-link',
    test: /\bhttps?:\/\/[^\s]+/i,
    text: 'A web link is included in the message.',
  },
  {
    key: 'source-named',
    test: /\bsource\s*:\s*\S+/i,
    text: 'A source is named for the claim.',
  },
  {
    key: 'regulator-named',
    test: /\b(regulated\s+by|supervised\s+by|oversight\s+of)\b/i,
    text: 'A regulating body is named.',
  },
  {
    key: 'scheme-document',
    test: /\b(scheme|plan|policy|contract)\s+(document|details|pdf|file)\b/i,
    text: 'A scheme or contract document is offered.',
  },
  {
    key: 'scheme-identifier',
    test: /\b(?:identifier|isin|scheme\s+code|plan\s+code)\b/i,
    text: 'A scheme identifier or code is quoted.',
  },
]

/* ==========================================================================
   3. MISSING EVIDENCE — derived from what is claimed vs. what is shown
   ========================================================================== */

function deriveMissingEvidence({ raw, l, hasRegistrationClaim, hasReturnClaim, hasPaymentAsk, evidenceCount }) {
  const missing = []
  const add = (key, text) => missing.push({ key, text })

  if (hasReturnClaim) {
    add(
      'return-no-calculation',
      'No calculation, audited record or independent source is given for the claimed return.',
    )
    add('return-no-conditions', 'No statement of the conditions under which the return would apply.')
  }

  if (hasReturnClaim && !/\b(risk|loss|fall|volatile|volatility|downside)\b/i.test(raw)) {
    add('no-risk-mention', 'No mention of risk, downside or the possibility of losing money.')
  }

  if (hasRegistrationClaim && !/\b(registration|regd?\.?|reg\.?\s*no|number|cin|licence|license)\b/i.test(raw)) {
    add(
      'registration-no-number',
      'A registration claim is made, but no registration number or verifiable identifier is supplied.',
    )
  }

  if (hasPaymentAsk && !/\b(terms\s+and\s+conditions|t&c|contract|refund\s+policy|cooling[- ]off)\b/i.test(raw)) {
    add('no-terms', 'No contract, terms of service or refund/cancellation policy is provided.')
  }

  if (!/\bhttps?:\/\/|www\./i.test(raw)) {
    add('no-official-link', 'No link to an official register, filing or public record is included.')
  }

  if (!/\b(audit|audited|financial\s+statements?|disclosed)\b/i.test(raw)) {
    add('no-audited-figures', 'No audited or independently published figures are cited.')
  }

  if (!/\b(sponsor|asset\s+manager|broker|intermediary|registered\s+office|address|contact)\b/i.test(raw)) {
    add('no-entity-details', 'No identifiable entity details (sponsor, intermediary, registered address) are given.')
  }

  if (evidenceCount === 0) {
    add('no-documentation', 'The message contains no supporting documentation of any kind.')
  }

  if (missing.length === 0) {
    add(
      'material-not-attached',
      'Some supporting material is referenced, but it is not attached or independently linked, so it cannot be checked from this message alone.',
    )
  }

  return missing
}

/* ==========================================================================
   4. UNCERTAINTY — what simply cannot be established from the text
   ========================================================================== */

const UNCERTAINTY_BASE = [
  { key: 'sender-identity', text: 'Whether the sender is who they claim to be cannot be established from this message.' },
  { key: 'registration-genuine', text: 'Whether the registration or endorsement claim is genuine cannot be confirmed from the text alone.' },
  { key: 'returns-unverified', text: 'Whether the stated returns were actually achieved, by whom, and over what period, is unknown.' },
  { key: 'fees-conditions', text: 'What fees, lock-in periods or exit conditions apply is not shown here.' },
  { key: 'personal-terms', text: 'Whether the same terms would apply to you personally is not stated.' },
  { key: 'offer-availability', text: 'Whether the offer is still available, and on exactly what terms, cannot be verified from this message.' },
]

/* ==========================================================================
   5. INTENDED ACTION — what the content is trying to make you do
   ========================================================================== */

function deriveIntendedActions({ l, hasPaymentAsk, hasGroupAsk, hasUrgency, hasShareAsk, hasPersonalData }) {
  const actions = []
  const add = (key, text) => actions.push({ key, text })

  if (hasPaymentAsk) add('send-money', 'Commit or send money before verification is complete.')
  if (hasPaymentAsk) add('invest-on-message', 'Invest an amount on the strength of the message alone.')
  if (hasGroupAsk) add('join-private-group', 'Join a private group where claims are harder to check or report.')
  if (hasUrgency) add('decide-quickly', 'Decide quickly, leaving no time for independent verification.')
  if (/\btrust\b|\bverified\b|\breliable\b/i.test(l)) add('trust-on-claim', 'Trust a person or brand on the basis of their own claim.')
  if (hasShareAsk) add('forward-message', 'Forward the message to other people.')
  if (hasPersonalData) add('share-personal', 'Share personal or account information.')
  if (/\b(call|whatsapp|telegram|dm|contact)\b/i.test(l)) add('make-contact', 'Make contact through a channel the sender controls.')
  if (/\b(download|install|app)\b/i.test(l)) add('download-app', 'Download or install an application.')
  if (/\b(register|sign\s*up|enrol|open\s+an?\s+account)\b/i.test(l)) add('register-account', 'Register an account or enrol in a programme.')

  if (actions.length === 0) {
    add('read-only', 'Read and consider the claim — no direct action is explicitly demanded in this text.')
  }
  return actions
}

/* ==========================================================================
   6. CONTENT TYPE
   ========================================================================== */

function classifyContentType({ l, hasPaymentAsk, hasReturnAsk }) {
  const scores = { Education: 0, Promotion: 0, Opinion: 0, Prediction: 0 }

  // Education markers
  if (/\b(what\s+is|how\s+(does|to)|meaning|introduction|basics|explained|understand|learn|guide|tutorial|concept)\b/i.test(l)) scores.Education += 3
  if (/\b(for\s+beginners|simple|in\s+hindi|step[- ]by[- ]step|example|analogy)\b/i.test(l)) scores.Education += 2
  if (/\b(remember|note\s+that|it\s+is\s+important\s+to|always|never\s+ignore)\b/i.test(l)) scores.Education += 1

  // Promotion markers
  if (hasPaymentAsk) scores.Promotion += 4
  if (/\b(join|enrol|enroll|register|sign\s*up|buy|subscribe|offer|limited|discount|bonus|free\s+trial)\b/i.test(l)) scores.Promotion += 2
  if (/\b(our|we\s+offer|we\s+provide|best|top[- ]rated|exclusive)\b/i.test(l)) scores.Promotion += 1
  if (/\b(telegram|whatsapp|dm|contact\s+us|call\s+us|link\s+in\s+bio)\b/i.test(l)) scores.Promotion += 2

  // Opinion markers
  if (/\b(i\s+(think|believe|feel|personally)|in\s+my\s+(view|opinion|experience)|from\s+my\s+experience|imo|i\s+would\s+say)\b/i.test(l)) scores.Opinion += 4
  if (/\b(might|could\s+possibly|seems?\s+to\s+me|arguably|perhaps|maybe)\b/i.test(l)) scores.Opinion += 1

  // Prediction markers
  if (/\b(will\s+(rise|fall|reach|hit|grow|go|hit)|expect(ed|s)?\s+(to|a)|prediction|forecast|target\s+price|by\s+20\d\d)\b/i.test(l)) scores.Prediction += 4
  if (/\b(is\s+going\s+to|gonna|soon\s+be|will\s+be\s+worth|projection)\b/i.test(l)) scores.Prediction += 3

  if (hasReturnAsk) scores.Prediction += 1

  const entries = Object.entries(scores).sort((a, b) => b[1] - a[1])
  const [topType, topScore] = entries[0]
  const secondScore = entries[1][1]

  if (topScore === 0) return { contentType: 'Mixed', scores }
  if (topScore > 0 && secondScore > 0 && topScore - secondScore <= 2) {
    return { contentType: 'Mixed', scores }
  }
  return { contentType: topType, scores }
}

/* ==========================================================================
   7. CLAIM EXTRACTION
   ========================================================================== */

function extractClaim(raw) {
  const sentences = raw
    .split(/(?<=[.!?])\s+|\n+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 8)

  if (sentences.length === 0) return normalize(raw).slice(0, 300) || 'No claim could be extracted.'

  // Prefer a sentence that carries a promise, return figure, or instruction.
  const priority =
    sentences.find((s) => /guaranteed|assured|returns?|%|invest|profit|earn|will\s+(rise|reach|grow)/i.test(s)) ||
    sentences[0]

  if (sentences.length === 1) return priority

  const support = sentences.filter((s) => s !== priority).slice(0, 2)
  return `${priority}\n\nAlso stated: ${support.join(' ')}`
}

/* ==========================================================================
   8. SAFETY ACTIONS (Track A)
   ========================================================================== */

const SAFETY_ACTIONS = [
  { key: 's1', text: 'Do not send money immediately. Give yourself time to verify first.' },
  { key: 's2', text: 'Do not share OTP, password, PIN, card number or CVV with anyone — no genuine representative asks for these.' },
  { key: 's3', text: 'Independently verify identity and registration claims using the regulator\u2019s own public register, reached by searching for it yourself rather than through any link in the message.' },
  { key: 's4', text: 'Preserve screenshots, message headers, phone numbers, URLs and transaction details before you act or block.' },
  { key: 's5', text: 'Use the appropriate official reporting or grievance route if you have already acted, or if you believe an offence has occurred.' },
]

const VERIFICATION_SOURCES = [
  {
    key: 'registration',
    label: 'Registration or licence claims',
    detail:
      'Search for the regulator\u2019s official website yourself (for example SEBI, RBI, AMFI, IRDAI, exchanges) and look up the entity on its public register. Match the name, address and registration number shown there — not the details supplied in the message.',
  },
  {
    key: 'returns',
    label: 'Return or performance figures',
    detail:
      'Check audited factsheets, official filings or published scheme documents. A figure that appears only in the message, with no link to a published record, cannot be verified.',
  },
  {
    key: 'sender',
    label: 'Sender identity',
    detail:
      'Contact the organisation through a phone number or email address published on its own official website, not through the number or link contained in the message.',
  },
  {
    key: 'terms',
    label: 'Offer, scheme or contract terms',
    detail:
      'Ask for the written document, read the fees, lock-in, exit and refund conditions, and take time before signing or paying anything.',
  },
  {
    key: 'moneySent',
    label: 'Money already sent',
    detail:
      'Contact your bank or payment provider through official channels and use the appropriate grievance or reporting route. Acting quickly here matters.',
  },
]

/* ==========================================================================
   9. MAIN ENTRY POINT
   ========================================================================== */

/**
 * Analyze a piece of financial content.
 *
 * @param {string} text - raw user input
 * @returns {object} structured Evidence Card data
 */
export function analyzeContent(text) {
  const raw = String(text || '')
  const norm = normalize(raw)
  const l = lower(raw)

  if (!norm) {
    return {
      isEmpty: true,
      claim: '',
      contentType: '',
      evidence: [],
      evidenceKeys: [],
      missingEvidence: [],
      missingEvidenceKeys: [],
      warningSignals: [],
      uncertainty: [],
      uncertaintyKeys: [],
      intendedAction: [],
      intendedActionKeys: [],
      safetyActions: [],
      safetyActionKeys: [],
      verificationSources: [],
      verificationKeys: [],
      signalCount: 0,
      highSignalCount: 0,
    }
  }

  /* --- Run signal rules --- */
  const warningSignals = []
  for (const rule of SIGNAL_RULES) {
    if (rule.negative) continue // handled below
    let hit = false
    let matchedPattern = null

    for (const p of rule.patterns) {
      if (count(l, p) > 0) {
        hit = true
        matchedPattern = p
        break
      }
    }
    if (!hit) continue

    warningSignals.push({
      id: rule.id,
      label: rule.label,
      labelKey: `signals.${rule.id}.label`,
      why: rule.why,
      whyKey: `signals.${rule.id}.why`,
      severity: rule.severity,
      matches: snippets(norm, matchedPattern).slice(0, 2),
      matchedOn: matchedPattern ? matchedPattern.source : '',
    })
  }

  const hasRegistrationClaim = warningSignals.some((s) => s.id === 'registration-claim')
  const hasReturnClaim = warningSignals.some(
    (s) => s.id === 'guaranteed-return' || s.id === 'high-return-claim' || s.id === 'income-claim',
  )
  const hasPaymentAsk = warningSignals.some(
    (s) => s.id === 'investment-request' || s.id === 'payment-method' || s.id === 'recovery-pressure',
  )
  const hasGroupAsk = warningSignals.some((s) => s.id === 'private-group')
  const hasUrgency = warningSignals.some(
    (s) => s.id === 'urgency' || s.id === 'limited-slots' || s.id === 'immediate-pressure',
  )
  const hasShareAsk = warningSignals.some((s) => s.id === 'forward-share')
  const hasPersonalData = /\b(otp|password|pin|bank\s+details?|account\s+details?|card\s+number|kyc)\b/i.test(raw)

  /* --- "No risk disclosure" negation rule --- */
  const mentionsMoney = /\b(invest|return|profit|money|fund|scheme|amount|₹|rs\.?|inr|earn|loss)\b/i.test(l)
  const mentionsRisk = /\b(risk|loss|fall|downside|volatile|volatility|can\s+go\s+down|uncertain|fluctuat)\b/i.test(l)

  if (mentionsMoney && !mentionsRisk) {
    warningSignals.push({
      id: 'no-risk-disclosure',
      label: 'No risk or loss disclosure present',
      labelKey: 'signals.no-risk-disclosure.label',
      severity: 'medium',
      why: 'The message discusses money but never mentions that values can fall or that loss is possible. Promotion without risk disclosure makes a balanced judgement harder — it is a gap to note, not proof of wrongdoing.',
      whyKey: 'signals.no-risk-disclosure.why',
      matches: [],
      matchedOn: '',
    })
  }

  /* --- Evidence provided --- */
  const matchedEvidence = EVIDENCE_TESTS.filter((t) => t.test.test(raw))
  const evidence = matchedEvidence.map((t) => t.text)
  const evidenceKeys = matchedEvidence.map((t) => `evidenceItems.${t.key}`)

  /* --- Missing evidence --- */
  const missingPairs = deriveMissingEvidence({
    raw,
    l,
    hasRegistrationClaim,
    hasReturnClaim,
    hasPaymentAsk,
    evidenceCount: evidence.length,
  })
  const missingEvidence = missingPairs.map((m) => m.text)
  const missingEvidenceKeys = missingPairs.map((m) => `missingEvidence.${m.key}`)

  /* --- Uncertainty --- */
  const uncertaintyPairs = [...UNCERTAINTY_BASE]
  if (hasPaymentAsk) {
    uncertaintyPairs.push({
      key: 'payment-outcome',
      text: 'Whether payment would result in any investment, or simply in a transfer, is unknown.',
    })
  }
  if (hasGroupAsk) {
    uncertaintyPairs.push({
      key: 'private-group-hidden',
      text: 'What is said inside the private group cannot be assessed, because it is not visible here.',
    })
  }
  const uncertainty = uncertaintyPairs.map((u) => u.text)
  const uncertaintyKeys = uncertaintyPairs.map((u) => `uncertainty.${u.key}`)

  /* --- Content type --- */
  const { contentType } = classifyContentType({ l, hasPaymentAsk, hasReturnAsk: hasReturnClaim })

  /* --- Claim --- */
  const claim = extractClaim(raw)

  /* --- Intended action --- */
  const actionPairs = deriveIntendedActions({
    l,
    hasPaymentAsk,
    hasGroupAsk,
    hasUrgency,
    hasShareAsk,
    hasPersonalData,
  })
  const intendedAction = actionPairs.map((a) => a.text)
  const intendedActionKeys = actionPairs.map((a) => `intendedActions.${a.key}`)

  const highSignalCount = warningSignals.filter((s) => s.severity === 'high').length

  return {
    isEmpty: false,
    claim,
    contentType,
    // Slug must match contentTypeLabel() in src/i18n/index.js exactly.
    contentTypeKey: `contentTypes.${String(contentType)
      .toLowerCase()
      .replace(/[^a-z]/g, '')}.label`,
    evidence,
    evidenceKeys,
    missingEvidence,
    missingEvidenceKeys,
    warningSignals,
    uncertainty,
    uncertaintyKeys,
    intendedAction,
    intendedActionKeys,
    safetyActions: SAFETY_ACTIONS.map((s) => s.text),
    safetyActionKeys: SAFETY_ACTIONS.map((s) => `safetyActions.${s.key}`),
    verificationSources: VERIFICATION_SOURCES.map((v) => ({
      label: v.label,
      detail: v.detail,
      key: v.key,
    })),
    verificationKeys: VERIFICATION_SOURCES.map((v) => `verify.${v.key}.label`),
    verificationDetailKeys: VERIFICATION_SOURCES.map((v) => `verify.${v.key}.detail`),
    signalCount: warningSignals.length,
    highSignalCount,
    // True when the content should trigger the Track A pause flow.
    shouldPause: warningSignals.length > 0,
    // Not a probability. Only a coarse "how much to slow down" indication.
    cautionLevel:
      highSignalCount >= 3 || warningSignals.length >= 6
        ? 'high'
        : warningSignals.length >= 3
          ? 'elevated'
          : warningSignals.length >= 1
            ? 'notice'
            : 'none',
  }
}

export default analyzeContent
