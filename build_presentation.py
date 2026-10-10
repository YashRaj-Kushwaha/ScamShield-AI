#!/usr/bin/env python3
"""
ScamShield AI — Official Hackathon Presentation Deck Builder
IEEE VIT Bhopal Hackathon 2026 · Track 04 Cybersecurity (Problem Statement 04.1)
Team D43M0N$: Mangal Nath Yadav, Aastik Tripathi, Yash Raj Kushwaha, Palak Kalra
"""

import os
import subprocess
import pptx
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

# ==============================================================================
# COLOR PALETTE DEFINITIONS (Modern Dark Cyber-Security Aesthetic)
# ==============================================================================
BG_DARK = RGBColor(11, 15, 25)          # Deep Cyber Slate #0B0F19
CARD_BG = RGBColor(19, 27, 46)          # Card Slate #131B2E
CARD_BG_ALT = RGBColor(15, 23, 42)      # Deep Card #0F172A
CARD_BORDER = RGBColor(38, 52, 80)      # Border Slate #263450
ACCENT_CYAN = RGBColor(6, 182, 212)     # Electric Cyan #06B6D4
ACCENT_BLUE = RGBColor(59, 130, 246)    # Royal Blue #3B82F6
ACCENT_EMERALD = RGBColor(16, 185, 129) # Safe Green #10B981
ACCENT_RED = RGBColor(239, 68, 68)      # Scam Red #EF4444
ACCENT_AMBER = RGBColor(245, 158, 11)   # Warning Amber #F59E0B
ACCENT_PURPLE = RGBColor(168, 85, 247)  # Intelligence Purple #A855F7
TEXT_WHITE = RGBColor(248, 250, 252)    # Pure White #F8FAFC
TEXT_MUTED = RGBColor(148, 163, 184)    # Cool Gray #94A3B8
TEXT_SUBTLE = RGBColor(100, 116, 139)   # Dark Gray #64748B
PILL_BG = RGBColor(18, 38, 64)          # Tag Pill Background

FONT_HEADING = "Segoe UI"
FONT_BODY = "Segoe UI"
FONT_MONO = "Consolas"

