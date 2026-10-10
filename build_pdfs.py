import re
import subprocess
import os

def render_md_to_html(md_path):
    cmd = ["npx", "--yes", "marked", md_path]
    res = subprocess.run(cmd, capture_output=True, text=True, check=True)
    return res.stdout

def replace_mermaid_in_docs(html_content):
    # Diagram 1: 4-Stage Attack Sequence using Table for perfect print rendering
    diagram1_html = """
    <table style="width:100%; border-collapse:separate; border-spacing:6pt; border:none; margin:14pt 0;">
        <tr>
            <td style="width:22%; background:#eff6ff; border:1.5pt solid #3b82f6; border-radius:6pt; padding:8pt; text-align:center; vertical-align:top;">
                <div style="font-size:7.5pt; font-weight:800; text-transform:uppercase; color:#2563eb; letter-spacing:0.5pt;">Stage 1</div>
                <div style="font-size:9.5pt; font-weight:700; color:#0f172a; margin:3pt 0;">Initial Contact</div>
                <div style="font-size:8pt; color:#475569; line-height:1.3;">Unsolicited SMS/WhatsApp from unknown sender</div>
            </td>
            <td style="width:4%; border:none; text-align:center; vertical-align:middle; font-size:16pt; font-weight:bold; color:#94a3b8;">&rarr;</td>
            <td style="width:22%; background:#fffbeb; border:1.5pt solid #f59e0b; border-radius:6pt; padding:8pt; text-align:center; vertical-align:top;">
                <div style="font-size:7.5pt; font-weight:800; text-transform:uppercase; color:#d97706; letter-spacing:0.5pt;">Stage 2</div>
                <div style="font-size:9.5pt; font-weight:700; color:#0f172a; margin:3pt 0;">Panic Pressure</div>
                <div style="font-size:8pt; color:#475569; line-height:1.3;">Manufactured urgency & artificial 24h deadline</div>
            </td>
            <td style="width:4%; border:none; text-align:center; vertical-align:middle; font-size:16pt; font-weight:bold; color:#94a3b8;">&rarr;</td>
            <td style="width:22%; background:#fff1f2; border:1.5pt solid #f43f5e; border-radius:6pt; padding:8pt; text-align:center; vertical-align:top;">
                <div style="font-size:7.5pt; font-weight:800; text-transform:uppercase; color:#e11d48; letter-spacing:0.5pt;">Stage 3</div>
                <div style="font-size:9.5pt; font-weight:700; color:#0f172a; margin:3pt 0;">Credential Capture</div>
                <div style="font-size:8pt; color:#475569; line-height:1.3;">Pixel-perfect bank clone harvesting login/PIN</div>
            </td>
            <td style="width:4%; border:none; text-align:center; vertical-align:middle; font-size:16pt; font-weight:bold; color:#94a3b8;">&rarr;</td>
            <td style="width:22%; background:#fef2f2; border:1.5pt solid #dc2626; border-radius:6pt; padding:8pt; text-align:center; vertical-align:top;">
                <div style="font-size:7.5pt; font-weight:800; text-transform:uppercase; color:#b91c1c; letter-spacing:0.5pt;">Stage 4</div>
                <div style="font-size:9.5pt; font-weight:700; color:#0f172a; margin:3pt 0;">Capital Siphon</div>
                <div style="font-size:8pt; color:#475569; line-height:1.3;">Instant UPI drain to secondary mule account</div>
            </td>
        </tr>
    </table>
    """
    
    # Diagram 2: Architecture Overview using Table structure
    diagram2_html = """
    <table style="width:100%; border-collapse:collapse; margin:14pt 0; border:1.5pt solid #cbd5e1; border-radius:8pt; background:#f8fafc;">
        <tr>
            <td style="padding:10pt; border:none;">
                <div style="background:#ffffff; border:1.5pt solid #bfdbfe; border-radius:6pt; padding:8pt; margin-bottom:8pt;">
                    <div style="font-size:8pt; font-weight:800; text-transform:uppercase; color:#1e40af; letter-spacing:0.5pt; margin-bottom:5pt;">
                        &#9654; FRONTEND LAYER (Next.js 15 &bull; React 19 &bull; TypeScript &bull; Tailwind CSS)
                    </div>
                    <table style="width:100%; border-collapse:separate; border-spacing:4pt; border:none; margin:0;">
                        <tr>
                            <td style="background:#f1f5f9; border:1pt solid #cbd5e1; border-radius:4pt; padding:4pt 6pt; text-align:center; font-size:8pt; font-weight:600;">Threat Scanner View</td>
                            <td style="background:#f1f5f9; border:1pt solid #cbd5e1; border-radius:4pt; padding:4pt 6pt; text-align:center; font-size:8pt; font-weight:600;">Attack Simulator</td>
                            <td style="background:#f1f5f9; border:1pt solid #cbd5e1; border-radius:4pt; padding:4pt 6pt; text-align:center; font-size:8pt; font-weight:600;">Scan History Vault</td>
                            <td style="background:#f1f5f9; border:1pt solid #cbd5e1; border-radius:4pt; padding:4pt 6pt; text-align:center; font-size:8pt; font-weight:600;">Awareness Stories</td>
                            <td style="background:#f1f5f9; border:1pt solid #cbd5e1; border-radius:4pt; padding:4pt 6pt; text-align:center; font-size:8pt; font-weight:600;">Admin Console</td>
                        </tr>
                    </table>
                </div>

                <div style="text-align:center; font-size:9pt; font-weight:bold; color:#475569; margin:4pt 0;">
                    &darr; REST API Endpoints (/api/analyze &bull; /api/benchmark &bull; /api/reports) &darr;
                </div>

                <div style="background:#dbeafe; border:1.5pt solid #3b82f6; border-radius:6pt; padding:8pt; margin-bottom:8pt; text-align:center;">
                    <div style="font-size:8pt; font-weight:800; text-transform:uppercase; color:#1e3a8a; letter-spacing:0.5pt; margin-bottom:2pt;">
                        &#9654; THREAT SYNTHESIS LAYER
                    </div>
                    <div style="font-size:10pt; font-weight:800; color:#1e3a8a;">
                        Omni Threat Scorer Engine (Zero-Trust 0-100 Synthesis Matrix)
                    </div>
                </div>

                <div style="text-align:center; font-size:9pt; font-weight:bold; color:#475569; margin:4pt 0;">
                    &darr; Multi-Vector Static & Linguistic Analysis &darr;
                </div>

                <table style="width:100%; border-collapse:separate; border-spacing:6pt; border:none; margin:0;">
                    <tr>
                        <td style="width:33%; background:#ecfdf5; border:1.5pt solid #10b981; border-radius:6pt; padding:8pt; text-align:center; vertical-align:top;">
                            <div style="font-size:7.5pt; font-weight:800; text-transform:uppercase; color:#065f46;">Engine 1</div>
                            <div style="font-size:9pt; font-weight:700; color:#064e3b; margin:2pt 0;">Link Inspector</div>
                            <div style="font-size:7.5pt; color:#047857;">Typosquatting &bull; Punycode &bull; TLD Risk &bull; SSL Trust</div>
                        </td>
                        <td style="width:33%; background:#f5f3ff; border:1.5pt solid #8b5cf6; border-radius:6pt; padding:8pt; text-align:center; vertical-align:top;">
                            <div style="font-size:7.5pt; font-weight:800; text-transform:uppercase; color:#5b21b6;">Engine 2</div>
                            <div style="font-size:9pt; font-weight:700; color:#4c1d95; margin:2pt 0;">Multilingual NLP</div>
                            <div style="font-size:7.5pt; color:#6d28d9;">Urgency Heuristics &bull; Hindi/Hinglish &bull; Authority Impersonation</div>
                        </td>
                        <td style="width:33%; background:#fff7ed; border:1.5pt solid #f97316; border-radius:6pt; padding:8pt; text-align:center; vertical-align:top;">
                            <div style="font-size:7.5pt; font-weight:800; text-transform:uppercase; color:#9a3412;">Engine 3</div>
                            <div style="font-size:9pt; font-weight:700; color:#7c2d12; margin:2pt 0;">UPI & QR Sentinel</div>
                            <div style="font-size:7.5pt; color:#c2410c;">Reverse-Debit Trap &bull; VPA Masquerade &bull; jsQR Client Decode</div>
                        </td>
                    </tr>
                </table>

                <div style="text-align:center; font-size:9pt; font-weight:bold; color:#475569; margin:4pt 0;">
                    &darr; Real-Time Data Sync & Fallback Storage &darr;
                </div>

                <div style="background:#fef3c7; border:1.5pt solid #f59e0b; border-radius:6pt; padding:8pt; text-align:center;">
                    <div style="font-size:8pt; font-weight:800; text-transform:uppercase; color:#92400e; letter-spacing:0.5pt; margin-bottom:2pt;">
                        &#9654; DATA LAYER (Firebase RTDB WebSocket Sync &bull; Google Auth &bull; LocalStorage Fallback)
                    </div>
                </div>
            </td>
        </tr>
    </table>
    """

    def mermaid_replacer(match):
        content = match.group(0)
        if "Stage 1" in content:
            return diagram1_html
        elif "Frontend" in content or "Architecture" in content or "Omni" in content:
            return diagram2_html
        return content

    pattern = re.compile(r'<pre><code class="language-mermaid">[\s\S]*?</code></pre>')
    html_content = pattern.sub(mermaid_replacer, html_content)
    return html_content

