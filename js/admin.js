// لوحة تحكم المشرف - مركز حفصة القرآني (Firebase v12 Modular)

import { initializeApp, getApps, deleteApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import { createUserWithEmailAndPassword, getAuth, signOut } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
import { 
  collection, 
  addDoc, 
  doc, 
  setDoc, 
  getDoc,
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
      username: username,
      email: email
    });

    alert(`تم إنشاء شعبة (${sectionName}) والحساب بنجاح!`);
    window.loadAllSections();
  } catch (error) {
    console.error('خطأ في إنشاء الشعبة:', error);
    alert('حدث خطأ أثناء إنشاء الشعبة: ' + error.message);
  }
};

// جلب وعرض جميع الشعب في لوحة المشرف
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
      item.style.cssText = "padding:10px; border-bottom:1px solid #ccc; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;";
      item.innerHTML = `
        <div>
          <strong>${data.name || ''}</strong> (${data.username || ''})
          <span style="color:${data.isActive ? 'green' : 'red'}; margin-right:10px;">
            [${data.isActive ? 'مفعل' : 'معطل'}]
          </span>
        </div>
        <div style="display:flex; gap:6px;">
          <button onclick="openEditSectionModal('${sectionId}')" style="padding:5px 10px; cursor:pointer; background:#17a2b8; color:#fff; border:none; border-radius:4px;">
            ⚙️ تعديل الحساب
          </button>
          <button onclick="toggleSectionStatus('${sectionId}', ${!data.isActive})" style="padding:5px 10px; cursor:pointer; background:${data.isActive ? '#dc3545' : '#28a745'}; color:#fff; border:none; border-radius:4px;">
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

// 1. فتح نافذة تعديل حساب الشعبة
window.openEditSectionModal = async function(sectionId) {
  const db = window.db;
  if (!db) return;

  try {
    const secDoc = await getDoc(doc(db, 'sections', sectionId));
    if (!secDoc.exists()) return alert('الشعبة غير موجودة.');

    const data = secDoc.data();
    document.getElementById('editSectionId').value = sectionId;
    document.getElementById('editSectionName').value = data.name || '';
    document.getElementById('editSectionUser').value = data.username || '';
    document.getElementById('editSectionPass').value = '';

    const modal = document.getElementById('editSectionAccountModal');
    if (modal) modal.style.display = 'flex';
  } catch (err) {
    alert('خطأ في جلب بيانات الشعبة: ' + err.message);
  }
};

// 2. إغلاق نافذة التعديل
window.closeEditModal = function() {
  const modal = document.getElementById('editSectionAccountModal');
  if (modal) modal.style.display = 'none';
};

// 3. حفظ التغييرات على حساب الشعبة
window.saveSectionAccountChanges = async function() {
  const db = window.db;
  if (!db) return;

  const sectionId = document.getElementById('editSectionId').value;
  const newName = document.getElementById('editSectionName').value.trim();
  const newUser = document.getElementById('editSectionUser').value.trim();
  const newPass = document.getElementById('editSectionPass').value.trim();

  if (!newName || !newUser) {
    return alert('يرجى كتابة اسم الشعبة واسم المستخدم.');
  }

  try {
    const updateData = {
      name: newName,
      username: newUser
    };

    if (newPass) {
      updateData.password = newPass;
    }

    await updateDoc(doc(db, 'sections', sectionId), updateData);

    alert('تم تحديث بيانات حساب الشعبة بنجاح!');
    window.closeEditModal();
    window.loadAllSections();
  } catch (err) {
    console.error("خطأ التحديث:", err);
    alert('حدث خطأ أثناء حفظ التغييرات: ' + err.message);
  }
};

// التشغيل الذاتي عند إطلاق حدث جاهزية الفايربيس
window.addEventListener('firebase-ready', () => {
  if (window.currentUserData && window.currentUserData.role === 'admin') {
    window.loadAllSections();
  }
});
