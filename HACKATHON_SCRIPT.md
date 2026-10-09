# 🎤 ScamShield AI — Hackathon Presentation Script

> **IEEE VIT Bhopal Hackathon 2026 · Track 04.1**
> **Team D43M0N$ · 4-Person Presentation Script**
> **Total Time: ~10 minutes + Q&A**

---

## 👥 Speaker Roles

| Speaker | Name | Color Code | Primary Topics |
|---------|------|-----------|----------------|
| 🟦 **Speaker 1** | **Aastik Tripathi** | Blue | Opening, Problem, Architecture, Closing |
| 🟪 **Speaker 2** | **Palak Kalra** | Purple | NLP Engine, Hindi Demo, Language Support |
| 🟩 **Speaker 3** | **Yash Raj Kushwaha** | Green | Live Demo, UI/UX, Firebase, Full-Stack |
| 🟧 **Speaker 4** | **Mangal Nath Yadav** | Orange | QR/UPI Engine, Reverse Scam Demo, Benchmark |

---

## ⏱️ Timeline Overview

| Time | Section | Speaker |
|------|---------|---------|
| 0:00 - 1:30 | Hook + Problem Statement | 🟦 Aastik |
| 1:30 - 3:00 | Architecture + How It Works | 🟦 Aastik → 🟪 Palak |
| 3:00 - 5:30 | Live Demo (3 scans) | 🟩 Yash Raj |
| 5:30 - 7:30 | Engine Deep Dive | 🟪 Palak + 🟧 Mangal Nath |
| 7:30 - 8:30 | Benchmark Results | 🟧 Mangal Nath |
| 8:30 - 10:00 | Impact + Closing | 🟦 Aastik |
| 10:00+ | Q&A | All |

---

## 📜 THE SCRIPT

---

### SECTION 1: THE HOOK (0:00 - 1:30)
**🟦 Aastik (Speaker 1) — Standing center stage**

> *[Look at the audience directly. Speak slowly and clearly.]*

**Aastik:**
> "Good morning/afternoon, respected judges and fellow hackers.
>
> Let me start with a question.
>
> *[Pause for 2 seconds]*
>
> How many of you have received an SMS saying — 'Dear customer, your SBI account will be blocked in 24 hours. Update your KYC now'?
>
> *[Raise your hand to encourage audience]*
>
> Almost everyone.
>
> Now here's the scary part — In 2023, Indians lost **₹11,333 crore** to cyber fraud. That's ₹31 crore *every single day*. And 47% of these scams used fake links and UPI QR codes.
>
> The biggest problem? By the time a victim realizes it's a scam, the money is already gone. There is no 'undo' button in UPI.
>
> *[Pause]*
>
> That's exactly the problem we're solving today.
>
> We are **Team D43M0N$** — Aastik, Palak, Yash Raj, and Mangal Nath — from VIT Bhopal. And we've built **ScamShield AI** — a pre-click, Zero-Trust phishing and UPI fraud defense platform.
>
> The key word here is ***pre-click***. We don't wait for the scam to happen. We intercept it *before* the user clicks the link, *before* they enter their UPI PIN, and *before* a single rupee leaves their account."

---

### SECTION 2: THE PROBLEM (1:30 - 2:15)
**🟦 Aastik continues**

> "Our problem statement is **Track 04.1: 'The Scam That Almost Worked'**.
>
> Every cyber scam follows the same 4-stage pattern:
>
> *[Point to the screen if the PPT is showing, or count on fingers]*
>
> **Stage 1:** The victim gets an SMS from an unknown number.
>
> **Stage 2:** The message creates artificial panic — 'Your electricity will be cut tonight', 'Your account will be blocked in 24 hours'.
>
> **Stage 3:** The victim clicks a link that looks *exactly* like their bank's website — but it's a pixel-perfect clone on a fake domain.
>
> **Stage 4:** They enter their UPI PIN or OTP, and the money is transferred instantly to a mule account. *Irreversible.*
>
> ScamShield intercepts at **Stage 2 and 3** — before any damage happens."

---

### SECTION 3: ARCHITECTURE (2:15 - 3:00)
**🟦 Aastik → 🟪 Palak (Handoff)**

