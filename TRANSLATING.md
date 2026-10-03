# Translating NiveshSaathi

You are producing **one** language file for an Indian-language web app. This
document is the complete brief. Follow it exactly.

## Your task

- **Read** `src/i18n/languages/en.js` — this is the canonical dictionary
  (~815 leaf keys, ~73 KB). It is the single source of truth for structure.
- **Completely overwrite** `src/i18n/languages/<YOUR_LANGUAGE>.js`.
  That file currently contains a 4-line English stub. Replace the whole file.
- **Verify** with the audit (see below) and iterate until it reports **0
  problems for your language**.

## Hard rules

1. **Identical key structure.** Every key that exists in `en.js` must exist in
   your file, with the same nesting, in the same order. No keys added, none
   removed, none renamed. `en.js` has 815 leaf keys — your file must too.
2. **Identical array lengths.** If `en.js` has an array of 3 strings, yours has
   3 strings. The audit enforces this.
3. **Identical `{{placeholders}}`.** Where English has `Next: {{title}}` yours
   must contain `{{title}}` with the same spelling. The audit enforces this.
   Placeholder names are never translated.
4. **Numbers, IDs and `answerIndex` stay unchanged.** `answerIndex: 1` stays
   `1`. Dates, percentages, phone numbers, ₹ amounts, ISIN/folio examples,
   `1930`, `IEPF`, `SEBI` — untouched.
5. **Never reorder quiz options.** In `learn.modules.*.quiz.options`, the
   *n*-th string must stay the *n*-th string — only its words change. The quiz
   grades by array position (`answerIndex`), so reordering silently marks
   correct answers wrong. Translate in place, top to bottom.
6. **Valid JavaScript.** The file must be a valid ES module that Node can
   import. Prefer double quotes for strings containing apostrophes, so
   `'Don't'` never breaks the file. No trailing-comma errors, no stray
   backticks. Run the audit — it imports the file, so syntax errors surface.
7. **Never edit any other file.** Not `en.js`, not other languages, not the
   React source. If you believe there is a bug in `en.js`, report it in your
   final message instead of "fixing" it.
8. **No investment advice.** Never add, remove or soften the app's stance.
   Never introduce buy / sell / hold / "guaranteed" promises. Never ask for
   OTP, password or PIN. The app always ends at *Understand → Verify → Pause →
   Decide Yourself* — keep that reinforcement.

## Style guide

You are writing for a **first-time investor in India** who may be reading this
language for the first time on a phone. Not for a translator's exam.

- **Natural over literal.** "मैच वैल्यू (NAV)" beats a word-for-word rendering
  nobody says. Rewrite sentence structure freely to sound like a person
  talking.
- **Financial term + explanation.** Keep the standard English term when Indian
  users will actually encounter it in a statement or app, then gloss it in the
  target language:
  - `Volatility (कीमतों में उतार-चढ़ाव)`
  - `NAV (कोष का शुद्ध मूल्य)`
  - `Nominee (नामांकित व्यक्ति)`
  - `Compounding (चक्रवृद्धि / ब्याज पर ब्याज)`
- **Official names stay recognisable.** `SEBI`, `RBI`, `SCORES`, `IEPF`,
  `Cyber Crime Portal`, `cybercrime.gov.in`, `1930` keep their English form;
  add a short regional gloss only where it genuinely helps. A user must be able
  to search for them.
- **Short lines.** These strings sit in cards, badges, tooltips and buttons on
  a 375 px screen. If the target language runs ~30 % longer than English,
  tighten it rather than blowing out the layout. Buttons especially.
- **Regional script only** in the body of each string — except the
  English-term-plus-explanation pattern above and official names.
- **Tone:** calm, respectful, non-judgemental, never alarmist. This is a
  companion, not a warning siren. Warnings state facts and options.
- **Fraud reporting copy must be clear, not panic-inducing.** Recovery strings
  (`recovery.*`) should lower the temperature: STOP → PRESERVE EVIDENCE →
  REPORT → TRACK → NEXT STEP.
- **Track C modules** (`learn.modules.*`) are the most demanding: each has
  `title`, `subtitle`, `concept`, `simple`, `analogy`, `example`,
  `misunderstanding`, and a `quiz` with `question`, 3 `options` and
  `explanation`. Keep the everyday analogy local and concrete — swap a foreign
  reference for an Indian one if the original would not land.
- Preserve the meaning of all 8 cooling-off questions in `beforeInvest` exactly;
  only the wording changes.

## What must NOT change

- No `if (language === 'hi')` style logic — this file is a flat dictionary.
- No HTML tags or `dangerouslySetInnerHTML` content. Some English strings were
  deliberately split (`modulesAvailableCount` / `modulesAvailableSuffix`,
  `emptyBodyPrefix` / `emptyBodySuffix`) — keep the split, just translate both
  halves.
- No commentary in the strings such as "(translator note)".

## Verify before you finish

```bash
node scripts/i18n-audit.mjs <YOUR_LANGUAGE>
```

The last two lines must look like:

```
<YOUR_LANGUAGE>: 815 keys | missing=0 extra=0 empty=0 placeholderMismatch=0 sameAsEnglish=N

OK - every dictionary matches English key-for-key.
```

`sameAsEnglish` > 0 is fine and expected for proper nouns and symbols — but
review that list mentally: if a whole sentence is identical to English, you
missed a translation.

Iterate until `missing`, `extra`, `empty` and `placeholderMismatch` are all `0`
and the final line says `OK`.

Optional but recommended once your file is clean:

```bash
node scripts/i18n-ssr-audit.mjs
```

It server-renders all 7 routes in all 13 languages. Other languages may still
be stubs while parallel work is in progress — ignore their lines; only ensure
your language's line shows `7 routes rendered` with no problems attributed to
it.

## Report back

In your final message state: the language code, the final audit line, the
`sameAsEnglish` count, and any English strings you thought were ambiguous or
needing review.
