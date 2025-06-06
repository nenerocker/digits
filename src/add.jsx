import { db } from './firebase'; // นำเข้า db จาก firebase.js
import { collection, addDoc } from 'firebase/firestore';

async function saveUserData() {
  try {
    await addDoc(collection(db, 'users'), {
      name: 'นมวัว',
      score: 95,
      level: 'Beginner',
      country: 'Thailand',
      timestamp: new Date()
    });
    console.log('✅ เพิ่มข้อมูลสำเร็จ');
  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาด:', error);
  }
}
