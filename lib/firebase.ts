import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getDatabase, 
  ref, 
  push, 
  set, 
  get, 
  remove,
  update,
  query, 
  limitToLast, 
  onValue, 
  Database 
} from "firebase/database";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  User, 
  Auth 
} from "firebase/auth";
import { getAnalytics, isSupported, Analytics } from "firebase/analytics";

// User provided Firebase configuration for scamshield-9621b
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDqFHd9wKzXR6yYotqmo6F4MgdgOuF7gY8",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "scamshield-9621b.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "scamshield-9621b",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "scamshield-9621b.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "254971834134",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:254971834134:web:6d1881c7d9dc3bae296a37",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-YLCSM4VQD4",
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "https://scamshield-9621b-default-rtdb.firebaseio.com"
};

// Singleton Firebase initialization
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

let rtdb: Database | null = null;
let auth: Auth | null = null;
let googleProvider: GoogleAuthProvider | null = null;
let analytics: Analytics | null = null;

try {
  rtdb = getDatabase(app);
} catch (err) {
  console.warn("Could not initialize Realtime Database client:", err);
}

try {
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
  googleProvider.setCustomParameters({ prompt: "select_account" });
} catch (err) {
  console.warn("Could not initialize Firebase Auth:", err);
}

// Client-side Analytics initialization
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch((err) => {
    console.debug("Firebase Analytics client notice:", err);
  });
}

// -------------------------------------------------------------
// DATA INTERFACES
// -------------------------------------------------------------

export interface ThreatReport {
  id?: string;
  type: "url" | "message" | "qr" | "omni";
  target: string;
  riskScore: number;
  riskLevel: "SAFE" | "SUSPICIOUS" | "HIGH_RISK";
  summary: string;
  flags: string[];
  userNotes?: string;
  reportedBy?: {
    uid?: string;
    displayName?: string;
    email?: string;
    photoURL?: string;
  };
  timestamp: string | number;
}

export interface UserScanRecord {
  id: string;
  userId: string;
  userEmail?: string;
  userName?: string;
  type: "url" | "message" | "qr" | "omni";
  target: string;
  riskScore: number;
  riskLevel: "SAFE" | "SUSPICIOUS" | "HIGH_RISK";
  summary: string;
  flags: string[];
  metrics?: {
    domainTrust?: number;
    protocolSecurity?: number;
    linguisticUrgency?: number;
    impersonationRisk?: number;
    zeroTrustScore?: number;
  };
  timestamp: string;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  role: "admin" | "analyst" | "citizen";
  totalScans: number;
  lastLogin: string;
  joinedAt: string;
}

export interface SocialStory {
  id: string;
  title: string;
  authorName: string;
  authorEmail?: string;
  authorPhoto?: string;
  userId?: string;
  scamType: "UPI_FRAUD" | "PHISHING_LINK" | "ELECTRICITY_BILL" | "WHATSAPP_CALL" | "JOB_SCAM" | "CUSTOMS_PARCEL" | "OTHER";
  lossAmount?: string;
  status: "PREVENTED" | "LOSS_INCURRED";
  story: string;
  lessonLearned: string;
  likesCount: number;
  likedBy?: string[];
  timestamp: string;
  verified?: boolean;
}

