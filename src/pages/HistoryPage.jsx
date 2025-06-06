import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography,
  Button, Box, AppBar, Toolbar
} from '@mui/material';

import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { initializeApp, getApps } from "firebase/app";
import { Link } from 'react-router-dom'; // เพิ่ม import นี้

// Firebase config (เหมือนกับใน Home.jsx)
const firebaseConfig = {
  apiKey: "AIzaSyCm0EPRJvnJpuATCSpnMDhhCU5aRSEmmpM",
  authDomain: "test-digits-e137c.firebaseapp.com",
  projectId: "test-digits-e137c",
  storageBucket: "test-digits-e137c.firebasestorage.app",
  messagingSenderId: "8039583824",
  appId: "1:8039583824:web:ad85b89e71031e67160155",
  measurementId: "G-6Y8YV8F80B"
};

// ป้องกัน initializeApp ซ้ำ
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

export default function HistoryPage() {
  const { nickname } = useParams();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(10); // จำนวนรายการที่แสดง

  useEffect(() => {
  const fetchHistory = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "historygame"), where("nickname", "==", nickname));
      const querySnapshot = await getDocs(q);

      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      const filteredData = data.filter(item => item.rank !== undefined && item.rank !== null && item.rank !== '');

      filteredData.sort((a, b) => b.date.seconds - a.date.seconds);

      setHistory(filteredData);
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchHistory();
}, [nickname]);

  const getScoreText = (item) => {
    const settings = {
      easy: { win: 10000, lose: 1000 },
      moderate: { win: 20000, lose: 2000 },
      hard: { win: 30000, lose: 3000 },
    };

    if (!item.status || !item.difficulty) return `${item.score} คะแนน`;

    const difficulty = item.difficulty.toLowerCase();
    const isWin = item.status.toLowerCase() === 'win';
    const points = isWin ? settings[difficulty]?.win : settings[difficulty]?.lose;

    if (!points) return `${item.score} คะแนน`;

    return `${isWin ? 'ชนะ' : 'แพ้'} +${points} ในระดับ ${difficulty === 'easy' ? 'ง่าย' : difficulty === 'moderate' ? 'ปานกลาง' : 'ยาก'}`;
  };

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 10);
  };

  return (
    <Box>
      <AppBar>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            ประวัติการเล่นของ {nickname}
          </Typography>
          <Button color="inherit" onClick={() => navigate(-1)}>
            กลับ
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 2 }} marginTop={8}>
        {loading ? (
          <Typography>กำลังโหลดข้อมูล...</Typography>
        ) : history.length === 0 ? (
          <Typography>ไม่พบประวัติการเล่นของผู้เล่นนี้</Typography>
        ) : (
          <>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>วันที่เล่น</TableCell>
                    <TableCell>สถานะเกม:ระดับความยาก</TableCell>
                    <TableCell align="right">คะแนน</TableCell>
                    <TableCell align="right">ตำแหน่ง</TableCell>
                    <TableCell align="right">ดูรายละเอียด</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {history.slice(0, visibleCount).map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{new Date(item.date?.seconds * 1000).toLocaleString()}</TableCell>
                      <TableCell>{item.status}:{item.difficulty}</TableCell>
                      <TableCell align="right">{getScoreText(item)}</TableCell>
                      <TableCell align="right">{item.rank}</TableCell>
                      <TableCell align="right">
                        <Button onClick={() => navigate(`/gamedetail/${item.id}`)}>ดูรายละเอียด</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* ปุ่มดูเพิ่มเติม */}
            {history.length > visibleCount && (
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Button variant="contained" onClick={handleLoadMore}>
                  ดูเพิ่มเติม
                </Button>
              </Box>
            )}
          </>
        )}
      </Box>
    </Box>
  );
}
