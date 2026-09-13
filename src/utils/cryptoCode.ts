/**
 * Mathematical Cryptographic Code Engine for "MORE ENGLISH MORE LOVE"
 * Under the supervision of Teacher Jaidaa Saqer.
 * 
 * Works completely client-side with 0 server dependencies.
 * Deterministically binds a student's full name to an 8-character cryptographic token:
 * Format: MEML-XXXX-XXXX
 */

export const ADMIN_PIN = "b13a15m17";
export const SUBSCRIPTION_DURATION_DAYS = 180; // 6 Months (180 days)
export const TEACHER_NAME = "جيداء صقر";
export const TEACHER_WHATSAPP = "+963933036079";
export const TEACHER_WHATSAPP_CLEAN = "963933036079";

// Salt constant for the mathematical hash transformation
const MEML_SALT = "MEML_JAIDAA_SAQER_MATH_CRYPTO_2026_EXCLUSIVE_SALT";

// Clean alphabet avoiding ambiguous characters (like 0 vs O, 1 vs I)
const CHARSET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";

/**
 * Normalizes student name to prevent mismatch caused by:
 * - Leading/trailing/multiple spaces
 * - Different Arabic hamzas (أ, إ, آ -> ا)
 * - Taa marbuta (ة -> ه)
 * - Yaa/Alef maqsura (ى -> ي)
 * - English letter case
 */
export function normalizeStudentName(name: string): string {
  if (!name) return "";
  let clean = name.trim().toLowerCase();
  
  // Normalize Arabic letters
  clean = clean.replace(/[أإآ]/g, "ا");
  clean = clean.replace(/ة/g, "ه");
  clean = clean.replace(/ى/g, "ي");
  clean = clean.replace(/[\u064B-\u065F]/g, ""); // Remove Arabic diacritics/tashkeel
  clean = clean.replace(/\s+/g, " ");            // Squash multiple spaces
  
  return clean;
}

/**
 * Deterministic mathematical hash function
 * Combines polynomial rolling hash with bitwise rotations and prime multiplication
 */
function computeNameHash(normalizedName: string, salt: string): { part1: number; part2: number } {
  let h1 = 0x811c9dc5;
  let h2 = 0x55555555;
  const fullStr = `${salt}:${normalizedName}:${salt}`;

  for (let i = 0; i < fullStr.length; i++) {
    const code = fullStr.charCodeAt(i);
    
    // Hash component 1 (FNV-1a variant with prime mix)
    h1 ^= code;
    h1 = Math.imul(h1, 0x01000193);
    h1 = (h1 << 5) | (h1 >>> 27);
    
    // Hash component 2 (Rolling polynomial)
    h2 = Math.imul(h2 ^ (code * 31), 0x45d9f3b);
    h2 = (h2 << 13) | (h2 >>> 19);
  }

  return {
    part1: Math.abs(h1),
    part2: Math.abs(h2),
  };
}

/**
 * Generates the official MEML-XXXX-XXXX code for a given student name
 */
export function generateStudentCode(rawStudentName: string): string {
  const normalized = normalizeStudentName(rawStudentName);
  if (!normalized || normalized.length < 2) {
    return "";
  }

  const { part1, part2 } = computeNameHash(normalized, MEML_SALT);

  // Derive 4 characters from part1 and 4 characters from part2
  let code1 = "";
  let temp1 = part1;
  for (let i = 0; i < 4; i++) {
    code1 += CHARSET[temp1 % CHARSET.length];
    temp1 = Math.floor(temp1 / CHARSET.length) ^ (i * 7);
  }

  let code2 = "";
  let temp2 = part2;
  for (let i = 0; i < 4; i++) {
    code2 += CHARSET[temp2 % CHARSET.length];
    temp2 = Math.floor(temp2 / CHARSET.length) ^ (i * 11);
  }

  return `MEML-${code1}-${code2}`;
}

/**
 * Validates whether the entered code matches the student name
 */
export function verifyStudentCode(rawStudentName: string, enteredCode: string): {
  isValid: boolean;
  expectedCode?: string;
  errorMessage?: string;
} {
  const normalizedName = normalizeStudentName(rawStudentName);
  if (!normalizedName || normalizedName.length < 2) {
    return {
      isValid: false,
      errorMessage: "يرجى كتابة الاسم الكامل للطالب بشكل صحيح (حرفين على الأقل)",
    };
  }

  if (!enteredCode || !enteredCode.trim()) {
    return {
      isValid: false,
      errorMessage: "يرجى إدخال كود التفعيل السري المخصص لك من المعلمة",
    };
  }

  const cleanCode = enteredCode.trim().toUpperCase().replace(/\s+/g, "");
  const expectedCode = generateStudentCode(rawStudentName);

  if (cleanCode === expectedCode) {
    return {
      isValid: true,
      expectedCode,
    };
  }

  return {
    isValid: false,
    errorMessage: "كود التفعيل غير متطابق مع اسم الطالب. تأكد من كتابة الاسم والكود تماماً كما تم استلامهما من المعلمة جيداء صقر.",
  };
}

/**
 * Retrieves or creates a unique client-side device signature
 * Ensures subscription stays bound to this device ("الكود يفتح على جهاز واحد فقط")
 */
export function getOrCreateDeviceId(): string {
  const STORAGE_KEY = "meml_device_fingerprint";
  try {
    let devId = localStorage.getItem(STORAGE_KEY);
    if (!devId) {
      devId = "DEV-" + Math.random().toString(36).substring(2, 10).toUpperCase() + "-" + Date.now().toString(36).toUpperCase();
      localStorage.setItem(STORAGE_KEY, devId);
    }
    return devId;
  } catch {
    return "DEV-BROWSER-GENERIC";
  }
}

/**
 * Formats a WhatsApp direct link with automated greeting
 */
export function buildStudentWhatsAppRequestUrl(studentName?: string): string {
  const baseGreeting = studentName && studentName.trim()
    ? `مرحباً أستاذة جيداء صقر، أود الحصول على كود تفعيل لتطبيق MORE ENGLISH MORE LOVE لفتح المنهاج. اسمي الكامل هو: ${studentName.trim()}`
    : `مرحباً أستاذة جيداء صقر، أود الحصول على كود تفعيل لتطبيق MORE ENGLISH MORE LOVE لفتح المنهاج. اسمي هو: `;
    
  return `https://wa.me/${TEACHER_WHATSAPP_CLEAN}?text=${encodeURIComponent(baseGreeting)}`;
}

/**
 * Formats a WhatsApp link for the teacher to send the code to the student
 */
export function buildTeacherSendCodeUrl(studentName: string, code: string): string {
  const message = `مرحباً ${studentName} 🌟\nتم تفعيل اشتراكك في تطبيق "MORE ENGLISH MORE LOVE" بإشراف المعلمة جيداء صقر.\n\n🔑 كود التفعيل الحصري الخاص بك:\n${code}\n\n⏱️ صلاحية الكود: 6 أشهر (180 يوماً)\nرابط التطبيق: https://more-english-more-love.netlify.app/\n\nنتمنى لك كل التوفيق والتميز! ✨`;
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}
