"use client";

import React, { useState } from "react";
import { 
  Download, 
  ShieldCheck, 
  Lock, 
  Cpu, 
  PhoneCall, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle,
  BookOpen,
  Scale,
  FileText,
  FileCode,
  Layers,
  Activity,
  Users,
  HelpCircle,
  QrCode,
  Globe,
  Terminal,
  ShieldAlert,
  Radio
} from "lucide-react";
import { Language } from "@/lib/i18n";

interface DocumentationViewProps {
  language: Language;
  t: any;
}

export default function DocumentationView({ language, t }: DocumentationViewProps) {
  const [activeTabSection, setActiveTabSection] = useState<string>("all");

  const scrollToSection = (id: string) => {
    setActiveTabSection(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="surface-card rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-app-surface-subtle border border-app-border text-app-accent">
              IEEE Track 04 · Cybersecurity
            </span>
            <span className="text-xs font-mono text-app-muted">
              Team D43M0N$ Dossier
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-app-text mt-1.5 tracking-tight">
            {language === "hi" ? "स्कैमशील्ड एआई — संपूर्ण तकनीकी दस्तावेज" : "ScamShield AI — Complete Technical Documentation"}
          </h1>
          <p className="text-xs text-app-muted mt-0.5">
            Problem Statement 04.1: &quot;The Scam That Almost Worked&quot; · VIT Bhopal Hackathon 2026
          </p>
        </div>

        {/* Download Buttons */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto shrink-0">
          <a
            href="/FULL_DOCUMENTATION.pdf"
            download="ScamShield_AI_Full_Documentation.pdf"
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-app-accent hover:opacity-90 text-xs font-semibold text-white transition shadow-2xs"
            title="Download Official 13-Section PDF"
          >
            <Download className="h-3.5 w-3.5 text-white" />
            <span>Download PDF</span>
          </a>
          <a
            href="/FULL_DOCUMENTATION.md"
            download="ScamShield_AI_Full_Documentation.md"
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-app-surface hover:bg-app-surface-subtle border border-app-border text-xs font-semibold text-app-text transition shadow-2xs"
            title="Download Full Markdown Specification"
          >
            <FileCode className="h-3.5 w-3.5 text-emerald-500" />
            <span>Download .MD</span>
          </a>
          <a
            href="/DOCUMENTATION.docx"
            download="ScamShield_AI_Documentation.docx"
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-app-surface hover:bg-app-surface-subtle border border-app-border text-xs font-semibold text-app-text transition shadow-2xs"
            title="Download Word Document"
          >
            <FileText className="h-3.5 w-3.5 text-blue-500" />
            <span>.DOCX</span>
          </a>
        </div>
      </div>

      {/* Quick Jump Navigation Bar */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => scrollToSection("overview")}
          className="px-3 py-1.5 rounded-xl border border-app-border bg-app-surface hover:bg-app-surface-subtle font-medium text-app-secondary hover:text-app-text transition whitespace-nowrap"
        >
          1. Problem & Context
        </button>
        <button
          onClick={() => scrollToSection("architecture")}
          className="px-3 py-1.5 rounded-xl border border-app-border bg-app-surface hover:bg-app-surface-subtle font-medium text-app-secondary hover:text-app-text transition whitespace-nowrap"
        >
          2. Zero-Trust Architecture
        </button>
        <button
          onClick={() => scrollToSection("engines")}
          className="px-3 py-1.5 rounded-xl border border-app-border bg-app-surface hover:bg-app-surface-subtle font-medium text-app-secondary hover:text-app-text transition whitespace-nowrap"
        >
          3. 3 Detection Engines
        </button>
        <button
          onClick={() => scrollToSection("broadcast")}
          className="px-3 py-1.5 rounded-xl border border-app-border bg-app-surface hover:bg-app-surface-subtle font-medium text-amber-600 hover:text-amber-700 transition whitespace-nowrap flex items-center space-x-1"
        >
          <Radio className="h-3 w-3" />
          <span>4. Broadcast &amp; Live Stream</span>
        </button>
        <button
          onClick={() => scrollToSection("benchmark")}
          className="px-3 py-1.5 rounded-xl border border-app-border bg-app-surface hover:bg-app-surface-subtle font-medium text-app-secondary hover:text-app-text transition whitespace-nowrap"
        >
          5. 98% Benchmark
        </button>
        <button
          onClick={() => scrollToSection("legal")}
          className="px-3 py-1.5 rounded-xl border border-app-border bg-app-surface hover:bg-app-surface-subtle font-medium text-app-secondary hover:text-app-text transition whitespace-nowrap"
        >
          6. Legal &amp; Helplines
        </button>
        <button
          onClick={() => scrollToSection("techstack")}
          className="px-3 py-1.5 rounded-xl border border-app-border bg-app-surface hover:bg-app-surface-subtle font-medium text-app-secondary hover:text-app-text transition whitespace-nowrap"
        >
          7. Tech Stack &amp; Team
        </button>
        <button
          onClick={() => scrollToSection("glossary")}
          className="px-3 py-1.5 rounded-xl border border-app-border bg-app-surface hover:bg-app-surface-subtle font-medium text-app-secondary hover:text-app-text transition whitespace-nowrap"
        >
          8. Cyber Glossary
        </button>
      </div>

      {/* Main Documentation Body */}
      <div className="space-y-6">
        
        {/* SECTION 1: PROBLEM STATEMENT 04.1 & OVERVIEW */}
        <section id="overview" className="surface-card rounded-2xl p-6 sm:p-7 space-y-4 shadow-2xs scroll-mt-6 border border-app-border">
          <div className="flex items-center space-x-2 text-app-accent font-bold text-sm border-b border-app-border/80 pb-2.5">
            <BookOpen className="h-4 w-4 text-app-accent" />
            <h2>1. What is ScamShield AI? & Problem Statement 04.1 Context</h2>
          </div>
          <div className="text-xs text-app-secondary leading-relaxed space-y-4">
            <p>
              ScamShield AI is an autonomous, <strong>pre-click Zero-Trust cybersecurity platform</strong> engineered specifically for Indian digital citizens to intercept financial social engineering attacks before credentials, OTPs, or UPI transfers are compromised.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-app-surface-subtle border border-app-border space-y-1">
                <span className="font-bold text-app-text text-sm">₹11,333 Crore</span>
                <p className="text-[11px] text-app-muted">Lost to cyber fraud across India in 2023 (RBI Annual Report).</p>
              </div>
              <div className="p-3.5 rounded-xl bg-app-surface-subtle border border-app-border space-y-1">
                <span className="font-bold text-app-text text-sm">47% Attack Share</span>
                <p className="text-[11px] text-app-muted">Of financial scams exploit deceptive UPI QR codes or typosquatted links.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-app-surface-subtle border border-app-border space-y-1">
                <span className="font-bold text-app-text text-sm">&lt;2 Second Latency</span>
                <p className="text-[11px] text-app-muted">Autonomous client/edge forensic triage before user opens the link.</p>
              </div>
            </div>

            {/* 4-Stage Anatomy Table */}
            <div className="space-y-2 pt-1">
              <h3 className="font-bold text-app-text text-xs uppercase tracking-wide">
                IEEE Problem Statement 04.1: The 4-Stage Anatomy of Social Engineering
              </h3>
              <div className="overflow-x-auto rounded-xl border border-app-border">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-app-surface-subtle border-b border-app-border text-app-text font-bold">
                    <tr>
                      <th className="p-2.5">Stage</th>
                      <th className="p-2.5">Attacker Action</th>
                      <th className="p-2.5">Real-World Vector</th>
                      <th className="p-2.5 text-app-accent">ScamShield Intervention</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-app-border text-[11px]">
                    <tr>
                      <td className="p-2.5 font-bold text-app-text">1. Initial Contact</td>
                      <td className="p-2.5 text-app-muted">Target receives SMS, WhatsApp, or Telegram message from spoofed ID</td>
                      <td className="p-2.5">&quot;Dear SBI User, your YONO netbanking has been blocked due to missing PAN.&quot;</td>
                      <td className="p-2.5 text-emerald-600 font-semibold">Analyzed before opening link</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-app-text">2. Psychological Pressure</td>
                      <td className="p-2.5 text-app-muted">Engineered urgency, fear of financial loss, or electricity cutoff deadline</td>
                      <td className="p-2.5">&quot;Update KYC within 24 hours or ₹5,000 penalty. Electricity disconnects at 9:30 PM.&quot;</td>
                      <td className="p-2.5 text-emerald-600 font-semibold">Multilingual NLP flags panic triggers</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-rose-500">3. Credential Harvesting</td>
                      <td className="p-2.5 text-app-muted">Victim led to lookalike banking portal or reverse-charge UPI payment intent</td>
                      <td className="p-2.5"><code>http://sbl-kyc-update.xyz/login.php</code> or <code>upi://pay?pa=scam@ybl</code></td>
                      <td className="p-2.5 text-emerald-600 font-bold">BLOCKED: Homograph &amp; QR guard flags fraud</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-app-muted">4. Capital Extraction</td>
                      <td className="p-2.5 text-app-muted">Irreversible debit transfer via UPI PIN or OTP interception</td>
                      <td className="p-2.5">Victim authorizes ₹50,000 debit thinking it is a cashback/refund</td>
                      <td className="p-2.5 text-emerald-600 font-semibold">Never reached (Intercepted at Stage 2-3)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: ARCHITECTURE & ZERO-TRUST */}
        <section id="architecture" className="surface-card rounded-2xl p-6 sm:p-7 space-y-4 shadow-2xs scroll-mt-6 border border-app-border">
          <div className="flex items-center space-x-2 text-app-accent font-bold text-sm border-b border-app-border/80 pb-2.5">
            <Lock className="h-4 w-4 text-app-accent" />
            <h2>2. Zero-Trust Architecture & Client-Edge Forensic Pipeline</h2>
          </div>
          <div className="text-xs text-app-secondary leading-relaxed space-y-4">
            <p>
              ScamShield AI enforces the strict cybersecurity principle: <strong>&quot;Never trust, always inspect every vector.&quot;</strong> Instead of maintaining static blocklists that become stale within hours, ScamShield decomposes any incoming threat vector into 3 concurrent forensic pipelines:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-[11px]">
              <div className="p-4 rounded-xl bg-app-surface-subtle border border-app-border space-y-1.5">
                <div className="flex items-center space-x-1.5 text-rose-500 font-bold">
                  <Globe className="h-4 w-4" />
                  <span>1. URL Link Inspector</span>
                </div>
                <p className="text-app-muted">
                  Heuristic analysis of typosquatting, Punycode/homographs, disposable TLDs (.xyz, .top), WHOIS age &lt;7d, IP hostnames, and banking brand mimicry.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-app-surface-subtle border border-app-border space-y-1.5">
                <div className="flex items-center space-x-1.5 text-purple-500 font-bold">
                  <Terminal className="h-4 w-4" />
                  <span>2. Multilingual NLP Engine</span>
                </div>
                <p className="text-app-muted">
                  Dual-tier script recognition (Devanagari Unicode \u0900-\u097F + Hinglish regex), panic urgency weighting, authority impersonation detection across 7 fraud categories.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-app-surface-subtle border border-app-border space-y-1.5">
                <div className="flex items-center space-x-1.5 text-emerald-500 font-bold">
                  <QrCode className="h-4 w-4" />
                  <span>3. QR &amp; UPI Protocol Guard</span>
                </div>
                <p className="text-app-muted">
                  Client-side jsQR decoding, parsing of RFC UPI intent URI parameters (pa, pn, am, tn), VPA masquerade checks, and reverse-charge debit trap interception.
                </p>
              </div>
            </div>

            {/* Live Data Flow Summary */}
            <div className="p-4 rounded-xl bg-app-surface-subtle border border-app-border space-y-2">
              <span className="font-bold text-app-text text-xs uppercase tracking-wide">
                Real-Time Data Plane &amp; Cloud Synchronization
              </span>
              <p className="text-app-muted">
                Scans and community incident stories synchronize in real-time with <strong>Firebase Realtime Database (RTDB)</strong> via persistent WebSocket listeners. When users authenticate via Google Auth, pre-login guest scans automatically migrate into their personal vault. Threat broadcasts pushed by SecOps administrators trigger instantaneous alerts on active endpoints.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 3: THE 3 DETECTION ENGINES */}
        <section id="engines" className="surface-card rounded-2xl p-6 sm:p-7 space-y-5 shadow-2xs scroll-mt-6 border border-app-border">
          <div className="flex items-center space-x-2 text-app-accent font-bold text-sm border-b border-app-border/80 pb-2.5">
            <Cpu className="h-4 w-4 text-app-accent" />
            <h2>3. The 3 Detection Engines &amp; Omni Threat Scoring Formulation</h2>
          </div>
          <div className="text-xs text-app-secondary leading-relaxed space-y-4">
            
            {/* Engine 1 */}
            <div className="space-y-2">
              <h3 className="font-bold text-app-text text-xs">
                Engine 1: URL Heuristic Analyzer (<code className="text-app-accent">lib/analyzers/urlAnalyzer.ts</code>)
              </h3>
              <p className="text-app-muted">
                Scam websites register disposable domains that closely resemble trusted financial institutions. Our engine applies heuristic penalty weights against known attack vectors:
              </p>
              <div className="overflow-x-auto rounded-xl border border-app-border">
                <table className="w-full text-left text-[11px] font-mono">
                  <thead className="bg-app-surface-subtle border-b border-app-border text-app-text font-bold">
                    <tr>
                      <th className="p-2">Heuristic Check</th>
                      <th className="p-2">Penalty / Credit</th>
                      <th className="p-2">Example Attack Vector</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-app-border">
                    <tr>
                      <td className="p-2 font-semibold">Raw IP as Hostname</td>
                      <td className="p-2 text-rose-500 font-bold">+45 pts</td>
                      <td className="p-2"><code>http://192.168.10.55/icici/login</code></td>
                    </tr>
                    <tr>
                      <td className="p-2 font-semibold">Homograph / Punycode Attack</td>
                      <td className="p-2 text-rose-500 font-bold">+40 pts</td>
                      <td className="p-2">Cyrillic lookalikes mimicking Latin characters</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-semibold">Brand Impersonation (Typosquat)</td>
                      <td className="p-2 text-rose-500 font-bold">+45 pts</td>
                      <td className="p-2"><code>sbl-kyc-update.xyz</code> instead of <code>sbi.co.in</code></td>
                    </tr>
                    <tr>
                      <td className="p-2 font-semibold">Suspicious / High-Abuse TLD</td>
                      <td className="p-2 text-amber-500 font-bold">+25 pts</td>
                      <td className="p-2">.xyz, .top, .buzz, .club, .live, .work</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-semibold">Insecure Protocol (HTTP)</td>
                      <td className="p-2 text-amber-500 font-bold">+25 pts</td>
                      <td className="p-2">Plaintext HTTP on banking or KYC form</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-semibold">Phishing Tokens in Path</td>
                      <td className="p-2 text-amber-500 font-bold">+10-30 pts</td>
                      <td className="p-2">/kyc-update/, /verify-pan/, /account-block/</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-semibold text-emerald-600">Official Banking Whitelist</td>
                      <td className="p-2 text-emerald-600 font-bold">-50 pts</td>
                      <td className="p-2">Verified official: <code>onlinesbi.sbi</code>, <code>hdfcbank.com</code></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Engine 2 */}
            <div className="space-y-2 pt-2">
              <h3 className="font-bold text-app-text text-xs">
                Engine 2: Multilingual NLP Panic Engine (<code className="text-app-accent">lib/analyzers/nlpEngine.ts</code>)
              </h3>
              <p className="text-app-muted">
                Indian cyber attackers predominantly use regional languages (Hindi / Hinglish) because vernacular urgency generates acute psychological fear. Our engine classifies scripts and scores panic keywords:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-[11px]">
                <div className="p-3.5 rounded-xl bg-app-surface-subtle border border-app-border space-y-1">
                  <span className="font-bold text-app-text">Urgency Score Formula:</span>
                  <p className="text-app-muted">
                    <code>compositeNlpScore = (urgencyScore × 0.45) + (impersonationScore × 0.45) + (triggerCount × 5)</code>
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-app-surface-subtle border border-app-border space-y-1">
                  <span className="font-bold text-app-text">Monitored Categories (7 Vectors):</span>
                  <p className="text-app-muted">
                    KYC Expiry, Electricity Utility, Reverse UPI Collect, Digital Arrest (CBI/Police), Job Task Scam, Lottery Bait, Legitimate Banking Notification.
                  </p>
                </div>
              </div>
            </div>

            {/* Engine 3 */}
            <div className="space-y-2 pt-2">
              <h3 className="font-bold text-app-text text-xs">
                Engine 3: QR Code &amp; UPI Reverse-Charge Guard (<code className="text-app-accent">lib/analyzers/qrInspector.ts</code>)
              </h3>
              <p className="text-app-muted">
                <strong>Fundamental UPI Axiom:</strong> In the Unified Payments Interface architecture, scanning a QR code and entering your MPIN <em>strictly debits funds</em> from your bank account. It is technologically impossible to receive money by scanning a QR code or entering a PIN.
              </p>
              <div className="p-3.5 rounded-xl bg-app-surface-subtle border border-app-border font-mono text-[11px] space-y-1.5">
                <span className="font-bold text-app-text">Raw UPI Intent URI Decomposition:</span>
                <p className="text-app-muted">
                  <code>upi://pay?pa=scammer89@ybl&amp;pn=SBI%20Refund%20Dept&amp;am=5000&amp;tn=Scan%20to%20Receive%20Cashback</code>
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[10px]">
                  <div><code>pa</code>: Payee VPA address</div>
                  <div><code>pn</code>: Display Name</div>
                  <div><code>am</code>: Pre-filled Amount</div>
                  <div><code>tn</code>: Deceptive Note</div>
                </div>
              </div>
            </div>

            {/* Omni Threat Scorer Formula */}
            <div className="p-4 rounded-xl bg-app-surface-subtle border border-app-border space-y-2">
              <span className="font-bold text-app-text text-xs uppercase tracking-wide">
                Omni Threat Composite Formula (<code className="text-app-accent">threatScorer.ts</code>)
              </span>
              <p className="text-app-muted font-mono text-xs">
                <code>overallScore = Math.min(100, (messageScore × 0.40) + (urlScore × 0.35) + (qrScore × 0.35))</code>
              </p>
              <div className="grid grid-cols-3 gap-2 text-[11px] font-mono text-center pt-1">
                <div className="p-2 rounded bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-bold">
                  Score 0-29: SAFE
                </div>
                <div className="p-2 rounded bg-amber-500/10 text-amber-600 border border-amber-500/20 font-bold">
                  Score 30-64: SUSPICIOUS
                </div>
                <div className="p-2 rounded bg-rose-500/10 text-rose-600 border border-rose-500/20 font-bold">
                  Score 65-100: HIGH_RISK
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: LIVE THREAT STREAM & BROADCAST DISPATCHER */}
        <section id="broadcast" className="surface-card rounded-2xl p-6 sm:p-7 space-y-4 shadow-2xs scroll-mt-6 border border-app-border">
          <div className="flex items-center space-x-2 text-app-accent font-bold text-sm border-b border-app-border/80 pb-2.5">
            <Radio className="h-4 w-4 text-amber-500 animate-pulse" />
            <h2>4. Live Threat Stream Broadcast &amp; Sovereign Scan History Governance</h2>
          </div>
          <div className="text-xs text-app-secondary leading-relaxed space-y-4">
            <p>
              To protect Indian citizens from rapidly mutating social engineering campaigns, ScamShield AI integrates a <strong>Real-Time Threat Telemetry Dispatcher</strong> paired with a <strong>Zero-Trust History Governance model</strong>:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-[11px]">
              <div className="p-4 rounded-xl bg-app-surface-subtle border border-app-border space-y-2">
                <div className="flex items-center space-x-1.5 text-amber-500 font-bold">
                  <Radio className="h-4 w-4" />
                  <span>Nationwide Live Threat Stream</span>
                </div>
                <p className="text-app-muted">
                  A high-velocity WebSocket stream backed by Firebase RTDB (<code>threat_reports</code>) delivering instant feeds of zero-day threats detected across India. Users can inspect live threat tickers, analyze MITRE-style indicators of compromise (IOCs), and send flagged targets directly into the Scanner.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-app-surface-subtle border border-app-border space-y-2">
                <div className="flex items-center space-x-1.5 text-purple-500 font-bold">
                  <ShieldAlert className="h-4 w-4" />
                  <span>SecOps Threat Broadcaster</span>
                </div>
                <p className="text-app-muted">
                  Authorized security analysts can broadcast emergency warnings to all citizen dashboards nationwide in real-time. Broadcasters configure custom attack titles, target indicators (URLs, phone VPAs, QR links), anomaly tags, and actionable Zero-Trust defense playbooks.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-app-surface-subtle border border-app-border space-y-2">
              <span className="font-bold text-app-text text-xs uppercase tracking-wide">
                Role-Based Scan History Governance &amp; Anti-Tampering Protocol
              </span>
              <ul className="list-disc list-inside space-y-1.5 text-app-muted font-mono text-[11px]">
                <li><strong className="text-app-text">Guest Users (Read-Only Vault):</strong> Anonymous guests can scan and review local results, but cannot delete audit trails without authentication to prevent anti-forensic tampering.</li>
                <li><strong className="text-app-text">Authenticated Citizens:</strong> Logged-in users hold sovereign ownership over their scan records and can selectively delete or purge their personal cloud history.</li>
                <li><strong className="text-app-text">SecOps Administrators:</strong> Granted full supervisory privileges to moderate flagged reports and execute global RTDB history purges across all network nodes.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* SECTION 5: 100-SAMPLE BENCHMARK RESULTS */}
        <section id="benchmark" className="surface-card rounded-2xl p-6 sm:p-7 space-y-4 shadow-2xs scroll-mt-6 border border-app-border">
          <div className="flex items-center space-x-2 text-app-accent font-bold text-sm border-b border-app-border/80 pb-2.5">
            <ShieldCheck className="h-4 w-4 text-app-accent" />
            <h2>5. 100-Sample Test Corpus Benchmark Evaluation (98% Accuracy)</h2>
          </div>
          <div className="text-xs text-app-secondary leading-relaxed space-y-4">
            <p>
              The platform was evaluated against a sanitized 100-sample test suite comprising 50 active scam vectors (banking clones, fake utility SMS, reverse UPI intents) and 50 verified legitimate interactions:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center font-mono">
              <div className="p-3.5 rounded-xl bg-app-surface-subtle border border-app-border">
                <span className="text-[10px] text-app-muted block">Accuracy</span>
                <span className="text-lg font-bold text-emerald-500">98.0%</span>
              </div>
              <div className="p-3.5 rounded-xl bg-app-surface-subtle border border-app-border">
                <span className="text-[10px] text-app-muted block">Precision</span>
                <span className="text-lg font-bold text-app-text">98.0%</span>
              </div>
              <div className="p-3.5 rounded-xl bg-app-surface-subtle border border-app-border">
                <span className="text-[10px] text-app-muted block">Recall</span>
                <span className="text-lg font-bold text-app-text">98.0%</span>
              </div>
              <div className="p-3.5 rounded-xl bg-app-surface-subtle border border-app-border">
                <span className="text-[10px] text-app-muted block">F1-Score</span>
                <span className="text-lg font-bold text-app-text">98.0%</span>
              </div>
            </div>

            {/* Confusion Matrix */}
            <div className="p-4 rounded-xl bg-app-surface-subtle border border-app-border max-w-sm mx-auto text-center font-mono text-xs space-y-2">
              <span className="text-[10px] font-bold text-app-muted uppercase">2x2 Confusion Matrix</span>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded bg-app-surface border border-emerald-500/30 text-emerald-500 font-bold">
                  TP: 49 (Scam Caught)
                </div>
                <div className="p-2.5 rounded bg-app-surface border border-amber-500/30 text-amber-500 font-bold">
                  FP: 1 (False Alarm)
                </div>
                <div className="p-2.5 rounded bg-app-surface border border-red-500/30 text-red-500 font-bold">
                  FN: 1 (Missed Vector)
                </div>
                <div className="p-2.5 rounded bg-app-surface border border-emerald-500/30 text-emerald-500 font-bold">
                  TN: 49 (Legit Verified)
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 6: LEGAL FRAMEWORK & HELPLINES */}
        <section id="legal" className="surface-card rounded-2xl p-6 sm:p-7 space-y-4 shadow-2xs scroll-mt-6 border border-app-border">
          <div className="flex items-center space-x-2 text-app-accent font-bold text-sm border-b border-app-border/80 pb-2.5">
            <Scale className="h-4 w-4 text-app-accent" />
            <h2>6. Statutory Legal Alignment &amp; National Helplines</h2>
          </div>
          <div className="text-xs text-app-secondary leading-relaxed space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-app-surface-subtle border border-app-border space-y-1">
                <span className="font-bold text-app-text">IT Act, 2000 — Section 66D</span>
                <p className="text-app-muted">
                  Penalizes cheating by personation using computer resources. Carries imprisonment up to 3 years and a fine up to ₹1,00,000.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-app-surface-subtle border border-app-border space-y-1">
                <span className="font-bold text-app-text">IT Act, 2000 — Section 43</span>
                <p className="text-app-muted">
                  Civil penalties for unauthorized extraction or damage to computer networks, data theft, and virus induction.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-app-surface-subtle border border-app-border space-y-1">
                <span className="font-bold text-app-text">Indian Penal Code — Section 420 &amp; 468</span>
                <p className="text-app-muted">
                  Cheating and dishonestly inducing delivery of property; forgery for the purpose of cheating and impersonation.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-app-surface-subtle border border-app-border space-y-1">
                <span className="font-bold text-app-text">Consumer Protection Act, 2019 — Section 2(47)</span>
                <p className="text-app-muted">
                  Protects citizens against unfair trade practices and misleading representations by fake digital service merchants.
                </p>
              </div>
            </div>

            {/* Helplines and Golden Hour */}
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
              <div className="flex items-center space-x-2 text-emerald-600 font-bold">
                <PhoneCall className="h-4 w-4" />
                <span>The 1930 &quot;Golden Hour&quot; Emergency Protocol</span>
              </div>
              <p className="text-xs text-app-secondary leading-relaxed">
                If money has already been debited, report immediately to <strong>1930</strong> or <strong>cybercrime.gov.in</strong> within the first <strong>2 hours</strong>. This &quot;Golden Hour&quot; window enables the Indian Cyber Crime Coordination Centre (I4C) and bank nodal officers to freeze funds in the recipient mule account before ATM liquidation.
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-1 font-semibold text-xs">
                <a
                  href="https://cybercrime.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="text-app-accent hover:underline flex items-center space-x-1"
                >
                  <span>cybercrime.gov.in</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
                <a
                  href="https://sancharsaathi.gov.in/Chakshu/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-app-accent hover:underline flex items-center space-x-1"
                >
                  <span>Chakshu Portal (DoT)</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
                <span className="text-app-muted">SMS Fraud Reporting: <strong>1909</strong></span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 7: TECH STACK & TEAM D43M0N$ */}
        <section id="techstack" className="surface-card rounded-2xl p-6 sm:p-7 space-y-4 shadow-2xs scroll-mt-6 border border-app-border">
          <div className="flex items-center space-x-2 text-app-accent font-bold text-sm border-b border-app-border/80 pb-2.5">
            <Layers className="h-4 w-4 text-app-accent" />
            <h2>7. Modern Tech Stack &amp; Team D43M0N$ Roster</h2>
          </div>
          <div className="text-xs text-app-secondary leading-relaxed space-y-4">
            
            {/* Tech Stack Table */}
            <div className="overflow-x-auto rounded-xl border border-app-border">
              <table className="w-full text-left text-[11px] font-mono">
                <thead className="bg-app-surface-subtle border-b border-app-border text-app-text font-bold">
                  <tr>
                    <th className="p-2">Component</th>
                    <th className="p-2">Technology Used</th>
                    <th className="p-2">Architectural Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-app-border">
                  <tr>
                    <td className="p-2 font-bold text-app-text">Web Framework</td>
                    <td className="p-2">Next.js 15 (App Router) + React 19</td>
                    <td className="p-2 text-app-muted">Server-side rendering, API routes, fast client-side routing</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold text-app-text">Cloud Database</td>
                    <td className="p-2">Firebase Realtime Database (RTDB)</td>
                    <td className="p-2 text-app-muted">WebSocket-based instant sync for stories, threat logs, and scans</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold text-app-text">Authentication</td>
                    <td className="p-2">Firebase Google Auth</td>
                    <td className="p-2 text-app-muted">Secure citizen sign-in and SecOps admin role enforcement</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold text-app-text">Styling System</td>
                    <td className="p-2">Tailwind CSS (CSS Variables)</td>
                    <td className="p-2 text-app-muted">5 dynamic themes (Clean Light, Glass Mint, Lavender Frost, Solar Amber, Obsidian Dark)</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold text-app-text">QR Computer Vision</td>
                    <td className="p-2">jsQR + HTML5 Canvas API</td>
                    <td className="p-2 text-app-muted">100% client-side QR image reading without uploading photos to servers</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold text-app-text">AI Cyber Advisor</td>
                    <td className="p-2">Google Gemini Flash API</td>
                    <td className="p-2 text-app-muted">Interactive cybersecurity advisory, threat explanations, and prevention tips</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Team Roster */}
            <div className="space-y-2 pt-2">
              <h3 className="font-bold text-app-text text-xs uppercase tracking-wide">
                Team D43M0N$ — IEEE VIT Bhopal Hackathon 2026
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-app-surface-subtle border border-app-border space-y-1">
                  <span className="font-bold text-app-text text-xs">Mangal Nath Yadav</span>
                  <p className="text-[11px] font-mono text-app-muted">Reg No: 26BHI10047</p>
                </div>

                <div className="p-3.5 rounded-xl bg-app-surface-subtle border border-app-border space-y-1">
                  <span className="font-bold text-app-text text-xs">Aastik Tripathi</span>
                  <p className="text-[11px] font-mono text-app-muted">Reg No: 26BCY10090</p>
                </div>

                <div className="p-3.5 rounded-xl bg-app-surface-subtle border border-app-border space-y-1">
                  <span className="font-bold text-app-text text-xs">Yash Raj Kushwaha</span>
                  <p className="text-[11px] font-mono text-app-muted">Reg No: 26BCE10122</p>
                </div>

                <div className="p-3.5 rounded-xl bg-app-surface-subtle border border-app-border space-y-1">
                  <span className="font-bold text-app-text text-xs">Palak Kalra</span>
                  <p className="text-[11px] font-mono text-app-muted">Reg No: 26BCY10001</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 8: CYBERSECURITY GLOSSARY */}
        <section id="glossary" className="surface-card rounded-2xl p-6 sm:p-7 space-y-4 shadow-2xs scroll-mt-6 border border-app-border">
          <div className="flex items-center space-x-2 text-app-accent font-bold text-sm border-b border-app-border/80 pb-2.5">
            <HelpCircle className="h-4 w-4 text-app-accent" />
            <h2>8. Cybersecurity Glossary for Citizens &amp; Evaluators</h2>
          </div>
          <div className="overflow-x-auto rounded-xl border border-app-border text-xs font-mono">
            <table className="w-full text-left">
              <thead className="bg-app-surface-subtle border-b border-app-border text-app-text font-bold">
                <tr>
                  <th className="p-2.5">Security Term</th>
                  <th className="p-2.5">Plain-English Definition</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-app-border text-[11px]">
                <tr>
                  <td className="p-2.5 font-bold text-app-text">Zero-Trust</td>
                  <td className="p-2.5 text-app-muted">Security model assuming every communication is hostile until cryptographic or forensic proof validates it.</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-app-text">Typosquatting</td>
                  <td className="p-2.5 text-app-muted">Registering lookalike domains (e.g. <code>sbl-kyc.xyz</code> instead of <code>sbi.co.in</code>) to trick victims.</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-app-text">Homograph Attack</td>
                  <td className="p-2.5 text-app-muted">Using foreign or Unicode characters that look identical to standard Latin characters to fool human readers.</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-app-text">Reverse-Charge QR Trap</td>
                  <td className="p-2.5 text-app-muted">Deceptive QR codes claiming &quot;Scan to receive ₹5,000 cashback&quot; which actually trigger an account debit transfer.</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-app-text">VPA Masquerade</td>
                  <td className="p-2.5 text-app-muted">Setting display name as &quot;Electricity Department&quot; while the actual destination VPA handle is a personal account.</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-app-text">Golden Hour (1930)</td>
                  <td className="p-2.5 text-app-muted">The initial 2-hour window following cyber fraud when inter-bank nodal officers can freeze stolen funds.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </div>
  );
}