export const DEFAULT_COMMUNITY_STORIES: SocialStory[] = [
  {
    id: "story-seed-1",
    title: "Fake Electricity Disconnection Warning on WhatsApp (Discom Impersonation)",
    authorName: "Rohan Verma",
    authorEmail: "rohan.v@example.com",
    scamType: "ELECTRICITY_BILL",
    status: "PREVENTED",
    lossAmount: "₹0 (Prevented ₹8,450)",
    story: "Received an urgent SMS at 8 PM stating my power connection would be severed at 9:30 PM due to unpaid balance. The sender provided an unknown mobile number and a link to pay via an APK. I scanned the link on ScamShield AI which immediately flagged it as high risk with panic prompt indicators. Called the official discom helpline and confirmed my bill was fully paid.",
    lessonLearned: "State utility boards never send SMS from 10-digit private mobile numbers, and never threaten instant disconnection within hours.",
    likesCount: 24,
    likedBy: ["seed-user-1", "seed-user-2"],
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    verified: true
  },
  {
    id: "story-seed-2",
    title: "OLX Buyer Sent Reverse-Debit UPI QR Code Claiming to Pay Advance",
    authorName: "Ananya Sharma",
    scamType: "UPI_FRAUD",
    status: "PREVENTED",
    lossAmount: "₹0 (Prevented ₹15,000)",
    story: "I listed a used study table on OLX. A buyer agreed instantly without bargaining and sent a QR code stating 'Scan this QR in PhonePe to receive ₹15,000 advance'. When I decoded the QR in ScamShield, it warned me that the UPI payload had am=15000 and was configured to DEBIT my account, not credit it. Saved me from a major financial trap.",
    lessonLearned: "You NEVER need to scan a QR code or enter your UPI PIN to receive money. PIN is strictly required only to send money.",
    likesCount: 38,
    likedBy: ["seed-user-3"],
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 42).toISOString(),
    verified: true
  },
  {
    id: "story-seed-3",
    title: "Digital Arrest Scam: Fake Police Video Call Alleging Customs Parcel Contraband",
    authorName: "Kavita Nair",
    scamType: "WHATSAPP_CALL",
    status: "PREVENTED",
    lossAmount: "₹0 (Shielded ₹1,20,000)",
    story: "Received a call from someone posing as FedEx claiming a parcel to Taiwan with passports and drugs in my name was seized. They connected me to a fake Skype video call with someone in police uniform and a fake CBI backdrop. They demanded I stay on camera under 'digital arrest' and transfer funds for financial verification. Realized the panic trigger, disconnected, and immediately reported to 1930.",
    lessonLearned: "Indian law enforcement agencies NEVER place citizens under 'digital arrest' over video calls or demand money transfers.",
    likesCount: 45,
    likedBy: ["seed-user-4"],
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 65).toISOString(),
    verified: true
  },
  {
    id: "story-seed-4",
    title: "Typosquatted Banking Phishing Link Claiming Mandatory PAN-KYC Update",
    authorName: "Siddharth Jain",
    scamType: "PHISHING_LINK",
    status: "PREVENTED",
    lossAmount: "₹0 (Prevented ₹32,000)",
    story: "Got an SMS with link 'http://sbl-kyc-update.xyz/login.php'. It looked almost identical to State Bank of India's portal. ScamShield's domain trust engine caught the typosquatting ('sbl' instead of 'sbi') and Punycode risk score. Stopped me from keying in my internet banking credentials and OTP.",
    lessonLearned: "Always inspect the exact spelling in the browser address bar and only log in through official bank domains (e.g., onlinesbi.sbi).",
    likesCount: 19,
    likedBy: [],
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 90).toISOString(),
    verified: true
  }
];

export const DEFAULT_USER_SCANS: UserScanRecord[] = [
  {
    id: "scan-seed-1",
    userId: "guest-user",
    type: "url",
    target: "http://sbl-kyc-update.xyz/login.php",
    riskScore: 94,
    riskLevel: "HIGH_RISK",
    summary: "Typosquatting Phishing Link impersonating State Bank of India with suspicious .xyz TLD and SSL certificate absence.",
    flags: ["Homoglyph Typosquatting (sbl)", "Suspicious TLD (.xyz)", "Unencrypted HTTP Protocol", "Credential Harvesting Form"],
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString()
  },
  {
    id: "scan-seed-2",
    userId: "guest-user",
    type: "message",
    target: "प्रिय ग्राहक आपका बिजली बिल बकाया है आज रात 9:30 बजे बिजली काट दी जाएगी तुरंत इस लिंक पर बिल भरें",
    riskScore: 88,
    riskLevel: "HIGH_RISK",
    summary: "Deceptive Discom SMS employing manufactured psychological panic and artificial 90-minute deadline to enforce hasty payment.",
    flags: ["Panic Urgency Trigger", "Hindi NLP Threat Pattern", "Impersonation of Utility Department", "Unverified Contact Target"],
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString()
  },
  {
    id: "scan-seed-3",
    userId: "guest-user",
    type: "qr",
    target: "upi://pay?pa=scammer89@ybl&pn=SBI%20Refund%20Dept&am=5000&cu=INR&tn=Scan%20to%20Receive%20Cashback",
    riskScore: 96,
    riskLevel: "HIGH_RISK",
    summary: "Reverse-Charge Fraudulent UPI Intent containing mandatory am=5000 debit parameter disguised as cashback receipt.",
    flags: ["Reverse Debit Fraud", "Fake Bank Name Parameter", "Unsolicited Collect Action", "Deceptive Transaction Note"],
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString()
  }
];

let localReportsCache: ThreatReport[] = [];
let localStoriesCache: SocialStory[] = [...DEFAULT_COMMUNITY_STORIES];
let localUserScansCache: { [userId: string]: UserScanRecord[] } = {};

// Helper to run promise with strict timeout
function withTimeout<T>(promise: Promise<T>, timeoutMs: number = 2500): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error("Timeout")), timeoutMs))
  ]);
}

/**
 * Strips undefined properties recursively to prevent Firebase RTDB
 * "set failed: value argument contains undefined in property..." fatal validation error.
 */
