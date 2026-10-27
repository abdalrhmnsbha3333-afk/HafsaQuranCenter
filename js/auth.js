// إدارة المصادقة والجلسات - مركز حفصة القرآني (Firebase v12 Modular)

// استدعاء الدوال المطلوبة من مكتبات v12 مباشرة
import { 
  signInWithEmailAndPassword, 
  signOut, 
  EmailAuthProvider, 
  reauthenticateWithCredential, 
  updatePassword, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

import { 
  doc, 
  getDoc 
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

// تحويل اسم المستخدم لبريد افتراضي
function usernameToEmail(username) {
  return `${username.trim().toLowerCase()}@hafsa-quran.internal`;
}

// تسجيل الدخول
window.loginUser = async function(username, password) {
  try {
    const auth = window.auth;
    const db = window.db;
    if (!auth || !db) throw new Error("لم يتم تهيئة Firebase بعد.");

    const email = usernameToEmail(username);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // جلب صلاحيات المستخدم من Firestore v12
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      throw new Error('لم يتم العثور على بيانات الحساب.');
    }

    const userData = userDoc.data();
    sessionStorage.setItem('userRole', userData.role);
    sessionStorage.setItem('sectionId', userData.sectionId || '');

    location.reload();
  } catch (error) {
    alert('فشل تسجيل الدخول: اسم المستخدم أو كلمة المرور غير صحيحة.');
    console.error(error);
  }
};

// تسجيل الخروج
window.logoutUser = function() {
  const auth = window.auth;
  if (!auth) return;
  
  signOut(auth).then(() => {
    sessionStorage.clear();
    location.reload();
  });
};

// تغيير كلمة المرور للحساب الحالي
window.changeOwnPassword = async function(currentPassword, newPassword) {
  const auth = window.auth;
  if (!auth || !auth.currentUser) return alert('يجب تسجيل الدخول أولاً.');

  if (newPassword.length < 6) {
    return alert('كلمة المرور يجب أن تكون 6 خانات على الأقل.');
  }

  try {
    const user = auth.currentUser;
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
    await updatePassword(user, newPassword);
    alert('تم تغيير كلمة المرور بنجاح.');
  } catch (error) {
    alert('حدث خطأ: التأكد من كلمة المرور الحالية غير صحيح.');
    console.error(error);
  }
};

// تهيئة ومراقبة حالة الجلسة
function setupAuthObserver() {
  const auth = window.auth;
  const db = window.db;

  if (!auth || !db) return;

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
          window.currentUserData = data;
          console.log('مرحباً بك:', data.username, '| الدور:', data.role);
        }
      } catch (err) {
        console.error("خطأ في جلب بيانات المستخدم:", err);
      }
    } else {
      window.currentUserData = null;
    }
  });
}

// الانتظار لحين تهيئة window.auth من الصفحة الرئيسية
window.addEventListener('firebase-ready', setupAuthObserver);
if (window.auth && window.db) {
  setupAuthObserver();
}