**Aastik:**
> "Now let me briefly explain how ScamShield works under the hood, before Yash gives you a live demo.
>
> ScamShield has **3 detection engines** running simultaneously:
>
> **Engine 1:** The **URL Analyzer** — checks if a website link is typosquatting, using suspicious domains, or impersonating a bank.
>
> **Engine 2:** The **NLP Engine** — Palak built this. It analyzes the *text* of SMS messages in English, Hindi, AND Hinglish. It detects urgency triggers, fear tactics, and authority impersonation.
>
> **Engine 3:** The **QR & UPI Inspector** — Mangal built this. It parses QR codes and detects the deadly 'reverse-charge' scam where a QR claims 'scan to receive money' but actually *debits* your account.
>
> All three engines feed into an **Omni Threat Scorer** that produces a unified risk score from 0 to 100.
>
> Now, Yash will show you all of this live."

---

### SECTION 4: LIVE DEMO — THE MAIN EVENT (3:00 - 5:30)
**🟩 Yash Raj (Speaker 3) — Takes over the laptop**

> *[Move to the laptop. Have the app already open at localhost:3000]*

**Yash Raj:**
> "Thank you, Aastik. Let me show you ScamShield in action. What you're seeing is our live application built with Next.js 15, React 19, TypeScript, and Firebase.
>
> I'm going to run 3 live scans right now — one for each engine."

---

#### Demo 1: Fake Bank Link (30 seconds)
> *[Click the first preset card: "Fake SBI Bank Clone"]*

**Yash Raj:**
> "**Demo 1: Fake Bank Link.**
>
> I'm clicking this preset — it simulates someone sending you the link `sbl-kyc-update.xyz`.
>
> Notice it says 'sbl' not 'sbi' — that's called **typosquatting**.
>
> *[Wait for results to load — point to the screen]*
>
> And look — ScamShield immediately flags it as **Critical Scam Detected** with a threat score of **90 out of 100**.
>
> It detected:
> - Brand impersonation — mimicking SBI
> - Suspicious .xyz domain
> - Phishing keywords like 'kyc' and 'update'
> - Newly registered domain
>
> All of this in under **2 seconds**, before the user even clicks the link."

---

#### Demo 2: Hindi Scam SMS (30 seconds)
> *[Click the second preset card: "Hindi Discom Bill SMS"]*

**Yash Raj:**
> "**Demo 2: Hindi Scam SMS.**
>
> This is a message in *pure Hindi Devanagari* — 'आपका बिजली बिल बकाया है, आज रात 9:30 बजे बिजली काट दी जाएगी.'
>
> This is the electricity bill disconnection scam — extremely common in India.
>
> *[Wait for results]*
>
> ScamShield's NLP Engine flags this as **Electricity Utility Scam** with a high urgency score.
>
> It detected: 'तुरंत' — urgency trigger, 'काट दी जाएगी' — fear tactic, and authority impersonation of the Electricity Department.
>
> **This works in Hindi, Hinglish, AND English.** Palak will explain the NLP engine in detail."

---

#### Demo 3: Reverse QR Scam (30 seconds)
> *[Click the third preset card: "Reverse UPI QR Trap"]*

**Yash Raj:**
> "**Demo 3: The Reverse QR Scam — this is the most dangerous one.**
>
> Someone sends you a QR code and says 'Scan this to receive ₹5,000 cashback'.
>
> But here's the truth that most Indians don't know: **In UPI, you NEVER scan a QR to receive money.** Scanning a QR always *debits* from your account.
>
> *[Wait for results]*
>
> ScamShield immediately catches this — '**CRITICAL REVERSE-QR SCAM**'. The transaction note says 'Receive Cashback' but the UPI intent will actually debit ₹5,000 from you.
>
> It also detects that the VPA is a personal account pretending to be 'SBI Refund Department'."

---

#### Show Safe Result (15 seconds)
> *[Click the fourth preset card: "Official Bank Alert"]*

**Yash Raj:**
> "And for contrast — when I scan the *real* SBI website `onlinesbi.sbi`, ScamShield shows **Verified Authentic** with a green checkmark. Score: 0%. It recognizes official domains.
>
> We also have scan history stored in Firebase, community stories, an attack simulator, and 5 beautiful themes — all fully responsive."

---

**Yash Raj:**
> "Now let me hand it over to Palak to explain how our NLP engine works under the hood."