export function cleanForFirebase<T>(data: T): T {
  if (data === null || data === undefined) {
    return null as any;
  }
  if (Array.isArray(data)) {
    return data
      .filter((item) => item !== undefined)
      .map((item) => cleanForFirebase(item)) as any;
  }
  if (typeof data === "object") {
    const cleaned: any = {};
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        cleaned[key] = cleanForFirebase(value);
      }
    }
    return cleaned;
  }
  return data;
}

// -------------------------------------------------------------
// GLOBAL THREAT REPORTS
// -------------------------------------------------------------

export async function saveThreatReport(report: Omit<ThreatReport, "id" | "timestamp"> & { timestamp?: any }) {
  const newReport: ThreatReport = {
    ...report,
    id: `rep-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    timestamp: new Date().toISOString()
  };

  if (rtdb) {
    try {
      const reportsRef = ref(rtdb, "threat_reports");
      const newRef = push(reportsRef);
      await withTimeout(set(newRef, cleanForFirebase({ ...newReport, id: newRef.key })), 2500);
      return { id: newRef.key, success: true, storage: "realtime-database" };
    } catch (err: any) {
      console.warn("RTDB write fallback:", err?.message || err);
    }
  }

  localReportsCache.unshift(newReport);
  return { id: newReport.id, success: true, storage: "cache-resilient" };
}

export async function getRecentThreatReports(count: number = 10): Promise<ThreatReport[]> {
  if (rtdb) {
    try {
      const reportsRef = query(ref(rtdb, "threat_reports"), limitToLast(count));
      const snapshot = await withTimeout(get(reportsRef), 2500);
      if (snapshot.exists()) {
        const val = snapshot.val();
        const list: ThreatReport[] = Object.keys(val).map(key => ({
          ...val[key],
          id: key
        }));
        list.reverse();
        if (list.length > 0) return list;
      }
    } catch (err: any) {
      console.warn("RTDB query notice:", err?.message || err);
    }
  }

  return localReportsCache.slice(0, count);
}

export async function deleteThreatReport(reportId: string): Promise<void> {
  localReportsCache = localReportsCache.filter(r => r.id !== reportId);
  if (rtdb) {
    try {
      const reportRef = ref(rtdb, `threat_reports/${reportId}`);
      await withTimeout(remove(reportRef), 2000);
    } catch (err) {
      console.warn("RTDB delete report notice:", err);
    }
  }
}

export function subscribeToRealtimeThreatReports(
  callback: (reports: ThreatReport[]) => void
): () => void {
  if (!rtdb) {
    callback(localReportsCache);
    return () => {};
  }

  try {
    const reportsRef = query(ref(rtdb, "threat_reports"), limitToLast(20));
    const unsubscribe = onValue(
      reportsRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const val = snapshot.val();
          const list: ThreatReport[] = Object.keys(val).map(key => ({
            ...val[key],
            id: key
          }));
          list.reverse();
          callback(list);
        } else {
          callback(localReportsCache);
        }
      },
      (error) => {
        console.warn("Realtime listener error:", error);
        callback(localReportsCache);
      }
    );
    return unsubscribe;
  } catch (err) {
    console.warn("Failed to set up Realtime listener:", err);
    callback(localReportsCache);
    return () => {};
  }
}

// -------------------------------------------------------------
// USER SPECIFIC SCANS & HISTORY (Task 2)
// -------------------------------------------------------------

// Migrates any scans made in guest mode to user's account upon sign-in
export async function migrateGuestScansToUser(userId: string): Promise<void> {
  if (typeof window === "undefined" || !userId || userId === "guest-user") return;
  try {
    const guestStored = localStorage.getItem("scamshield_history_guest-user");
    if (!guestStored) return;
    const guestScans: UserScanRecord[] = JSON.parse(guestStored);
    if (!Array.isArray(guestScans) || guestScans.length === 0) return;

    const userStored = localStorage.getItem(`scamshield_history_${userId}`);
    const userScans: UserScanRecord[] = userStored ? JSON.parse(userStored) : [];
    const existingIds = new Set(userScans.map(s => s.id));

    for (const scan of guestScans) {
      if (!existingIds.has(scan.id)) {
        const migrated = { ...scan, userId };
        userScans.push(migrated);
        if (rtdb) {
          const userScansRef = ref(rtdb, `users/${userId}/scans/${scan.id}`);
          set(userScansRef, cleanForFirebase(migrated));
        }
      }
    }
    localStorage.setItem(`scamshield_history_${userId}`, JSON.stringify(userScans));
    localUserScansCache[userId] = userScans;
  } catch (e) {
    console.warn("Guest scan migration notice:", e);
  }
}

export async function saveUserScanRecord(userId: string, scanData: Omit<UserScanRecord, "id" | "timestamp" | "userId">): Promise<UserScanRecord> {
  const newScan: UserScanRecord = {
    ...scanData,
    id: `scan-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    userId,
    timestamp: new Date().toISOString()
  };

  // Sync to local memory cache
  if (!localUserScansCache[userId]) {
    localUserScansCache[userId] = [];
  }
  localUserScansCache[userId].unshift(newScan);

  // Sync to localStorage
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(`scamshield_history_${userId}`);
      const list = stored ? JSON.parse(stored) : [];
      list.unshift(newScan);
      localStorage.setItem(`scamshield_history_${userId}`, JSON.stringify(list.slice(0, 50)));
    } catch (e) {
      console.warn("localStorage write notice:", e);
    }
  }

  // Sync to Firebase RTDB under users/{userId}/scans AND global threat_reports
  if (rtdb) {
    try {
      const userScansRef = ref(rtdb, `users/${userId}/scans/${newScan.id}`);
      await withTimeout(set(userScansRef, cleanForFirebase(newScan)), 2500);

      // Also publish to global threat reports for Admin Console SecOps oversight
      const globalReportRef = ref(rtdb, `threat_reports/${newScan.id}`);
      set(globalReportRef, cleanForFirebase({
        id: newScan.id,
        type: newScan.type,
        target: newScan.target,
        riskScore: newScan.riskScore,
        riskLevel: newScan.riskLevel,
        summary: newScan.summary,
        flags: newScan.flags,
        reportedBy: {
          uid: userId,
          displayName: newScan.userName || "Citizen",
          email: newScan.userEmail || ""
        },
        timestamp: newScan.timestamp
      }));
    } catch (err) {
      console.warn("RTDB user scan write notice:", err);
    }
  }

  return newScan;
}

