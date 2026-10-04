/**
 * English dictionary — the canonical key set for NiveshSaathi.
 *
 * Every other language file must contain exactly these keys.
 * Interpolation uses {{name}} placeholders.
 *
 * Sections: nav, common, safety, home, learn, checkContent, evidence,
 * contentTypes, signals, catalogue, evidenceItems, missingEvidence,
 * uncertainty, intendedActions, safetyActions, verify, beforeInvest,
 * decisions, problem, recovery, footer, picker.
 */

export default {
  /* ------------------------------------------------------------------ NAV */
  nav: {
    home: 'Home',
    learn: 'Learn',
    checkContent: 'Check Content',
    beforeInvest: 'Before I Invest',
    decisions: 'My Decisions',
    problem: 'I Have a Problem',
    recovery: 'Recovery',
    mainNav: 'Main navigation',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    language: 'Language',
    selectLanguage: 'Select Language',
    chooseLanguage: 'Choose your language',
    brandTagline: 'Investor Resilience Companion',
  },

  /* --------------------------------------------------------------- COMMON */
  common: {
    progress: 'Progress',
    open: 'Open',
    tryDemo: 'Try Demo',
    analyzeContent: 'Analyze Content',
    clear: 'Clear',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    back: 'Back',
    next: 'Next',
    startOver: 'Start over',
    copy: 'Copy',
    copied: 'Copied',
    regenerate: 'Regenerate',
    tryAgain: 'Try again',
    continueBtn: 'Continue',
    notAnswered: 'Not answered',
    yes: 'Yes',
    no: 'No',
    notSure: 'Not sure',
    characters: '{{count}} characters',
    nothingPastedYet: 'Nothing pasted yet',
    of: '{{done}} of {{total}}',
    entry: 'entry',
    entries: 'entries',
    observation: 'observation',
    observations: 'observations',
    optional: 'Optional',
    somethingWentWrong: 'Something went wrong. Please try again.',
    stepOf: 'Step {{current}} of {{total}}',
    percent: '{{value}}%',
    devicesOnly: 'Stored on this device only',
    educationalOnly: 'Educational only — not advice',
  },

  /* --------------------------------------------------------------- SAFETY */
  safety: {
    mantra: 'Understand → Verify → Pause → Decide Yourself',
    noRecommendationsStrong: 'NiveshSaathi does not provide investment recommendations.',
    noRecommendationsBody:
      'It never tells you to buy, sell or hold. You make the decision.',
    neverShareTitle: 'Never share these with anyone.',
    neverShareBody:
      'OTP, passwords, PINs, card numbers, CVVs or login credentials. No genuine bank, broker, regulator or support agent will ever ask for them.',
    neverShareShortTitle: 'Never share:',
    neverShareShortBody:
      'OTP, password, PIN, card number or CVV. No genuine bank, broker or regulator will ever ask for these.',
    signalNotProof: 'A warning signal on its own is not proof of fraud.',
    neverShareFull:
      'Never share: OTP, passwords, PINs or login credentials — including to anyone claiming they can “unlock” your funds. No genuine official asks for these.',
    pauseNow: 'Pause and reflect',
    understand: 'Understand',
    verify: 'Verify',
    pause: 'Pause',
    decideYourself: 'Decide Yourself',
  },

  /* ---------------------------------------------------------------- HOME */
  home: {
    eyebrow: 'Your Investor Resilience Companion',
    title1: 'Understand. Verify.',
    title2: 'Pause. Protect.',
    description:
      'NiveshSaathi helps you understand financial information, identify manipulation and scam signals, pause before impulsive decisions, and understand your investor rights.',
    ctaPrimary: 'Check Financial Content',
    ctaSecondary: 'Start Learning',
    howItHelps: 'How it helps',
    startEyebrow: 'Where would you like to start?',
    startTitle: 'Five ways to build resilience',
    startDesc:
      'Each one works on its own — and they are designed to be used together, in the order that fits your situation.',
    journeyEyebrow: 'One connected experience',
    journeyTitle: 'How the five tracks work together',
    journeyDesc:
      'A message arrives. Instead of reacting, you move through the tracks — and you still make the decision yourself.',
    guardEyebrow: 'What NiveshSaathi will never do',
    tryDemo: 'Try Demo',
    flow: {
      detect: { title: 'Detect', sub: 'suspicious patterns' },
      verify: { title: 'Verify', sub: 'with reliable sources' },
      understand: { title: 'Understand', sub: 'the risk clearly' },
      actSafely: { title: 'Act Safely', sub: 'with confidence' },
    },
    cards: {
      check: {
        title: 'Check Financial Content',
        desc: 'Is this information trustworthy?',
        track: 'Track E',
      },
      learn: {
        title: 'Learn',
        desc: 'Understand financial concepts simply.',
        track: 'Track C',
      },
      beforeInvest: {
        title: 'Before I Invest',
        desc: 'Pause and think before making a decision.',
        track: 'Track D',
      },
      problem: {
        title: 'I Have a Problem',
        desc: 'Understand your rights and next steps.',
        track: 'Track B',
      },
      decisions: {
        title: 'My Decisions',
        desc: 'Reflect on your financial decisions.',
        track: 'Track D',
      },
      recovery: {
        title: 'Something went wrong?',
        desc: 'Stop, preserve evidence, report, track, next step.',
        track: 'Track A + B',
      },
    },
    journey: {
      e: {
        tag: 'Track E',
        small: 'Misinformation',
        heading: 'Read the content critically',
        b1: 'Extract the claim',
        b2: 'Identify the content type',
        b3: 'Show evidence and missing evidence',
        b4: 'List warning signals and explain what cannot be established',
      },
      a: {
        tag: 'Track A',
        small: 'Fraud resilience',
        heading: 'Detect → Verify → Pause → Safe Action',
        b1: 'Explain each warning signal in plain language',
        b2: 'Suggest independent verification routes',
        b3: 'Hold a pause before money moves',
      },
      c: {
        tag: 'Track C',
        small: 'Education',
        heading: 'Understand the concept involved',
        b1: 'NAV, risk, diversification, volatility, compounding, fees, nomination, leverage',
        b2: 'Simple language, everyday analogies, quick checks',
      },
      d: {
        tag: 'Track D',
        small: 'Behaviour',
        heading: 'Pause and reflect',
        b1: 'Eight cooling-off questions',
        b2: 'Neutral pattern observations — no score, no ranking',
      },
      you: {
        tag: 'You',
        small: 'the decision',
        heading: 'You make your own decision',
        b1: 'Nothing is bought or sold here',
        b2: 'If something already went wrong → Track A recovery + Track B rights and grievance',
      },
    },
    never: {
      n1: 'Recommend stocks, mutual funds or securities',
      n2: 'Tell you to buy, sell or hold',
      n3: 'Predict prices or give trading signals',
      n4: 'Promote any financial product',
      n5: 'Provide personalised investment advice',
      n6: 'Ask for OTP, passwords or PINs',
      n7: 'Access SMS, bank or Demat accounts',
      n8: 'Require login, payment or any API',
    },
  },

  /* ---------------------------------------------------------------- LEARN */
  learn: {
    eyebrow: 'Track C · Investor education for Bharat',
    title: 'Learn',
    lede:
      'Financial concepts in plain language — with everyday analogies, examples, common misunderstandings and a quick check. No recommendations, ever.',
    modulesAvailableCount: '{{done}} of {{total}}',
    modulesAvailableSuffix: 'modules available',
    modulesNav: 'Learning modules',
    languageLabel: 'Content language',
    sideNotice:
      'Learning a concept does not tell you what to do with it. The decision stays with you.',
    noticeNotRecommendation:
      'This is an explanation of a concept. It is not a recommendation to buy, sell or hold anything.',
    sections: {
      concept: 'Concept',
      simple: 'Simple explanation',
      analogy: 'Everyday analogy',
      example: 'Example',
      misunderstanding: 'Common misunderstanding',
    },
    quiz: {
      title: 'Quick understanding check',
      correct: 'Correct.',
      notQuite: 'Not quite.',
      tryAgain: 'Try again',
    },
    relatedSignals: {
      title: 'Related warning signals',
      body: 'When you check a message, watch for these signals alongside the concept you just learned.',
      checkMessage: 'Check a message',
    },
    modules: {
      nav: {
        title: 'NAV',
        subtitle: 'Net Asset Value — what one unit is worth',
        concept: 'Net Asset Value (NAV)',
        simple:
          'NAV is the price of one unit of a mutual fund. It is calculated by taking the total value of everything the fund holds, subtracting what it owes, and dividing by the number of units. It is normally published once each working day.',
        analogy:
          'Think of a shared pot of sweets. Someone counts the total sweets, removes what is owed to others, then divides the rest by the number of people sharing. Each person\u2019s share is like the NAV.',
        example:
          'A fund holds assets worth ₹1,00,00,000 and owes ₹20,00,000. It has 8,00,000 units. (₹1,00,00,000 − ₹20,00,000) ÷ 8,00,000 = ₹10 per unit.',
        misunderstanding:
          'Many people believe a low NAV means a fund is "cheap" and a high NAV means it is "expensive". A NAV of ₹10 and a NAV of ₹500 do not tell you which fund will perform better. What matters is what the fund owns and how it has behaved over time.',
        quiz: {
          question:
            'A fund\u2019s NAV is ₹10 today. Does that mean it is a better bargain than a fund priced at ₹400?',
          options: [
            'Yes — lower NAV always means better value.',
            'No — NAV alone does not show quality or future returns.',
            'Yes — because you get more units for the same money.',
          ],
          explanation:
            'You receive more units at ₹10, but the number of units does not change the total value you own. NAV shows the price per unit, not whether the fund is good value or likely to grow.',
        },
      },
      risk: {
        title: 'Risk',
        subtitle: 'The chance that things do not go as expected',
        concept: 'Risk',
        simple:
          'Risk is the possibility that the value of your investment falls, or that you get back less than you put in. Every investment carries some risk. The important question is not "is there risk?" but "what kind of risk, and am I comfortable with it?"',
        analogy:
          'Carrying an umbrella is not risky in itself — the risk is getting rained on, or getting too hot. Different umbrellas handle different weather. Investments handle different kinds of risk.',
        example:
          'A person invests money needed for a medical bill next month. If the market falls in that month, the money may not be there when needed. The risk here was not only market movement, but using money with a very short deadline.',
        misunderstanding:
          'Many people think "risk" only means losing money in the stock market. Risk also includes not keeping up with inflation, needing money at the wrong time, or relying on a single source of income.',
        quiz: {
          question: 'Which of these is also a form of risk?',
          options: [
            'Putting all money into one scheme.',
            'Spreading money across different assets.',
            'Writing down your investment goals first.',
          ],
          explanation:
            'Putting everything into a single scheme means one failure can affect everything. Spreading money and writing down goals are both ways of reducing risk, not forms of risk.',
        },
      },
      diversification: {
        title: 'Diversification',
        subtitle: 'Not putting everything in one place',
        concept: 'Diversification',
        simple:
          'Diversification means spreading your money across different assets, sectors or instruments so that a problem in one area does not affect your entire savings. It reduces the impact of any single thing going wrong.',
        analogy:
          'If you carry all your eggs in one basket and trip, everything breaks. If they are in two baskets, a fall costs you less. Spreading money works the same way.',
        example:
          'A person puts their entire savings into shares of one company. If that company reports a problem, the whole savings can fall sharply at once. Spreading across different types of assets limits how much any single event can affect them.',
        misunderstanding:
          'Diversification does not mean buying the largest possible number of things. Owning twenty funds that all hold the same shares is not really diversification — what matters is whether the underlying exposures are genuinely different.',
        quiz: {
          question:
            'Someone owns five funds, but all five invest in the same large companies. Is that well diversified?',
          options: [
            'Yes — five funds is always enough.',
            'No — the underlying holdings may be almost identical.',
            'Yes — more funds always means less risk.',
          ],
          explanation:
            'Diversification depends on what you actually own, not how many products you hold. If the same companies appear across all five funds, a single downturn can still affect all of them together.',
        },
      },
      volatility: {
        title: 'Volatility',
        subtitle: 'How much and how fast values move',
        concept: 'Volatility',
        simple:
          'Volatility describes how much and how quickly an investment\u2019s value moves up and down. High volatility means large swings in a short time; low volatility means smaller, slower changes. Volatility is not the same as loss — it describes movement, not a final result.',
        analogy:
          'One road is smooth with gentle bends; another has sharp turns and steep climbs. Both get you somewhere, but the second journey feels much bumpier. Volatility is how bumpy the ride feels.',
        example:
          'Over a year, one fund moves between ₹95 and ₹105, while another moves between ₹70 and ₹130. The second fund is more volatile. If you need the money after three months, that swing may matter a great deal to you.',
        misunderstanding:
          'Many people assume volatility always means danger. For someone with a long time horizon and steady income, short-term swings may be manageable. For someone needing money soon, the same swings can be a real problem.',
        quiz: {
          question:
            'A fund falls sharply for two months, then rises again. Is it automatically a bad fund?',
          options: [
            'No — movement alone does not tell you the final outcome or quality.',
            'Yes — any fall means the fund is bad.',
            'Yes — volatility always leads to permanent loss.',
          ],
          explanation:
            'A two-month fall describes a period of movement, not a final result. Whether it matters to you depends on your time horizon and when you need the money.',
        },
      },
      compounding: {
        title: 'Compounding',
        subtitle: 'Earnings that themselves earn',
        concept: 'Compounding',
        simple:
          'Compounding means your earnings also start generating further earnings. Over long periods this effect grows quickly, because each period\u2019s returns are calculated on a larger base than the one before.',
        analogy:
          'A small snowball rolled downhill gathers snow, then rolls over more snow with a bigger surface. The ball keeps growing faster. Compounding works like that over time.',
        example:
          'Suppose an amount grows at 8% a year for 20 years. The early years add small amounts; later years add much more, because the growth is applied to a base that has already been growing.',
        misunderstanding:
          'Compounding is not magic, and it does not remove risk. It also does not work instantly. Two common errors are expecting quick results, and withdrawing early so the base never has time to grow.',
        quiz: {
          question: 'Which statement about compounding is correct?',
          options: [
            'It guarantees a fixed return every year.',
            'It describes earnings generating further earnings over time.',
            'It only applies to bank fixed deposits.',
          ],
          explanation:
            'Compounding is a description of how growth accumulates. It guarantees nothing about future returns, and it applies wherever returns are reinvested — not only to deposits.',
        },
      },
      fees: {
        title: 'Fees',
        subtitle: 'The cost of holding an investment',
        concept: 'Fees and charges',
        simple:
          'Investments carry costs — management fees, expense ratios, entry or exit charges, brokerage and taxes. These are deducted from your returns. Even a small annual percentage, applied year after year, reduces the final amount noticeably.',
        analogy:
          'A bucket with a small hole leaks a little each day. Very little seems to go at first; after a year the level is visibly lower. Fees work like that slow leak.',
        example:
          'Two investments grow at the same gross rate. One charges 0.5% a year and the other 2% a year. Over fifteen years the difference in what you keep can be substantial — even though the underlying performance was identical.',
        misunderstanding:
          'Many people compare investments only by returns and ignore cost. Others assume a higher fee must mean better service. Fees should be checked directly and compared like-for-like, in writing.',
        quiz: {
          question: 'Two funds perform identically before costs. Which keeps more for you?',
          options: [
            'The one with the lower ongoing charge.',
            'The one advertised with the highest past return.',
            'Both keep exactly the same amount.',
          ],
          explanation:
            'With the same gross performance, the lower-cost option leaves more with you. Costs compound in reverse — they quietly reduce the base each year.',
        },
      },
      nomination: {
        title: 'Nomination',
        subtitle: 'Who receives your assets if something happens',
        concept: 'Nomination',
        simple:
          'A nomination names the person who receives your investment or bank balance if you are not there to claim it. It does not transfer ownership while you are alive — it simplifies transfer after death. Keeping it updated matters as life changes.',
        analogy:
          'It is like writing instructions on a sealed envelope so the right person knows where to find it and what to do, without needing a court to decide.',
        example:
          'A person nominates a spouse for a bank account and demat holdings. If something happens, the nominee can approach the institution with the required documents instead of the matter going through a long legal process.',
        misunderstanding:
          'A nominee is not automatically the legal owner of the asset. The distinction between nomination and inheritance can matter, and the exact position depends on the asset type and applicable law. It is worth checking current rules rather than assuming.',
        quiz: {
          question: 'What is the main purpose of keeping a nominee updated?',
          options: [
            'To increase the return on the investment.',
            'To make transfer smoother for the right person if you cannot act.',
            'To avoid paying any fees on the account.',
          ],
          explanation:
            'Nomination exists to reduce friction at a difficult moment. It has no effect on returns, and it does not remove charges.',
        },
      },
      leverage: {
        title: 'Leverage',
        subtitle: 'Borrowing to amplify a position',
        concept: 'Leverage',
        simple:
          'Leverage means using borrowed money to take a larger position than your own capital allows. It magnifies gains AND losses equally. Small adverse moves can consume a large part of your capital, sometimes quickly.',
        analogy:
          'Standing on a tiptoe lets you reach a higher shelf, but any stumble drops you further. Levers raise your reach and raise your fall by the same amount.',
        example:
          'With leverage, a 5% adverse move against a position can wipe out a significant share of the money you put up — and if the move is larger, you can lose more than you started with, depending on the product and rules.',
        misunderstanding:
          'Many people see leverage as a shortcut to bigger profits without understanding that the same multiplier applies to losses. Borrowed or emergency money used for investing adds a second layer of risk, because that money has another purpose.',
        quiz: {
          question: 'Which statement about leverage is accurate?',
          options: [
            'It increases potential gains and potential losses by the same factor.',
            'It increases gains while limiting losses.',
            'It removes risk because the money is borrowed.',
          ],
          explanation:
            'Leverage is a multiplier, not a filter. The same factor that magnifies profit magnifies loss, and borrowed money still has to be repaid.',
        },
      },
    },
  },

  /* --------------------------------------------------------- CHECK CONTENT */
  checkContent: {
    eyebrow: 'Track E · Misinformation & financial content',
    title: 'Check Financial Content',
    lede:
      'Paste a message and see what it actually claims, what evidence it provides, what is missing, and what cannot be established. This is an evidence card — not a verdict.',
    linkedNotice: 'Coming from Learn: watch for \u201c{{title}}\u201d',
    inputTitle: 'Paste a message to analyse',
    inputSub: 'WhatsApp, Telegram, YouTube, social media or any financial message.',
    inputLabel: 'Content to analyse',
    placeholder:
      'Paste a WhatsApp message, Telegram message, YouTube claim, social media post or financial message here.',
    exampleMessages: 'Example messages',
    localOnly:
      'Everything runs locally in your browser. Nothing you paste is uploaded or stored on a server.',
    exampleLabel: 'Example:',
    exampleQuote:
      '\u201cSEBI registered expert. Guaranteed 25% monthly return. Join our private Telegram group. Only 10 slots left. Invest ₹20,000 today.\u201d',
    frameworkTitle:
      'Track A framework — Detect → Verify → Explain → Pause → Safe Action → Recovery',
    emptyTitle: 'Nothing to analyse yet.',
    emptyBodyPrefix: 'Paste a message above, or press',
    emptyBodySuffix: 'to load an example.',
    pauseTitle: 'PAUSE BEFORE YOU ACT',
    pauseBodyOne:
      'A warning signal was detected in this content. A warning signal is not proof of fraud — it is a reason to slow down and verify before doing anything.',
    pauseBodyMany:
      '{{count}} warning signals were detected in this content. A warning signal is not proof of fraud — it is a reason to slow down and verify before doing anything.',
    iLostMoney: 'I have already lost money',
    hideRecoveryHelp: 'Hide recovery help',
    lostMoneyTitle: 'If you have already lost money',
    lostMoneyBody:
      'Acting quickly and keeping evidence matters more than anything else right now. Recovery is never guaranteed, and no one can promise to return your money — be wary of anyone who does.',
    openRecovery: 'Open Scam Recovery Assistant',
    rightsGrievance: 'Rights & grievance',
    safeActionTitle: 'Safe Action',
    safeActionDesc:
      'Steps that are safe regardless of whether this content turns out to be legitimate.',
    safeActions: {
      a1: 'Do not send money immediately.',
      a2: 'Do not share OTP, password or PIN with anyone, for any reason.',
      a3: 'Independently verify identity and registration claims using official sources you find yourself.',
      a4: 'Preserve screenshots and transaction evidence before you act or block.',
      a5: 'Use the appropriate official reporting or grievance route if necessary.',
    },
    trackCTitle: 'Track C — understand the concept',
    trackCDesc:
      'Based on what this message is about, this is the concept worth understanding first.',
    allModules: 'All learning modules',
    coolingOff: 'Cooling-off questions',
    nextTitle: 'Where to go next',
    nextTrackD: {
      title: 'Track D — Pause before you decide',
      sub: 'Eight cooling-off questions before any money moves.',
    },
    nextDecisions: {
      title: 'My Decisions — decision journal',
      sub: 'Record what you considered, why, and what would change your mind.',
    },
    nextTrackB: {
      title: 'Track B — Rights & grievance',
      sub: 'Understand, document, draft and route a complaint correctly.',
    },
    demoTitles: {
      'demo-1': 'Telegram investment offer',
      'demo-2': 'Forwarded WhatsApp message',
      'demo-3': 'Recovery offer after a loss',
      'demo-4': 'Plain educational content',
    },
    steps: {
      detect: 'Detect',
      verify: 'Verify',
      explain: 'Explain',
      pause: 'Pause',
      safeAction: 'Safe Action',
      recovery: 'Recovery',
    },

  /* ------------------------------------------------- INPUT MODES (E: new) */
    modes: {
      label: 'Choose how to add content',
      paste: 'Paste Message',
      screenshot: 'Upload Screenshot',
      link: 'Analyze Link',
      pasteHint:
        'Paste the message, post or article text into the box below, then press Analyze Content.',
    },

    ocr: {
      heading: 'Upload a screenshot',
      hint: 'JPG, JPEG, PNG or WEBP. The image is read on this device and is never uploaded anywhere.',
      choose: 'Choose image',
      replace: 'Choose a different image',
      remove: 'Remove image',
      previewAlt: 'Preview of the image you selected',
      reading: 'Reading the image… {{percent}}%',
      readingNote:
        'The first use may download the text-reading model for your language, which can take a moment.',
      reviewTitle: 'Text read from your screenshot',
      reviewBody:
        'Please check and correct the text below before analysing it — automatic reading can make mistakes.',
      emptyTitle: 'No readable text found',
      emptyBody:
        'We could not read any text in this image. Try a clearer screenshot, or paste the message instead.',
      errorTitle: 'Could not read this image',
      errorBody:
        'Something went wrong while reading the image. Try another JPG, JPEG, PNG or WEBP image, or paste the message instead.',
      invalid: 'Please choose a JPG, JPEG, PNG or WEBP image smaller than 10 MB.',
    },

    link: {
      heading: 'Analyze a link',
      label: 'Web address (URL)',
      placeholder: 'https://example.com/article',
      fetch: 'Fetch content',
      fetching: 'Fetching the page…',
      invalid: 'Please enter a valid web address that starts with http:// or https://.',
      blocked:
        'We couldn\u2019t safely retrieve readable content from this link. Paste the text or upload a screenshot instead.',
      reviewTitle: 'Content read from the link',
      reviewBody: 'Review the text below, then press Analyze Content.',
      safetyNote:
        'A page that opens is not automatically safe. Reading a link may share its address with a public reading service — never enter personal, login or payment details on any page.',
    },

    source: {
      title: 'Analysis source',
      image: 'Text read from an uploaded screenshot',
      caveat:
        'The source is shown for transparency only — a source on its own never shows whether the content is trustworthy.',
    },
  },

  /* ----------------------------------------- FOUR-LEVEL ASSESSMENT (links) */
  assessment: {
    title: 'Overall assessment',
    positiveTitle: 'Positive evidence found',
    levels: {
      legit: {
        label: 'Likely legitimate',
        body:
          'The source appears legitimate based on the information we could verify. We did not identify major warning signals in the content reviewed.',
      },
      verify: {
        label: 'Needs verification',
        body:
          'The source or content could not be sufficiently verified, or important information is missing. This is not a finding of fraud \u2014 verify independently before you act.',
      },
      caution: {
        label: 'Caution',
        body:
          'Potentially misleading or manipulative signals are present, but the available evidence is insufficient to establish fraud. Slow down and verify before you act.',
      },
      warning: {
        label: 'Strong warning signals',
        body:
          'Multiple significant warning signals were found in the content reviewed. A warning signal is not proof of fraud \u2014 verify independently before you act.',
      },
    },
    positives: {
      'official-domain':
        'The address is on a recognised official domain ({{domain}}). Source legitimacy is evaluated separately from the claims made on the page.',
      'registration-reference':
        'A registration or licence reference is quoted, which can be checked against the regulator\u2019s public register.',
      'source-attribution': 'A named source or regulator is given for the claim.',
      'audited-figures': 'Audited figures or an auditor are referenced.',
      'risk-disclosure': 'A risk disclosure or past-performance caveat is present.',
      'supporting-material': 'Supporting material (documents, terms or links) is referenced.',
      'no-major-signals':
        'No high-severity warning signals were found in the content reviewed.',
    },
  },

  /* ------------------------------------------- SOURCE / URL INFORMATION */
  sourceInfo: {
    title: 'Source / URL:',
    domain: 'Domain',
    secureLabel: 'HTTPS',
    secureYes: 'Yes',
    secureNo: 'No',
    pageTitle: 'Page title',
    noTitle: 'not available',
    retrieved:
      'The content below was read from this page and analysed with the same rule-based checks as pasted text.',
    linkNote:
      'Domain, HTTPS and page title are facts about the address only. They do not show that the claims on this page are true or that an offer is legitimate.',
  },

  /* ---------------------------------------------------------- EVIDENCE CARD */
  evidence: {
    ariaLabel: 'Evidence card',
    title: 'Evidence Card',
    subtitle: 'What this content says, what it shows, and what cannot be established.',
    claim: 'Claim',
    matched: 'Matched:',
    contentType: 'Content type',
    evidenceProvided: 'Evidence provided',
    missingEvidence: 'Missing evidence',
    warningSignals: 'Warning signals ({{count}})',
    uncertainty: 'Uncertainty',
    intendedAction: 'What is this content trying to make you do?',
    independentVerification: 'Independent verification',
    evidenceEmpty:
      'The content does not provide supporting evidence such as documents, figures, sources or links.',
    noSignalsTitle: 'No common warning signals were matched.',
    noSignalsBody:
      'This does not confirm the content is safe. It only means these particular patterns were not found.',
    uncertaintyIntro: 'What cannot be established from this content:',
    verifyIntro:
      'Claims like these should be checked independently, using official sources you find yourself rather than any link or number supplied in the message.',
    importantTitle: 'Important:',
    importantBody:
      'a warning signal is not automatically proof of fraud. This card organises what the content does and does not show. The decision remains yours.',
    mixedTypeFallback: 'The content blends more than one of these purposes.',
  },

  /* ----------------------------------------------------------- CONTENT TYPES */
  contentTypes: {
    education: {
      label: 'Education',
      desc: 'The content primarily explains a concept or process.',
    },
    promotion: {
      label: 'Promotion',
      desc: 'The content primarily tries to get you to act, join, pay or register.',
    },
    opinion: {
      label: 'Opinion',
      desc: 'The content primarily expresses a personal view rather than verifiable fact.',
    },
    prediction: {
      label: 'Prediction',
      desc: 'The content primarily forecasts a future price, return or outcome.',
    },
    mixed: {
      label: 'Mixed',
      desc: 'The content blends more than one of these purposes.',
    },
  },

  /* ------------------------------------------------------- WARNING SIGNALS */
  signals: {
    'guaranteed-return': {
      label: 'Guaranteed return claim',
      why: 'The message presents an outcome as guaranteed. Investment outcomes normally involve uncertainty, so a guarantee is a warning signal worth verifying — on its own it is not proof of fraud.',
    },
    'high-return-claim': {
      label: 'Very high or unusually precise return claim',
      why: 'The message presents an unusually high or unusually precise short-term return. Returns of this size are uncommon and hard to sustain, so the figure should be independently checked against published records. Stating a large figure does not by itself prove the content is fraudulent.',
    },
    urgency: {
      label: 'Pressure to act immediately',
      why: 'The message pushes the reader to act fast. Urgency reduces the time available to verify a claim, which is a common pressure tactic in financial promotions.',
    },
    'limited-slots': {
      label: 'Limited slots or artificial scarcity',
      why: 'The message claims a small number of remaining places. Scarcity nudges people to decide before checking — it is a signal to slow down, not evidence of wrongdoing.',
    },
    'private-group': {
      label: 'Redirect to a private group or direct message',
      why: 'The message moves the conversation to a private channel. Private groups are harder to verify or report, and claims made there rarely leave a public record. Being directed to a private group does not by itself prove the content is fraudulent.',
    },
    'investment-request': {
      label: 'Direct request to invest or send money',
      why: 'The message asks for money to be committed or transferred. A request for payment before you have independently verified the offer is a significant warning signal. Many legitimate investments also ask for money, so asking for payment does not by itself prove the content is fraudulent.',
    },
    'registration-claim': {
      label: 'Regulatory registration or endorsement claim',
      why: 'The message asserts regulatory approval or registration. Such claims should be checked directly on the regulator\u2019s own public register, using details found there rather than details supplied by the sender. Many genuine firms make this claim, so claiming registration does not by itself prove the content is fraudulent.',
    },
    'social-proof': {
      label: 'Social proof or testimonial evidence',
      why: 'The message relies on other people\u2019s apparent success rather than verifiable data. Testimonials and member counts do not show that a result is repeatable for you.',
    },
    'get-rich-quick': {
      label: 'Get-rich-quick or secret-strategy language',
      why: 'The message promises large gains with little effort or knowledge. Wealth-building normally takes time, cost and risk — shortcut language is a recognised warning sign.',
    },
    'immediate-pressure': {
      label: 'Pressure to enrol or register right now',
      why: 'The message tells you to sign up without delay. Real opportunities normally allow time for questions, documents and independent checks.',
    },
    'recovery-pressure': {
      label: 'Money-recovery or refund pressure',
      why: 'The message offers to return or recover money. People who have already lost money are frequently targeted again — a second payment demand in this context needs particular care.',
    },
    'insider-tip': {
      label: 'Insider tip, secret or exclusive-tip language',
      why: 'The message presents information as secret or exclusive. Tips distributed to the public cannot normally be verified in advance, and acting on them carries significant risk.',
    },
    'unsolicited-buy-sell': {
      label: 'Unsolicited instruction to buy or sell',
      why: 'The message tells you to buy or sell without showing reasoning you can check. Direct trading instructions from an unverified source warrant independent verification.',
    },
    'payment-method': {
      label: 'Unusual or hard-to-trace payment method',
      why: 'The message suggests payment through channels that are difficult to reverse or trace. Payment method is a practical factor to check before sending money anywhere.',
    },
    impersonation: {
      label: 'Claim of official or celebrity authority',
      why: 'The message borrows authority from a regulator, bank, official or public figure. Identity claims should be confirmed through the organisation\u2019s own published channels.',
    },
    'forward-share': {
      label: 'Request to forward or mass-share',
      why: 'The message asks to be spread widely. Requests to forward financial claims make it harder to trace the original source and can amplify unverified information.',
    },
    'income-claim': {
      label: 'Specific income promise without mechanism',
      why: 'The message states an amount you can earn without explaining how the money is generated. An income figure without a transparent mechanism is hard to verify.',
    },
    'no-risk-disclosure': {
      label: 'No risk or loss disclosure present',
      why: 'The message discusses money but never mentions that values can fall or that loss is possible. Promotion without risk disclosure makes a balanced judgement harder — it is a gap to note, not proof of wrongdoing.',
    },
  },

  /* ------------------------------------------------ SIGNAL CATALOGUE (learn) */
  catalogue: {
    'guaranteed-return': {
      title: 'Guaranteed returns',
      detail: 'Real investment outcomes carry uncertainty. A promise of a fixed, certain result should be checked before you act.',
    },
    'high-return-claim': {
      title: 'Unusually high returns',
      detail: 'Very high short-term returns are difficult to sustain. Ask where the figure comes from and whether it is independently published.',
    },
    urgency: {
      title: 'Urgency',
      detail: 'Urgency reduces the time you have to verify. A genuine opportunity normally survives a pause.',
    },
    'limited-slots': {
      title: 'Limited slots',
      detail: 'Scarcity nudges you to act before checking. Treat it as a cue to slow down.',
    },
    'private-group': {
      title: 'Private group redirect',
      detail: 'Claims made in private groups leave little public record and are harder to verify or report.',
    },
    'investment-request': {
      title: 'Request to invest or pay',
      detail: 'A payment demand before verification is one of the most significant practical warning signals.',
    },
    'registration-claim': {
      title: 'Registration claim',
      detail: 'Verify registration on the regulator\u2019s own public register — reached by searching for it yourself.',
    },
    'social-proof': {
      title: 'Social proof',
      detail: 'Other people\u2019s apparent success does not show that a result is repeatable for you.',
    },
    'get-rich-quick': {
      title: 'Get-rich-quick language',
      detail: 'Shortcut language is a widely recognised warning sign in financial promotions.',
    },
    'immediate-pressure': {
      title: 'Pressure to enrol',
      detail: 'Legitimate offers normally allow time for questions, documents and independent checks.',
    },
    'recovery-pressure': {
      title: 'Money-recovery pressure',
      detail: 'People who have lost money are often targeted a second time. Treat any recovery fee demand with particular care.',
    },
    'insider-tip': {
      title: 'Secret or insider tip',
      detail: 'Tips distributed widely cannot be verified in advance.',
    },
    'unsolicited-buy-sell': {
      title: 'Buy / sell instruction',
      detail: 'An instruction you cannot check independently warrants verification before any action.',
    },
    'payment-method': {
      title: 'Hard-to-trace payment method',
      detail: 'How you are asked to pay is a practical factor to check before sending money.',
    },
    impersonation: {
      title: 'Authority claim',
      detail: 'Confirm identity through the organisation\u2019s own published channels, never through the message.',
    },
    'forward-share': {
      title: 'Forward request',
      detail: 'Forwarding makes the original source harder to trace and spreads unverified information.',
    },
    'income-claim': {
      title: 'Income figure without mechanism',
      detail: 'An income figure with no transparent explanation of how it is generated is hard to verify.',
    },
    'no-risk-disclosure': {
      title: 'No risk disclosure',
      detail: 'A promotion that never mentions the possibility of loss leaves out information you need.',
    },
  },

  /* ----------------------------------------------- ANALYSER OUTPUT SECTIONS */
  evidenceItems: {
    'registration-number': 'A registration or licence number is quoted.',
    cin: 'A CIN (company identification number) is quoted.',
    'sebi-reg-number': 'A SEBI registration number is quoted.',
    'audited-statements': 'Audited financial statements or an auditor are referenced.',
    'official-document': 'An official document (prospectus / fact sheet / KID) is referenced.',
    'risk-disclosure': 'A risk disclosure or past-performance caveat is present.',
    'terms-conditions': 'Terms, conditions or a disclosure document are referenced.',
    'web-link': 'A web link is included in the message.',
    'source-named': 'A source is named for the claim.',
    'regulator-named': 'A regulating body is named.',
    'scheme-document': 'A scheme or contract document is offered.',
    'scheme-identifier': 'A scheme identifier or code is quoted.',
  },

  missingEvidence: {
    'return-no-calculation':
      'No calculation, audited record or independent source is given for the claimed return.',
    'return-no-conditions': 'No statement of the conditions under which the return would apply.',
    'no-risk-mention': 'No mention of risk, downside or the possibility of losing money.',
    'registration-no-number':
      'A registration claim is made, but no registration number or verifiable identifier is supplied.',
    'no-terms': 'No contract, terms of service or refund/cancellation policy is provided.',
    'no-official-link': 'No link to an official register, filing or public record is included.',
    'no-audited-figures': 'No audited or independently published figures are cited.',
    'no-entity-details':
      'No identifiable entity details (sponsor, intermediary, registered address) are given.',
    'no-documentation': 'The message contains no supporting documentation of any kind.',
    'material-not-attached':
      'Some supporting material is referenced, but it is not attached or independently linked, so it cannot be checked from this message alone.',
  },

  uncertainty: {
    'sender-identity':
      'Whether the sender is who they claim to be cannot be established from this message.',
    'registration-genuine':
      'Whether the registration or endorsement claim is genuine cannot be confirmed from the text alone.',
    'returns-unverified':
      'Whether the stated returns were actually achieved, by whom, and over what period, is unknown.',
    'fees-conditions': 'What fees, lock-in periods or exit conditions apply is not shown here.',
    'personal-terms': 'Whether the same terms would apply to you personally is not stated.',
    'offer-availability':
      'Whether the offer is still available, and on exactly what terms, cannot be verified from this message.',
    'payment-outcome':
      'Whether payment would result in any investment, or simply in a transfer, is unknown.',
    'private-group-hidden':
      'What is said inside the private group cannot be assessed, because it is not visible here.',
  },

  intendedActions: {
    'send-money': 'Commit or send money before verification is complete.',
    'invest-on-message': 'Invest an amount on the strength of the message alone.',
    'join-private-group': 'Join a private group where claims are harder to check or report.',
    'decide-quickly': 'Decide quickly, leaving no time for independent verification.',
    'trust-on-claim': 'Trust a person or brand on the basis of their own claim.',
    'forward-message': 'Forward the message to other people.',
    'share-personal': 'Share personal or account information.',
    'make-contact': 'Make contact through a channel the sender controls.',
    'download-app': 'Download or install an application.',
    'register-account': 'Register an account or enrol in a programme.',
    'read-only': 'Read and consider the claim — no direct action is explicitly demanded in this text.',
  },

  safetyActions: {
    s1: 'Do not send money immediately. Give yourself time to verify first.',
    s2: 'Do not share OTP, password, PIN, card number or CVV with anyone — no genuine representative asks for these.',
    s3: 'Independently verify identity and registration claims using the regulator\u2019s own public register, reached by searching for it yourself rather than through any link in the message.',
    s4: 'Preserve screenshots, message headers, phone numbers, URLs and transaction details before you act or block.',
    s5: 'Use the appropriate official reporting or grievance route if you have already acted, or if you believe an offence has occurred.',
  },

  verify: {
    registration: {
      label: 'Registration or licence claims',
      detail:
        'Search for the regulator\u2019s official website yourself (for example SEBI, RBI, AMFI, IRDAI, exchanges) and look up the entity on its public register. Match the name, address and registration number shown there — not the details supplied in the message.',
    },
    returns: {
      label: 'Return or performance figures',
      detail:
        'Check audited factsheets, official filings or published scheme documents. A figure that appears only in the message, with no link to a published record, cannot be verified.',
    },
    sender: {
      label: 'Sender identity',
      detail:
        'Contact the organisation through a phone number or email address published on its own official website, not through the number or link contained in the message.',
    },
    terms: {
      label: 'Offer, scheme or contract terms',
      detail:
        'Ask for the written document, read the fees, lock-in, exit and refund conditions, and take time before signing or paying anything.',
    },
    moneySent: {
      label: 'Money already sent',
      detail:
        'Contact your bank or payment provider through official channels and use the appropriate grievance or reporting route. Acting quickly here matters.',
    },
  },

  /* -------------------------------------------------------- BEFORE I INVEST */
  beforeInvest: {
    eyebrow: 'Track D · Financial habits & behavioural resilience',
    title: 'Pause before you decide.',
    lede:
      'A cooling-off circuit breaker. Eight questions that take a few minutes — and often change how a decision feels. Nothing is scored, ranked or sent anywhere.',
    steps: {
      questions: 'Questions',
      reflection: 'Your reflection',
      nextStep: 'Next step',
    },
    formTitle: 'Pause before you decide',
    formIntro:
      'Answer honestly. Nothing is scored, ranked or sent anywhere — these answers stay on this device only.',
    submit: 'Show my reflection',
    questions: {
      why: {
        label: 'Why am I considering this?',
        hint: 'In your own words. There is no right answer.',
        placeholder: 'e.g. A friend mentioned it and it sounds interesting…',
      },
      lossRecovery: {
        label: 'Am I trying to recover a previous loss?',
        hint: 'It is common to want to win back what was lost.',
      },
      borrowed: {
        label: 'Am I using borrowed or emergency money?',
        hint: 'Money that has another job, or that must be repaid.',
      },
      horizon: {
        label: 'What is my time horizon?',
        hint: 'When might I need this money back?',
      },
      changed: {
        label: 'What changed my mind?',
        hint: 'What specifically made you start considering this now?',
        placeholder: 'e.g. a message, a video, a friend\u2019s result, a recent market move…',
      },
      risk: {
        label: 'What is the main risk I understand?',
        hint: 'State one risk in your own words.',
        placeholder: 'e.g. The value could fall and I might get back less…',
      },
      evidence: {
        label: 'What evidence supports this decision?',
        hint: 'Documents, data, official sources — not just someone\u2019s claim.',
        placeholder: 'Paste or describe the evidence you have actually seen…',
      },
      reconsider: {
        label: 'What would make me reconsider?',
        hint: 'Deciding this now protects you later.',
        placeholder: 'e.g. If the returns cannot be verified from an official source…',
      },
    },
    options: {
      under6: 'Less than 6 months',
      sixMonthsTo3: '6 months – 3 years',
      threeTo7: '3 – 7 years',
      over7: 'More than 7 years',
      notSure: 'Not sure yet',
    },
    reflectionTitle: 'Your Reflection',
    reflectionIntro:
      'These are neutral observations about patterns in your answers — not a judgement, a score or a ranking.',
    noPatternsTitle: 'No particular patterns stood out in your answers.',
    noPatternsBody:
      'That does not mean the decision is right or wrong — only that these particular signals were not present. You still make the call.',
    recommendationsStrong: 'NiveshSaathi does not provide investment recommendations.',
    recommendationsBody:
      'These observations do not tell you what to do. They only reflect what you wrote.',
    answersTitle: 'Your answers, as you wrote them',
    nextStepTitle: 'Next step',
    nextStepBody:
      'Take your time. You can save this reflection, record it in your journal, or come back to it later.',
    saved: 'Saved to journal',
    saveToDecisions: 'Save to My Decisions',
    answerAgain: 'Answer again',
    openJournal: 'Open journal',
    savedNotice: 'Saved on this device only.',
    viewInDecisions: 'View it in My Decisions →',
    stillVerifyingTitle: 'Still verifying a message?',
    stillVerifyingBody: 'Run it through the evidence card before you act on it.',
    checkContentBtn: 'Check Content',
    lostMoneyTitle: 'Already lost money?',
    lostMoneyBody:
      'Recovery is never guaranteed, but acting quickly and preserving evidence matters.',
    openRecovery: 'Open recovery assistant',
    reflections: {
      'loss-chasing': {
        title: 'Recovering a previous loss',
        text: 'You indicated that you are trying to recover a previous loss. Consider taking additional time before making another financial decision.',
      },
      'borrowed-money': {
        title: 'Borrowed or emergency money',
        text: 'You indicated that borrowed or emergency money may be involved. This money likely has another purpose or a repayment date. It may be worth setting it aside from this decision entirely.',
      },
      'short-horizon': {
        title: 'Short time horizon',
        text: 'You indicated a time horizon of under six months. Short horizons generally leave less room to recover from a fall. You may want to compare this with options designed for short time periods.',
      },
      'no-horizon': {
        title: 'Time horizon not yet decided',
        text: 'You indicated that you are not sure when you would need this money. Deciding the time horizon first often makes the rest of the decision clearer.',
      },
      'no-evidence': {
        title: 'No evidence written down',
        text: 'You did not record supporting evidence. Writing down the specific sources you checked — and what they actually said — often changes how a decision feels.',
      },
      'social-source': {
        title: 'Evidence appears to be social',
        text: 'Your evidence appears to come from a person, message or channel rather than a document or official source. You may want to check the same claim against a published, independent record.',
      },
      'no-risk-stated': {
        title: 'No risk stated',
        text: 'You did not state a main risk. Naming at least one way this could go wrong is a useful check before any decision.',
      },
      'fomo-urgency': {
        title: 'Urgency or fear of missing out',
        text: 'Your answers suggest that timing pressure or others\u2019 participation may be influencing this. Opportunities that are genuine normally remain available after a pause.',
      },
      'social-influence': {
        title: 'Social influence',
        text: 'Other people appear to be part of what is shaping this decision. It is worth separating what they experienced from what applies to your own situation.',
      },
      'quick-gain': {
        title: 'Expectation of quick gains',
        text: 'Your answers suggest an expectation of rapid gains. Slower, less exciting outcomes are usually the ones that can be checked in advance.',
      },
      'no-reconsider-condition': {
        title: 'No reconsideration condition',
        text: 'You did not set a condition that would change your mind. Deciding in advance what would make you stop makes it easier to act on later.',
      },
    },
  },

  /* ----------------------------------------------------------- MY DECISIONS */
  decisions: {
    eyebrow: 'Track D · Reflect on your financial decisions',
    title: 'My Decisions',
    lede:
      'A decision journal. Write down what you are considering and why, what evidence you have, and what would make you reconsider. No score, no ranking — only your own record.',
    newEntry: 'New entry',
    untitledReflection: 'Reflection before deciding',
    newEntryTitle: 'New decision entry',
    newEntryIntro:
      'Write honestly. This stays in your browser and can be deleted at any time.',
    saveEntry: 'Save entry',
    requiredError: 'Please write what you are considering before saving.',
    emptyTitle: 'No entries yet.',
    emptyBody:
      'Write down what you are considering, why, and what would make you reconsider. Journaling before a decision makes it easier to review afterwards.',
    createFirst: 'Create your first entry',
    supportStrong: 'No ranking, no score, no advice.',
    supportBody:
      'This journal does not judge your entries or tell you whether a decision was good. It exists so you can compare what you thought beforehand with what actually happened.',
    coolingOff: 'Cooling-off questions',
    checkMessage: 'Check a message',
    learnConcept: 'Learn a concept',
    fields: {
      title: {
        label: 'What am I considering?',
        placeholder: 'e.g. Moving a portion of my savings into…',
      },
      why: { label: 'Why?', placeholder: 'Your reasoning, in your own words…' },
      horizon: { label: 'Time horizon', placeholder: 'e.g. 5 years, or "not sure yet"' },
      risk: {
        label: 'Main risk I understand',
        placeholder: 'One risk you can name clearly…',
      },
      evidence: {
        label: 'Evidence / source',
        placeholder: 'What you actually checked — documents, official sources, data…',
      },
      reconsider: {
        label: 'What would make me reconsider?',
        placeholder: 'Decide this now, while you are calm…',
      },
    },
    confidence: {
      label: 'Confidence',
      hint: 'Optional. This is recorded as a note, not as a score.',
      prefix: 'Confidence:',
      veryLow: 'Very low',
      low: 'Low',
      uncertain: 'Uncertain',
      fairlyHigh: 'Fairly high',
      high: 'High',
    },
    rows: {
      why: 'Why',
      horizon: 'Time horizon',
      risk: 'Main risk I understand',
      evidence: 'Evidence / source',
      reconsider: 'What would make me reconsider',
    },
    deleteLabel: 'Delete entry {{title}}',
  },

  /* ------------------------------------------------------ I HAVE A PROBLEM */
  problem: {
    eyebrow: 'Track B · Investor rights & grievance',
    title: 'Investor Rights & Grievance Assistant',
    lede:
      'A guided way to turn a problem into a documented complaint on the correct route. This prepares a draft for you — it does not submit anything on your behalf.',
    tablist: 'Section',
    tabs: {
      complaint: 'Complaint assistant',
      nominee: 'Nominee & family wealth',
      iepf: 'IEPF recovery',
    },
    flowSteps: {
      understand: 'Understand',
      document: 'Document',
      draft: 'Draft',
      route: 'Correct route',
      track: 'Track',
      nextStep: 'Next step',
    },
    categories: {
      unauthorized: {
        label: 'Unauthorized transaction',
        routes: [
          'Your bank or card issuer (for the debit)',
          'The regulated entity that holds the account',
          'Cyber crime portal for a financial fraud',
        ],
        docs: [
          'Transaction reference number and date',
          'Account or card last four digits',
          'Statement showing the debit',
          'SMS / email alert you received',
        ],
      },
      broker: {
        label: 'Broker / intermediary issue',
        routes: [
          'The broker\u2019s grievance / compliance officer',
          'The exchange investor grievances cell (if the broker is a member)',
          'SEBI SCORES for a market intermediary grievance',
        ],
        docs: [
          'Client ID and contract notes',
          'Order and trade confirmation',
          'Ledger or statement extract',
          'Your earlier complaint reference, if any',
        ],
      },
      fraud: {
        label: 'Fraud / scam',
        routes: [
          'National cyber crime portal (1930 helpline for financial fraud)',
          'Your bank / payment provider immediately',
          'Local police for an FIR, if applicable',
        ],
        docs: [
          'Screenshots of the conversation',
          'Payment reference numbers and UPI IDs',
          'Phone numbers, URLs and profile names',
          'Bank statement showing the transfer',
        ],
      },
      wronginfo: {
        label: 'Wrong information',
        routes: [
          'The entity\u2019s grievance officer',
          'The relevant ombudsman scheme, if applicable',
        ],
        docs: [
          'What was shown vs. what is correct',
          'Screenshots with dates',
          'Account or policy reference',
          'Your request for correction, sent in writing',
        ],
      },
      nomination: {
        label: 'Nomination issue',
        routes: [
          'The entity holding the asset (bank, depository participant, registrar)',
          'The relevant grievance redressal mechanism if unresolved',
        ],
        docs: [
          'Nomination form and acknowledgement',
          'Account or folio details',
          'Death certificate (where applicable)',
          'Identity and relationship proof',
        ],
      },
      iepf: {
        label: 'IEPF-related issue',
        routes: [
          'The company / registrar claiming the shares or amount',
          'IEPF Authority through the prescribed process',
          'Investor grievances cell of the relevant exchange',
        ],
        docs: [
          'Folio / demat details',
          'PAN and identity documents',
          'Shareholding and transmission records',
          'Details of dividends or shares transferred',
        ],
      },
      other: {
        label: 'Other investor grievance',
        routes: [
          'The entity\u2019s grievance / compliance officer first',
          'The applicable ombudsman or regulator portal if unresolved',
        ],
        docs: [
          'A clear timeline of what happened',
          'Reference numbers of the account',
          'All correspondence with the entity',
          'What outcome you are seeking',
        ],
      },
    },
    genericRoutes: [
      'The entity\u2019s grievance / compliance officer',
      'The applicable ombudsman or regulator portal if unresolved',
    ],
    genericDocs: [
      'Statement or ledger extract',
      'Reference numbers',
      'Screenshots with dates',
      'Correspondence with the entity',
      'What outcome you are seeking',
    ],
    step0: {
      title: 'What happened?',
      intro:
        'Describe the matter in your own words. This stays on your device and is only used to build your draft.',
      whatLabel: 'What happened?',
      whatPlaceholder:
        'Describe the issue — what you did, what you expected, and what actually happened…',
      categoryLabel: 'Choose the category',
      dateLabel: 'Date / period',
      datePlaceholder: 'e.g. 14 Sept 2026',
      entityLabel: 'Entity involved',
      entityPlaceholder: 'e.g. broker, bank, fund house, app',
      continueBtn: 'Continue to documentation',
    },
    step1: {
      title: 'Document your case',
      introWithCat:
        'For a {{category}} complaint, these documents are usually relevant:',
      introGeneric:
        'Tick what you already have. A complete file makes a complaint much easier to resolve.',
      back: 'Back',
      generate: 'Generate draft',
      readyLabel: 'ready',
    },
    step2: {
      title: 'Complaint draft',
      warningStrong:
        'This is a draft template. Verify the appropriate official route before submitting.',
      warningBody:
        'NiveshSaathi does not file complaints and has not contacted anyone on your behalf.',
      draftLabel: 'Generated draft',
      copyDraft: 'Copy draft',
      chooseRoute: 'Choose the correct route',
      back: 'Back',
    },
    step4: {
      title: 'Correct official route',
      intro:
        'Start with the entity that caused the problem — most schemes require you to approach the grievance officer first. Escalate only if it is not resolved.',
      warning:
        'Schemes, portals and timelines change. Before submitting, confirm the current route by visiting the regulator\u2019s or ombudsman\u2019s official website yourself — do not use a link from a message.',
      backToDraft: 'Back to draft',
      nextStep: 'Next step',
    },
    step5: {
      title: 'Track & next step',
      intro:
        'Keep one place where you record every follow-up. Complaints are resolved faster when you can quote your own reference numbers.',
      nextStepStrong: 'Next step:',
      nextStepBody:
        'submit the draft through the route you confirmed, keep the acknowledgement, and diarise a follow-up date. If money was lost to fraud, also use the recovery flow.',
      openRecovery: 'Open recovery assistant',
      back: 'Back',
      doneLabel: 'done',
      trackItems: {
        t1: { title: 'Save your acknowledgement / reference number', note: 'Quote it in every follow-up.' },
        t2: { title: 'Diary the date you submitted', note: 'Response timelines usually run from this date.' },
        t3: { title: 'Set a follow-up reminder', note: 'Chase politely if the timeline passes.' },
        t4: { title: 'Escalate only after the first stage', note: 'Keep a copy of the earlier complaint.' },
        t5: { title: 'Record every call and email', note: 'Date, name of the person, and what was said.' },
      },
    },
    draft: {
      heading: 'COMPLAINT DRAFT',
      to: 'To: Grievance Officer, {{entity}}',
      subject: 'Subject: {{category}} — {{what}}',
      subjectGeneric: 'Subject: {{category}} — {{what}}',
      salutation: 'Respected Sir / Madam,',
      opener: 'I wish to register a complaint regarding the following matter.',
      s1: '1. WHAT HAPPENED',
      s1Placeholder: '[describe what happened, in your own words]',
      s2: '2. RELEVANT DETAILS',
      dateLine: 'Date of incident / transaction: {{value}}',
      dateLinePlaceholder: 'Date of incident / transaction: [add date]',
      entityLine: 'Entity / intermediary involved: {{value}}',
      entityLinePlaceholder: 'Entity / intermediary involved: [name]',
      entityFallback: '[name]',
      categoryLine: 'Category: {{value}}',
      categoryLinePlaceholder: 'Category: [category]',
      categoryFallback: '[category]',
      s3: '3. DOCUMENTS ENCLOSED',
      s3Placeholder: '   [list the documents you are enclosing]',
      s4: '4. OUTCOME SOUGHT',
      s4Placeholder: '[what resolution are you seeking]',
      request:
        'I request you to look into this matter and provide a resolution within the timelines\napplicable to grievance redressal. I am available to provide any further information\nthat may be required.',
      yours: 'Yours faithfully,',
      name: '[Your name]',
      contact: '[Contact number]',
      address: '[Address]',
      footer:
        'This is a draft template. Verify the appropriate official route\nbefore submitting. Nothing has been sent on your behalf.',
      subjectFallbackCategory: 'Investor grievance',
      subjectFallbackWhat: '[short description]',
    },
    nominee: {
      title: 'Nominee & Family Wealth',
      sub: 'An educational checklist — confirm current rules with the institution that holds the asset.',
      notice:
        'A nomination directs who receives an asset when the holder cannot claim it. It is not the same as inheritance, and the exact position depends on the asset and applicable law. This tool does not submit any form.',
      doneLabel: 'checked',
      items: {
        n1: { title: 'Bank accounts', note: 'Check whether a nominee is recorded, and that it is current.' },
        n2: { title: 'Demat / share holdings', note: 'Nomination is recorded through the depository participant.' },
        n3: { title: 'Mutual fund folios', note: 'Each folio carries its own nomination record.' },
        n4: { title: 'Insurance policies', note: 'Confirm the nominee and the relationship recorded.' },
        n5: { title: 'PPF / small savings accounts', note: 'Check the nomination entry with the holding institution.' },
        n6: { title: 'Property and documents', note: 'Will, property records and where documents are kept.' },
        n7: { title: 'Digital accounts and subscriptions', note: 'Family should know what exists and how to access it.' },
        n8: { title: 'Update after life events', note: 'Marriage, birth, death or a change in circumstances.' },
        n9: { title: 'Tell someone you trust', note: 'A nomination only helps if a survivor knows to claim it.' },
      },
      infoTitle: 'Information typically required',
      infoList: [
        'Identity of the holder and the nominee',
        'Relationship between them',
        'Account, folio or policy reference',
        'The institution\u2019s own nomination form',
        'Signature or verification as that institution specifies',
      ],
      processTitle: 'Process & tracking',
      processList: [
        'Inventory where nominations exist and where they are missing.',
        'Ask each institution for its current nomination form.',
        'Submit and obtain a written acknowledgement.',
        'Re-verify after any life event or change of details.',
        'Tell a trusted person where the records are kept.',
      ],
    },
    iepf: {
      title: 'IEPF Recovery Assistant',
      sub: 'Educational guidance on preparing a claim. No government form is submitted from here.',
      noticeStrong: 'Recovery is never guaranteed.',
      noticeBody:
        'Some amounts or shares may be eligible for transfer to the Investor Education and Protection Fund (IEPF) after the applicable period. Eligibility, documents and process must be confirmed with the company or its registrar, and against the current official rules.',
      doneLabel: 'prepared',
      items: {
        i1: { title: 'Confirm whether the asset is actually transferable', note: 'Unpaid dividends or shares may be transferred to the IEPF after the applicable period.' },
        i2: { title: 'Identify the company and folio / demat details', note: 'Name, ISIN, folio number and the exact number of shares or amount.' },
        i3: { title: 'Gather identity documents', note: 'PAN, address proof and documents establishing your relationship to the holder.' },
        i4: { title: 'Gather holding proof', note: 'Share certificates, statements, dividend records or bank evidence of the original investment.' },
        i5: { title: 'Check the company\u2019s or RTA\u2019s claim process', note: 'Each company publishes the documents it accepts for an IEPF claim.' },
        i6: { title: 'Submit through the prescribed route', note: 'Follow the official form and process exactly; incomplete filings are returned.' },
        i7: { title: 'Keep the acknowledgement and reference number', note: 'This is what you quote when you follow up.' },
        i8: { title: 'Track status periodically', note: 'Check the status using your reference, and respond to any queries promptly.' },
      },
      docsTitle: 'Potentially relevant documents',
      docsList: [
        'PAN and address proof of the claimant',
        'Share certificates or demat statement',
        'Dividend warrants or bank credit records',
        'Documents showing relationship to the original holder',
        'Company / RTA claim form, completed as instructed',
      ],
      trackTitle: 'Tracking your claim',
      trackList: [
        'Record the acknowledgement number and submission date.',
        'Keep one folder with every document you sent.',
        'Check status using your reference at sensible intervals.',
        'Respond promptly to any query — delays can return the file.',
        'Never pay anyone a fee to \u201crelease\u201d your funds.',
      ],
      ifDefrauded: 'If you were defrauded',
      backToTop: 'Back to top',
    },
  },

  /* -------------------------------------------------------------- RECOVERY */
  recovery: {
    eyebrow: 'Track A + Track B · Recovery',
    title: 'Something went wrong?',
    lede:
      'A calm, ordered way through it. Nothing here promises that money will be recovered — no one can honestly promise that. What it does give you is a sequence that works.',
    fiveSteps: 'The five steps',
    nextStepBtn: 'Next: {{title}}',
    steps: {
      stop: 'Stop',
      preserve: 'Preserve evidence',
      report: 'Report',
      track: 'Track',
      nextStep: 'Next step',
    },
    doneLabel: 'gathered',
    evidenceTitle: 'Evidence checklist',
    evidenceIntro: 'Tick what you have gathered. Progress is saved on this device only.',
    cautionTitle: 'What we will not promise you',
    cautionList: [
      'We cannot promise your money will be recovered. Nobody honestly can.',
      'We cannot file a complaint for you or contact anyone on your behalf.',
      'We cannot access your bank, Demat, SMS or account details — and never will.',
    ],
    secondLossStrong: 'After a loss, watch for a second loss.',
    secondLossBody:
      'People who have lost money are often approached by \u201crecovery agents\u201d who ask for an advance fee. Genuine recovery never requires you to pay someone to release your own funds.',
    rightsTitle: 'Rights & grievance',
    rightsBody:
      'If an intermediary, broker or service provider is involved, build a documented complaint on the correct route.',
    rightsBtn: 'Open grievance assistant',
    recordTitle: 'Record what happened',
    recordBody:
      'Write it down while it is fresh — what you saw, what you believed, and what would make you reconsider next time.',
    recordBtn: 'Open decision journal',
    trackSteps: {
      stop: {
        title: 'STOP',
        tagline: 'Do not send anything more.',
        body: 'Cease contact with the person or platform immediately. Do not pay another fee, do not install anything they send, and do not share further details. If you are still on a call, end it.',
        actions: [
          'Stop all payments, including any "release" or "clearance" fee.',
          'Do not share OTP, password, PIN, card number or CVV.',
          'Do not install screen-sharing or remote-access apps they send you.',
          'Do not delete the conversation — it is evidence.',
        ],
      },
      preserve: {
        title: 'PRESERVE EVIDENCE',
        tagline: 'Before anything is deleted or expires.',
        body: 'Take screenshots and export what you can. Evidence that disappears quickly — disappearing messages, deleted profiles, short-lived links — is often the hardest to recover later.',
        actions: [
          'Screenshot full conversations, including dates and profile names.',
          'Save payment reference numbers and your bank statement extract.',
          'Record phone numbers, URLs and app or wallet identifiers.',
          'Back up the evidence somewhere other than the device you lost it on.',
        ],
      },
      report: {
        title: 'REPORT',
        tagline: 'Through the appropriate official route.',
        body: 'Report to your bank or payment provider first for anything involving money, then use the appropriate official reporting route. Acting quickly here matters most.',
        actions: [
          'Contact your bank / card issuer / payment provider to flag the debit.',
          'Use the national cyber crime reporting route for financial fraud.',
          'Report the account, number or profile to the platform it was on.',
          'File a complaint with the relevant grievance mechanism if an intermediary is involved.',
        ],
      },
      track: {
        title: 'TRACK',
        tagline: 'Keep one record of everything.',
        body: 'Complaints stall when reference numbers are lost. Keep a single sheet with every reference, date, name and outcome so you can quote it each time you follow up.',
        actions: [
          'Save every acknowledgement and reference number.',
          'Log the date, time and name of each person you spoke to.',
          'Set follow-up reminders against the stated response timelines.',
          'Escalate only after the earlier stage has had its full timeline.',
        ],
      },
      next: {
        title: 'NEXT STEP',
        tagline: 'Decide calmly what comes next.',
        body: 'Once the immediate steps are done, step back. No one can promise your money back — be extremely wary of anyone who says they can, especially if they ask for a fee to do it.',
        actions: [
          'Be sceptical of "recovery agents" who contact you afterwards.',
          'Never pay a fee to recover funds — a second loss often follows the first.',
          'Use the grievance assistant if an intermediary is involved.',
          'Record what happened in your decision journal while it is fresh.',
        ],
      },
    },
    evidenceItems: {
      'ev-screenshots': { title: 'Screenshots', note: 'Of the conversation, profile, page or app.' },
      'ev-txn': { title: 'Transaction details', note: 'Reference numbers, UTR, date, amount, recipient.' },
      'ev-phone': { title: 'Phone numbers', note: 'The numbers used to contact you, with country code.' },
      'ev-urls': { title: 'URLs', note: 'Links, websites and domain names you were sent.' },
      'ev-msgs': { title: 'Messages', note: 'Full text, including deleted or disappearing ones if saved.' },
      'ev-emails': { title: 'Emails', note: 'Headers and sender addresses, not just the body.' },
      'ev-payments': { title: 'Payment records', note: 'Bank statements, UPI or card entries showing the debit.' },
      'ev-accounts': { title: 'Account details relevant to the incident', note: 'Account or folio numbers involved — never credentials.' },
    },
  },

  /* ----------------------------------------------- AI-ASSISTED ANALYSIS */
  ai: {
    title: 'AI-Assisted Analysis',
    badgeRules: 'Detected by NiveshSaathi rules',
    badgeAi: 'AI interpretation',
    subtitle:
      'An AI-assisted interpretation that complements — never replaces — the rule-based analysis above.',
    loading: 'AI is analysing this content…',
    retry: 'Retry AI analysis',
    analyzeEntry: 'Analyze with AI',
    learnTitle: 'AI-assisted explanation',
    learnDesc:
      'Get a plain-language, everyday explanation of this module — educational only, never a recommendation.',
    learnButton: 'Explain with AI',
    problemButton: 'AI guidance',
    unavailableTitle:
      'AI analysis is temporarily unavailable. Your existing analysis is still available.',
    unavailableBody:
      'The rule-based results above were produced locally and are unaffected. You can retry the AI analysis in a moment.',
    summary: 'AI Summary',
    claimed: 'What is being claimed?',
    tryingToDo: 'What is this content trying to make you do?',
    warningSignals: 'AI warning signals',
    warningSignalsNote:
      'These are AI observations, separate from the rule-based warning signals above. A warning signal is not proof of fraud.',
    supportingEvidence: 'Supporting evidence',
    missingContext: 'Missing context',
    uncertainty: 'Uncertainty',
    verification: 'How to verify independently',
    safeNextSteps: 'Safe next steps',
    trackInsight: 'AI insight for this check',
    noWarningSignals:
      'The AI did not identify additional manipulation patterns.',
    emptyEvidence:
      'The content does not present supporting evidence.',
    emptyList: 'None identified.',
    /* Track B — rights & grievance */
    situationUnderstanding: 'Understanding your situation',
    relevantDocuments: 'Documents that may be relevant',
    grievanceDraft: 'Draft complaint — edit before sending',
    grievanceDraftNote:
      'This draft was built only from what you wrote. Check every detail and remove anything that does not match your case before sending it. NiveshSaathi does not confirm any law, deadline or official process for you.',
    nextStep: 'Your next step',
    copyDraft: 'Copy draft',
    /* Track C — education + voice */
    everydayExample: 'Everyday example',
    voice: {
      title: 'Listen to this explanation',
      desc:
        'Uses your device voice — free, private and offline. No audio is sent to NiveshSaathi or to the AI.',
      listen: 'Listen',
      pause: 'Pause',
      resume: 'Resume',
      stop: 'Stop',
      playing: 'Playing…',
      paused: 'Paused',
      unsupported:
        'Voice is not available in this browser. The explanation stays visible as text.',
      error: 'Voice could not start. The text explanation is still available.',
    },
    /* Track D — behavioural reflection */
    observedPatterns: 'Possible patterns',
    noPatterns: 'No strong pattern was visible in what you wrote.',
    whyItMayMatter: 'Why this may matter',
    reflectionQuestions: 'Questions to reflect on',
    coolingOff: 'Cooling-off suggestion',
    coolingOffButton: 'Start a cooling-off',
    saferProcess: 'A calmer decision process',
    disclaimerTitle: 'Important:',
    disclaimerBody:
      'this is an AI interpretation — not a fraud verdict, not an investment recommendation, and not a prediction. The rule-based analysis remains the foundation of this result, and the decision remains yours.',
    tracks: {
      A: 'Fraud warning check',
      B: 'Rights & grievance help',
      C: 'Financial education',
      D: 'Behavioural reflection',
      E: 'Claim & misinformation check',
    },
  },

  /* ---------------------------------------------------------------- FOOTER */
  footer: {
    strong: 'NiveshSaathi does not provide investment recommendations.',
    body: 'It does not tell you what to buy, sell or hold. It helps you understand, verify, pause and decide for yourself.',
    recovery: 'Recovery',
    grievance: 'Grievance',
    disclaimer:
      'Educational tool only. NiveshSaathi does not offer investment advice, tips or returns of any kind.',
  },

  /* -------------------------------------------------------- LANGUAGE PICKER */
  picker: {
    title: 'Choose your language',
    subtitle:
      'Select your preferred language. You can change it any time from the 🌐 Language menu in the header.',
    continueEnglish: 'Continue in English',
    close: 'Close',
    selectThis: 'Use this language',
  },
}