---

### SECTION 5: NLP ENGINE DEEP DIVE (5:30 - 6:30)
**🟪 Palak (Speaker 2)**

**Palak:**
> "Thank you, Yash. The NLP Engine is what makes ScamShield unique for the Indian context.
>
> Most security tools only work with English text. But in India, scam messages come in **three languages** — English, Hindi in Devanagari script, and Hinglish — which is Hindi written in English letters.
>
> *[Example gesture]*
>
> For instance, a scammer might write 'aapka khata band ho jayega' — that's Hinglish. Or 'आपका खाता बंद कर दिया जाएगा' — that's Hindi.
>
> Our engine handles all three. Here's how:
>
> **Step 1: Language Detection** — We check for Devanagari Unicode characters. If found, it's Hindi. If we find romanized Hindi tokens like 'turant', 'jayega', 'bijli' — it's Hinglish.
>
> **Step 2: Urgency Scoring** — We have a dictionary of **30+ panic trigger words** across all 3 languages, each with weighted scores. 'Final warning' = 35 points. 'काट दी जाएगी' = 35 points.
>
> **Step 3: Authority Impersonation** — We detect if the message pretends to be from SBI, RBI, Electricity Board, TRAI, CBI, or India Post.
>
> **Step 4: Category Classification** — We classify each message into one of 7 scam types: KYC fraud, electricity scam, reverse UPI, digital arrest, job fraud, lottery bait, or legitimate notification.
>
> The final score combines urgency at 45% weight, impersonation at 45%, and trigger count at 10%.
>
> Now Mangal will explain the QR engine."

---

### SECTION 6: QR/UPI ENGINE + BENCHMARK (6:30 - 8:30)
**🟧 Mangal Nath (Speaker 4)**

**Mangal Nath:**
> "Thank you, Palak. I built the QR Code and UPI Intent Inspector.
>
> When you scan a QR code for payment, it actually contains a text string called a **UPI intent URI**. It looks like this:
>
> `upi://pay?pa=name@bank&pn=PayeeName&am=5000&tn=Payment`
>
> Our engine parses every parameter:
> - `pa` = payee's UPI address
> - `pn` = payee's display name
> - `am` = amount
> - `tn` = transaction note
>
> We check for **3 critical fraud patterns**:
>
> **Pattern 1: Reverse-Charge Scam** — If the note contains words like 'Refund', 'Cashback', 'Receive', or 'Prize' — it's a 100% scam. Because in UPI, scanning a QR always DEBITS money, never credits.
>
> **Pattern 2: VPA Masquerade** — If the name says 'Electricity Department' but the VPA ends in `@ybl` or `@paytm` — that's a personal account pretending to be a corporate one.
>
> **Pattern 3: Malware Links** — If the QR contains a URL ending in `.apk` — that's a direct malware download.
>
> We also support **QR image upload** — users can upload a photo of a QR code, and we decode it client-side using the jsQR library without sending the image to any server. This preserves privacy."

---

**🟧 Mangal Nath continues — Benchmark Results**

> "Now, for our benchmark evaluation.
>
> We built a dataset of **100 test samples** — 50 confirmed scams and 50 confirmed legitimate items. These cover URLs, SMS messages, and QR codes across English, Hindi, and Hinglish.
>
> Our results:
>
> | Metric | Score |
> |--------|-------|
> | **Accuracy** | **98%** |
> | **Precision** | **98%** |
> | **Recall** | **98%** |
> | **F1 Score** | **98%** |
>
> That means out of 100 tests, we correctly classified 98. We have near-zero false positives — we don't wrongly flag legitimate bank notifications as scams. And near-zero false negatives — we catch almost every scam.
>
> You can actually run this benchmark yourself in our app — there's a built-in benchmark runner that generates a live confusion matrix."

---

### SECTION 7: IMPACT & CLOSING (8:30 - 10:00)
**🟦 Aastik (Speaker 1) — Returns to center**

