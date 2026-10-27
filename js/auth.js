// إدارة المصادقة والجلسات - مركز حفصة القرآني (Firebase v12 Modular)

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
  getDoc,
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

// تحويل اسم المستخدم لبريد افتراضي
function usernameToEmail(username) {
  return `${username.trim().toLowerCase()}@hafsa-quran.internal`;
}

// تطبيق صلاحيات الواجهة بناءً على دور المستخدم
export function applyRoleUI(userData) {
  const adminPanel = document.getElementById('adminPanel');
  const announcementsCard = document.querySelector('.an-card');
  const halaqahTabs = document.getElementById('halaqahTabs');

  if (userData && userData.role === 'admin') {
    // المشرف الرئيسي: تظهر له لوحة الإدارة والإعلانات والتبديل
    if (adminPanel) adminPanel.style.display = 'block';
    if (announcementsCard) announcementsCard.style.display = 'block';
    if (halaqahTabs) halaqahTabs.style.display = 'flex';
  } else if (userData && userData.role === 'teacher') {
    // المعلم/الشيخ: تُخفى عنه لوحة الإدارة والإعلانات وتثبت واجهته على شعبته
    if (adminPanel) adminPanel.style.display = 'none';
    if (announcementsCard) announcementsCard.style.display = 'none';
    if (halaqahTabs) halaqahTabs.style.display = 'none';

    if (userData.sectionId) {
      localStorage.setItem('sawaed-current-halaqah', userData.sectionId);
    }
  }
}

// تسجيل الدخول مع فحص تعطيل الشعبة
window.loginUser = async function(username, password) {
  try {
    const auth = window.auth;
    const db = window.db;
    if (!auth || !db) throw new Error("لم يتم تهيئة Firebase بعد.");

    const email = usernameToEmail(username);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // جلب بيانات المستخدم
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      await signOut(auth);
      throw new Error('لم يتم العثور على بيانات هذا الحساب في قاعدة البيانات.');
    }

    const userData = userDoc.data();

    // فحص ما إذا كانت الشعبة معطلة من قبل المشرف
    if (userData.role === 'teacher' && userData.sectionId) {
      const sectionDoc = await getDoc(doc(db, 'sections', userData.sectionId));
      if (sectionDoc.exists() && sectionDoc.data().isActive === false) {
        await signOut(auth);
        alert('عذراً، هذه الشعبة معطّلة حالياً من قبل المشرف.');
        return;
      }
    }

    window.currentUserData = userData;
    sessionStorage.setItem('userRole', userData.role);
    sessionStorage.setItem('sectionId', userData.sectionId || '');

    applyRoleUI(userData);
    location.reload();
  } catch (error) {
    alert('فشل تسجيل الدخول: اسم المستخدم أو كلمة المرور غير صحيحة.');
    console.error("خطأ تسجيل الدخول:", error);
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
    const loginModal = document.getElementById('loginModal');
    if (user) {
      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
          window.currentUserData = data;
          
          if (loginModal) loginModal.style.display = 'none';
          applyRoleUI(data);
          console.log('مرحباً بك:', data.username, '| الدور:', data.role);
        }
      } catch (err) {
        console.error("خطأ في جلب بيانات المستخدم:", err);
      }
    } else {
      window.currentUserData = null;
      if (loginModal) loginModal.style.display = 'flex';
    }
  });
}

// الانتظار لحين تهيئة window.auth من الصفحة الرئيسية
window.addEventListener('firebase-ready', setupAuthObserver);
if (window.auth && window.db) {
  setupAuthObserver();
}