export function subscribeToUserScans(userId: string, callback: (scans: UserScanRecord[]) => void): () => void {
  // If user signed in, migrate any pending guest scans into their account
  if (userId && userId !== "guest-user") {
    migrateGuestScansToUser(userId);
  }

  // Try localStorage first for instant, non-vanishing render
  let cachedList: UserScanRecord[] = [];
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(`scamshield_history_${userId}`);
      if (stored) {
        cachedList = JSON.parse(stored);
      }
    } catch (e) {}
  }

  if (cachedList.length === 0 && localUserScansCache[userId]) {
    cachedList = localUserScansCache[userId];
  }

  // Fallback to demonstration seed scans if brand new user / guest
  if (cachedList.length === 0) {
    cachedList = DEFAULT_USER_SCANS.map(s => ({ ...s, userId }));
    localUserScansCache[userId] = cachedList;
  }

  callback(cachedList);

  if (!rtdb) {
    return () => {};
  }

  try {
    const userScansRef = query(ref(rtdb, `users/${userId}/scans`), limitToLast(50));
    const unsubscribe = onValue(
      userScansRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const val = snapshot.val();
          const list: UserScanRecord[] = Object.keys(val).map(key => ({
            ...val[key],
            id: key
          }));
          list.reverse();
          localUserScansCache[userId] = list;
          if (typeof window !== "undefined") {
            try {
              localStorage.setItem(`scamshield_history_${userId}`, JSON.stringify(list));
            } catch (e) {}
          }
          callback(list);
        } else {
          // If RTDB doesn't have scans yet, retain existing local list and save to RTDB so it persists!
          const listToKeep = localUserScansCache[userId] || cachedList;
          if (listToKeep.length > 0) {
            callback(listToKeep);
            listToKeep.forEach(item => {
              set(ref(rtdb!, `users/${userId}/scans/${item.id}`), item);
            });
          }
        }
      },
      (err) => {
        console.warn("User scans listener notice:", err);
        callback(localUserScansCache[userId] || cachedList);
      }
    );
    return unsubscribe;
  } catch (err) {
    callback(localUserScansCache[userId] || cachedList);
    return () => {};
  }
}

export function isUserAdmin(user: User | null): boolean {
  if (!user || !user.email) return false;
  const email = user.email.toLowerCase();
  return (
    email.includes("admin") ||
    email.includes("yashraj") ||
    email.includes("aastik") ||
    email.includes("mangal") ||
    email.includes("palak") ||
    ["26bhi10047", "26bcy10090", "26bcy10001", "26bce10122"].some(reg => email.includes(reg))
  );
}

