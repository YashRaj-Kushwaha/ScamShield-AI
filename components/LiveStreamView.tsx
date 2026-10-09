"use client";

import React, { useState, useEffect } from "react";
import { 
  Radio, 
  ShieldAlert, 
  AlertTriangle, 
  ExternalLink, 
  ArrowRight, 
  Copy, 
  Check, 
  Search, 
  Filter, 
  Bell, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Shield, 
  Globe, 
  MessageSquare, 
  QrCode,
  Share2
} from "lucide-react";
import { ThreatReport, subscribeToRealtimeThreatReports } from "@/lib/firebase";
import { Language } from "@/lib/i18n";

interface LiveStreamViewProps {
  onReinspect: (target: string, type: "url" | "message" | "qr") => void;
  language: Language;
  t: any;
}

export default function LiveStreamView({ onReinspect, language, t }: LiveStreamViewProps) {
  const [reports, setReports] = useState<ThreatReport[]>([]);
  const [filter, setFilter] = useState<"all" | "broadcasts" | "high" | "url" | "message" | "qr">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(false);

  useEffect(() => {
    const unsub = subscribeToRealtimeThreatReports((list) => {
      setReports(list);
    });
    return () => unsub();
  }, []);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleShare = (report: ThreatReport) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(
        `🚨 ScamShield AI Threat Alert: [${report.riskLevel}] ${report.target}\nSummary: ${report.summary}\nTake Action: Do not interact with this vector.`
      );
      setCopiedId(report.id || "shared");
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const filteredReports = reports.filter((r) => {
    if (!r) return false;
    const isBroadcast = (r.summary || "").includes("[ADMIN BROADCAST]");
    if (filter === "broadcasts" && !isBroadcast) return false;
    if (filter === "high" && (r.riskScore ?? 0) < 70) return false;
    if (filter === "url" && r.type !== "url") return false;
    if (filter === "message" && r.type !== "message") return false;
    if (filter === "qr" && r.type !== "qr") return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const targetStr = (r.target || "").toLowerCase();
      const summaryStr = (r.summary || "").toLowerCase();
      return targetStr.includes(q) || summaryStr.includes(q);
    }
    return true;
  });

  const broadcastAlerts = reports.filter(r => (r.summary || "").includes("[ADMIN BROADCAST]"));
  const criticalThreats = reports.filter(r => (r.riskScore ?? 0) >= 70);

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-5xl mx-auto">
      {/* Top Banner Header */}
      <div className="surface-card rounded-2xl p-6 sm:p-7 shadow-2xs relative overflow-hidden border border-app-border">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-rose-500/10 text-rose-600 border border-rose-500/20 flex items-center space-x-1.5">
                <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
                <span>Live Broadcast Stream</span>
              </span>
              <span className="text-xs font-mono text-app-muted">
                Real-Time Network Telemetry · WebSocket Active
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-app-text mt-1.5 tracking-tight">
              {language === "hi" ? "लाइव साइबर थ्रेट ब्रॉडकास्ट स्ट्रीम" : "Live Cyber Threat Broadcast Stream"}
            </h1>
            <p className="text-xs text-app-muted mt-0.5">
              {language === "hi"
                ? "नेटवर्क सुरक्षा और एडमिन द्वारा सीधे प्रसारित किए गए नए फ़िशिंग लिंक व यूपीआई धोखाधड़ी अलर्ट्स"
                : "Real-time threat advisories & scam vectors broadcasted across the network by SecOps administrators"}
            </p>
          </div>

          <div className="flex items-center space-x-3 self-start md:self-auto shrink-0">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2.5 rounded-xl border border-app-border bg-app-surface hover:bg-app-surface-subtle text-xs text-app-muted hover:text-app-text transition"
              title={soundEnabled ? "Mute alert chime" : "Enable alert chime"}
            >
              {soundEnabled ? <Volume2 className="h-4 w-4 text-emerald-500" /> : <VolumeX className="h-4 w-4" />}
            </button>
            <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Network Feed Active</span>
            </span>
          </div>
        </div>

        {/* Live Metrics Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-app-border/80 text-center font-mono">
          <div className="p-3 rounded-xl bg-app-surface-subtle border border-app-border">
            <div className="text-[10px] text-app-muted uppercase">Live Broadcasts</div>
            <div className="text-lg font-bold text-amber-500">{broadcastAlerts.length}</div>
          </div>
          <div className="p-3 rounded-xl bg-app-surface-subtle border border-app-border">
            <div className="text-[10px] text-app-muted uppercase">Critical Threats</div>
            <div className="text-lg font-bold text-rose-500">{criticalThreats.length}</div>
          </div>
          <div className="p-3 rounded-xl bg-app-surface-subtle border border-app-border">
            <div className="text-[10px] text-app-muted uppercase">Network Stream Total</div>
            <div className="text-lg font-bold text-app-text">{reports.length}</div>
          </div>
          <div className="p-3 rounded-xl bg-app-surface-subtle border border-app-border">
            <div className="text-[10px] text-app-muted uppercase">Zero-Trust Intercepts</div>
            <div className="text-lg font-bold text-emerald-500">100%</div>
          </div>
        </div>
      </div>

      {/* Breaking Broadcast Highlight (If any admin broadcast exists) */}
      {broadcastAlerts.length > 0 && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-rose-500/10 via-amber-500/10 to-transparent border border-rose-500/30 space-y-2 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500 text-white uppercase tracking-wider">
                Breaking Admin Advisory
              </span>
              <span className="text-xs font-mono text-app-muted">
                {broadcastAlerts[0].timestamp ? new Date(broadcastAlerts[0].timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now"}
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-rose-600">
              Score: {broadcastAlerts[0].riskScore}/100
            </span>
          </div>
          <div className="text-sm font-bold text-app-text">
            {broadcastAlerts[0].target}
          </div>
          <p className="text-xs text-app-secondary leading-relaxed">
            {broadcastAlerts[0].summary.replace("[ADMIN BROADCAST] ", "")}
          </p>
          <div className="pt-1 flex items-center space-x-2">
            <button
              onClick={() => onReinspect(broadcastAlerts[0].target, broadcastAlerts[0].type as any)}
              className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center space-x-1.5 transition shadow-2xs"
            >
              <span>Scan This Threat Now</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              filter === "all"
                ? "bg-app-accent text-white"
                : "bg-app-surface text-app-muted hover:text-app-text border border-app-border"
            }`}
          >
            All Stream ({reports.length})
          </button>
          <button
            onClick={() => setFilter("broadcasts")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              filter === "broadcasts"
                ? "bg-amber-500 text-white"
                : "bg-app-surface text-app-muted hover:text-amber-600 border border-app-border"
            }`}
          >
            Advisories ({broadcastAlerts.length})
          </button>
          <button
            onClick={() => setFilter("high")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              filter === "high"
                ? "bg-rose-600 text-white"
                : "bg-app-surface text-app-muted hover:text-rose-600 border border-app-border"
            }`}
          >
            High Risk ({criticalThreats.length})
          </button>
          <button
            onClick={() => setFilter("url")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              filter === "url"
                ? "bg-app-accent text-white"
                : "bg-app-surface text-app-muted hover:text-app-text border border-app-border"
            }`}
          >
            Links
          </button>
          <button
            onClick={() => setFilter("message")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              filter === "message"
                ? "bg-app-accent text-white"
                : "bg-app-surface text-app-muted hover:text-app-text border border-app-border"
            }`}
          >
            SMS / Social
          </button>
          <button
            onClick={() => setFilter("qr")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              filter === "qr"
                ? "bg-app-accent text-white"
                : "bg-app-surface text-app-muted hover:text-app-text border border-app-border"
            }`}
          >
            QR / UPI
          </button>
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-app-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search stream vectors..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-app-surface border border-app-border text-xs focus:outline-none focus:ring-1 focus:ring-app-accent text-app-text"
          />
        </div>
      </div>

      {/* Stream List Cards */}
      <div className="space-y-3.5">
        {filteredReports.length === 0 ? (
          <div className="surface-card rounded-2xl p-10 text-center border border-app-border space-y-2">
            <Radio className="h-8 w-8 text-app-muted mx-auto animate-pulse" />
            <h3 className="text-sm font-bold text-app-text">Awaiting Live Network Broadcasts</h3>
            <p className="text-xs text-app-muted max-w-sm mx-auto">
              No threat alerts match this filter. As new scans and SecOps advisories are broadcasted to Firebase RTDB, they appear here live.
            </p>
          </div>
        ) : (
          filteredReports.map((report, idx) => {
            const isHigh = (report.riskScore ?? 0) >= 70;
            const isBroadcast = (report.summary || "").includes("[ADMIN BROADCAST]");
            const flagsList = Array.isArray(report.flags) ? report.flags : [];

            return (
              <div
                key={report.id || `stream-${idx}`}
                style={{ animationDelay: `${Math.min(idx * 35, 300)}ms` }}
                className={`surface-card rounded-2xl p-5 shadow-2xs border transition space-y-3 animate-fade-in-up ${
                  isBroadcast
                    ? "border-amber-500/40 bg-amber-500/[0.02]"
                    : isHigh
                    ? "border-rose-500/30 hover:border-rose-500/50"
                    : "border-app-border hover:border-app-accent/30"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="flex items-center space-x-2">
                    <span className={`text-[10px] font-mono uppercase font-bold px-2.5 py-0.5 rounded-full border ${
                      isBroadcast
                        ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                        : isHigh
                        ? "bg-rose-500/10 text-rose-600 border-rose-500/20"
                        : "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                    }`}>
                      {isBroadcast ? "Admin Broadcast Advisory" : `Score: ${report.riskScore ?? 0}/100 · ${report.riskLevel}`}
                    </span>

                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-app-surface-subtle text-app-muted border border-app-border flex items-center space-x-1">
                      {report.type === "url" && <Globe className="h-3 w-3 text-rose-500" />}
                      {report.type === "message" && <MessageSquare className="h-3 w-3 text-purple-500" />}
                      {report.type === "qr" && <QrCode className="h-3 w-3 text-emerald-500" />}
                      <span>{(report.type || "vector").toUpperCase()}</span>
                    </span>

                    <span className="text-[10px] font-mono text-app-muted">
                      {report.timestamp ? new Date(report.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Live"}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleCopy(report.id || `c-${idx}`, report.target)}
                      className="px-2.5 py-1 rounded-lg border border-app-border bg-app-surface hover:bg-app-surface-subtle text-xs text-app-muted hover:text-app-text transition flex items-center space-x-1"
                      title="Copy vector target"
                    >
                      {copiedId === (report.id || `c-${idx}`) ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-500" />
                          <span className="text-[10px]">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span className="text-[10px]">Copy</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleShare(report)}
                      className="p-1 rounded-lg border border-app-border bg-app-surface hover:bg-app-surface-subtle text-app-muted hover:text-app-text transition"
                      title="Share Threat Advisory"
                    >
                      <Share2 className="h-3.5 w-3.5" />
                    </button>

                    <button
                      onClick={() => onReinspect(report.target, report.type as any)}
                      className="px-3 py-1 rounded-lg bg-app-accent hover:opacity-90 text-white font-semibold text-xs transition flex items-center space-x-1 shadow-2xs"
                    >
                      <span>Analyze</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="font-mono text-xs font-bold text-app-text break-all">
                    {report.target}
                  </div>
                  <p className="text-xs text-app-secondary leading-relaxed">
                    {report.summary}
                  </p>
                </div>

                {flagsList.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {flagsList.map((flag, fIdx) => (
                      <span
                        key={fIdx}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-app-surface-subtle text-app-muted border border-app-border"
                      >
                        {flag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