def create_presentation():
    prs = pptx.Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    def add_slide_header(slide, tag_text, title_text, subtitle_text=""):
        # Dark slide background
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = BG_DARK
        bg.line.fill.background()

        # Category Pill
        pill = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.5), Inches(3.2), Inches(0.36))
        pill.fill.solid()
        pill.fill.fore_color.rgb = PILL_BG
        pill.line.color.rgb = ACCENT_CYAN
        pill.line.width = Pt(1)
        ptf = pill.text_frame
        ptf.word_wrap = False
        ptf.margin_left = Inches(0.15)
        ptf.margin_top = Inches(0.04)
        p = ptf.paragraphs[0]
        p.text = tag_text.upper()
        p.font.name = FONT_MONO
        p.font.size = Pt(9.5)
        p.font.bold = True
        p.font.color.rgb = ACCENT_CYAN

        # Title
        tb = slide.shapes.add_textbox(Inches(0.8), Inches(0.92), Inches(11.7), Inches(0.6))
        ttf = tb.text_frame
        ttf.word_wrap = True
        ttf.margin_left = ttf.margin_top = ttf.margin_bottom = ttf.margin_right = 0
        tp = ttf.paragraphs[0]
        tp.text = title_text
        tp.font.name = FONT_HEADING
        tp.font.size = Pt(22)
        tp.font.bold = True
        tp.font.color.rgb = TEXT_WHITE

        # Subtitle
        if subtitle_text:
            sp = ttf.add_paragraph()
            sp.text = subtitle_text
            sp.font.name = FONT_BODY
            sp.font.size = Pt(11)
            sp.font.color.rgb = TEXT_MUTED
            sp.space_before = Pt(3)

        # Footer
        ftr = slide.shapes.add_textbox(Inches(0.8), Inches(7.05), Inches(11.7), Inches(0.3))
        ftf = ftr.text_frame
        ftf.word_wrap = False
        ftf.margin_left = ftf.margin_top = ftf.margin_bottom = ftf.margin_right = 0
        fp = ftf.paragraphs[0]
        fp.text = "IEEE VIT Bhopal Hackathon 2026 · Track 04.1 'The Scam That Almost Worked' · Team D43M0N$"
        fp.font.name = FONT_MONO
        fp.font.size = Pt(8.5)
        fp.font.color.rgb = TEXT_SUBTLE

    # ==============================================================================
    # SLIDE 1: TITLE SLIDE
    # ==============================================================================
    s1 = prs.slides.add_slide(blank_layout)
    bg1 = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg1.fill.solid()
    bg1.fill.fore_color.rgb = BG_DARK
    bg1.line.fill.background()

    # Subtle decorative grid line
    div1 = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.3), Inches(11.7), Pt(1.5))
    div1.fill.solid()
    div1.fill.fore_color.rgb = RGBColor(26, 41, 66)
    div1.line.fill.background()

    # Top Pill
    pill1 = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.8), Inches(5.8), Inches(0.38))
    pill1.fill.solid()
    pill1.fill.fore_color.rgb = PILL_BG
    pill1.line.color.rgb = ACCENT_CYAN
    pill1.line.width = Pt(1.2)
    p1 = pill1.text_frame.paragraphs[0]
    p1.text = "IEEE VIT BHOPAL HACKATHON 2026 · TRACK 04 CYBERSECURITY"
    p1.font.name = FONT_MONO
    p1.font.size = Pt(9.5)
    p1.font.bold = True
    p1.font.color.rgb = ACCENT_CYAN

    # Main Big Title
    tb1 = s1.shapes.add_textbox(Inches(0.8), Inches(1.55), Inches(11.7), Inches(2.2))
    tf1 = tb1.text_frame
    tf1.word_wrap = True
    p_title = tf1.paragraphs[0]
    p_title.text = "ScamShield AI"
    p_title.font.name = FONT_HEADING
    p_title.font.size = Pt(44)
    p_title.font.bold = True
    p_title.font.color.rgb = TEXT_WHITE

    p_sub = tf1.add_paragraph()
    p_sub.text = "Pre-Click Zero-Trust Phishing & UPI Fraud Defense Platform"
    p_sub.font.name = FONT_HEADING
    p_sub.font.size = Pt(19)
    p_sub.font.bold = True
    p_sub.font.color.rgb = ACCENT_CYAN
    p_sub.space_before = Pt(6)

    p_desc = tf1.add_paragraph()
    p_desc.text = "Problem Statement 04.1: 'The Scam That Almost Worked' — Neutralizing financial coercion, deceptive UPI QR collects, and typosquatted banking clones at the human decision point before credentials or capital travel across the wire."
    p_desc.font.name = FONT_BODY
    p_desc.font.size = Pt(11.5)
    p_desc.font.color.rgb = TEXT_MUTED
    p_desc.space_before = Pt(8)

    # 4 Quick Metric / Pillar Highlights
    pillars = [
        ("Zero-Trust Client-Edge", "100% Client-side privacy & inspection"),
        ("Multilingual NLP", "Devanagari Hindi + Hinglish Panic Detection"),
        ("UPI Protocol Guard", "Reverse-charge debit collect trap prevention"),
        ("Realtime Telemetry", "Firebase RTDB Nationwide Threat Broadcast")
    ]
    card_w = Inches(2.78)
    card_gap = Inches(0.19)
    left_start = Inches(0.8)
    top_pos = Inches(3.95)

    for i, (title, sub) in enumerate(pillars):
        c = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left_start + i * (card_w + card_gap), top_pos, card_w, Inches(1.05))
        c.fill.solid()
        c.fill.fore_color.rgb = CARD_BG
        c.line.color.rgb = CARD_BORDER
        c.line.width = Pt(1)
        ctf = c.text_frame
        ctf.word_wrap = True
        ctf.margin_left = ctf.margin_right = ctf.margin_top = Inches(0.14)
        cp1 = ctf.paragraphs[0]
        cp1.text = title
        cp1.font.name = FONT_HEADING
        cp1.font.size = Pt(11)
        cp1.font.bold = True
        cp1.font.color.rgb = TEXT_WHITE
        cp2 = ctf.add_paragraph()
        cp2.text = sub
        cp2.font.name = FONT_BODY
        cp2.font.size = Pt(9.5)
        cp2.font.color.rgb = TEXT_MUTED
        cp2.space_before = Pt(2)

    # Team Box at Bottom
    team_card = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(5.25), Inches(11.7), Inches(1.4))
    team_card.fill.solid()
    team_card.fill.fore_color.rgb = RGBColor(16, 24, 40)
    team_card.line.color.rgb = RGBColor(37, 99, 235)
    team_card.line.width = Pt(1.2)
    ttf = team_card.text_frame
    ttf.word_wrap = True
    ttf.margin_left = Inches(0.2)
    ttf.margin_top = Inches(0.15)
    tp1 = ttf.paragraphs[0]
    tp1.text = "TEAM D43M0N$ · VIT BHOPAL UNIVERSITY"
    tp1.font.name = FONT_MONO
    tp1.font.size = Pt(10)
    tp1.font.bold = True
    tp1.font.color.rgb = ACCENT_CYAN

    members = [
        "Mangal Nath Yadav (26BHI10047)",
        "Aastik Tripathi (26BCY10090)",
        "Yash Raj Kushwaha (26BCE10122)",
        "Palak Kalra (26BCY10001)"
    ]
    tp2 = ttf.add_paragraph()
    tp2.text = "   •   ".join(members)
    tp2.font.name = FONT_HEADING
    tp2.font.size = Pt(11.5)
    tp2.font.bold = True
    tp2.font.color.rgb = TEXT_WHITE
    tp2.space_before = Pt(4)

    tp3 = ttf.add_paragraph()
    tp3.text = "Presentation Structure: Theoretical Architecture (Slides)  ➜  Direct Handover to Live Interactive App Demonstration"
    tp3.font.name = FONT_BODY
    tp3.font.size = Pt(10)
    tp3.font.color.rgb = ACCENT_AMBER
    tp3.space_before = Pt(4)

    # ==============================================================================
    # SLIDE 2: THE PROBLEM & HUMAN DECISION POINT
    # ==============================================================================
    s2 = prs.slides.add_slide(blank_layout)
    add_slide_header(s2, "Critical Threat Context", "Why Modern Financial Scams Succeed", "Attackers exploit psychological panic, language barriers, and pre-click trust gaps.")

    col_w = Inches(3.7)
    col_gap = Inches(0.3)
    c_top = Inches(1.8)
    c_h = Inches(4.9)

    col_data = [
        (
            "1. The Scope of the Crisis",
            ACCENT_RED,
            [
                ("10,000+ Daily Complaints", "India registers over 10,000 financial cyber fraud complaints daily across banking & UPI."),
                ("₹1,750+ Crores Lost", "High-frequency campaigns: fake electricity bills, digital arrest calls, KYC deactivation traps."),
                ("Social Engineering Vector", "Over 85% of successful attacks exploit human decision errors, not payment gateway flaws."),
                ("Language Evasion", "Threat actors use regional Hindi/Hinglish phrasing that bypass traditional English security filters.")
            ]
        ),
        (
            "2. The 'Post-Theft' Blindspot",
            ACCENT_AMBER,
            [
                ("Reactive Protection", "Firewalls, antivirus, and bank SMS warnings operate AFTER credentials or OTPs have been submitted."),
                ("Mule Account Velocity", "Once a victim enters their UPI PIN or password, stolen funds are dispersed into secondary mule accounts in seconds."),
                ("Visual Mimicry", "Punycode & typosquatted portals (e.g. sbl-kyc.xyz) look identical to real bank websites to ordinary citizens."),
                ("Zero-Hour Fraud Window", "Victims panic during 'urgent deadlines' ('Account blocked in 24 hrs'), bypassing rational caution.")
            ]
        ),
        (
            "3. The Pre-Click Defense Paradigm",
            ACCENT_EMERALD,
            [
                ("Zero-Trust Architecture", "Every link, message, and QR code is assumed hostile until cryptographically and heuristically proven safe."),
                ("Pre-Click Interception", "ScamShield inspects incoming payloads BEFORE the user clicks or enters credentials."),
                ("Plain-English & Hindi Verdicts", "Explains exactly WHY a link is fake (e.g. 'Domain created 3 days ago mimicking SBI')."),
                ("Client-Edge Privacy", "Operates directly in the citizen's browser without uploading private images or credentials to central servers.")
            ]
        )
    ]

    for idx, (head, col_color, items) in enumerate(col_data):
        card = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8) + idx * (col_w + col_gap), c_top, col_w, c_h)
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_BG
        card.line.color.rgb = col_color
        card.line.width = Pt(1.2)
        ctf = card.text_frame
        ctf.word_wrap = True
        ctf.margin_left = ctf.margin_right = ctf.margin_top = Inches(0.2)

        p = ctf.paragraphs[0]
        p.text = head
        p.font.name = FONT_HEADING
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = col_color

        for item_title, item_desc in items:
            itp = ctf.add_paragraph()
            itp.text = f"▸ {item_title}"
            itp.font.name = FONT_HEADING
            itp.font.size = Pt(10.5)
            itp.font.bold = True
            itp.font.color.rgb = TEXT_WHITE
            itp.space_before = Pt(8)

            idp = ctf.add_paragraph()
            idp.text = item_desc
            idp.font.name = FONT_BODY
            idp.font.size = Pt(9.5)
            idp.font.color.rgb = TEXT_MUTED
            idp.space_before = Pt(2)

    # ==============================================================================
    # SLIDE 3: 4-STAGE ATTACK ANATOMY & WHERE SCAMSHIELD INTERCEPTS
    # ==============================================================================
    s3 = prs.slides.add_slide(blank_layout)
    add_slide_header(s3, "Attack Progression", "The 4-Stage Attack Anatomy & Interception Point", "Tracing 'The Scam That Almost Worked' and demonstrating exactly where ScamShield stops the kill-chain.")

    # 4 Sequential Attack Stage Boxes
    stage_w = Inches(2.7)
    stage_gap = Inches(0.3)
    s_top = Inches(1.8)
    s_h = Inches(3.2)

    stages = [
        ("STAGE 1", "Initial Contact", ACCENT_BLUE, "Victim receives unsolicited SMS, WhatsApp message, or QR flyer.", "Example: 'Electricity bill unpaid. Power disconnected tonight at 9:30 PM. Click to update.'"),
        ("STAGE 2", "Manufactured Panic", ACCENT_AMBER, "Psychological urgency & authority impersonation (BESCOM, SBI, TRAI).", "Artificial 24h countdown induces fear of service disconnection or legal arrest."),
        ("STAGE 3", "Credential Capture", ACCENT_RED, "Victim clicks link to pixel-perfect clone or scans reverse-charge QR.", "Fake portal harvests NetBanking password, OTP, or triggers UPI collect debit."),
        ("STAGE 4", "Capital Siphon", RGBColor(225, 29, 72), "Attacker liquidates account via mule bank network.", "Transaction irreversible within minutes; stolen funds laundered via P2P transfers.")
    ]

    for idx, (st_num, st_name, st_col, st_desc, st_eg) in enumerate(stages):
        box = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8) + idx * (stage_w + stage_gap), s_top, stage_w, s_h)
        box.fill.solid()
        box.fill.fore_color.rgb = CARD_BG
        box.line.color.rgb = st_col
        box.line.width = Pt(1.5)
        btf = box.text_frame
        btf.word_wrap = True
        btf.margin_left = btf.margin_right = btf.margin_top = Inches(0.18)

        bp1 = btf.paragraphs[0]
        bp1.text = st_num
        bp1.font.name = FONT_MONO
        bp1.font.size = Pt(10)
        bp1.font.bold = True
        bp1.font.color.rgb = st_col

        bp2 = btf.add_paragraph()
        bp2.text = st_name
        bp2.font.name = FONT_HEADING
        bp2.font.size = Pt(13)
        bp2.font.bold = True
        bp2.font.color.rgb = TEXT_WHITE
        bp2.space_before = Pt(2)

        bp3 = btf.add_paragraph()
        bp3.text = st_desc
        bp3.font.name = FONT_BODY
        bp3.font.size = Pt(9.5)
        bp3.font.color.rgb = TEXT_MUTED
        bp3.space_before = Pt(6)

        bp4 = btf.add_paragraph()
        bp4.text = st_eg
        bp4.font.name = FONT_BODY
        bp4.font.size = Pt(9)
        bp4.font.italic = True
        bp4.font.color.rgb = RGBColor(203, 213, 225)
        bp4.space_before = Pt(6)

    # Big Interception Banner Across Stages 1 & 2
    int_banner = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(5.2), Inches(11.7), Inches(1.6))
    int_banner.fill.solid()
    int_banner.fill.fore_color.rgb = RGBColor(6, 42, 54)
    int_banner.line.color.rgb = ACCENT_CYAN
    int_banner.line.width = Pt(1.5)
    ibtf = int_banner.text_frame
    ibtf.word_wrap = True
    ibtf.margin_left = Inches(0.25)
    ibtf.margin_top = Inches(0.16)

    ibp1 = ibtf.paragraphs[0]
    ibp1.text = "🛡️ SCAMSHIELD AI INTERCEPTION BARRIER — INTERCEPTING BETWEEN STAGE 1 & 2"
    ibp1.font.name = FONT_MONO
    ibp1.font.size = Pt(11)
    ibp1.font.bold = True
    ibp1.font.color.rgb = ACCENT_CYAN

    features_int = [
        "• Link Inspector detects typosquatted clone domains (Levenshtein distance, WHOIS age < 7d, disposable TLDs) BEFORE clicking.",
        "• Multilingual NLP Engine analyzes panic keywords, authority impersonation, and Hindi/Hinglish coercion patterns in SMS text.",
        "• QR & UPI Protocol Guard decodes raw payload client-side, identifying deceptive collect-request debits disguised as 'Cashback'."
    ]
    for feat in features_int:
        f_p = ibtf.add_paragraph()
        f_p.text = feat
        f_p.font.name = FONT_BODY
        f_p.font.size = Pt(10)
        f_p.font.color.rgb = TEXT_WHITE
        f_p.space_before = Pt(2)

    # ==============================================================================
    # SLIDE 4: THE 3 FORENSIC DETECTION ENGINES
    # ==============================================================================
    s4 = prs.slides.add_slide(blank_layout)
    add_slide_header(s4, "Detection Engines", "Three Concurrent Client-Edge Forensic Pipelines", "Modular, client-side inspection algorithms providing zero-trust threat verification.")

    eng_w = Inches(3.7)
    eng_gap = Inches(0.3)
    eng_top = Inches(1.8)
    eng_h = Inches(4.9)

    engines = [
        (
            "1. URL & Link Inspector",
            ACCENT_CYAN,
            "lib/analyzers/urlAnalyzer.ts",
            [
                ("Typosquatting & Levenshtein", "Measures edit distance against top Indian financial institutions (SBI, HDFC, ICICI, Axis)."),
                ("Homoglyph / Punycode Checks", "Detects Cyrillic and unicode character lookalikes (e.g. 'xn--' spoofing)."),
                ("Disposable TLD Heuristics", "Flags high-risk disposable extensions (.xyz, .top, .tk, .click, .live)."),
                ("Domain Age & Host Checks", "Flags domains registered < 7 days ago and raw IP literal hosts (http://192.168.1.1).")
            ]
        ),
        (
            "2. Multilingual NLP Engine",
            ACCENT_PURPLE,
            "lib/analyzers/nlpEngine.ts",
            [
                ("Devanagari & Hinglish Dual-Tier", "Recognizes Unicode Devanagari (\\u0900-\\u097F) and romanized Hinglish panic expressions."),
                ("Urgency & Coercion Scoring", "Identifies artificial deadlines ('24 hours', 'aaj raat 9:30 baje bijli kaat di jayegi')."),
                ("Authority Impersonation", "Classifies impersonation of regulatory bodies (RBI, TRAI, Police, Income Tax)."),
                ("Harvesting Anomaly Detection", "Detects requests for sensitive credentials (OTP, UPI PIN, CVV, APK download links).")
            ]
        ),
        (
            "3. QR & UPI Protocol Guard",
            ACCENT_EMERALD,
            "lib/analyzers/qrInspector.ts",
            [
                ("Client-Edge jsQR Vision", "Decodes QR images directly on HTML5 Canvas without sending user photos to any cloud server."),
                ("UPI RFC Parameter Parser", "Extracts canonical parameters: Virtual Payment Address (pa), Payee Name (pn), Amount (am)."),
                ("Reverse-Charge Trap Detection", "Crucial defense: Flags collect requests disguised as 'Cashback / Refunds' (PIN debits account)."),
                ("VPA Masquerade Analysis", "Detects personal VPAs disguised as corporate utilities (e.g. bescom.bill@ybl pointing to mule).")
            ]
        )
    ]

    for idx, (e_title, e_color, e_file, e_bullets) in enumerate(engines):
        ecard = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8) + idx * (eng_w + eng_gap), eng_top, eng_w, eng_h)
        ecard.fill.solid()
        ecard.fill.fore_color.rgb = CARD_BG
        ecard.line.color.rgb = e_color
        ecard.line.width = Pt(1.2)
        ectf = ecard.text_frame
        ectf.word_wrap = True
        ectf.margin_left = ectf.margin_right = ectf.margin_top = Inches(0.2)

        ep1 = ectf.paragraphs[0]
        ep1.text = e_title
        ep1.font.name = FONT_HEADING
        ep1.font.size = Pt(13)
        ep1.font.bold = True
        ep1.font.color.rgb = e_color

        ep_sub = ectf.add_paragraph()
        ep_sub.text = e_file
        ep_sub.font.name = FONT_MONO
        ep_sub.font.size = Pt(8.5)
        ep_sub.font.color.rgb = TEXT_SUBTLE
        ep_sub.space_before = Pt(1)

        for b_title, b_desc in e_bullets:
            bp = ectf.add_paragraph()
            bp.text = f"• {b_title}"
            bp.font.name = FONT_HEADING
            bp.font.size = Pt(10)
            bp.font.bold = True
            bp.font.color.rgb = TEXT_WHITE
            bp.space_before = Pt(8)

            bd = ectf.add_paragraph()
            bd.text = b_desc
            bd.font.name = FONT_BODY
            bd.font.size = Pt(9.2)
            bd.font.color.rgb = TEXT_MUTED
            bd.space_before = Pt(1)

    # ==============================================================================
    # SLIDE 5: ENTERPRISE FEATURES: LIVE STREAM, BROADCAST & SOVEREIGN HISTORY
    # ==============================================================================
    s5 = prs.slides.add_slide(blank_layout)
    add_slide_header(s5, "Enterprise SecOps", "Nationwide Live Threat Stream & Broadcast System", "Real-time threat intelligence synchronization powered by Firebase Realtime Database WebSockets.")

    feat_w = Inches(3.7)
    feat_gap = Inches(0.3)
    feat_top = Inches(1.8)
    feat_h = Inches(4.9)

    ent_features = [
        (
            "1. Live Threat Stream",
            ACCENT_CYAN,
            "Nationwide Telemetry Feed",
            [
                ("Persistent WebSocket Sync", "Live listener to Firebase RTDB (threat_reports) receiving real-time scam vectors detected across India."),
                ("Live Ticker & Event Counters", "Animated visual status pulse indicating active threat telemetry and connection health."),
                ("One-Click Forensic Re-Inspect", "Citizens and analysts can immediately pass stream IOCs into the Scanner for deep decomposition."),
                ("MITRE-Style Anomaly Badges", "Displays attack labels: Typosquatting, High-Urgency SMS, Reverse UPI QR.")
            ]
        ),
        (
            "2. SecOps Threat Broadcaster",
            ACCENT_AMBER,
            "Emergency Alert Dispatcher",
            [
                ("Admin Emergency Dispatch", "Verified security analysts broadcast urgent zero-day threat advisories to all connected endpoints."),
                ("Real-Time Client Propagation", "Advisories propagate instantly across citizen devices via RTDB with severity-ranked warning banners."),
                ("Comprehensive Alert Payload", "Configures threat title, target URL/VPA, threat score, anomaly flags, and Zero-Trust guidance."),
                ("Collaborative Defense", "Transforms isolated user scans into collective nationwide protection.")
            ]
        ),
        (
            "3. Sovereign History Vault",
            ACCENT_EMERALD,
            "Role-Based Anti-Tampering",
            [
                ("Guest Vault (Read-Only)", "Unauthenticated guests can view scans locally, but cannot delete audit trails to prevent forensic tampering."),
                ("Citizen Self-Ownership", "Logged-in users retain sovereign ownership to selectively delete or clear their own cloud history records."),
                ("Admin Global Purge", "SecOps administrators possess authoritative privileges to purge all scan records across RTDB (deleteAllScanHistories)."),
                ("Offline LocalStorage Backup", "History synchronizes seamlessly between browser storage and Firebase RTDB.")
            ]
        )
    ]

    for idx, (f_head, f_col, f_sub, f_items) in enumerate(ent_features):
        fcard = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8) + idx * (feat_w + feat_gap), feat_top, feat_w, feat_h)
        fcard.fill.solid()
        fcard.fill.fore_color.rgb = CARD_BG
        fcard.line.color.rgb = f_col
        fcard.line.width = Pt(1.2)
        fctf = fcard.text_frame
        fctf.word_wrap = True
        fctf.margin_left = fctf.margin_right = fctf.margin_top = Inches(0.2)

        fp1 = fctf.paragraphs[0]
        fp1.text = f_head
        fp1.font.name = FONT_HEADING
        fp1.font.size = Pt(13)
        fp1.font.bold = True
        fp1.font.color.rgb = f_col

        fp2 = fctf.add_paragraph()
        fp2.text = f_sub
        fp2.font.name = FONT_BODY
        fp2.font.size = Pt(9.5)
        fp2.font.color.rgb = TEXT_MUTED
        fp2.space_before = Pt(2)

        for it_h, it_d in f_items:
            ip = fctf.add_paragraph()
            ip.text = f"▸ {it_h}"
            ip.font.name = FONT_HEADING
            ip.font.size = Pt(10)
            ip.font.bold = True
            ip.font.color.rgb = TEXT_WHITE
            ip.space_before = Pt(8)

            idp = fctf.add_paragraph()
            idp.text = it_d
            idp.font.name = FONT_BODY
            idp.font.size = Pt(9.2)
            idp.font.color.rgb = TEXT_MUTED
            idp.space_before = Pt(1)

    # ==============================================================================
    # SLIDE 6: AI ADVISOR & INDIAN LEGAL STATUTES
    # ==============================================================================
    s6 = prs.slides.add_slide(blank_layout)
    add_slide_header(s6, "AI Advisor & Compliance", "Gemini 3.x Cyber Defense Advisor & Statutory Framework", "Interactive zero-trust guidance aligned with Indian cyber law and the national 1930 emergency protocol.")

    hw_col = Inches(5.7)
    hw_gap = Inches(0.3)
    hw_top = Inches(1.8)
    hw_h = Inches(4.9)

    # Left Card: Gemini AI Advisor
    ai_card = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), hw_top, hw_col, hw_h)
    ai_card.fill.solid()
    ai_card.fill.fore_color.rgb = CARD_BG
    ai_card.line.color.rgb = ACCENT_PURPLE
    ai_card.line.width = Pt(1.2)
    atf = ai_card.text_frame
    atf.word_wrap = True
    atf.margin_left = atf.margin_right = atf.margin_top = Inches(0.22)

    ap1 = atf.paragraphs[0]
    ap1.text = "🤖 Gemini 3.x AI Cyber Defense Advisor (/api/advisor)"
    ap1.font.name = FONT_HEADING
    ap1.font.size = Pt(13)
    ap1.font.bold = True
    ap1.font.color.rgb = ACCENT_PURPLE

    ai_points = [
        ("Multi-Model Resilient Fallback", "Sequentially routes through production Gemini models (gemini-3-flash-preview, gemini-3.1-flash-lite) for high-availability advice."),
        ("Bilingual Intelligence (English & Devanagari)", "Understands queries and outputs structured responses in both English and natural Hindi for inclusive accessibility."),
        ("Zero-Trust Response Structuring", "Provides clear headings, immediate containment steps (card freeze, UPI deactivation), and legal referral frameworks."),
        ("Offline Heuristic Intelligence Fallback", "Includes pre-configured offline response playbooks for Advance-Fee scams, Reverse QR debits, and Digital Arrest threats.")
    ]
    for h, d in ai_points:
        p = atf.add_paragraph()
        p.text = f"• {h}"
        p.font.name = FONT_HEADING
        p.font.size = Pt(10)
        p.font.bold = True
        p.font.color.rgb = TEXT_WHITE
        p.space_before = Pt(8)
        p2 = atf.add_paragraph()
        p2.text = d
        p2.font.name = FONT_BODY
        p2.font.size = Pt(9.2)
        p2.font.color.rgb = TEXT_MUTED
        p2.space_before = Pt(1)

    # Right Card: Indian Legal Alignment & Helplines
    legal_card = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8) + hw_col + hw_gap, hw_top, hw_col, hw_h)
    legal_card.fill.solid()
    legal_card.fill.fore_color.rgb = CARD_BG
    legal_card.line.color.rgb = ACCENT_EMERALD
    legal_card.line.width = Pt(1.2)
    ltf = legal_card.text_frame
    ltf.word_wrap = True
    ltf.margin_left = ltf.margin_right = ltf.margin_top = Inches(0.22)

    lp1 = ltf.paragraphs[0]
    lp1.text = "⚖️ Statutory Indian Legal Alignment & 1930 Protocol"
    lp1.font.name = FONT_HEADING
    lp1.font.size = Pt(13)
    lp1.font.bold = True
    lp1.font.color.rgb = ACCENT_EMERALD

    legal_points = [
        ("IT Act, 2000 — Section 66D", "Explicitly criminalizes cheating by personation using computer resources. Carries imprisonment up to 3 years and fines up to ₹1,00,000."),
        ("IT Act, 2000 — Section 43", "Civil liability and compensation for unauthorized access, data extraction, and introducing malicious payloads into systems."),
        ("The 'Golden Hour' 1930 Protocol", "The first 2 hours post-fraud are critical. Calling 1930 triggers I4C inter-bank nodal officers to freeze stolen capital before cash withdrawal."),
        ("National Reporting Portals", "Direct integration referrals to cybercrime.gov.in and Department of Telecom Chakshu Portal (sancharsaathi.gov.in/Chakshu).")
    ]
    for h, d in legal_points:
        p = ltf.add_paragraph()
        p.text = f"• {h}"
        p.font.name = FONT_HEADING
        p.font.size = Pt(10)
        p.font.bold = True
        p.font.color.rgb = TEXT_WHITE
        p.space_before = Pt(8)
        p2 = ltf.add_paragraph()
        p2.text = d
        p2.font.name = FONT_BODY
        p2.font.size = Pt(9.2)
        p2.font.color.rgb = TEXT_MUTED
        p2.space_before = Pt(1)

    # ==============================================================================
    # SLIDE 7: EMPIRICAL BENCHMARK & 98% ACCURACY EVALUATION
    # ==============================================================================
    s7 = prs.slides.add_slide(blank_layout)
    add_slide_header(s7, "Rigorous Evaluation", "Empirical Benchmark: 98% Detection Accuracy", "Evaluated against a sanitized 100-sample test corpus comprising 50 active scam vectors and 50 verified legitimate interactions.")

    # 4 Metric Boxes Across Top
    m_w = Inches(2.78)
    m_gap = Inches(0.19)
    m_top = Inches(1.8)
    m_h = Inches(1.3)

    metrics = [
        ("Accuracy", "98.0%", "98 / 100 Correct Classifications", ACCENT_EMERALD),
        ("Precision", "98.0%", "TP / (TP + FP) — Low False Alarms", ACCENT_CYAN),
        ("Recall", "98.0%", "TP / (TP + FN) — 49 / 50 Scams Caught", ACCENT_PURPLE),
        ("F1-Score", "98.0%", "Harmonic Mean of Precision & Recall", ACCENT_AMBER)
    ]

    for idx, (label, val, sub, col) in enumerate(metrics):
        box = s7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8) + idx * (m_w + m_gap), m_top, m_w, m_h)
        box.fill.solid()
        box.fill.fore_color.rgb = CARD_BG
        box.line.color.rgb = col
        box.line.width = Pt(1.2)
        btf = box.text_frame
        btf.word_wrap = True
        btf.margin_left = Inches(0.15)
        btf.margin_top = Inches(0.12)
        p1 = btf.paragraphs[0]
        p1.text = label.upper()
        p1.font.name = FONT_MONO
        p1.font.size = Pt(9.5)
        p1.font.bold = True
        p1.font.color.rgb = TEXT_MUTED

        p2 = btf.add_paragraph()
        p2.text = val
        p2.font.name = FONT_HEADING
        p2.font.size = Pt(22)
        p2.font.bold = True
        p2.font.color.rgb = col
        p2.space_before = Pt(2)

        p3 = btf.add_paragraph()
        p3.text = sub
        p3.font.name = FONT_BODY
        p3.font.size = Pt(8.5)
        p3.font.color.rgb = TEXT_MUTED
        p3.space_before = Pt(1)

    # 2 Big Cards: Confusion Matrix & Scoring Formula
    bw_w = Inches(5.7)
    bw_gap = Inches(0.3)
    bw_top = Inches(3.35)
    bw_h = Inches(3.35)

    # Confusion Matrix Card
    cm_card = s7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), bw_top, bw_w, bw_h)
    cm_card.fill.solid()
    cm_card.fill.fore_color.rgb = CARD_BG
    cm_card.line.color.rgb = CARD_BORDER
    cm_card.line.width = Pt(1)
    cmtf = cm_card.text_frame
    cmtf.word_wrap = True
    cmtf.margin_left = cmtf.margin_right = cmtf.margin_top = Inches(0.2)

    cp = cmtf.paragraphs[0]
    cp.text = "2×2 Empirical Confusion Matrix"
    cp.font.name = FONT_HEADING
    cp.font.size = Pt(13)
    cp.font.bold = True
    cp.font.color.rgb = TEXT_WHITE

    cm_desc = [
        ("True Positives (TP = 49)", "Active scam URLs, phishing SMS, and reverse UPI QRs accurately intercepted and scored HIGH_RISK."),
        ("False Positives (FP = 1)", "Only 1 legitimate message flagged due to conservative urgency weighting (safe side bias)."),
        ("False Negatives (FN = 1)", "1 novel phrasing variant; automatically routed to community reporting."),
        ("True Negatives (TN = 49)", "Official bank notifications and verified merchant QRs identified as SAFE with 0 false alarms.")
    ]
    for h, d in cm_desc:
        p = cmtf.add_paragraph()
        p.text = f"• {h}: {d}"
        p.font.name = FONT_BODY
        p.font.size = Pt(9.5)
        p.font.color.rgb = TEXT_MUTED
        p.space_before = Pt(5)

    # Scoring System Card
    sc_card = s7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8) + bw_w + bw_gap, bw_top, bw_w, bw_h)
    sc_card.fill.solid()
    sc_card.fill.fore_color.rgb = CARD_BG
    sc_card.line.color.rgb = CARD_BORDER
    sc_card.line.width = Pt(1)
    sctf = sc_card.text_frame
    sctf.word_wrap = True
    sctf.margin_left = sctf.margin_right = sctf.margin_top = Inches(0.2)

    sp = sctf.paragraphs[0]
    sp.text = "Standardized Threat Scoring System (0–100)"
    sp.font.name = FONT_HEADING
    sp.font.size = Pt(13)
    sp.font.bold = True
    sp.font.color.rgb = TEXT_WHITE

    sc_desc = [
        ("Weighted Heuristic Formula", "Score = (Domain Anomaly × 0.40) + (NLP Panic × 0.35) + (Protocol Masquerade × 0.25)."),
        ("🟢 SAFE (Score 0 – 29)", "Verified authentic domains, valid certificates, standard transactional receipts."),
        ("🟡 SUSPICIOUS (Score 30 – 64)", "Mild urgency keywords or unknown merchant VPAs; cautionary advice issued."),
        ("🔴 HIGH RISK (Score 65 – 100)", "Critical scam: typosquatting, reverse QR debit trap, or severe coercion. Immediate block recommended.")
    ]
    for h, d in sc_desc:
        p = sctf.add_paragraph()
        p.text = f"• {h}"
        p.font.name = FONT_HEADING
        p.font.size = Pt(10)
        p.font.bold = True
        p.font.color.rgb = ACCENT_CYAN if "Formula" in h else TEXT_WHITE
        p.space_before = Pt(5)
        p2 = sctf.add_paragraph()
        p2.text = d
        p2.font.name = FONT_BODY
        p2.font.size = Pt(9.2)
        p2.font.color.rgb = TEXT_MUTED
        p2.space_before = Pt(1)

    # ==============================================================================
    # SLIDE 8: PRODUCTION TECH STACK & SYSTEM ARCHITECTURE
    # ==============================================================================
    s8 = prs.slides.add_slide(blank_layout)
    add_slide_header(s8, "System Architecture", "Modern Production-Grade Technology Stack", "Full-stack Next.js 15 architecture engineered for sub-second responsiveness and zero-latency WebSocket sync.")

    stk_w = Inches(2.78)
    stk_gap = Inches(0.19)
    stk_top = Inches(1.8)
    stk_h = Inches(4.9)

    stacks = [
        (
            "Frontend & UI",
            ACCENT_CYAN,
            [
                ("Next.js 15 & React 19", "Modern App Router with client-side reactive components and server route optimization."),
                ("Tailwind CSS Variables", "High-craft minimalist UI inspired by ElevenLabs with 5 selectable themes."),
                ("Lucide React Icons", "Crisp, consistent iconography across all forensic dashboards."),
                ("Responsive Layout", "Mobile-first experience for citizens scanning suspicious links on smartphones.")
            ]
        ),
        (
            "Backend & Cloud",
            ACCENT_BLUE,
            [
                ("Firebase RTDB", "WebSocket-based persistent sync for live threat streams, scans, and site configuration."),
                ("Google Authentication", "Firebase Auth enabling citizen scan history vaults and admin role enforcement."),
                ("Next.js API Routes", "Production endpoints for /api/advisor, /api/analyze, /api/benchmark, and /api/reports."),
                ("Client Cache Sync", "Dual-sync persistence across browser localStorage and cloud RTDB.")
            ]
        ),
        (
            "Vision & AI Core",
            ACCENT_PURPLE,
            [
                ("Client-Edge jsQR", "In-browser QR code extraction via HTML5 Canvas — 0% server image exposure."),
                ("Google Gemini Flash API", "Advanced reasoning for natural language incident response and legal advice."),
                ("Zero-Trust Regex Core", "Custom high-speed patterns for Punycode, typosquatting, and UPI RFC protocols."),
                ("Offline Fallbacks", "Resilient heuristic engine operates seamlessly even during network degradation.")
            ]
        ),
        (
            "Security & DevOps",
            ACCENT_EMERALD,
            [
                ("Push-Protection Hygiene", "Strict credential separation via .env.local; zero secrets checked into git repository."),
                ("Clean Git Commit History", "Pushed cleanly to GitHub (YashRaj-Kushwaha/ScamShield-AI) tracking main branch."),
                ("Automated Test Harness", "100-sample benchmark runner validating accuracy before deployment."),
                ("Vercel Ready", "Production-optimized build with standalone chunks and static page generation.")
            ]
        )
    ]

    for idx, (s_title, s_color, s_items) in enumerate(stacks):
        card = s8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8) + idx * (stk_w + stk_gap), stk_top, stk_w, stk_h)
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_BG
        card.line.color.rgb = s_color
        card.line.width = Pt(1.2)
        ctf = card.text_frame
        ctf.word_wrap = True
        ctf.margin_left = ctf.margin_right = ctf.margin_top = Inches(0.18)

        cp1 = ctf.paragraphs[0]
        cp1.text = s_title
        cp1.font.name = FONT_HEADING
        cp1.font.size = Pt(13)
        cp1.font.bold = True
        cp1.font.color.rgb = s_color

        for it_h, it_d in s_items:
            p = ctf.add_paragraph()
            p.text = f"▸ {it_h}"
            p.font.name = FONT_HEADING
            p.font.size = Pt(10)
            p.font.bold = True
            p.font.color.rgb = TEXT_WHITE
            p.space_before = Pt(8)

            p2 = ctf.add_paragraph()
            p2.text = it_d
            p2.font.name = FONT_BODY
            p2.font.size = Pt(9.2)
            p2.font.color.rgb = TEXT_MUTED
            p2.space_before = Pt(1)

    # ==============================================================================
    # SLIDE 9: TRANSITION TO LIVE DEMONSTRATION (THE KEY DEMO SLIDE)
    # ==============================================================================
    s9 = prs.slides.add_slide(blank_layout)
    add_slide_header(s9, "Live Application Demo", "Interactive Live Demonstration Roadmap", "Seamless transition from theoretical architecture to active hands-on application execution.")

    demo_w = Inches(2.15)
    demo_gap = Inches(0.23)
    demo_top = Inches(1.8)
    demo_h = Inches(3.6)

    demo_steps = [
        (
            "Demo Step 1",
            "Threat Scanner",
            ACCENT_CYAN,
            "Scanning live phishing URLs (SBI bank clone) & reverse UPI QRs disguised as cashbacks; observing instant Red/Green verdicts."
        ),
        (
            "Demo Step 2",
            "Attack Simulator",
            ACCENT_AMBER,
            "Stepping through the 4-stage anatomy of a scam and viewing the visual pre-click interception barrier in real time."
        ),
        (
            "Demo Step 3",
            "Live Threat Stream",
            ACCENT_PURPLE,
            "Demonstrating the WebSocket live threat stream ticker and one-click IOC re-inspection directly into the scanner."
        ),
        (
            "Demo Step 4",
            "Gemini AI Advisor",
            ACCENT_EMERALD,
            "Querying live Hindi & English emergency cyber incident guidance and viewing statutory 1930 Golden Hour recommendations."
        ),
        (
            "Demo Step 5",
            "Admin Operations",
            ACCENT_RED,
            "Dispatching an emergency threat broadcast across the platform and demonstrating the sovereign RTDB history purge."
        )
    ]

    for idx, (st_num, st_name, st_col, st_desc) in enumerate(demo_steps):
        box = s9.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8) + idx * (demo_w + demo_gap), demo_top, demo_w, demo_h)
        box.fill.solid()
        box.fill.fore_color.rgb = CARD_BG
        box.line.color.rgb = st_col
        box.line.width = Pt(1.5)
        btf = box.text_frame
        btf.word_wrap = True
        btf.margin_left = btf.margin_right = btf.margin_top = Inches(0.16)

        p1 = btf.paragraphs[0]
        p1.text = st_num.upper()
        p1.font.name = FONT_MONO
        p1.font.size = Pt(9.5)
        p1.font.bold = True
        p1.font.color.rgb = st_col

        p2 = btf.add_paragraph()
        p2.text = st_name
        p2.font.name = FONT_HEADING
        p2.font.size = Pt(12.5)
        p2.font.bold = True
        p2.font.color.rgb = TEXT_WHITE
        p2.space_before = Pt(3)

        p3 = btf.add_paragraph()
        p3.text = st_desc
        p3.font.name = FONT_BODY
        p3.font.size = Pt(9.2)
        p3.font.color.rgb = TEXT_MUTED
        p3.space_before = Pt(8)

    # Large Handover Callout Box
    handover = s9.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(5.6), Inches(11.7), Inches(1.2))
    handover.fill.solid()
    handover.fill.fore_color.rgb = RGBColor(16, 32, 54)
    handover.line.color.rgb = ACCENT_CYAN
    handover.line.width = Pt(1.5)
    htf = handover.text_frame
    htf.word_wrap = True
    htf.margin_left = Inches(0.25)
    htf.margin_top = Inches(0.15)

    hp1 = htf.paragraphs[0]
    hp1.text = "🎯 READY FOR EVALUATION · SWITCHING TO LIVE RUNNING INSTANCE"
    hp1.font.name = FONT_MONO
    hp1.font.size = Pt(11)
    hp1.font.bold = True
    hp1.font.color.rgb = ACCENT_CYAN

    hp2 = htf.add_paragraph()
    hp2.text = "Now stepping into the live web application (http://localhost:3000) to showcase active client-edge execution across URLs, SMS messages, and QR codes."
    hp2.font.name = FONT_HEADING
    hp2.font.size = Pt(10.5)
    hp2.font.color.rgb = TEXT_WHITE
    hp2.space_before = Pt(3)

    # ==============================================================================
    # SLIDE 10: CONCLUSION, SUMMARY & TEAM D43M0N$
    # ==============================================================================
    s10 = prs.slides.add_slide(blank_layout)
    add_slide_header(s10, "Summary & Vision", "Building Beyond Boundaries: Protecting Digital India", "Empowering 1 billion+ citizens with proactive, pre-click cybersecurity defense.")

    # Left Column: 3 Pillars of Impact
    left_w = Inches(5.7)
    left_top = Inches(1.8)
    left_h = Inches(4.9)

    imp_card = s10.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), left_top, left_w, left_h)
    imp_card.fill.solid()
    imp_card.fill.fore_color.rgb = CARD_BG
    imp_card.line.color.rgb = ACCENT_CYAN
    imp_card.line.width = Pt(1.2)
    itf = imp_card.text_frame
    itf.word_wrap = True
    itf.margin_left = itf.margin_right = itf.margin_top = Inches(0.22)

    ip1 = itf.paragraphs[0]
    ip1.text = "🛡️ Core Impact & Strategic Value"
    ip1.font.name = FONT_HEADING
    ip1.font.size = Pt(13)
    ip1.font.bold = True
    ip1.font.color.rgb = ACCENT_CYAN

    impact_pillars = [
        ("Proactive Pre-Click Paradigm", "Shifts defense from post-incident banking forensics to pre-click citizen protection. Stops the scam before the victim enters their credentials or UPI PIN."),
        ("Linguistic & Social Inclusion", "Removes language barriers for rural and first-time UPI users with dual-tier Hindi/Hinglish analysis and Devanagari guidance."),
        ("Zero-Trust Edge Privacy", "Analyzes QR codes and links entirely within the client's browser without storing or uploading sensitive user photos or messages."),
        ("Collective Community Defense", "Synchronizes citizen incident stories and SecOps alerts nationwide in real-time through WebSocket-based threat streaming.")
    ]
    for h, d in impact_pillars:
        p = itf.add_paragraph()
        p.text = f"• {h}"
        p.font.name = FONT_HEADING
        p.font.size = Pt(10)
        p.font.bold = True
        p.font.color.rgb = TEXT_WHITE
        p.space_before = Pt(8)
        p2 = itf.add_paragraph()
        p2.text = d
        p2.font.name = FONT_BODY
        p2.font.size = Pt(9.2)
        p2.font.color.rgb = TEXT_MUTED
        p2.space_before = Pt(1)

    # Right Column: Team Roster & Contact
    right_card = s10.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8) + left_w + Inches(0.3), left_top, left_w, left_h)
    right_card.fill.solid()
    right_card.fill.fore_color.rgb = CARD_BG
    right_card.line.color.rgb = ACCENT_EMERALD
    right_card.line.width = Pt(1.2)
    rtf = right_card.text_frame
    rtf.word_wrap = True
    rtf.margin_left = rtf.margin_right = rtf.margin_top = Inches(0.22)

    rp1 = rtf.paragraphs[0]
    rp1.text = "👥 Team D43M0N$ — Roster & Project Links"
    rp1.font.name = FONT_HEADING
    rp1.font.size = Pt(13)
    rp1.font.bold = True
    rp1.font.color.rgb = ACCENT_EMERALD

    team_members_info = [
        ("Mangal Nath Yadav", "Reg No: 26BHI10047 · VIT Bhopal University"),
        ("Aastik Tripathi", "Reg No: 26BCY10090 · VIT Bhopal University"),
        ("Yash Raj Kushwaha", "Reg No: 26BCE10122 · VIT Bhopal University"),
        ("Palak Kalra", "Reg No: 26BCY10001 · VIT Bhopal University")
    ]
    for name, reg in team_members_info:
        p = rtf.add_paragraph()
        p.text = f"▸ {name}"
        p.font.name = FONT_HEADING
        p.font.size = Pt(10.5)
        p.font.bold = True
        p.font.color.rgb = TEXT_WHITE
        p.space_before = Pt(8)
        p2 = rtf.add_paragraph()
        p2.text = reg
        p2.font.name = FONT_BODY
        p2.font.size = Pt(9)
        p2.font.color.rgb = TEXT_MUTED
        p2.space_before = Pt(1)

    # Project Link box
    p_link = rtf.add_paragraph()
    p_link.text = "🔗 GitHub Repository: github.com/YashRaj-Kushwaha/ScamShield-AI"
    p_link.font.name = FONT_MONO
    p_link.font.size = Pt(9.5)
    p_link.font.bold = True
    p_link.font.color.rgb = ACCENT_CYAN
    p_link.space_before = Pt(12)

    p_stat = rtf.add_paragraph()
    p_stat.text = "Thank you, Judges & Evaluators! We welcome your questions."
    p_stat.font.name = FONT_HEADING
    p_stat.font.size = Pt(10.5)
    p_stat.font.italic = True
    p_stat.font.color.rgb = ACCENT_AMBER
    p_stat.space_before = Pt(4)

    # Save presentations
    output_filename = "D43M0N$_CYBERSECURITY_ScamShield_AI.pptx"
    prs.save(output_filename)
    print(f"Presentation saved successfully to {output_filename} (10 Widescreen 16:9 Slides)!")

    # Also make a copy with generic name for convenience
    prs.save("ScamShield_AI_Pitch_Deck.pptx")
    print("Saved clean copy to ScamShield_AI_Pitch_Deck.pptx!")

if __name__ == "__main__":
    create_presentation()