**Aastik:**
> "Thank you, team. Let me summarize what makes ScamShield AI special.
>
> *[Count on fingers]*
>
> **One** — We're **pre-click**, not post-theft. We stop scams before they happen, not after.
>
> **Two** — We're **multilingual**. We understand English, Hindi, and Hinglish — because scammers in India don't just speak English.
>
> **Three** — We detect **India-specific scams** that global tools miss — reverse UPI QR codes, electricity bill threats, digital arrest impersonation.
>
> **Four** — We're **98% accurate** on a 100-sample benchmark with a proper confusion matrix.
>
> **Five** — Everything runs **client-side and in real-time**. No external API calls. No data leaves the user's browser for QR decoding. Privacy first.
>
> *[Pause]*
>
> Our vision is simple: **Shift India's cyber defense from reactive to proactive.** No more ₹31 crore lost every day. No more grandmothers losing their savings to a fake SMS.
>
> If a tool like ScamShield was available on every Indian phone, we could prevent millions of scam incidents before the first click.
>
> We are Team D43M0N$ — and this is ScamShield AI.
>
> Thank you."

> *[All 4 members stand together. Small bow.]*

---

## ❓ Q&A PREPARATION — Predicted Judge Questions & Answers

### Q1: "How is this different from Google Safe Browsing?"
**Who answers: 🟦 Aastik**
> "Google Safe Browsing maintains a blacklist of known malicious URLs. Our approach is different — we use heuristic analysis to detect *new, never-seen-before* scam domains. When a scammer registers `sbl-kyc-update.xyz` today, Google's blacklist won't have it yet. But our URL analyzer instantly catches the typosquatting, suspicious TLD, and brand impersonation. We also analyze SMS text and QR codes — which Safe Browsing doesn't do at all."

### Q2: "Is this using Machine Learning or AI?"
**Who answers: 🟪 Palak**
> "Our current version uses a heuristic, rule-based approach — weighted keyword scoring with linguistic pattern matching. We chose this deliberately because: (1) it's explainable — we can tell users exactly WHY something is flagged, (2) it's fast — no model inference latency, (3) it works offline — no API calls needed. For future versions, we plan to add ML classification trained on actual scam SMS datasets."

### Q3: "What if a scammer doesn't use any of your keywords?"
**Who answers: 🟪 Palak**
> "Our detection isn't single-point. Even without urgency keywords, we check domain trust, TLD risk, SSL status, subdomain abuse, brand impersonation, and UPI payment anomalies. A scam link will still get flagged for its domain characteristics even if the accompanying message is clean. Our multi-vector approach means a scammer would need to bypass ALL engines simultaneously — which is extremely difficult."

### Q4: "How do you handle false positives? What if a real bank alert gets flagged?"
**Who answers: 🟧 Mangal Nath**
> "Great question. We have an explicit list of verified official domains — SBI, HDFC, ICICI, RBI, etc. When a URL matches an official domain, we give it a -50 point bonus, effectively clearing it. For messages, we check for legitimate transaction patterns like 'debited by INR' or 'credited by INR' without external links. Our benchmark shows less than 2% false positive rate."

### Q5: "How does the QR image upload work?"
**Who answers: 🟧 Mangal Nath**
> "When a user uploads a QR code image, we use the jsQR JavaScript library to decode it entirely in the browser. The image is drawn onto an HTML5 Canvas, and jsQR reads the pixel data to extract the encoded text. The image never leaves the user's device — no server upload. This is a deliberate privacy decision."

### Q6: "Why Firebase and not a traditional database?"
**Who answers: 🟩 Yash Raj**
> "Firebase Realtime Database gives us instant WebSocket-based synchronization. When a scan is saved, all connected devices see it immediately — no polling, no refresh. For a hackathon demo, it also means zero backend server setup. We also use Firebase Authentication for Google sign-in and Firebase Analytics for usage telemetry."

### Q7: "Can this be deployed as a mobile app?"
**Who answers: 🟩 Yash Raj**
> "Absolutely. Since we built it with Next.js and React, it's already a responsive Progressive Web App. Users can add it to their home screen on Android. For a native app, we could wrap it with React Native or Capacitor. The detection engines are pure TypeScript with zero native dependencies, so they port directly."

### Q8: "What's the Zero-Trust model you keep mentioning?"
**Who answers: 🟦 Aastik**
> "Zero-Trust is a cybersecurity principle: never trust, always verify. In our context, it means we treat EVERY incoming link, message, and QR code as potentially malicious by default. It must pass all our security checkpoints before we label it safe. This is the opposite of traditional approaches that only flag known-bad URLs."

