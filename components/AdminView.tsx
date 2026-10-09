"use client";

import React, { useState, useEffect } from "react";
import { 
  ShieldAlert, 
  Users, 
  FileText, 
  MessageSquareHeart, 
  Radio, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  ExternalLink, 
  AlertTriangle, 
  Sparkles, 
  RefreshCw, 
  Shield, 
  Lock, 
  Cpu, 
  ArrowRight, 
  Check, 
  Send,
  Eye,
  Sliders,
  ShieldCheck,
  UserCheck,
  LogIn,
  Camera,
  Upload,
  Image as ImageIcon,
  Settings,
  Save
} from "lucide-react";
import { 
  UserProfile, 
  ThreatReport, 
  SocialStory, 
  getAllUsersForAdmin, 
  updateUserRole,
  subscribeToRealtimeThreatReports, 
  saveThreatReport, 
  subscribeToSocialStories, 
  verifySocialStory, 
  deleteSocialStory,
  deleteThreatReport,
  subscribeToTeamMembers,
  updateTeamMemberInRtdb,
  subscribeToSiteConfig,
  updateSiteConfigInRtdb,
  EditableTeamMember,
  DEFAULT_TEAM_MEMBERS,
  WebAppSiteConfig
} from "@/lib/firebase";
import { Language } from "@/lib/i18n";
import { User } from "firebase/auth";

const ADMIN_EMAILS = [
  // Official VIT Bhopal format: firstname.regno@vitbhopal.ac.in
  "mangal.26bhi10047@vitbhopal.ac.in",
  "mangalnath.26bhi10047@vitbhopal.ac.in",
  "aastik.26bcy10090@vitbhopal.ac.in",
  "palak.26bcy10001@vitbhopal.ac.in",
  "yashraj.26bce10122@vitbhopal.ac.in",
  "yash.26bce10122@vitbhopal.ac.in",
  // Personal Gmail fallbacks
  "yashrajkushwaha92@gmail.com",
  "yashrajkushwaha@gmail.com",
  "yashraj@gmail.com",
  "mangalnathyadav@gmail.com",
  "mangal.yadav@gmail.com",
  "mangalnath@gmail.com",
  "aastiktripathi@gmail.com",
  "aastik@gmail.com",
  "palakkalra@gmail.com",
  "palak@gmail.com",
  "admin@scamshield.ai",
  "admin@vitbhopal.ac.in",
  "admin@gmail.com"
];

const AUTHORIZED_REG_NOS = ["26bhi10047", "26bcy10090", "26bcy10001", "26bce10122"];

function isAuthorizedAdmin(u: User | null): boolean {
  if (!u || !u.email) return false;
  const email = u.email.toLowerCase().trim();
  if (ADMIN_EMAILS.includes(email)) return true;
  if (AUTHORIZED_REG_NOS.some(reg => email.includes(reg))) return true;

  // Support any email handle of the 4 team members
  const memberKeywords = ["yashraj", "mangal", "aastik", "palak"];
  if (memberKeywords.some(keyword => email.includes(keyword))) {
    return true;
  }

  return email.startsWith("admin@");
}

function processImageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Resize to max 320x320 to keep Base64 payload tiny and fast in RTDB (<100KB)
        const canvas = document.createElement("canvas");
        const MAX_DIM = 320;
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > MAX_DIM) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          }
        } else {
          if (height > MAX_DIM) {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", 0.82));
        } else {
          resolve(event.target?.result as string);
        }
      };
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = event.target?.result as string;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

interface AdminViewProps {
  user: User | null;
  onSignIn?: () => void;
  language: Language;
  t: any;
}

