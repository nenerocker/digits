import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

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

export default function Easygame() {
    const navigate = useNavigate();
    const [users, setUsers] = React.useState([]);
    const [nickname, setNickname] = React.useState(null);
  
    React.useEffect(() => {
      const fetchData = async () => {
        const querySnapshot = await getDocs(collection(db, "users"));
        const fetchedData = querySnapshot.docs.map(doc => doc.data());
        setUsers(fetchedData);
      };
      fetchData();
    }, []);
  
    React.useEffect(() => {
      const auth = getAuth();
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setNickname(docSnap.data().nickname);
          }
        } else {
          setNickname(null);
        }
      });
      return () => unsubscribe();
    }, []);

  return (
    <Box>
      <AppBar>
        <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Digits Guess
            </Typography>
            {nickname ? (
            <Typography color="inherit">👋 {nickname}</Typography>
            ) : (
            <Button color="inherit" onClick={() => navigate('/register')}>
                ลงทะเบียน
            </Button>
            )}
        </Toolbar>
        </AppBar>
        
    </Box>
  );
}
