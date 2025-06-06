import * as React from 'react';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, AppBar, Box,
  Toolbar, Typography, Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getAuth, signOut } from "firebase/auth";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { Link } from 'react-router-dom';


const firebaseConfig = {
  apiKey: "AIzaSyCm0EPRJvnJpuATCSpnMDhhCU5aRSEmmpM",
  authDomain: "test-digits-e137c.firebaseapp.com",
  projectId: "test-digits-e137c",
  storageBucket: "test-digits-e137c.firebasestorage.app",
  messagingSenderId: "8039583824",
  appId: "1:8039583824:web:ad85b89e71031e67160155",
  measurementId: "G-6Y8YV8F80B"
};


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export default function Home() {
  const navigate = useNavigate();
  const [users, setUsers] = React.useState([]);
  const [nickname, setNickname] = React.useState(null);
  const [email, setEmail] = React.useState(null);

  React.useEffect(() => {
    const storedNickname = localStorage.getItem('nickname');
    const storedEmail = localStorage.getItem('email');
    if (storedNickname) setNickname(storedNickname);
    if (storedEmail) setEmail(storedEmail);
  }, []);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const fetchedData = querySnapshot.docs.map(doc => doc.data());

        const sorted = [...fetchedData].sort((a, b) => b.score - a.score).slice(0, 10);
        sorted.forEach((user, idx) => (user.rank));
        setUsers(sorted);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setNickname(null);
        setEmail(null);
        localStorage.removeItem('nickname');
        localStorage.removeItem('email');
        navigate('/');
      })
      .catch((error) => {
        console.error('Logout error:', error);
      });
  };

  return (
    <Box>
      <AppBar>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Digits Guess
          </Typography>
          {nickname ? (
            <>
              <Typography color="inherit">👋 {nickname}</Typography>
              <Button color="inherit" onClick={handleLogout} sx={{ ml: 2 }}>
                ออกจากระบบ
              </Button>
            </>
          ) : (
            <Button color="inherit" onClick={() => navigate('/register')}>
              ลงทะเบียน
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 2 }} marginTop={8}>
        <Typography variant="h6" gutterBottom sx={{ textAlign: 'left' }}>
          ยินดีต้อนรับ {nickname} สู่ Digits Guess
        </Typography>

        <Box height={16} />

        <Typography variant="subtitle2" gutterBottom sx={{ textAlign: 'left' }}>
          Top 10 World Ranking
        </Typography>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ backgroundColor: 'white' }}>Name</TableCell>
                <TableCell align="right" sx={{ backgroundColor: 'white' }}>Score</TableCell>
                <TableCell align="right" sx={{ backgroundColor: 'white' }}>Rank</TableCell>
                <TableCell align="right" sx={{ backgroundColor: 'white' }}>Country</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ backgroundColor: 'white' }}>
                    <Link to={`/history/${user.nickname}`} style={{ textDecoration: 'none', color: '#1976d2' }}>
                      {user.nickname}
                    </Link>
                  </TableCell>
                  <TableCell align="right" sx={{ backgroundColor: 'white' }}>{user.score}</TableCell>
                  <TableCell align="right" sx={{ backgroundColor: 'white' }}>{user.rank}</TableCell>
                  <TableCell align="right" sx={{ backgroundColor: 'white' }}>{user.country}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box height={16} />
        <Button variant="contained" onClick={() => navigate('/Play')}>
          เล่นเกมส์ เลย
        </Button>
      </Box>
    </Box>
  );
}
