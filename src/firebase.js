// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCm0EPRJvnJpuATCSpnMDhhCU5aRSEmmpM",
  authDomain: "test-digits-e137c.firebaseapp.com",
  projectId: "test-digits-e137c",
  storageBucket: "test-digits-e137c.appspot.com", // ตรวจ spelling ด้วย
  messagingSenderId: "8039583824",
  appId: "1:8039583824:web:ad85b89e71031e67160155",
  measurementId: "G-6Y8YV8F80B",
};

// Export Firebase App
export const app = initializeApp(firebaseConfig);

// (Optional) For analytics
getAnalytics(app);