export default function AdminView({ user, onSignIn, language, t }: AdminViewProps) {
  const [activeAdminTab, setActiveAdminTab] = useState<"users" | "logs" | "stories" | "broadcast" | "customizer">("users");

  // Users State
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [userSearch, setUserSearch] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(true);

  // Threat Logs State
  const [threatLogs, setThreatLogs] = useState<ThreatReport[]>([]);
  const [logFilter, setLogFilter] = useState<"all" | "high" | "safe">("all");
  const [logSearch, setLogSearch] = useState("");
  const [selectedLog, setSelectedLog] = useState<ThreatReport | null>(null);

  // Stories State
  const [stories, setStories] = useState<SocialStory[]>([]);
  const [storyFilter, setStoryFilter] = useState<"all" | "unverified" | "prevented" | "loss">("all");

  // Broadcast Form State
  const [broadcastTitle, setBroadcastTitle] = useState("");
  const [broadcastTarget, setBroadcastTarget] = useState("");
  const [broadcastType, setBroadcastType] = useState<"url" | "message" | "qr">("url");
  const [broadcastScore, setBroadcastScore] = useState<number>(92);
  const [broadcastSummary, setBroadcastSummary] = useState("");
  const [broadcastFlags, setBroadcastFlags] = useState("Typosquatting Link, Domain Age < 7 Days, Panic Prompt");
  const [broadcastSubmitting, setBroadcastSubmitting] = useState(false);
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  // Team Members & Site Config State (Synced with Firebase RTDB)
  const [teamMembers, setTeamMembers] = useState<EditableTeamMember[]>(DEFAULT_TEAM_MEMBERS);
  const [savingMemberId, setSavingMemberId] = useState<string | null>(null);
  const [memberSuccessMsg, setMemberSuccessMsg] = useState<string | null>(null);

  const [siteConfig, setSiteConfig] = useState<WebAppSiteConfig>({
    bannerActive: false,
    bannerText: "ACTIVE ALERT: Ongoing high-frequency UPI reverse debit fraud attempts reported via WhatsApp & Telegram.",
    bannerSeverity: "warning",
    helplinePhone: "1930",
    certInNotice: "CERT-In Advisory CI-2026-0041: Critical Smishing Campaigns",
    demoModeActive: true
  });
  const [savingSiteConfig, setSavingSiteConfig] = useState(false);
  const [siteConfigSuccessMsg, setSiteConfigSuccessMsg] = useState<string | null>(null);

  // RTDB Team Members Subscription
  useEffect(() => {
    const unsub = subscribeToTeamMembers((members) => {
      if (members && members.length > 0) {
        setTeamMembers(members);
      }
    });
    return () => unsub();
  }, []);

  // RTDB Site Config Subscription
  useEffect(() => {
    const unsub = subscribeToSiteConfig((cfg) => {
      if (cfg) {
        setSiteConfig(cfg);
      }
    });
    return () => unsub();
  }, []);

  const handlePhotoUpload = async (memberId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await processImageToBase64(file);
      setTeamMembers(prev => prev.map(m => m.id === memberId ? { ...m, photoBase64: base64 } : m));
    } catch (err) {
      console.error("Failed to process photo:", err);
      alert("Failed to process image file. Please choose a standard PNG or JPEG.");
    }
  };

  const handleRemovePhoto = (memberId: string) => {
    setTeamMembers(prev => prev.map(m => m.id === memberId ? { ...m, photoBase64: undefined } : m));
  };

  const handleMemberFieldChange = (memberId: string, field: keyof EditableTeamMember, val: string) => {
    setTeamMembers(prev => prev.map(m => m.id === memberId ? { ...m, [field]: val } : m));
  };

  const handleSaveMember = async (member: EditableTeamMember) => {
    setSavingMemberId(member.id);
    setMemberSuccessMsg(null);
    try {
      await updateTeamMemberInRtdb(member);
      setMemberSuccessMsg(`Saved ${member.name} to Firebase RTDB!`);
      setTimeout(() => setMemberSuccessMsg(null), 3000);
    } catch (err: any) {
      console.error("Error saving team member:", err);
      alert("Failed to save team member: " + err.message);
    } finally {
      setSavingMemberId(null);
    }
  };

  const handleSaveSiteConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSiteConfig(true);
    setSiteConfigSuccessMsg(null);
    try {
      await updateSiteConfigInRtdb(siteConfig);
      setSiteConfigSuccessMsg("App configuration synced to Firebase RTDB!");
      setTimeout(() => setSiteConfigSuccessMsg(null), 3000);
    } catch (err: any) {
      console.error("Error saving site config:", err);
      alert("Failed to save app configuration: " + err.message);
    } finally {
      setSavingSiteConfig(false);
    }
  };

  // Load Users
  useEffect(() => {
    async function fetchUsers() {
      setLoadingUsers(true);
      const list = await getAllUsersForAdmin();
      // If active user is signed in, ensure they are in the list
      if (user && !list.some(u => u.uid === user.uid)) {
        let scansCount = 0;
        if (typeof window !== "undefined") {
          try {
            const stored = localStorage.getItem(`scamshield_history_${user.uid}`);
            if (stored) {
              const parsed = JSON.parse(stored);
              if (Array.isArray(parsed)) scansCount = parsed.length;
            }
          } catch (e) {}
        }
        list.unshift({
          uid: user.uid,
          displayName: user.displayName || user.email?.split("@")[0] || "Active Admin",
          email: user.email || "",
          photoURL: user.photoURL || undefined,
          role: "admin",
          totalScans: scansCount,
          lastLogin: new Date().toISOString(),
          joinedAt: new Date().toISOString()
        });
      }
      setUsers(list);
      setLoadingUsers(false);
    }
    fetchUsers();
  }, [user]);

  // Subscribe to Threat Logs
  useEffect(() => {
    const unsub = subscribeToRealtimeThreatReports((reports) => {
      setThreatLogs(reports);
    });
    return () => unsub();
  }, []);

  // Subscribe to Social Stories
  useEffect(() => {
    const unsub = subscribeToSocialStories((list) => {
      setStories(list);
    });
    return () => unsub();
  }, []);

  // Toggle user role
  const handleRoleToggle = async (uid: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "analyst" : "admin";
    await updateUserRole(uid, newRole as any);
    setUsers(prev => prev.map(u => u.uid === uid ? { ...u, role: newRole as any } : u));
  };

  // Moderate story: Verify / Unverify
  const handleToggleVerifyStory = async (storyId: string, currentVerified: boolean) => {
    await verifySocialStory(storyId, !currentVerified);
  };

  // Moderate story: Delete
  const handleDeleteStory = async (storyId: string) => {
    if (confirm("Are you sure you want to permanently remove this scam incident story?")) {
      await deleteSocialStory(storyId);
    }
  };

  // Moderate threat log: Delete
  const handleDeleteThreatLog = async (reportId?: string) => {
    if (!reportId) return;
    if (confirm("Are you sure you want to permanently remove this threat log from RTDB?")) {
      await deleteThreatReport(reportId);
    }
  };

  // Handle Threat Broadcast Submit
  const handleBroadcastSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastTarget || !broadcastSummary) return;

    setBroadcastSubmitting(true);
    const flagsList = broadcastFlags.split(",").map(f => f.trim()).filter(Boolean);

    await saveThreatReport({
      type: broadcastType,
      target: broadcastTarget,
      riskScore: broadcastScore,
      riskLevel: broadcastScore >= 70 ? "HIGH_RISK" : broadcastScore >= 35 ? "SUSPICIOUS" : "SAFE",
      summary: `[ADMIN BROADCAST] ${broadcastTitle}: ${broadcastSummary}`,
      flags: flagsList.length > 0 ? flagsList : ["Admin Broadcast Advisory"]
    });

    setBroadcastSubmitting(false);
    setBroadcastSuccess(true);
    setTimeout(() => setBroadcastSuccess(false), 4000);

    // Reset fields
    setBroadcastTitle("");
    setBroadcastTarget("");
    setBroadcastSummary("");
  };

  // Incident preset loader
  const loadBroadcastPreset = (title: string, target: string, type: "url" | "message" | "qr", score: number, summary: string, flags: string) => {
    setBroadcastTitle(title);
    setBroadcastTarget(target);
    setBroadcastType(type);
    setBroadcastScore(score);
    setBroadcastSummary(summary);
    setBroadcastFlags(flags);
  };

  // Filters
  const filteredUsers = users.filter(u => {
    if (!u) return false;
    if (!userSearch.trim()) return true;
    const q = userSearch.toLowerCase();
    const name = (u.displayName || "").toLowerCase();
    const mail = (u.email || "").toLowerCase();
    const role = (u.role || "").toLowerCase();
    return name.includes(q) || mail.includes(q) || role.includes(q);
  });

  const filteredLogs = threatLogs.filter(l => {
    if (!l) return false;
    const score = l.riskScore ?? 0;
    if (logFilter === "high" && score < 50) return false;
    if (logFilter === "safe" && score >= 50) return false;
    if (logSearch.trim()) {
      const q = logSearch.toLowerCase();
      const targetStr = (l.target || "").toLowerCase();
      const summaryStr = (l.summary || "").toLowerCase();
      return targetStr.includes(q) || summaryStr.includes(q);
    }
    return true;
  });

  const filteredStories = stories.filter(s => {
    if (!s) return false;
    if (storyFilter === "unverified" && s.verified) return false;
    if (storyFilter === "prevented" && s.status !== "PREVENTED") return false;
    if (storyFilter === "loss" && s.status !== "LOSS_INCURRED") return false;
    return true;
  });

  // Guard 1: Not logged in
  if (!user) {
    return (
      <div className="surface-card rounded-2xl p-10 max-w-md mx-auto text-center space-y-4 border border-app-border shadow-md my-12 animate-in fade-in zoom-in-95 duration-200">
        <div className="h-16 w-16 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto border border-amber-500/20 shadow-2xs">
          <Lock className="h-8 w-8" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-app-text">Admin Panel Locked</h2>
          <p className="text-xs text-app-muted mt-1 leading-relaxed">
            Authentication required. Please sign in with an authorized Team D43M0N$ developer account to access the SecOps Admin Console.
          </p>
        </div>
        {onSignIn && (
          <button
            onClick={onSignIn}
            className="w-full py-2.5 rounded-xl bg-app-accent hover:opacity-90 text-white font-semibold text-xs transition shadow-sm flex items-center justify-center space-x-2"
          >
            <LogIn className="h-4 w-4" />
            <span>Sign in with Google</span>
          </button>
        )}
      </div>
    );
  }

  // Guard 2: Logged in but not an authorized admin/developer
  if (!isAuthorizedAdmin(user)) {
    return (
      <div className="surface-card rounded-2xl p-10 max-w-lg mx-auto text-center space-y-4 border border-rose-500/30 bg-rose-500/[0.02] shadow-md my-12 animate-in fade-in zoom-in-95 duration-200">
        <div className="h-16 w-16 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center mx-auto border border-rose-500/20 shadow-2xs">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <div>
          <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 border border-rose-500/20">
            Error 403 · Forbidden
          </span>
          <h2 className="text-lg font-bold text-app-text mt-2">Access Denied: Developer Only</h2>
          <p className="text-xs text-app-muted mt-1 leading-relaxed">
            Your logged-in account (<strong className="text-app-text">{user.email}</strong>) does not have administrative clearance. Only Team D43M0N$ developers have access to user management and raw threat logs.
          </p>
        </div>
        <div className="p-3.5 rounded-xl bg-app-surface-subtle border border-app-border text-xs text-app-secondary">
          <p className="leading-relaxed">
            SecOps Admin Console is restricted to authorized Team D43M0N$ developers. Please sign in with an authorized developer account.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="surface-card rounded-2xl p-6 shadow-2xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 border border-purple-500/20">
                SecOps Console
              </span>
              <span className="text-xs font-mono text-app-muted">
                Admin Control Plane · IEEE Track 04.1
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-app-text mt-1.5 tracking-tight">
              {t.adminTitle || "Admin & Operations Console"}
            </h1>
            <p className="text-xs text-app-muted mt-0.5">
              {t.adminSubtitle || "Manage users, monitor network threat logs, and moderate scam awareness stories"}
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Full Access Mode</span>
            </span>
          </div>
        </div>

        {/* Operational Metrics Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-app-border/80 text-center font-mono">
          <div className="p-3 rounded-xl bg-app-surface-subtle border border-app-border">
            <div className="text-[10px] text-app-muted uppercase">Monitored Scans</div>
            <div className="text-lg font-bold text-app-text">{threatLogs.length}</div>
          </div>
          <div className="p-3 rounded-xl bg-app-surface-subtle border border-app-border">
            <div className="text-[10px] text-app-muted uppercase">Threats Blocked</div>
            <div className="text-lg font-bold text-rose-500">
              {threatLogs.filter(l => (l?.riskScore ?? 0) >= 50 || l?.riskLevel === "HIGH_RISK").length}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-app-surface-subtle border border-app-border">
            <div className="text-[10px] text-app-muted uppercase">Active Accounts</div>
            <div className="text-lg font-bold text-purple-500">{users.length}</div>
          </div>
          <div className="p-3 rounded-xl bg-app-surface-subtle border border-app-border">
            <div className="text-[10px] text-app-muted uppercase">Stories Live</div>
            <div className="text-lg font-bold text-emerald-500">{stories.length}</div>
          </div>
        </div>
      </div>

      {/* Admin Tab Navigation */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-app-surface-subtle border border-app-border">
        <button
          onClick={() => setActiveAdminTab("users")}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition ${
            activeAdminTab === "users"
              ? "bg-app-surface text-app-text shadow-2xs border border-app-border"
              : "text-app-muted hover:text-app-text hover:bg-app-surface/50"
          }`}
        >
          <Users className="h-3.5 w-3.5 text-purple-500" />
          <span>{t.adminTabUsers || "User Accounts"}</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-app-surface-subtle text-app-muted border border-app-border">
            {users.length}
          </span>
        </button>

        <button
          onClick={() => setActiveAdminTab("logs")}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition ${
            activeAdminTab === "logs"
              ? "bg-app-surface text-app-text shadow-2xs border border-app-border"
              : "text-app-muted hover:text-app-text hover:bg-app-surface/50"
          }`}
        >
          <FileText className="h-3.5 w-3.5 text-blue-500" />
          <span>{t.adminTabLogs || "Threat Scan Logs"}</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-app-surface-subtle text-app-muted border border-app-border">
            {threatLogs.length}
          </span>
        </button>

        <button
          onClick={() => setActiveAdminTab("stories")}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition ${
            activeAdminTab === "stories"
              ? "bg-app-surface text-app-text shadow-2xs border border-app-border"
              : "text-app-muted hover:text-app-text hover:bg-app-surface/50"
          }`}
        >
          <MessageSquareHeart className="h-3.5 w-3.5 text-rose-500" />
          <span>{t.adminTabStories || "Stories Moderation"}</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-app-surface-subtle text-app-muted border border-app-border">
            {stories.length}
          </span>
        </button>

        <button
          onClick={() => setActiveAdminTab("broadcast")}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition ${
            activeAdminTab === "broadcast"
              ? "bg-app-surface text-app-text shadow-2xs border border-app-border"
              : "text-app-muted hover:text-app-text hover:bg-app-surface/50"
          }`}
        >
          <Radio className="h-3.5 w-3.5 text-amber-500" />
          <span>{t.adminTabBroadcast || "Live Threat Broadcast"}</span>
        </button>

        <button
          onClick={() => setActiveAdminTab("customizer")}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition ${
            activeAdminTab === "customizer"
              ? "bg-app-surface text-app-text shadow-2xs border border-app-border"
              : "text-app-muted hover:text-app-text hover:bg-app-surface/50"
          }`}
        >
          <Settings className="h-3.5 w-3.5 text-emerald-500" />
          <span>Team & App Customizer</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-app-surface-subtle text-emerald-600 border border-emerald-500/20 font-bold">
            RTDB
          </span>
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* TAB 1: USER ACCOUNTS & ROLES */}
      {/* ------------------------------------------------------------- */}
      {activeAdminTab === "users" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-app-muted" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search user by name or email..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-app-surface border border-app-border text-xs focus:outline-none focus:ring-1 focus:ring-app-accent"
              />
            </div>
            <div className="text-xs text-app-muted font-mono">
              Showing {filteredUsers.length} registered SecOps users
            </div>
          </div>

          <div className="surface-card rounded-2xl overflow-hidden shadow-2xs border border-app-border divide-y divide-app-border">
            {loadingUsers ? (
              <div className="p-4 space-y-4 animate-fade-in-up">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-xl skeleton-shimmer shrink-0" />
                      <div className="space-y-1.5">
                        <div className="h-3.5 w-36 rounded skeleton-shimmer" />
                        <div className="h-2.5 w-48 rounded skeleton-shimmer opacity-60" />
                      </div>
                    </div>
                    <div className="h-7 w-28 rounded-xl skeleton-shimmer" />
                  </div>
                ))}
              </div>
            ) : filteredUsers.map((u, idx) => (
              <div
                key={u.uid}
                style={{ animationDelay: `${Math.min(idx * 40, 350)}ms` }}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-app-surface-subtle/40 transition animate-fade-in-up"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="h-10 w-10 rounded-xl bg-app-surface-subtle border border-app-border text-app-text font-bold font-mono text-sm flex items-center justify-center shrink-0">
                    {(u.displayName || u.email || "US").slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-xs sm:text-sm text-app-text">{u.displayName || u.email?.split("@")[0] || "SecOps User"}</span>
                      <span className={`text-[10px] font-mono uppercase font-bold px-2 py-0.2 rounded-full border ${
                        u.role === "admin"
                          ? "bg-purple-500/10 text-purple-600 border-purple-500/20"
                          : "bg-blue-500/10 text-blue-600 border-blue-500/20"
                      }`}>
                        {u.role}
                      </span>
                    </div>
                    <div className="text-xs text-app-muted font-mono mt-0.5 truncate max-w-xs sm:max-w-md">
                      {u.email || "Guest Authenticated Identity"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end space-x-4 shrink-0 text-xs font-mono">
                  <div className="text-right">
                    <span className="text-[10px] text-app-muted block uppercase">Scans Done</span>
                    <span className="font-bold text-app-text">{u.totalScans ?? 0} scans</span>
                  </div>

                  <button
                    onClick={() => handleRoleToggle(u.uid, u.role)}
                    className="px-3 py-1.5 rounded-xl border border-app-border hover:bg-app-surface text-xs font-semibold text-app-text transition shadow-2xs flex items-center space-x-1.5"
                    title="Change user privileges"
                  >
                    <UserCheck className="h-3.5 w-3.5 text-app-accent" />
                    <span>Switch to {u.role === "admin" ? "Analyst" : "Admin"}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 2: THREAT SCAN AUDIT LOGS */}
      {/* ------------------------------------------------------------- */}
      {activeAdminTab === "logs" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => setLogFilter("all")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  logFilter === "all"
                    ? "bg-app-accent text-white"
                    : "bg-app-surface text-app-muted hover:text-app-text border border-app-border"
                }`}
              >
                All Logs ({threatLogs.length})
              </button>
              <button
                onClick={() => setLogFilter("high")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  logFilter === "high"
                    ? "bg-rose-500 text-white"
                    : "bg-app-surface text-app-muted hover:text-rose-600 border border-app-border"
                }`}
              >
                High Risk Threats
              </button>
              <button
                onClick={() => setLogFilter("safe")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  logFilter === "safe"
                    ? "bg-emerald-600 text-white"
                    : "bg-app-surface text-app-muted hover:text-emerald-600 border border-app-border"
                }`}
              >
                Verified Safe
              </button>
            </div>

            <div className="relative max-w-xs w-full">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-app-muted" />
              <input
                type="text"
                value={logSearch}
                onChange={(e) => setLogSearch(e.target.value)}
                placeholder="Search target or summary..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-app-surface border border-app-border text-xs focus:outline-none focus:ring-1 focus:ring-app-accent"
              />
            </div>
          </div>

          <div className="surface-card rounded-2xl overflow-hidden shadow-2xs border border-app-border divide-y divide-app-border">
            {filteredLogs.map((log, idx) => {
              const isHigh = (log.riskScore ?? 0) >= 70;
              const flagsList = Array.isArray(log.flags) ? log.flags : [];
              return (
                <div
                  key={log.id || `log-${idx}`}
                  style={{ animationDelay: `${Math.min(idx * 35, 300)}ms` }}
                  className="p-4 space-y-2 hover:bg-app-surface-subtle/40 transition animate-fade-in-up"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-full border ${
                          isHigh
                            ? "bg-rose-500/10 text-rose-600 border-rose-500/20"
                            : "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                        }`}>
                          Score: {log.riskScore ?? 0}/100 · {log.riskLevel || "ANALYZED"}
                        </span>
                        <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-app-surface-subtle text-app-muted border border-app-border">
                          {(log.type || "omni").toUpperCase()}
                        </span>
                        <span className="text-[10px] font-mono text-app-muted">
                          {log.timestamp ? new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Recent"}
                        </span>
                      </div>
                      <div className="font-mono text-xs text-app-text font-bold truncate">
                        {log.target || "N/A"}
                      </div>
                    </div>
                    {log.id && (
                      <button
                        onClick={() => handleDeleteThreatLog(log.id)}
                        className="p-1.5 rounded-lg text-app-muted hover:text-rose-600 hover:bg-rose-500/10 transition shrink-0"
                        title="Permanently Delete Threat Log"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <p className="text-xs text-app-secondary leading-relaxed">
                    {log.summary || "Threat vector analyzed"}
                  </p>

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
            })}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 3: COMMUNITY STORIES MODERATION */}
      {/* ------------------------------------------------------------- */}
      {activeAdminTab === "stories" && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => setStoryFilter("all")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  storyFilter === "all"
                    ? "bg-app-accent text-white"
                    : "bg-app-surface text-app-muted hover:text-app-text border border-app-border"
                }`}
              >
                All Stories ({stories.length})
              </button>
              <button
                onClick={() => setStoryFilter("unverified")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  storyFilter === "unverified"
                    ? "bg-amber-500 text-white"
                    : "bg-app-surface text-app-muted hover:text-amber-600 border border-app-border"
                }`}
              >
                Pending Verification
              </button>
              <button
                onClick={() => setStoryFilter("prevented")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  storyFilter === "prevented"
                    ? "bg-emerald-600 text-white"
                    : "bg-app-surface text-app-muted hover:text-emerald-600 border border-app-border"
                }`}
              >
                Shielded (Prevented)
              </button>
              <button
                onClick={() => setStoryFilter("loss")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  storyFilter === "loss"
                    ? "bg-rose-500 text-white"
                    : "bg-app-surface text-app-muted hover:text-rose-600 border border-app-border"
                }`}
              >
                Loss Incurred
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {filteredStories.map((story, idx) => (
              <div
                key={story.id || `story-${idx}`}
                style={{ animationDelay: `${Math.min(idx * 40, 350)}ms` }}
                className="surface-card rounded-2xl p-5 shadow-2xs border border-app-border space-y-3 hover:border-app-accent/30 transition animate-fade-in-up"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-full border ${
                        story.status === "PREVENTED"
                          ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                          : "bg-rose-500/10 text-rose-600 border-rose-500/20"
                      }`}>
                        {story.status === "PREVENTED" ? "Shielded" : "Loss Incurred"}
                      </span>
                      <span className="text-[10px] font-mono text-app-muted">
                        Category: {story.scamType || "OTHER"}
                      </span>
                      {story.verified && (
                        <span className="inline-flex items-center space-x-1 text-[10px] font-mono px-2 py-0.2 rounded-full bg-blue-500/10 text-blue-600 border border-blue-500/20 font-bold">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>Verified Real Incident</span>
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-sm text-app-text">{story.title || "Untitled Scam Story"}</h3>
                    <div className="text-[11px] text-app-muted">
                      Shared by <strong className="text-app-text">{story.authorName || "Citizen"}</strong> · {story.lossAmount || "₹0"}
                    </div>
                  </div>

                  {/* Moderation Controls */}
                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => handleToggleVerifyStory(story.id, !!story.verified)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border flex items-center space-x-1.5 shadow-2xs ${
                        story.verified
                          ? "bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-amber-500/20"
                          : "bg-blue-500/10 text-blue-600 border-blue-500/20 hover:bg-blue-500/20"
                      }`}
                      title={story.verified ? "Remove verified badge" : "Mark as verified incident"}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>{story.verified ? "Unverify" : "Verify Badge"}</span>
                    </button>

                    <button
                      onClick={() => handleDeleteStory(story.id)}
                      className="p-1.5 rounded-xl text-rose-500 hover:bg-rose-500/10 transition border border-rose-500/20"
                      title="Delete story"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-app-secondary leading-relaxed bg-app-surface-subtle p-3 rounded-xl border border-app-border">
                  {story.story || "No incident details provided."}
                </p>

                <div className="text-[11px] text-app-muted flex items-center justify-between">
                  <span><strong>Lesson:</strong> {story.lessonLearned || "Always verify credentials independently."}</span>
                  <span className="font-mono">{story.likesCount ?? 0} Helpful votes</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 4: LIVE THREAT BROADCAST DISPATCHER */}
      {/* ------------------------------------------------------------- */}
      {activeAdminTab === "broadcast" && (
        <div className="space-y-6">
          {/* Quick Presets */}
          <div className="surface-card rounded-2xl p-5 shadow-2xs space-y-3 border border-app-border">
            <div className="flex items-center space-x-2 text-app-text font-bold text-xs">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span>Broadcast Incident Presets (1-Click Fill)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => loadBroadcastPreset(
                  "BESCOM Urgent Power Disconnection SMS Wave",
                  "http://bescom-bill-clearance.live/pay",
                  "url",
                  94,
                  "Fraudulent electricity notice threatening cutoff tonight. Redirects to fake payment gateway.",
                  "Disposable TLD .live, Homograph BESCOM, Urgent 24h Deadline"
                )}
                className="p-3 rounded-xl bg-app-surface-subtle hover:bg-app-surface border border-app-border text-left transition space-y-1"
              >
                <div className="font-bold text-xs text-app-text truncate">⚡ BESCOM Utility Threat</div>
                <div className="text-[10px] text-app-muted line-clamp-2">Threatening electricity cut tonight at 9:30 PM with fake link.</div>
              </button>

              <button
                type="button"
                onClick={() => loadBroadcastPreset(
                  "SBI YONO APK Trojan Dropper on WhatsApp",
                  "Dear customer your YONO account is locked. Download SBI-KYC.apk to unfreeze.",
                  "message",
                  96,
                  "Malicious Android APK payload circulating on WhatsApp claiming to be State Bank of India update.",
                  "Malicious APK Vector, Bank Impersonation, Account Lock Panic"
                )}
                className="p-3 rounded-xl bg-app-surface-subtle hover:bg-app-surface border border-app-border text-left transition space-y-1"
              >
                <div className="font-bold text-xs text-app-text truncate">📱 Fake SBI YONO APK</div>
                <div className="text-[10px] text-app-muted line-clamp-2">Trojan dropper claiming to unfreeze netbanking via APK.</div>
              </button>

              <button
                type="button"
                onClick={() => loadBroadcastPreset(
                  "Marketplace Reverse UPI Cashback Trap",
                  "upi://pay?pa=cashback-rewards@ybl&pn=PhonePe%20Rewards&am=2500&cu=INR",
                  "qr",
                  91,
                  "Deceptive QR code claiming to credit ₹2,500 cashback; actually issues debit intent.",
                  "Reverse Debit Intent, Fictitious Cashback Hook, Unverified VPA"
                )}
                className="p-3 rounded-xl bg-app-surface-subtle hover:bg-app-surface border border-app-border text-left transition space-y-1"
              >
                <div className="font-bold text-xs text-app-text truncate">💳 Reverse UPI QR Trap</div>
                <div className="text-[10px] text-app-muted line-clamp-2">Marketplace QR code masquerading as incoming cashback.</div>
              </button>
            </div>
          </div>

          {/* Broadcast Form */}
          <form onSubmit={handleBroadcastSubmit} className="surface-card rounded-2xl p-6 shadow-2xs space-y-4 border border-app-border">
            <div className="flex items-center space-x-2 text-app-accent font-bold text-sm border-b border-app-border/80 pb-2">
              <Radio className="h-4 w-4 text-app-accent" />
              <h2>Broadcast Real-Time Threat Advisory to Network</h2>
            </div>

            {broadcastSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-semibold flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>Threat advisory broadcasted successfully! Added to real-time telemetry stream.</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-app-text">Incident Headline</label>
                <input
                  type="text"
                  required
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  placeholder="e.g. BESCOM Power Cut Wave"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-app-surface-subtle border border-app-border text-xs focus:outline-none focus:ring-1 focus:ring-app-accent text-app-text"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-app-text">Attack Vector Type</label>
                <select
                  value={broadcastType}
                  onChange={(e) => setBroadcastType(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-app-surface-subtle border border-app-border text-xs focus:outline-none focus:ring-1 focus:ring-app-accent text-app-text"
                >
                  <option value="url">Phishing / Typosquatting Website (URL)</option>
                  <option value="message">SMS / WhatsApp Social Engineering (Message)</option>
                  <option value="qr">Reverse UPI Intent / QR Code (QR)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-app-text">Target URL / Text / UPI URI</label>
              <input
                type="text"
                required
                value={broadcastTarget}
                onChange={(e) => setBroadcastTarget(e.target.value)}
                placeholder="e.g. http://sbl-kyc.xyz or SMS message string"
                className="w-full px-3.5 py-2.5 rounded-xl bg-app-surface-subtle border border-app-border text-xs font-mono focus:outline-none focus:ring-1 focus:ring-app-accent text-app-text"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-app-text">Assigned Risk Score (0 - 100)</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={broadcastScore}
                  onChange={(e) => setBroadcastScore(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-app-surface-subtle border border-app-border text-xs font-mono focus:outline-none focus:ring-1 focus:ring-app-accent text-app-text"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-app-text">Detected Heuristics / Flags (Comma-separated)</label>
                <input
                  type="text"
                  value={broadcastFlags}
                  onChange={(e) => setBroadcastFlags(e.target.value)}
                  placeholder="e.g. Typosquatting, Urgent Deadline, Fake VPA"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-app-surface-subtle border border-app-border text-xs focus:outline-none focus:ring-1 focus:ring-app-accent text-app-text"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-app-text">Forensic Summary & Citizen Guidance</label>
              <textarea
                required
                rows={3}
                value={broadcastSummary}
                onChange={(e) => setBroadcastSummary(e.target.value)}
                placeholder="Describe how the attack operates and what citizens should avoid..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-app-surface-subtle border border-app-border text-xs focus:outline-none focus:ring-1 focus:ring-app-accent text-app-text"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={broadcastSubmitting}
                className="px-5 py-2.5 rounded-xl bg-app-accent hover:bg-app-accent-hover text-white text-xs font-bold transition flex items-center space-x-2 shadow-xs disabled:opacity-50"
              >
                <Send className="h-3.5 w-3.5" />
                <span>{broadcastSubmitting ? "Broadcasting..." : "Broadcast Threat to Network"}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 5: APP & TEAM CUSTOMIZER (SYNCED WITH FIREBASE RTDB) */}
      {/* ------------------------------------------------------------- */}
      {activeAdminTab === "customizer" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Status feedback notifications */}
          {memberSuccessMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 text-xs font-semibold flex items-center space-x-2 animate-in slide-in-from-top-1">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{memberSuccessMsg}</span>
            </div>
          )}
          {siteConfigSuccessMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 text-xs font-semibold flex items-center space-x-2 animate-in slide-in-from-top-1">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{siteConfigSuccessMsg}</span>
            </div>
          )}

          {/* Section 1: Team Members Photo & Details Suite */}
          <div className="surface-card rounded-2xl p-6 shadow-2xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-app-border/80 pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <Camera className="h-4 w-4 text-app-accent" />
                  <h3 className="text-sm font-bold text-app-text">
                    Team D43M0N$ Roster & Photo Upload
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-bold">
                    RTDB Synced
                  </span>
                </div>
                <p className="text-xs text-app-muted mt-0.5">
                  Upload member photos (stored as optimized Base64 in Firebase RTDB) and update roles in the public About section.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="p-4 rounded-2xl bg-app-surface-subtle border border-app-border space-y-4 hover:border-app-accent/40 transition-all duration-200"
                >
                  {/* Photo & Actions Header */}
                  <div className="flex items-center space-x-4">
                    <div className="relative shrink-0">
                      {member.photoBase64 ? (
                        <img
                          src={member.photoBase64}
                          alt={member.name}
                          className="h-16 w-16 rounded-2xl object-cover border-2 border-app-border shadow-xs"
                        />
                      ) : (
                        <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${member.avatarBg || "from-app-accent to-indigo-600"} text-white font-bold font-mono text-lg flex items-center justify-center shadow-xs`}>
                          {member.initials || member.name.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                      {member.photoBase64 && (
                        <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-app-surface shadow-xs" />
                      )}
                    </div>

                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <label className="cursor-pointer px-3 py-1.5 rounded-xl bg-app-accent hover:bg-app-accent-hover text-white text-[11px] font-semibold transition flex items-center space-x-1.5 shadow-2xs">
                          <Upload className="h-3 w-3" />
                          <span>{member.photoBase64 ? "Change Photo" : "Upload Photo"}</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handlePhotoUpload(member.id, e)}
                          />
                        </label>

                        {member.photoBase64 && (
                          <button
                            type="button"
                            onClick={() => handleRemovePhoto(member.id)}
                            className="p-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 border border-rose-500/20 transition text-xs"
                            title="Remove photo"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                      <p className="text-[10px] text-app-muted truncate font-mono">
                        {member.photoBase64 ? "Base64 Compressed (<100KB)" : "Default Avatar"}
                      </p>
                    </div>
                  </div>

                  {/* Form fields */}
                  <div className="space-y-2.5 text-xs">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-app-text">Full Name</label>
                        <input
                          type="text"
                          value={member.name}
                          onChange={(e) => handleMemberFieldChange(member.id, "name", e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-app-surface border border-app-border text-xs focus:outline-none focus:ring-1 focus:ring-app-accent text-app-text"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-app-text">Reg. Number</label>
                        <input
                          type="text"
                          value={member.regNo}
                          onChange={(e) => handleMemberFieldChange(member.id, "regNo", e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-app-surface border border-app-border text-xs font-mono focus:outline-none focus:ring-1 focus:ring-app-accent text-app-text"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-app-text">Badge / Role Tag</label>
                        <input
                          type="text"
                          value={member.badge || ""}
                          placeholder="e.g. Team Lead"
                          onChange={(e) => handleMemberFieldChange(member.id, "badge", e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-app-surface border border-app-border text-xs focus:outline-none focus:ring-1 focus:ring-app-accent text-app-text"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-app-text">Short Tagline / Bio</label>
                        <input
                          type="text"
                          value={member.bio || ""}
                          placeholder="Security Architecture"
                          onChange={(e) => handleMemberFieldChange(member.id, "bio", e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-app-surface border border-app-border text-xs focus:outline-none focus:ring-1 focus:ring-app-accent text-app-text"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Save button for this member */}
                  <div className="pt-1 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleSaveMember(member)}
                      disabled={savingMemberId === member.id}
                      className="px-3.5 py-1.5 rounded-xl bg-app-surface hover:bg-app-surface-subtle border border-app-border text-xs font-semibold text-app-text transition flex items-center space-x-1.5 shadow-2xs disabled:opacity-50"
                    >
                      {savingMemberId === member.id ? (
                        <RefreshCw className="h-3 w-3 animate-spin text-app-accent" />
                      ) : (
                        <Save className="h-3 w-3 text-app-accent" />
                      )}
                      <span>{savingMemberId === member.id ? "Saving..." : "Save Member"}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Global Web App Settings & Emergency Advisory */}
          <div className="surface-card rounded-2xl p-6 shadow-2xs space-y-5">
            <div className="flex items-center space-x-2 border-b border-app-border/80 pb-4">
              <Settings className="h-4 w-4 text-app-accent" />
              <div>
                <h3 className="text-sm font-bold text-app-text">
                  Global Web App & Emergency Alert Settings
                </h3>
                <p className="text-xs text-app-muted mt-0.5">
                  Configure site-wide alerts and parameters synced in real time across the application.
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveSiteConfig} className="space-y-4">
              {/* Emergency Banner Toggle */}
              <div className="p-4 rounded-xl bg-app-surface-subtle border border-app-border space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-xs font-bold text-app-text flex items-center gap-1.5">
                      <span>Global Emergency Threat Banner</span>
                      {siteConfig.bannerActive && (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-rose-500/10 text-rose-600 border border-rose-500/20 font-bold animate-pulse">
                          ACTIVE LIVE
                        </span>
                      )}
                    </label>
                    <p className="text-[11px] text-app-muted">
                      Displays a high-visibility warning banner at the top of the app for all users.
                    </p>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={siteConfig.bannerActive}
                      onChange={(e) => setSiteConfig({ ...siteConfig, bannerActive: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-app-surface peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-app-accent border border-app-border"></div>
                  </label>
                </div>

                {siteConfig.bannerActive && (
                  <div className="space-y-3 pt-2 border-t border-app-border/60 animate-in fade-in duration-200">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-app-text">Alert Severity</label>
                        <select
                          value={siteConfig.bannerSeverity}
                          onChange={(e) => setSiteConfig({ ...siteConfig, bannerSeverity: e.target.value as any })}
                          className="w-full px-3 py-2 rounded-xl bg-app-surface border border-app-border text-xs focus:outline-none focus:ring-1 focus:ring-app-accent text-app-text"
                        >
                          <option value="danger">Critical Danger (Red)</option>
                          <option value="warning">Active Advisory (Amber)</option>
                          <option value="info">System Notice (Blue)</option>
                        </select>
                      </div>

                      <div className="sm:col-span-2 space-y-1">
                        <label className="text-[11px] font-semibold text-app-text">Banner Announcement Message</label>
                        <input
                          type="text"
                          value={siteConfig.bannerText}
                          onChange={(e) => setSiteConfig({ ...siteConfig, bannerText: e.target.value })}
                          placeholder="e.g. Critical alert: High-volume typosquatting SBI links active..."
                          className="w-full px-3 py-2 rounded-xl bg-app-surface border border-app-border text-xs focus:outline-none focus:ring-1 focus:ring-app-accent text-app-text"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Additional app settings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-app-text">National Cyber Crime Helpline Number</label>
                  <input
                    type="text"
                    value={siteConfig.helplinePhone}
                    onChange={(e) => setSiteConfig({ ...siteConfig, helplinePhone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-app-surface-subtle border border-app-border text-xs font-mono focus:outline-none focus:ring-1 focus:ring-app-accent text-app-text"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-app-text">CERT-In Active Advisory Tag</label>
                  <input
                    type="text"
                    value={siteConfig.certInNotice || ""}
                    onChange={(e) => setSiteConfig({ ...siteConfig, certInNotice: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-app-surface-subtle border border-app-border text-xs focus:outline-none focus:ring-1 focus:ring-app-accent text-app-text"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={savingSiteConfig}
                  className="px-5 py-2.5 rounded-xl bg-app-accent hover:bg-app-accent-hover text-white text-xs font-bold transition flex items-center space-x-2 shadow-xs disabled:opacity-50"
                >
                  {savingSiteConfig ? (
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Save className="h-3.5 w-3.5" />
                  )}
                  <span>{savingSiteConfig ? "Syncing..." : "Save & Sync Site Settings"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
