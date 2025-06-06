import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar, Box, Toolbar, Typography, Button,
  TextField
} from '@mui/material';

// Firebase SDK
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, getDocs } from "firebase/firestore";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCm0EPRJvnJpuATCSpnMDhhCU5aRSEmmpM",
  authDomain: "test-digits-e137c.firebaseapp.com",
  projectId: "test-digits-e137c",
  storageBucket: "test-digits-e137c.firebasestorage.app",
  messagingSenderId: "8039583824",
  appId: "1:8039583824:web:ad85b89e71031e67160155",
  measurementId: "G-6Y8YV8F80B"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = React.useState(() => localStorage.getItem('email') || '');
  const [nickname, setNickname] = React.useState(() => localStorage.getItem('nickname') || '');
  const [error, setError] = React.useState('');

  // อัพเดท localStorage ทุกครั้งที่ email หรือ nickname เปลี่ยน
  React.useEffect(() => {
    if (email) localStorage.setItem('email', email);
    else localStorage.removeItem('email');

    if (nickname) localStorage.setItem('nickname', nickname);
    else localStorage.removeItem('nickname');
  }, [email, nickname]);

  const handleLogin = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const users = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const foundUser = users.find(user =>
        user.email === email.trim() && user.nickname === nickname.trim()
      );

      if (foundUser) {
        // จำค่าผู้ใช้ไว้ใน localStorage เพื่อใช้ที่หน้า home (ถ้าไม่ใช้ auth)
        localStorage.setItem('nickname', foundUser.nickname);
        localStorage.setItem('email', foundUser.email);
        navigate('/home');
      } else {
        setError('ไม่พบผู้ใช้ที่ตรงกัน กรุณาตรวจสอบ Email และ Nickname');
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
    }
  };

  return (
    <Box>
      <AppBar>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Digits Guess
          </Typography>
          <Button color="inherit" onClick={() => navigate('/register')}>
            สมัครใหม่
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 2 }} marginTop={8}>
        <Typography variant="h6" gutterBottom>
          เข้าสู่ระบบ
        </Typography>

        <Box my={2}>
          <TextField
            fullWidth
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Box>

        <Box my={2}>
          <TextField
            fullWidth
            label="Nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </Box>

        {error && (
          <Typography color="error" variant="body2" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Button variant="contained" fullWidth onClick={handleLogin}>
          เข้าสู่ระบบ
        </Button>
      </Box>
    </Box>
  );
}
