// لوحة تحكم المشرف - مركز حفصة القرآني
const adminDb = firebase.firestore();

// إنشاء شعبة جديدة وحساب مرتبط بها
async function createNewSection(sectionName, username, initialPassword) {
  if (!window.currentUserData || window.currentUserData.role !== 'admin') {
    return alert('عذراً، هذه الصلاحية للمشرف الرئيسي فقط.');
  }

  try {
    // 1. إضافة بيانات الشعبة
    const sectionRef = await adminDb.collection('sections').add({
      name: sectionName,
      username: username,
      isActive: true,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    // 2. تحويل اسم المستخدم لبريد افتراضي
    const email = `${username.trim().toLowerCase()}@hafsa-quran.internal`;

    // 3. إنشاء الحساب في Auth عبر تطبيق ثانوي لتفادي تسجيل خروج المشرف
    const secondaryApp = firebase.initializeApp(firebase.app().options, "SecondaryApp");
    const userCredential = await secondaryApp.auth().createUserWithEmailAndPassword(email, initialPassword);
    const newUid = userCredential.user.uid;
    await secondaryApp.auth().signOut();
    secondaryApp.delete();

    // 4. حفظ ربط الحساب بالشعبة في Firestore
    await adminDb.collection('users').doc(newUid).set({
      role: 'teacher',
      sectionId: sectionRef.id,
      username: username
    });

    alert(`تم إنشاء شعبة (${sectionName}) والحساب بنجاح!`);
    loadAllSections();
  } catch (error) {
    console.error('خطأ في إنشاء الشعبة:', error);
    alert('حدث خطأ أثناء إنشاء الشعبة: ' + error.message);
  }
}

// جلب وعرض جميع الشعب
async function loadAllSections() {
  if (!window.currentUserData || window.currentUserData.role !== 'admin') return;

  const snapshot = await adminDb.collection('sections').get();
  const listContainer = document.getElementById('adminSectionsList');
  if (!listContainer) return;

  listContainer.innerHTML = '';
  snapshot.forEach(doc => {
    const data = doc.data();
    const item = document.createElement('div');
    item.style.cssText = "padding:10px; border-bottom:1px solid #ccc; display:flex; justify-content:space-between; align-items:center;";
    item.innerHTML = `
      <div>
        <strong>${data.name}</strong> (${data.username})
        <span style="color:${data.isActive ? 'green' : 'red'}; margin-right:10px;">
          [${data.isActive ? 'مفعل' : 'معطل'}]
        </span>
      </div>
      <div>
        <button onclick="toggleSectionStatus('${doc.id}', ${!data.isActive})" style="padding:5px 10px; cursor:pointer;">
          ${data.isActive ? 'تعطيل' : 'تفعيل'}
        </button>
      </div>
    `;
    listContainer.appendChild(item);
  });
}

// تفعيل أو تعطيل شعبة
async function toggleSectionStatus(sectionId, newStatus) {
  try {
    await adminDb.collection('sections').doc(sectionId).update({
      isActive: newStatus
    });
    alert('تم تغيير حالة الشعبة بنجاح.');
    loadAllSections();
  } catch (error) {
    alert('حدث خطأ أثناء تغيير الحالة.');
  }
}
