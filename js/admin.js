// لوحة تحكم المشرف - مركز حفصة القرآني (Firebase v12 Modular)

import { initializeApp, getApps, deleteApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import { createUserWithEmailAndPassword, getAuth, signOut } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
import { 
  collection, 
  addDoc, 
  doc, 
  setDoc, 
  getDoc,
  updateDoc, 
  serverTimestamp,
  onSnapshot 
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

// تحويل اسم المستخدم لبريد افتراضي
function usernameToEmail(username) {
  return `${username.trim().toLowerCase()}@hafsa-quran.internal`;
}

// إنشاء شعبة جديدة وحساب مرتبط بها مباشرة في الفايربيس
window.createNewSection = async function(sectionName, username, initialPassword) {
  if (!window.currentUserData || window.currentUserData.role !== 'admin') {
    return alert('عذراً، هذه الصلاحية للمشرف الرئيسي فقط.');
  }

  const db = window.db;
  if (!db) return alert('لم يتم الاتصال بقاعدة البيانات بعد.');

  try {
    // 1. إضافة بيانات الشعبة في مجموعة sections مباشرة
    const sectionRef = await addDoc(collection(db, 'sections'), {
      name: sectionName,
      username: username,
      isActive: true,
      createdAt: serverTimestamp()
    });

    const email = usernameToEmail(username);

    // 2. إنشاء حساب Auth عبر تطبيق ثانوي لتفادي تسجيل خروج المشرف
    const mainAppConfig = window.firebaseConfig || {};
    const secondaryApp = initializeApp(mainAppConfig, "SecondaryApp_" + Date.now());
    const secondaryAuth = getAuth(secondaryApp);

    const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, initialPassword);
    const newUid = userCredential.user.uid;

    await signOut(secondaryAuth);
    await deleteApp(secondaryApp);

    // 3. ربط الحساب بالشعبة في مجموعة users
    await setDoc(doc(db, 'users', newUid), {
      role: 'teacher',
      sectionId: sectionRef.id,
      username: username,
      email: email
    });

    alert(`تم إنشاء شعبة (${sectionName}) وحساب المعلم بنجاح على الفايربيس!`);
  } catch (error) {
    console.error('خطأ في إنشاء الشعبة:', error);
    alert('حدث خطأ أثناء إنشاء الشعبة: ' + error.message);
  }
};

// جلب واستماع حي ومباشر (Real-time) لجميع الشعب من Firestore
let unsubscribeSections = null;

window.loadAllSections = function() {
  const db = window.db;
  if (!db) return;

  const listContainer = document.getElementById('adminSectionsList');
  if (!listContainer) return;

  // إيقاف المستمع القديم إن وجد لمنع التكرار
  if (unsubscribeSections) {
    unsubscribeSections();
  }

  // الاستماع المباشر للتغييرات عبر الإنترنت (Real-time)
  unsubscribeSections = onSnapshot(collection(db, 'sections'), (snapshot) => {
    if (snapshot.empty) {
      listContainer.innerHTML = '<p style="color:#666; text-align:center;">لا توجد شعب مسجلة حالياً في الفايربيس.</p>';
      return;
    }

    listContainer.innerHTML = '';
    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      const sectionId = docSnap.id;
      const item = document.createElement('div');
      item.style.cssText = "padding:10px; border-bottom:1px solid #eee; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;";
      item.innerHTML = `
        <div>
          <strong>${data.name || 'شعبة بدون اسم'}</strong> 
          <span style="color:#666; font-size:13px;">(${data.username || ''})</span>
          <span style="color:${data.isActive ? 'green' : 'red'}; margin-right:10px; font-weight:bold;">
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
  }, (error) => {
    console.error("خطأ في جلب الشعب مباشرة من الإنترنت:", error);
    listContainer.innerHTML = '<p style="color:red; text-align:center;">حدث خطأ في تحميل البيانات من الإنترنت (تأكد من قواعد Security Rules في الفايربيس).</p>';
  });
};

// تفعيل أو تعطيل شعبة في Firestore
window.toggleSectionStatus = async function(sectionId, newStatus) {
  const db = window.db;
  if (!db) return;

  try {
    const sectionDocRef = doc(db, 'sections', sectionId);
    await updateDoc(sectionDocRef, {
      isActive: newStatus
    });
  } catch (error) {
    console.error(error);
    alert('حدث خطأ أثناء تغيير الحالة: ' + error.message);
  }
};

// فتح نافذة تعديل حساب الشعبة
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

// إغلاق نافذة التعديل
window.closeEditModal = function() {
  const modal = document.getElementById('editSectionAccountModal');
  if (modal) modal.style.display = 'none';
};

// حفظ التغييرات على حساب الشعبة
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
  } catch (err) {
    console.error("خطأ التحديث:", err);
    alert('حدث خطأ أثناء حفظ التغييرات: ' + err.message);
  }
};

// دالة ترحيل البيانات القديمة المحفوظة محلياً إلى Firestore
window.migrateOldData = async function() {
  if (!window.currentUserData || window.currentUserData.role !== 'admin') {
    return alert('عذراً، هذه الصلاحية للمشرف الرئيسي فقط.');
  }

  const db = window.db;
  if (!db) return alert('لم يتم الاتصال بقاعدة البيانات بعد.');

  try {
    const halaqatListRaw = localStorage.getItem('sawaed-halaqat-list');
    if (!halaqatListRaw) {
      return alert('لا توجد بيانات حلقات قديمة محفوظة في المتصفح لترحيلها.');
    }

    const halaqat = JSON.parse(halaqatListRaw);
    let count = 0;

    for (const h of halaqat) {
      const configKey = h.id === 'h1' ? 'sawaed_sawaed-config' : `sawaed_sawaed-config:${h.id}`;
      const configRaw = localStorage.getItem(configKey);
      
      if (configRaw) {
        const configData = JSON.parse(configRaw);
        await setDoc(doc(db, 'sections', h.id), {
          name: h.name,
          username: h.id === 'h1' ? 'sec_h1' : (h.id === 'h2' ? 'sec_h2' : h.id),
          isActive: true,
          students: configData.students || [],
          groupLink: configData.groupLink || '',
          updatedAt: serverTimestamp()
        }, { merge: true });
        count++;
      }
    }

    alert(`تم ترحيل بيانات ${count} شعبة بنجاح إلى الفايربيس!`);
  } catch (error) {
    console.error('خطأ أثناء الترحيل:', error);
    alert('حدث خطأ أثناء ترحيل البيانات: ' + error.message);
  }
};

// التشغيل الذاتي والبدء بالاستماع المباشر للبيانات فور تحميل الفايربيس
window.addEventListener('firebase-ready', () => {
  window.loadAllSections();
});

if (window.db) {
  window.loadAllSections();
}