export async function deleteUserScanRecord(
  userId: string, 
  scanId: string, 
  currentUser?: User | null
): Promise<{ success: boolean; error?: string }> {
  // If currentUser is provided, enforce access rules:
  // 1. Unauthenticated/guest users cannot delete
  if (!currentUser) {
    const errMsg = "Unauthorized: Only logged-in users can delete scan history records.";
    console.warn(errMsg);
    return { success: false, error: errMsg };
  }

  // 2. Regular users can ONLY delete their own scans (currentUser.uid === userId)
  // 3. Admin can delete anyone's scan records
  const isAdmin = isUserAdmin(currentUser);
  const isOwner = currentUser.uid === userId;
  if (!isOwner && !isAdmin) {
    const errMsg = "Unauthorized: You can only delete your own scan history.";
    console.warn(errMsg);
    return { success: false, error: errMsg };
  }

  if (localUserScansCache[userId]) {
    localUserScansCache[userId] = localUserScansCache[userId].filter(s => s.id !== scanId);
  }
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(`scamshield_history_${userId}`);
      if (stored) {
        const list = JSON.parse(stored).filter((s: any) => s.id !== scanId);
        localStorage.setItem(`scamshield_history_${userId}`, JSON.stringify(list));
      }
    } catch (e) {}
  }

  if (rtdb) {
    try {
      const scanRef = ref(rtdb, `users/${userId}/scans/${scanId}`);
      await withTimeout(remove(scanRef), 2000);
      const globalRef = ref(rtdb, `threat_reports/${scanId}`);
      remove(globalRef);
    } catch (err) {
      console.warn("RTDB delete notice:", err);
    }
  }

  return { success: true };
}

export async function deleteAllScanHistories(
  currentUser: User | null
): Promise<{ success: boolean; error?: string }> {
  if (!currentUser || !isUserAdmin(currentUser)) {
    return { success: false, error: "Unauthorized: Only administrators can delete all scan histories." };
  }

  // Clear local memory caches
  Object.keys(localUserScansCache).forEach(k => {
    localUserScansCache[k] = [];
  });

  // Clear localStorage
  if (typeof window !== "undefined") {
    try {
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && key.startsWith("scamshield_history_")) {
          localStorage.removeItem(key);
        }
      }
    } catch (e) {}
  }

  // Clear RTDB scans across all users
  if (rtdb) {
    try {
      const usersSnap = await withTimeout(get(ref(rtdb, "users")), 3500);
      if (usersSnap.exists()) {
        const usersData = usersSnap.val() || {};
        const updates: Record<string, any> = {};
        Object.keys(usersData).forEach(uid => {
          updates[`users/${uid}/scans`] = null;
        });
        await withTimeout(update(ref(rtdb), updates), 4000);
      }
      // Also clear threat reports node
      await withTimeout(remove(ref(rtdb, "threat_reports")), 2000);
    } catch (err) {
      console.warn("RTDB deleteAllScanHistories error:", err);
    }
  }

  return { success: true };
}

export async function clearUserOwnScans(
  userId: string,
  currentUser: User | null
): Promise<{ success: boolean; error?: string }> {
  if (!currentUser) {
    return { success: false, error: "Unauthorized: Please sign in to clear scan history." };
  }
  const isAdmin = isUserAdmin(currentUser);
  if (currentUser.uid !== userId && !isAdmin) {
    return { success: false, error: "Unauthorized: You can only clear your own scan history." };
  }

  localUserScansCache[userId] = [];
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(`scamshield_history_${userId}`);
    } catch (e) {}
  }

  if (rtdb) {
    try {
      await withTimeout(remove(ref(rtdb, `users/${userId}/scans`)), 2500);
    } catch (err) {
      console.warn("RTDB clearUserOwnScans error:", err);
    }
  }

  return { success: true };
}


// -------------------------------------------------------------
// SOCIAL AWARENESS STORIES (Task 3)
// -------------------------------------------------------------

// Seed default stories into RTDB if empty
export async function seedDefaultSocialStoriesToRtdb(): Promise<void> {
  if (!rtdb) return;
  try {
    const storiesRef = ref(rtdb, "social_stories");
    const snapshot = await withTimeout(get(storiesRef), 2000);
    if (!snapshot.exists() || Object.keys(snapshot.val() || {}).length === 0) {
      for (const story of DEFAULT_COMMUNITY_STORIES) {
        await set(ref(rtdb, `social_stories/${story.id}`), cleanForFirebase(story));
      }
    }
  } catch (e) {
    console.debug("RTDB seed notice:", e);
  }
}

