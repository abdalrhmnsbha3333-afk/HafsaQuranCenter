// لوحة تحكم المشرف - مركز حفصة القرآني (Firebase v12 Modular)

import { initializeApp, getApps, deleteApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import { createUserWithEmailAndPassword, getAuth, signOut } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
import { 
  collection, 
  addDoc, 
  doc, 
  setDoc, 
  getDocs, 
  updateDoc, 
  serverTimestamp 
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

// تحويل اسم المستخدم لبريد افتراضي
function usernameToEmail(username) {
  return `${username.trim().toLowerCase()}@hafsa-quran.internal`;
}

// إنشاء شعبة جديدة وحساب مرتبط بها
window.createNewSection = async function(sectionName, username, initialPassword) {
  if (!window.currentUserData || window.currentUserData.role !== 'admin') {
    return alert('عذراً، هذه الصلاحية للمشرف الرئيسي فقط.');
  }

  const db = window.db;
  if (!db) return alert('لم يتم الاتصال بقاعدة البيانات بعد.');

  try {
    // 1. إضافة بيانات الشعبة
    const sectionRef = await addDoc(collection(db, 'sections'), {
      name: sectionName,
      username: username,
      isActive: true,
      createdAt: serverTimestamp()
    });

    // 2. تحويل اسم المستخدم لبريد افتراضي
    const email = usernameToEmail(username);

    // 3. إنشاء الحساب في Auth عبر تطبيق ثانوي لتفادي تسجيل خروج المشرف الحالي
    const mainAppConfig = window.firebaseConfig || {};
    const secondaryApp = initializeApp(mainAppConfig, "SecondaryApp_" + Date.now());
    const secondaryAuth = getAuth(secondaryApp);

    const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, initialPassword);
    const newUid = userCredential.user.uid;

    await signOut(secondaryAuth);
    await deleteApp(secondaryApp);

    // 4. حفظ ربط الحساب بالشعبة في Firestore
    await setDoc(doc(db, 'users', newUid), {
      role: 'teacher',
      sectionId: sectionRef.id,
      username: username
    });

    alert(`تم إنشاء شعبة (${sectionName}) والحساب بنجاح!`);
    window.loadAllSections();
  } catch (error) {
    console.error('خطأ في إنشاء الشعبة:', error);
    alert('حدث خطأ أثناء إنشاء الشعبة: ' + error.message);
  }
};

// جلب وعرض جميع الشعب
window.loadAllSections = async function() {
  if (!window.currentUserData || window.currentUserData.role !== 'admin') return;

  const db = window.db;
  if (!db) return;

  try {
    const snapshot = await getDocs(collection(db, 'sections'));
    const listContainer = document.getElementById('adminSectionsList');
    if (!listContainer) return;

    listContainer.innerHTML = '';
    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      const sectionId = docSnap.id;
      const item = document.createElement('div');
      item.style.cssText = "padding:10px; border-bottom:1px solid #ccc; display:flex; justify-content:space-between; align-items:center;";
      item.innerHTML = `
        <div>
          <strong>${data.name || ''}</strong> (${data.username || ''})
          <span style="color:${data.isActive ? 'green' : 'red'}; margin-right:10px;">
            [${data.isActive ? 'مفعل' : 'معطل'}]
          </span>
        </div>
        <div>
          <button onclick="toggleSectionStatus('${sectionId}', ${!data.isActive})" style="padding:5px 10px; cursor:pointer;">
            ${data.isActive ? 'تعطيل' : 'تفعيل'}
          </button>
        </div>
      `;
      listContainer.appendChild(item);
    });
  } catch (err) {
    console.error("خطأ في تحميل الشعب:", err);
  }
};

// تفعيل أو تعطيل شعبة
window.toggleSectionStatus = async function(sectionId, newStatus) {
  const db = window.db;
  if (!db) return;

  try {
    const sectionDocRef = doc(db, 'sections', sectionId);
    await updateDoc(sectionDocRef, {
      isActive: newStatus
    });
    alert('تم تغيير حالة الشعبة بنجاح.');
    window.loadAllSections();
  } catch (error) {
    console.error(error);
    alert('حدث خطأ أثناء تغيير الحالة.');
  }
};

// التشغيل الذاتي عند إطلاق حدث جاهزية الفايربيس
window.addEventListener('firebase-ready', () => {
  if (window.currentUserData && window.currentUserData.role === 'admin') {
    window.loadAllSections();
  }
});
