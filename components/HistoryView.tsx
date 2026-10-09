"use client";

import React, { useState, useEffect } from "react";
import { 
  Clock, 
  Trash2, 
  ShieldCheck, 
  ShieldAlert, 
  Search, 
  RefreshCw, 
  ArrowRight, 
  Link as LinkIcon, 
  MessageSquare, 
  QrCode,
  LogIn,
  Copy,
  Check,
  Sparkles
} from "lucide-react";
import { UserScanRecord, subscribeToUserScans, deleteUserScanRecord } from "@/lib/firebase";
import { Language } from "@/lib/i18n";
import { User } from "firebase/auth";

interface HistoryViewProps {
  user: User | null;
  onSelectScanForReinspect: (target: string, type: "url" | "message" | "qr") => void;
  onSignIn: () => void;
  language: Language;
  t: any;
}

export default function HistoryView({
  user,
  onSelectScanForReinspect,
  onSignIn,
  language,
  t
}: HistoryViewProps) {
  const [scans, setScans] = useState<UserScanRecord[]>([]);
  const [filter, setFilter] = useState<"all" | "scams" | "safe">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyTarget = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const targetUserId = user ? user.uid : "guest-user";

  useEffect(() => {
    setLoading(true);
    const unsub = subscribeToUserScans(targetUserId, (list) => {
      setScans(list);
      setLoading(false);
    });
    return () => unsub();
  }, [targetUserId]);

  const handleDelete = async (scanId: string) => {
    await deleteUserScanRecord(targetUserId, scanId);
  };

  const filteredScans = scans.filter((s) => {
    if (filter === "scams" && s.riskScore < 50) return false;
    if (filter === "safe" && s.riskScore >= 50) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        s.target.toLowerCase().includes(q) ||
        s.summary.toLowerCase().includes(q) ||
        s.type.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-app-surface-subtle border border-app-border text-app-accent">
              Personal Vault
            </span>
            <span className="text-xs font-mono text-app-muted">
              Firebase RTDB Sync
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-app-text mt-1">
            {t.historyTitle}
          </h1>
          <p className="text-xs text-app-muted mt-0.5">
            {t.historySubtitle}
          </p>
        </div>

        {/* User Account / Google Sign-in Prompt if guest */}
        {!user && (
          <button
            onClick={onSignIn}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-app-surface hover:bg-app-surface-subtle border border-app-border text-xs font-semibold text-app-text transition shadow-2xs self-start sm:self-auto"
          >
            <LogIn className="h-3.5 w-3.5 text-blue-500" />
            <span>{t.signIn}</span>
          </button>
        )}
      </div>

      {/* Guest Notice Banner if not logged in */}
      {!user && (
        <div className="p-3.5 rounded-xl bg-app-surface-subtle border border-app-border flex items-center justify-between gap-3 text-xs">
          <p className="text-app-muted">
            {t.historySignInPrompt}
          </p>
          <button
            onClick={onSignIn}
            className="text-app-accent font-semibold underline whitespace-nowrap"
          >
            Sign in now
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="surface-card rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Filter Pills */}
        <div className="flex bg-app-surface-subtle p-0.5 rounded-xl border border-app-border text-xs self-start">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              filter === "all" ? "bg-app-surface text-app-text font-bold shadow-2xs" : "text-app-muted hover:text-app-text"
            }`}
          >
            {t.historyFilterAll} ({scans.length})
          </button>
          <button
            onClick={() => setFilter("scams")}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              filter === "scams" ? "bg-app-surface text-app-text font-bold shadow-2xs text-red-600" : "text-app-muted hover:text-app-text"
            }`}
          >
            {t.historyFilterScams} ({scans.filter(s => s.riskScore >= 50).length})
          </button>
          <button
            onClick={() => setFilter("safe")}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              filter === "safe" ? "bg-app-surface text-app-text font-bold shadow-2xs text-emerald-600" : "text-app-muted hover:text-app-text"
            }`}
          >
            {t.historyFilterSafe} ({scans.filter(s => s.riskScore < 50).length})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-app-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search past scans..."
            className="w-full bg-app-surface-subtle border border-app-border rounded-xl pl-9 pr-3 py-1.5 text-xs text-app-text placeholder-app-muted focus:outline-none focus:border-app-accent"
          />
        </div>
      </div>

      {/* Scans List */}
      <div className="space-y-3">
        {loading ? (
          /* Lazy Loading Shimmer Skeletons */
          <div className="space-y-3 animate-fade-in-up">
            {[1, 2, 3].map((i) => (
              <div key={i} className="surface-card rounded-2xl p-4.5 border border-app-border space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded-xl skeleton-shimmer shrink-0" />
                    <div className="space-y-1.5">
                      <div className="h-3.5 w-60 rounded skeleton-shimmer" />
                      <div className="h-2.5 w-32 rounded skeleton-shimmer opacity-60" />
                    </div>
                  </div>
                  <div className="h-6 w-24 rounded-full skeleton-shimmer" />
                </div>
                <div className="h-3 w-4/5 rounded skeleton-shimmer opacity-70" />
              </div>
            ))}
          </div>
        ) : filteredScans.length === 0 ? (
          <div className="surface-card rounded-2xl p-12 text-center space-y-4 animate-fade-in-up border border-app-border">
            <div className="h-14 w-14 rounded-2xl bg-app-surface-subtle border border-app-border flex items-center justify-center mx-auto text-app-muted shadow-2xs">
              <Clock className="h-7 w-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-app-text">No scans found</h3>
              <p className="text-xs text-app-muted max-w-sm mx-auto">
                {t.historyEmpty}
              </p>
            </div>
            <button
              onClick={() => onSelectScanForReinspect("", "url")}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-app-accent text-white font-semibold text-xs shadow-sm hover:opacity-95 transition"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Launch First Threat Scan</span>
            </button>
          </div>
        ) : (
          filteredScans.map((scan, idx) => {
            const isHigh = scan.riskScore >= 65;
            const isSusp = scan.riskScore >= 35 && scan.riskScore < 65;
            const isCopied = copiedId === scan.id;

            return (
              <div
                key={scan.id}
                style={{ animationDelay: `${Math.min(idx * 45, 400)}ms` }}
                className="surface-card rounded-2xl p-5 hover:border-app-accent/40 transition-all hover:shadow-xs space-y-3.5 group animate-fade-in-up border border-app-border"
              >
                {/* Card Top Row: Type & Target + Risk Meter */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-app-border/70 pb-3.5">
                  <div className="flex items-start sm:items-center space-x-3 overflow-hidden flex-1">
                    <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 border ${
                      scan.type === "url" 
                        ? "bg-rose-500/10 text-rose-600 border-rose-500/20" 
                        : scan.type === "message" 
                        ? "bg-purple-500/10 text-purple-600 border-purple-500/20" 
                        : "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                    }`}>
                      {scan.type === "url" ? (
                        <LinkIcon className="h-4 w-4" />
                      ) : scan.type === "message" ? (
                        <MessageSquare className="h-4 w-4" />
                      ) : (
                        <QrCode className="h-4 w-4" />
                      )}
                    </div>

                    <div className="overflow-hidden flex-1">
                      <div className="flex items-center space-x-2">
                        <span className={`text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${
                          scan.type === "url"
                            ? "bg-rose-500/10 text-rose-600 border-rose-500/20"
                            : scan.type === "message"
                            ? "bg-purple-500/10 text-purple-600 border-purple-500/20"
                            : "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                        }`}>
                          {scan.type === "url" ? "URL" : scan.type === "message" ? "SMS NLP" : "UPI QR"}
                        </span>
                        <div className="font-mono text-xs font-bold text-app-text truncate max-w-[280px] sm:max-w-md">
                          {scan.target}
                        </div>
                        <button
                          onClick={() => handleCopyTarget(scan.id, scan.target)}
                          className="p-1 rounded text-app-muted hover:text-app-text hover:bg-app-surface-subtle transition shrink-0"
                          title="Copy payload"
                        >
                          {isCopied ? (
                            <Check className="h-3 w-3 text-emerald-500" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </button>
                      </div>

                      <div className="flex items-center space-x-2 text-[10px] text-app-muted font-mono mt-1">
                        <Clock className="h-2.5 w-2.5" />
                        <span>{new Date(scan.timestamp).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}</span>
                        <span>&bull;</span>
                        <span>Zero-Trust Logged</span>
                      </div>
                    </div>
                  </div>

                  {/* Risk Score Pill & Gauge Meter */}
                  <div className="flex items-center space-x-3 self-end sm:self-center shrink-0">
                    <div className="flex flex-col items-end space-y-1">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold flex items-center space-x-1.5 border ${
                        isHigh
                          ? "bg-red-500/15 text-red-600 border-red-500/30"
                          : isSusp
                          ? "bg-amber-500/15 text-amber-600 border-amber-500/30"
                          : "bg-emerald-500/15 text-emerald-600 border-emerald-500/30"
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${
                          isHigh ? "bg-red-600 animate-pulse" : isSusp ? "bg-amber-500" : "bg-emerald-500"
                        }`} />
                        <span>{scan.riskScore}% {isHigh ? "SCAM" : isSusp ? "SUSPICIOUS" : "SAFE"}</span>
                      </span>

                      {/* Mini Risk Gauge Bar */}
                      <div className="w-24 h-1.5 rounded-full bg-app-surface-subtle overflow-hidden border border-app-border/40">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            isHigh ? "bg-red-500" : isSusp ? "bg-amber-500" : "bg-emerald-500"
                          }`}
                          style={{ width: `${Math.max(scan.riskScore, 6)}%` }}
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => handleDelete(scan.id)}
                      className="p-1.5 rounded-lg text-app-muted hover:text-red-500 hover:bg-app-surface-subtle transition"
                      title="Delete from history"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Threat Explanation Summary */}
                <p className="text-xs text-app-secondary leading-relaxed bg-app-surface-subtle/40 p-2.5 rounded-xl border border-app-border/40">
                  {scan.summary}
                </p>

                {/* Flags and Re-inspect action */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 text-[11px]">
                  <div className="flex flex-wrap gap-1.5 items-center">
                    {scan.flags && scan.flags.length > 0 ? (
                      scan.flags.slice(0, 3).map((f, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-app-surface-subtle text-app-secondary font-mono border border-app-border text-[10px]">
                          {f}
                        </span>
                      ))
                    ) : (
                      <span className="text-[10px] font-mono text-app-muted">No behavioral anomalies flagged</span>
                    )}
                  </div>

                  <button
                    onClick={() => onSelectScanForReinspect(scan.target, scan.type === "omni" ? "url" : scan.type)}
                    className="px-3 py-1.5 rounded-xl bg-app-surface-subtle hover:bg-app-accent hover:text-white border border-app-border text-app-accent font-semibold flex items-center space-x-1.5 shrink-0 self-end sm:self-auto transition-all shadow-2xs group/btn text-xs"
                  >
                    <span>Re-inspect in Scanner</span>
                    <ArrowRight className="h-3 w-3 group-hover/btn:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