def build_styled_doc_html(body_html, title):
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>{title}</title>
<style>
    @page {{
        size: A4;
        margin: 18mm 16mm 18mm 16mm;
    }}
    
    body {{
        font-family: 'Noto Sans', 'Noto Sans Devanagari', 'Liberation Sans', sans-serif;
        color: #1e293b;
        background: #ffffff;
        line-height: 1.55;
        font-size: 9.8pt;
        margin: 0;
        padding: 0;
    }}

    h1 {{
        font-size: 19pt;
        color: #0f172a;
        font-weight: 800;
        margin-top: 0;
        margin-bottom: 8pt;
        padding-bottom: 6pt;
        border-bottom: 2.5pt solid #2563eb;
        page-break-after: avoid;
    }}

    h2 {{
        font-size: 13.5pt;
        color: #1e3a8a;
        font-weight: 700;
        margin-top: 18pt;
        margin-bottom: 6pt;
        padding-bottom: 3pt;
        border-bottom: 1pt solid #cbd5e1;
        page-break-after: avoid;
    }}

    h3 {{
        font-size: 11pt;
        color: #0f172a;
        font-weight: 700;
        margin-top: 12pt;
        margin-bottom: 4pt;
        page-break-after: avoid;
    }}

    p {{
        margin-top: 0;
        margin-bottom: 7pt;
    }}

    blockquote {{
        margin: 10pt 0;
        padding: 8pt 12pt;
        background-color: #f8fafc;
        border-left: 4pt solid #2563eb;
        border-radius: 0 6pt 6pt 0;
        color: #334155;
        font-size: 9.5pt;
        page-break-inside: avoid;
    }}

    blockquote p:last-child {{
        margin-bottom: 0;
    }}

    table {{
        width: 100%;
        border-collapse: collapse;
        margin: 10pt 0 14pt 0;
        font-size: 9pt;
        page-break-inside: avoid;
    }}

    th {{
        background-color: #0f172a;
        color: #ffffff;
        font-weight: 700;
        text-align: left;
        padding: 6pt 8pt;
        border: 1pt solid #0f172a;
    }}

    td {{
        padding: 5.5pt 8pt;
        border: 1pt solid #cbd5e1;
        vertical-align: top;
    }}

    tbody tr:nth-child(even) {{
        background-color: #f8fafc;
    }}

    code {{
        font-family: 'Liberation Mono', 'DejaVu Sans Mono', Consolas, monospace;
        font-size: 8.5pt;
        background: #f1f5f9;
        color: #0f172a;
        padding: 1.5pt 4pt;
        border-radius: 3pt;
        border: 1pt solid #e2e8f0;
    }}

    pre {{
        background: #0f172a;
        color: #f8fafc;
        padding: 8pt 10pt;
        border-radius: 6pt;
        font-size: 8pt;
        line-height: 1.4;
        margin: 8pt 0 12pt 0;
        page-break-inside: avoid;
    }}

    pre code {{
        background: transparent;
        color: inherit;
        border: none;
        padding: 0;
    }}

    ul, ol {{
        margin-top: 0;
        margin-bottom: 8pt;
        padding-left: 18pt;
    }}

    li {{
        margin-bottom: 3pt;
    }}

    hr {{
        border: none;
        border-top: 1pt solid #e2e8f0;
        margin: 14pt 0;
    }}

    a {{
        color: #2563eb;
        text-decoration: none;
    }}
