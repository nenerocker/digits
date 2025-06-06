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

export default function ButtonAppBar() {
  const navigate = useNavigate();

  const [users, setUsers] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      const fetchedData = querySnapshot.docs.map(doc => doc.data());
      setUsers(fetchedData);
    };
    fetchData();
  }, []);

  return (
    <Box>
      <AppBar>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Digits Guess
          </Typography>
          <Button color="inherit" onClick={() => navigate('/register')}>
            ลงทะเบียน
          </Button>
          <Button color="inherit" onClick={() => navigate('/login')}>
            เข้าสู่ระบบ
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ textAlign: 'left' }}>
          ยินดีต้อนรับสู่ Digits Guess
        </Typography>

        <Box height={16} />

        <Typography variant="subtitle2" gutterBottom sx={{ textAlign: 'left' }}>
          Top 10 World Ranking
        </Typography>

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
                <TableCell sx={{ backgroundColor: 'white' }}>{user.nickname}</TableCell>
                <TableCell align="right" sx={{ backgroundColor: 'white' }}>{user.score}</TableCell>
                <TableCell align="right" sx={{ backgroundColor: 'white' }}>{user.rank}</TableCell>
                <TableCell align="right" sx={{ backgroundColor: 'white' }}>{user.country}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Box height={16} />
        <Button variant="contained" onClick={() => navigate('/register')}>
          ลงทะเบียน เล่นเกมส์
        </Button>
      </Box>
    </Box>
  );
}
