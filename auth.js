// إدارة المصادقة والجلسات - مركز حفصة القرآني
const auth = firebase.auth();
const db = firebase.firestore();

// تحويل اسم المستخدم لبريد افتراضي
function usernameToEmail(username) {
  return `${username.trim().toLowerCase()}@hafsa-quran.internal`;
}

// تسجيل الدخول
async function loginUser(username, password) {
  try {
    const email = usernameToEmail(username);
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    const user = userCredential.user;

    // جلب صلاحيات المستخدم
    const userDoc = await db.collection('users').doc(user.uid).get();
    if (!userDoc.exists) {
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
}

// تسجيل الخروج
function logoutUser() {
  auth.signOut().then(() => {
    sessionStorage.clear();
    location.reload();
  });
}

// تغيير كلمة المرور للحساب الحالي
async function changeOwnPassword(currentPassword, newPassword) {
  const user = auth.currentUser;
  if (!user) return alert('يجب تسجيل الدخول أولاً.');

  if (newPassword.length < 6) {
    return alert('كلمة المرور يجب أن تكون 6 خانات على الأقل.');
  }

  try {
    const credential = firebase.auth.EmailAuthProvider.credential(user.email, currentPassword);
    await user.reauthenticateWithCredential(credential);
    await user.updatePassword(newPassword);
    alert('تم تغيير كلمة المرور بنجاح.');
  } catch (error) {
    alert('حدث خطأ: التأكد من كلمة المرور الحالية غير صحيح.');
  }
}

// مراقبة حالة الجلسة
auth.onAuthStateChanged(async (user) => {
  if (user) {
    const userDoc = await db.collection('users').doc(user.uid).get();
    if (userDoc.exists) {
      const data = userDoc.data();
      window.currentUserData = data;
      console.log('مرحباً بك:', data.username, '| الدور:', data.role);
    }
  } else {
    window.currentUserData = null;
  }
});