export async function saveSocialStory(storyData: Omit<SocialStory, "id" | "timestamp" | "likesCount" | "likedBy">): Promise<SocialStory> {
  const newStory: SocialStory = {
    ...storyData,
    id: `story-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    likesCount: 0,
    likedBy: [],
    timestamp: new Date().toISOString(),
    verified: false
  };

  localStoriesCache.unshift(newStory);

  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("scamshield_social_stories");
      const list = stored ? JSON.parse(stored) : [];
      list.unshift(newStory);
      localStorage.setItem("scamshield_social_stories", JSON.stringify(list));
    } catch (e) {}
  }

  if (rtdb) {
    try {
      const storiesRef = ref(rtdb, `social_stories/${newStory.id}`);
      await withTimeout(set(storiesRef, cleanForFirebase(newStory)), 2500);
      newStory.id = newStory.id;
    } catch (err) {
      console.warn("RTDB story write notice:", err);
    }
  }

  return newStory;
}

export function subscribeToSocialStories(callback: (stories: SocialStory[]) => void): () => void {
  // First load: localStorage or DEFAULT_COMMUNITY_STORIES
  let initialList: SocialStory[] = DEFAULT_COMMUNITY_STORIES;
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("scamshield_social_stories");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          initialList = parsed;
        }
      }
    } catch (e) {}
  }

  localStoriesCache = initialList;
  callback(initialList);

  if (!rtdb) {
    return () => {};
  }

  try {
    const storiesRef = query(ref(rtdb, "social_stories"), limitToLast(50));
    const unsubscribe = onValue(
      storiesRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const val = snapshot.val();
          const list: SocialStory[] = Object.keys(val).map(key => ({
            ...val[key],
            id: key
          }));
          list.reverse();

          // Merge RTDB stories with seed defaults so feed never empties
          const rtdbIds = new Set(list.map(s => s.id));
          const combined = [...list];
          for (const def of DEFAULT_COMMUNITY_STORIES) {
            if (!rtdbIds.has(def.id)) {
              combined.push(def);
            }
          }

          localStoriesCache = combined;
          if (typeof window !== "undefined") {
            try {
              localStorage.setItem("scamshield_social_stories", JSON.stringify(combined));
            } catch (e) {}
          }
          callback(combined);
        } else {
          // If RTDB doesn't have stories yet, seed them so it is populated permanently
          seedDefaultSocialStoriesToRtdb();
          callback(localStoriesCache.length > 0 ? localStoriesCache : DEFAULT_COMMUNITY_STORIES);
        }
      },
      (err) => {
        console.warn("Social stories listener notice:", err);
        callback(localStoriesCache.length > 0 ? localStoriesCache : DEFAULT_COMMUNITY_STORIES);
      }
    );
    return unsubscribe;
  } catch (err) {
    callback(localStoriesCache.length > 0 ? localStoriesCache : DEFAULT_COMMUNITY_STORIES);
    return () => {};
  }
}

export async function toggleLikeSocialStory(storyId: string, userId: string): Promise<void> {
  const story = localStoriesCache.find(s => s.id === storyId);
  if (story) {
    if (!story.likedBy) story.likedBy = [];
    const hasLiked = story.likedBy.includes(userId);
    if (hasLiked) {
      story.likedBy = story.likedBy.filter(id => id !== userId);
      story.likesCount = Math.max(0, story.likesCount - 1);
    } else {
      story.likedBy.push(userId);
      story.likesCount += 1;
    }

    if (rtdb) {
      try {
        const storyRef = ref(rtdb, `social_stories/${storyId}`);
        await withTimeout(set(storyRef, story), 2000);
      } catch (e) {}
    }
  }
}

export async function deleteSocialStory(storyId: string): Promise<void> {
  localStoriesCache = localStoriesCache.filter(s => s.id !== storyId);
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("scamshield_social_stories", JSON.stringify(localStoriesCache));
    } catch (e) {}
  }
  if (rtdb) {
    try {
      const storyRef = ref(rtdb, `social_stories/${storyId}`);
      await withTimeout(remove(storyRef), 2000);
    } catch (e) {}
  }
}

export async function verifySocialStory(storyId: string, verified: boolean): Promise<void> {
  const story = localStoriesCache.find(s => s.id === storyId);
  if (story) {
    story.verified = verified;
    if (rtdb) {
      try {
        const storyRef = ref(rtdb, `social_stories/${storyId}`);
        await withTimeout(set(storyRef, cleanForFirebase(story)), 2000);
      } catch (e) {}
    }
  }
}

// -------------------------------------------------------------
// USER PROFILE & ADMIN CONSOLE (Task 7)
// -------------------------------------------------------------

export async function syncUserProfile(user: User): Promise<void> {
  let count = localUserScansCache[user.uid]?.length || 0;
  if (rtdb) {
    try {
      const scansSnap = await withTimeout(get(ref(rtdb, `users/${user.uid}/scans`)), 1500);
      if (scansSnap.exists()) {
        count = Object.keys(scansSnap.val() || {}).length;
      }
    } catch (e) {}
  }

  const profile: UserProfile = {
    uid: user.uid,
    displayName: user.displayName || user.email?.split("@")[0] || "SecOps User",
    email: user.email || "",
    photoURL: user.photoURL || "",
    role: (
      user.email?.includes("admin") ||
      user.email?.includes("yashraj") ||
      user.email?.includes("aastik") ||
      user.email?.includes("mangal") ||
      user.email?.includes("palak") ||
      ["26bhi10047", "26bcy10090", "26bcy10001", "26bce10122"].some(reg => user.email?.toLowerCase().includes(reg))
    ) ? "admin" : "analyst",
    totalScans: count,
    lastLogin: new Date().toISOString(),
    joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString()
  };

  if (rtdb) {
    try {
      const userRef = ref(rtdb, `user_profiles/${user.uid}`);
      await withTimeout(set(userRef, cleanForFirebase(profile)), 2000);
    } catch (e) {}
  }
}

export async function getAllUsersForAdmin(): Promise<UserProfile[]> {
  if (rtdb) {
    try {
      const usersRef = ref(rtdb, "user_profiles");
      const snapshot = await withTimeout(get(usersRef), 2000);
      if (snapshot.exists()) {
        const val = snapshot.val();
        const list: UserProfile[] = Object.values(val);
        for (const u of list) {
          try {
            const scansSnap = await withTimeout(get(ref(rtdb, `users/${u.uid}/scans`)), 1000);
            if (scansSnap.exists()) {
              u.totalScans = Object.keys(scansSnap.val() || {}).length;
            }
          } catch (e) {}
        }
        return list;
      }
    } catch (e) {}
  }

  return [];
}

export async function updateUserRole(uid: string, role: "admin" | "analyst" | "citizen"): Promise<boolean> {
  if (rtdb) {
    try {
      const userRef = ref(rtdb, `user_profiles/${uid}/role`);
      await withTimeout(set(userRef, role), 2000);
      return true;
    } catch (e) {
      console.warn("Error updating user role in RTDB:", e);
    }
  }
  return true;
}

// -------------------------------------------------------------
// AUTH HELPERS
// -------------------------------------------------------------

export async function signInWithGoogle(): Promise<User | null> {
  if (!auth || !googleProvider) {
    throw new Error("Firebase Auth is not initialized");
  }
  const result = await signInWithPopup(auth, googleProvider);
  if (result.user) {
    syncUserProfile(result.user);
  }
  return result.user;
}

export async function signOutUser(): Promise<void> {
  if (!auth) return;
  await signOut(auth);
}

export function subscribeToAuthChanges(callback: (user: User | null) => void): () => void {
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      syncUserProfile(user);
    }
    callback(user);
  });
}

// -------------------------------------------------------------
// TEAM MEMBERS & WEB APP DYNAMIC SETTINGS (RTDB Sync)
// -------------------------------------------------------------

export interface EditableTeamMember {
  id: string; // "mangal" | "aastik" | "palak" | "yashraj"
  name: string;
  regNo: string;
  badge?: string;
  badgeColor?: string;
  photoBase64?: string;
  initials: string;
  avatarBg: string;
  bio?: string;
  githubUsername?: string;
  githubUrl?: string;
  roleType?: "Author" | "Contributor";
}

export interface WebAppSiteConfig {
  bannerActive: boolean;
  bannerText: string;
  bannerMessage?: string;
  bannerSeverity: "danger" | "warning" | "info";
  bannerType?: "danger" | "warning" | "info";
  helplinePhone: string;
  helplineNumber?: string;
  certInNotice?: string;
  demoModeActive?: boolean;
}

export const DEFAULT_TEAM_MEMBERS: EditableTeamMember[] = [
  {
    id: "yashraj",
    name: "Yash Raj Kushwaha",
    regNo: "26BCE10122",
    badge: "Author",
    badgeColor: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    avatarBg: "from-emerald-600 to-teal-600",
    initials: "YK",
    githubUsername: "YashRaj-Kushwaha",
    githubUrl: "https://github.com/YashRaj-Kushwaha",
    roleType: "Author"
  },
  {
    id: "aastik",
    name: "Aastik Tripathi",
    regNo: "26BCY10090",
    badge: "Contributor",
    badgeColor: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    avatarBg: "from-blue-600 to-indigo-600",
    initials: "AT",
    githubUsername: "DarkDevil811",
    githubUrl: "https://github.com/DarkDevil811",
    roleType: "Contributor"
  },
  {
    id: "mangal",
    name: "Mangal Nath Yadav",
    regNo: "26BHI10047",
    badge: "Contributor",
    badgeColor: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    avatarBg: "from-amber-500 via-orange-500 to-amber-600",
    initials: "MY",
    githubUsername: "shadowXg",
    githubUrl: "https://github.com/shadowXg",
    roleType: "Contributor"
  },
  {
    id: "palak",
    name: "Palak Kalra",
    regNo: "26BCY10001",
    badge: "Contributor",
    badgeColor: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    avatarBg: "from-purple-600 to-pink-600",
    initials: "PK",
    githubUsername: "palak-kalra-gtihub",
    githubUrl: "https://github.com/palak-kalra-gtihub",
    roleType: "Contributor"
  }
];

export const DEFAULT_SITE_CONFIG: WebAppSiteConfig = {
  bannerActive: false,
  bannerText: "🚨 NCIIPC Advisory: Fake utility bill SMS vectors circulating actively. Verify all payment links before opening.",
  bannerMessage: "🚨 NCIIPC Advisory: Fake utility bill SMS vectors circulating actively. Verify all payment links before opening.",
  bannerSeverity: "danger",
  bannerType: "danger",
  helplinePhone: "1930",
  helplineNumber: "1930",
  certInNotice: "CERT-In Advisory CI-2026-0041: Critical Smishing Campaigns",
  demoModeActive: true
};

let localTeamMembersCache: EditableTeamMember[] = [...DEFAULT_TEAM_MEMBERS];
let localSiteConfigCache: WebAppSiteConfig = { ...DEFAULT_SITE_CONFIG };

export function subscribeToTeamMembers(callback: (members: EditableTeamMember[]) => void): () => void {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("scamshield_team_members");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          localTeamMembersCache = parsed;
        }
      }
    } catch (e) {}
  }

  callback(localTeamMembersCache);

  if (!rtdb) return () => {};

  try {
    const teamRef = ref(rtdb, "app_config/team_members");
    const unsubscribe = onValue(teamRef, (snapshot) => {
      if (snapshot.exists()) {
        const val = snapshot.val();
        const list: EditableTeamMember[] = Object.keys(val).map(key => ({
          ...val[key],
          id: key
        }));
        
        const ids = new Set(list.map(m => m.id));
        const combined = [...list];
        for (const def of DEFAULT_TEAM_MEMBERS) {
          if (!ids.has(def.id)) {
            combined.push(def);
          }
        }

        localTeamMembersCache = combined;
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem("scamshield_team_members", JSON.stringify(combined));
          } catch (e) {}
        }
        callback(combined);
      } else {
        if (rtdb) {
          for (const def of DEFAULT_TEAM_MEMBERS) {
            set(ref(rtdb, `app_config/team_members/${def.id}`), cleanForFirebase(def));
          }
        }
        callback(DEFAULT_TEAM_MEMBERS);
      }
    });

    return unsubscribe;
  } catch (e) {
    return () => {};
  }
}

export async function updateTeamMemberInRtdb(member: EditableTeamMember): Promise<void> {
  localTeamMembersCache = localTeamMembersCache.map(m => m.id === member.id ? member : m);
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("scamshield_team_members", JSON.stringify(localTeamMembersCache));
    } catch (e) {}
  }
  if (rtdb) {
    try {
      const memberRef = ref(rtdb, `app_config/team_members/${member.id}`);
      await withTimeout(set(memberRef, cleanForFirebase(member)), 3500);
    } catch (e) {
      console.warn("RTDB member update notice:", e);
    }
  }
}

export function subscribeToSiteConfig(callback: (config: WebAppSiteConfig) => void): () => void {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("scamshield_site_config");
      if (stored) {
        localSiteConfigCache = JSON.parse(stored);
      }
    } catch (e) {}
  }
  callback(localSiteConfigCache);

  if (!rtdb) return () => {};

  try {
    const configRef = ref(rtdb, "app_config/site_settings");
    const unsubscribe = onValue(configRef, (snapshot) => {
      if (snapshot.exists()) {
        const val = snapshot.val();
        localSiteConfigCache = { ...DEFAULT_SITE_CONFIG, ...val };
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem("scamshield_site_config", JSON.stringify(localSiteConfigCache));
          } catch (e) {}
        }
        callback(localSiteConfigCache);
      } else {
        if (rtdb) {
          set(ref(rtdb, "app_config/site_settings"), cleanForFirebase(DEFAULT_SITE_CONFIG));
        }
        callback(DEFAULT_SITE_CONFIG);
      }
    });
    return unsubscribe;
  } catch (e) {
    return () => {};
  }
}

export async function updateSiteConfigInRtdb(config: Partial<WebAppSiteConfig>): Promise<void> {
  localSiteConfigCache = { ...localSiteConfigCache, ...config };
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("scamshield_site_config", JSON.stringify(localSiteConfigCache));
    } catch (e) {}
  }
  if (rtdb) {
    try {
      const configRef = ref(rtdb, "app_config/site_settings");
      await withTimeout(set(configRef, cleanForFirebase(localSiteConfigCache)), 2500);
    } catch (e) {
      console.warn("RTDB site config notice:", e);
    }
  }
}

export { app, rtdb, auth, analytics };
