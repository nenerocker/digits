import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Button, AppBar, Toolbar, Grid, Paper
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { initializeApp, getApps, getApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyCm0EPRJvnJpuATCSpnMDhhCU5aRSEmmpM',
  authDomain: 'test-digits-e137c.firebaseapp.com',
  projectId: 'test-digits-e137c',
  storageBucket: 'test-digits-e137c.appspot.com',
  messagingSenderId: '8039583824',
  appId: '1:8039583824:web:ad85b89e71031e67160155',
  measurementId: 'G-6Y8YV8F80B',
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export default function GameDetailPage() {
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

  return `${isWin ? 'ชนะ' : 'แพ้'} +${points} คะแนน`;
};
  const { id } = useParams();
  const navigate = useNavigate();
  const [gameData, setGameData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, 'historygame', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setGameData(docSnap.data());
      }
    };
    fetchData();
  }, [id]);

  if (!gameData) return <Typography sx={{ mt: 10, textAlign: 'center' }}>กำลังโหลด...</Typography>;

  const {
    nickname,
    difficulty,
    status,
    score,
    rank,
    answer,
    guesses = [],
    correctDigits = [],
    correctPositions = [],
    roundsUsed,
    date,
  } = gameData;

  return (
    <Box>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>รายละเอียดการเล่น</Typography>
          <Button color="inherit" onClick={() => navigate(-1)}>กลับ</Button>
        </Toolbar>
      </AppBar>

      

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">📜 การเดาแต่ละรอบ</Typography>

          {guesses.map((guess, index) => (
            <Box key={index} sx={{ my: 2 }}>
              <Grid container spacing={1} justifyContent="center">
                {guess.split('').map((digit, idx) => (
                  <Grid item key={idx}>
                    <Paper
                      elevation={3}
                      sx={{
                        width: 50,
                        height: 50,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px',
                        borderRadius: 1,
                      }}
                    >
                      {digit}
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))}
        </Box>
        <Box sx={{ p: 4, mt: 10 }}>
        <Typography variant="h4" gutterBottom>Digits Guess Game</Typography>

        <Box
          sx={{
            border: `2px solid ${status === 'win' ? 'green' : 'red'}`,
            p: 2,
            mb: 2,
            borderRadius: 2,
            color: status === 'win' ? 'green' : 'red',
            fontSize: '20px',
          }}
        >
          {status === 'win' ? 'ชนะ ✅' : 'แพ้ ❌'}
        </Box>

        <Typography> ผู้เล่น: {nickname}</Typography>
        <Typography> วันที่: {new Date(date?.seconds * 1000).toLocaleString()}</Typography>
        <Typography> ระดับ: {difficulty}</Typography>
        <Typography> คำตอบ: {answer}</Typography>
        <Typography> {getScoreText(gameData)}</Typography>
        <Typography> ยศ (Rank): {rank || '-'}</Typography>
        <Typography> ใช้รอบทั้งหมด: {roundsUsed}</Typography>
      </Box>
    </Box>
  );
}