</style>
</head>
<body>
{body_html}
</body>
</html>"""

def build_styled_script_html(body_html, title):
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>{title}</title>
<style>
    @page {{
        size: A4;
        margin: 18mm 16mm 18mm 16mm;
    }}
    
    body {{
        font-family: 'Noto Sans', 'Noto Sans Devanagari', 'Liberation Sans', sans-serif;
        color: #1e293b;
        background: #ffffff;
        line-height: 1.6;
        font-size: 10pt;
        margin: 0;
        padding: 0;
    }}

    h1 {{
        font-size: 19pt;
        color: #0f172a;
        font-weight: 800;
        margin-top: 0;
        margin-bottom: 8pt;
        padding-bottom: 6pt;
        border-bottom: 2.5pt solid #7c3aed;
        page-break-after: avoid;
    }}

    h2 {{
        font-size: 13.5pt;
        color: #4338ca;
        font-weight: 700;
        margin-top: 18pt;
        margin-bottom: 6pt;
        padding-bottom: 3pt;
        border-bottom: 1pt solid #cbd5e1;
        page-break-after: avoid;
    }}

    h3 {{
        font-size: 11pt;
        color: #0f172a;
        font-weight: 700;
        margin-top: 14pt;
        margin-bottom: 4pt;
        page-break-after: avoid;
    }}

    h4 {{
        font-size: 10.5pt;
        color: #1e293b;
        font-weight: 700;
        margin-top: 10pt;
        margin-bottom: 3pt;
        page-break-after: avoid;
    }}

    p {{
        margin-top: 0;
        margin-bottom: 6pt;
    }}

    blockquote {{
        margin: 8pt 0 12pt 0;
        padding: 8pt 14pt;
        background-color: #f8fafc;
        border-left: 4.5pt solid #6366f1;
        border-radius: 0 6pt 6pt 0;
        color: #1e293b;
        font-size: 9.8pt;
        line-height: 1.6;
        page-break-inside: avoid;
    }}

    blockquote p:last-child {{
        margin-bottom: 0;
    }}

    em {{
        color: #475569;
        font-style: italic;
        background: #f1f5f9;
        padding: 1.5pt 5pt;
        border-radius: 4pt;
        font-size: 9pt;
    }}

    table {{
        width: 100%;
        border-collapse: collapse;
        margin: 10pt 0 14pt 0;
        font-size: 9pt;
        page-break-inside: avoid;
    }}

    th {{
        background-color: #0f172a;
        color: #ffffff;
        font-weight: 700;
        text-align: left;
        padding: 6pt 8pt;
        border: 1pt solid #0f172a;
    }}

    td {{
        padding: 5.5pt 8pt;
        border: 1pt solid #cbd5e1;
        vertical-align: top;
    }}

    tbody tr:nth-child(even) {{
        background-color: #f8fafc;
    }}

    code {{
        font-family: 'Liberation Mono', 'DejaVu Sans Mono', Consolas, monospace;
        font-size: 8.5pt;
        background: #f1f5f9;
        color: #0f172a;
        padding: 1.5pt 4pt;
        border-radius: 3pt;
        border: 1pt solid #e2e8f0;
    }}

    ul, ol {{
        margin-top: 0;
        margin-bottom: 8pt;
        padding-left: 18pt;
    }}

    li {{
        margin-bottom: 3pt;
    }}

    hr {{
        border: none;
        border-top: 1pt solid #e2e8f0;
        margin: 14pt 0;
    }}
</style>
</head>
<body>
{body_html}
</body>
</html>"""

def main():
    print("Step 1: Converting README.md...")
    raw_doc_html = render_md_to_html("README.md")
    processed_doc_html = replace_mermaid_in_docs(raw_doc_html)
    full_doc_html = build_styled_doc_html(processed_doc_html, "ScamShield AI - Technical Documentation")
    
    with open("temp_doc.html", "w", encoding="utf-8") as f:
        f.write(full_doc_html)

    print("Step 2: Compiling public/FULL_DOCUMENTATION.pdf...")
    subprocess.run([
        "libreoffice", "--headless", "--convert-to", "pdf",
        "temp_doc.html", "--outdir", "public"
    ], check=True)

    if os.path.exists("public/temp_doc.pdf"):
        os.replace("public/temp_doc.pdf", "public/FULL_DOCUMENTATION.pdf")
    if os.path.exists("temp_doc.html"):
        os.remove("temp_doc.html")

    print("Complete!")

if __name__ == "__main__":
    main()