### Q9: "How do you detect Hinglish specifically?"
**Who answers: 🟪 Palak**
> "We maintain a dictionary of romanized Hindi tokens — words like 'turant' (immediately), 'bijli' (electricity), 'jayega' (will happen), 'khata' (account). If the message contains these tokens but NOT Devanagari script, we classify it as Hinglish. This is important because many scam SMS in India use this mixed format."

### Q10: "What's your data pipeline? Where does the benchmark dataset come from?"
**Who answers: 🟧 Mangal Nath**
> "We manually curated 100 test samples based on real-world Indian scam patterns documented by the National Cyber Crime Portal, news reports, and actual phishing SMS shared by users. 50 are scam samples covering banking phishing, utility fraud, reverse UPI, digital arrest, and lottery baits. 50 are legitimate samples from official bank notifications, merchant QR codes, and government portals."

### Q11: "What about scams on WhatsApp or Instagram?"
**Who answers: 🟦 Aastik**
> "Our NLP engine works on any text — whether it comes from SMS, WhatsApp, Instagram DMs, or email. The user simply copies and pastes the suspicious message into ScamShield. For QR codes, they can screenshot and upload. In a future version, we could build a browser extension or share-intent handler for direct integration."

### Q12: "How is the risk score calculated exactly?"
**Who answers: 🟧 Mangal Nath**
> "Each engine produces its own score from 0-100. The Omni Threat Scorer combines them with weighted averages: Message analysis gets 40% weight, URL analysis gets 35%, and QR analysis gets 35%. The final score maps to tiers: 0-29 is SAFE, 30-64 is SUSPICIOUS, 65-100 is HIGH_RISK."

### Q13: "What happens if Firebase is down?"
**Who answers: 🟩 Yash Raj**
> "We built resilient fallbacks. If Firebase RTDB is unreachable, all data falls back to localStorage and in-memory cache. The detection engines run entirely locally — they don't depend on Firebase at all. Firebase is only used for history sync, social stories, and user profiles. The core scanning works fully offline."

### Q14: "Have you tested this with real users?"
**Who answers: 🟦 Aastik**
> "We've tested within our team and with family members — including parents and grandparents who are non-technical. The feedback was very positive, especially for the Hindi language support. Our grandparents were particularly surprised when ScamShield caught a real electricity bill scam SMS they had received. That real-world validation is what motivated us."

### Q15: "What would you build next if you had 3 more months?"
**Who answers: 🟦 Aastik**
> "Three priorities: (1) A Chrome browser extension that scans links in real-time as you browse. (2) ML-based classification trained on actual scam datasets from the NCCRP. (3) Integration with Gemini AI for explainable, conversational threat analysis — so users can ask 'Why is this link dangerous?' and get a plain-language answer."

---

## 🎯 Presentation Tips for Beginners

### Before the Presentation:
- [ ] Make sure the app is running at `localhost:3000`
- [ ] Test all 4 preset demos work correctly
- [ ] Have the app open in a maximized browser window
- [ ] Turn off notifications and close other apps
- [ ] Have the PPT as backup if live demo fails

### During the Presentation:
- **Stand up straight** and make eye contact with judges
- **Speak slowly** — beginners tend to rush. Take pauses
- **Point at the screen** when showing demo results
- When transitioning between speakers, **say their name**: "Now Palak will explain..."
- If a demo fails, say: "Let me show you the result from our documentation instead" (have screenshots ready)

### Body Language:
- Aastik: Stand center, be confident. You set the energy
- Palak: Stand to Aastik's left. Use hand gestures when explaining languages
- Yash Raj: Sit at the laptop for the demo, then stand for Q&A
- Mangal Nath: Stand to Aastik's right. Use the screen pointer for QR examples

### Common Mistakes to Avoid:
- ❌ Don't read from your phone or notes
- ❌ Don't say "umm" or "basically" — just pause instead
- ❌ Don't all talk at once during Q&A — decide who answers which topic
- ❌ Don't use jargon without explaining it first
- ❌ Don't apologize ("We're just beginners...") — own your work!

---

> **Remember: You built something that protects people. Be proud of it. 🛡️**
>
> Good luck, Team D43M0N$! 🚀
