import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, TextField, Grid, AppBar, Toolbar } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { collection, addDoc } from 'firebase/firestore'; // เพิ่มใน import


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
const analytics = getAnalytics(app);
const db = getFirestore(app);

const generateUniqueNumbers = (length) => {
  const numbers = new Set();
  while (numbers.size < length) {
    numbers.add(Math.floor(Math.random() * 10));
  }
  return Array.from(numbers);
};

const difficultySettings = {
  easy: { length: 3, maxRounds: 4 },
  moderate: { length: 4, maxRounds: 6 },
  hard: { length: 5, maxRounds: 6 },
};

export default function PlayGame() {
  const [email, setEmail] = useState('');
const [country, setCountry] = useState('');
  const [nickname, setNickname] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [difficulty, setDifficulty] = useState(null);
  const [answer, setAnswer] = useState([]);
  const [round, setRound] = useState(0);
  const [history, setHistory] = useState([]);
  const [status, setStatus] = useState('playing');
  const [score, setScore] = useState(0);
  const [winStreak, setWinStreak] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const [rank, setRank] = useState('');
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const userFromUrl = searchParams.get('nickname');
    const userFromStorage = localStorage.getItem('nickname');
  
    if (userFromUrl) {
      const cleanName = userFromUrl.trim();
      localStorage.setItem('nickname', cleanName);
      setNickname(cleanName);
      fetchUserScore(cleanName);
    } else if (userFromStorage) {
      const cleanName = userFromStorage.trim();
      setNickname(cleanName);
      fetchUserScore(cleanName);
    } else {
      // ถ้าไม่มี nickname เลย, redirect ไปหน้าลงทะเบียน
      navigate('/register');
    }
  }, [location.search]);
  const fetchUserScore = async (nickname) => {
  const cleanNickname = (nickname || '').trim();
  if (!cleanNickname) {
    console.error('Invalid nickname on fetch:', nickname);
    return;
  }

  const userRef = doc(db, 'users', cleanNickname);
  const docSnap = await getDoc(userRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    setScore(data.score || 0);
    setWinStreak(data.winStreak || 0);
    setEmail(data.email || '');
    setCountry(data.country || '');
  } else {
    await setDoc(userRef, { score: 0, winStreak: 0 });
  }
};


  const startGame = (level) => {
    const length = difficultySettings[level].length;
    setSelectedDifficulty(level);
    setDifficulty(level);
    setAnswer(generateUniqueNumbers(length));
    setRound(0);
    setHistory([{ guess: Array(length).fill('') }]);
    setStatus('playing');
  };

  const handleRestart = () => {
    setSelectedDifficulty(null);
    setDifficulty(null);
    setAnswer([]);
    setRound(0);
    setHistory([]);
    setStatus('playing');
  };

  const handleInputChange = (roundIndex, inputIndex, value) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newHistory = [...history];
    newHistory[roundIndex].guess[inputIndex] = value;
    setHistory(newHistory);
  };

  const handleSubmit = () => {
    const currentGuess = history[round]?.guess.map(Number);
    if (!currentGuess || currentGuess.length !== answer.length || currentGuess.includes(NaN)) return;

    let correctDigits = 0;
    let correctPositions = 0;

    currentGuess.forEach((num, idx) => {
      if (answer.includes(num)) correctDigits++;
      if (answer[idx] === num) correctPositions++;
    });

    const updatedHistory = [...history];
    updatedHistory[round] = {
      ...updatedHistory[round],
      correctDigits,
      correctPositions,
    };

    const maxRounds = difficultySettings[difficulty].maxRounds;

    if (correctPositions === answer.length) {
      setStatus('win');
    } else if (round + 1 >= maxRounds) {
      setStatus('lose');
    } else {
      updatedHistory.push({ guess: Array(answer.length).fill('') });
      setRound(round + 1);
    }

    setHistory(updatedHistory);
  };

  const calculateScore = async () => {
  const settings = {
    easy: { win: 10000, lose: 1000 },
    moderate: { win: 20000, lose: 2000 },
    hard: { win: 30000, lose: 3000 },
  };

  let points = 0;
  let streak = winStreak;

  if (status === 'win') {
    streak += 1;
    points = settings[difficulty].win;
    if (streak % 3 === 0) points *= 3;
  } else {
    streak = 0;
    points = settings[difficulty].lose;
  }

  const newScore = score + points;

  let passedModerate = false;
  let passedHard = false;

  const cleanNickname = (nickname || '').trim();

  if (!cleanNickname) {
    console.error('Invalid nickname:', nickname);
    return;
  }

  const userRef = doc(db, 'users', cleanNickname);
  const docSnap = await getDoc(userRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    passedModerate = data.passedModerate || false;
    passedHard = data.passedHard || false;
  }

  if (status === 'win') {
    if (difficulty === 'moderate') passedModerate = true;
    if (difficulty === 'hard') passedHard = true;
  }

  const newRank = calculateRank(newScore, passedModerate, passedHard);
  setRank(newRank);
  setScore(newScore);
  setWinStreak(streak);

  await updateDoc(userRef, {
    score: newScore,
    winStreak: streak,
    passedModerate,
    passedHard,
    rank: newRank,
    nickname: cleanNickname,
    email: email || '',        
    country: country || '',
  });
};
  const calculateRank = (score, passedModerate, passedHard) => {
  if (score >= 600000) return 'ศาสตราจารย์';
  if (score >= 500000) return 'รองศาสตราจารย์';
  if (score >= 400000 && passedHard) return 'ผช.ศาสตราจารย์';
  if (score >= 300000) return 'ดอกเตอร์';
  if (score >= 200000) return 'มาสเตอร์';
  if (score >= 100000) return 'จบการศึกษา';
  if (score >= 30000 && passedModerate) return 'Senior';
  if (score >= 10000) return 'Junior';
  if (score < 5000) return 'ผู้เริ่มต้น';
  return ''; // fallback
};

  useEffect(() => {
    if (status === 'win' || status === 'lose') {
      calculateScore();
    }
  }, [status]);

  const getBorderColor = () => {
    if (status === 'win') return 'green';
    if (status === 'lose') return 'red';
    return 'black';
  };
  const saveGameHistory = async () => {
    const cleanNickname = (nickname || '').trim();
    if (!cleanNickname) return;

    const historyRef = collection(db, 'historygame');
    await addDoc(historyRef, {
      nickname: cleanNickname,
      date: new Date(),
      difficulty,
      status,
      score,
      rank, 
      roundsUsed: round + 1,
      answer: answer.join(''),
      guesses: history.map(h => h.guess.join('')),
      correctDigits: history[round]?.correctDigits || 0,
      correctPositions: history[round]?.correctPositions || 0,
    });
  };

  // ⬇️ ใส่ useEffect นี้ตรงนี้ได้เลย
  useEffect(() => {
    if (status === 'win' || status === 'lose') {
      const nickname = localStorage.getItem('nickname');
      const score = status === 'win' ? 10000 : 1000;
      saveGameHistory(nickname, score, status);
    }
  }, [status, rank]);

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
            
          )
          }<Button color="inherit" onClick={() => navigate('/home')}>
              กลับ
            </Button>
        </Toolbar>
      </AppBar>

      {!selectedDifficulty ? (
        <Box sx={{ p: 4 ,marginTop:10}}>
          <Typography variant="h4" gutterBottom>
            เลือกระดับความยาก 
          </Typography>
          <Grid container spacing={2} justifyContent="center">
            {Object.entries(difficultySettings).map(([key, { length }]) => (
              <Grid item key={key}>
                <Button variant="contained" onClick={() => startGame(key)}>
                  {key.charAt(0).toUpperCase() + key.slice(1)} ({length} digits)
                </Button>
              </Grid>
            ))}
          </Grid>
        </Box>
      ) : (
        <Box sx={{ p: 4 ,marginTop:10}}>
          <Typography variant="h4" gutterBottom>
            Digits Guess Game
          </Typography>

          <Box sx={{ mb: 2 }}>
            {history.map((attempt, attemptIdx) => (
              <Grid container spacing={2} justifyContent="center" key={attemptIdx} sx={{ mb: 1 }}>
                {attempt.guess.map((value, idx) => (
                  <Grid item key={idx}>
                    <TextField
                      value={value}
                      onChange={(e) => handleInputChange(attemptIdx, idx, e.target.value)}
                      inputProps={{ maxLength: 1, style: { textAlign: 'center' } }}
                      sx={{ width: 56 }}
                      variant="outlined"
                      disabled={status !== 'playing' || attemptIdx !== round}
                    />
                  </Grid>
                ))}
              </Grid>
            ))}
          </Box>

          {status === 'playing' && (
            <Button variant="contained" onClick={handleSubmit} sx={{ mb: 2 }}>
              ยืนยัน
            </Button>
          )}

          {status !== 'playing' && (
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="h6"
                sx={{ color: status === 'win' ? 'green' : 'red', border: `2px solid ${getBorderColor()}`, p: 2, borderRadius: 1 }}
              >
                {status === 'win' ? 'ชนะ 🎉' : 'แพ้ ❌'}
              </Typography>
              {status === 'lose' && (
                <Typography variant="h6" sx={{ mt: 1 }}>
                  คำตอบที่ถูก : {answer.join('')}
                </Typography>
              )}
              <Button variant="contained" onClick={handleRestart} sx={{ mt: 2 }}>
                เริ่มเล่นใหม่
              </Button>
              <Button variant="contained" sx={{ mt: 2, marginLeft: 2 }} onClick={() => navigate('/home')}>
                กลับ
              </Button>
            </Box>
          )}

          <Typography variant="h6" sx={{ mt: 2 }}> คะแนน : {score}</Typography>
          <Typography variant="h6">ชนะติดต่อกัน : {winStreak}</Typography>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6">ประวัติการเล่น</Typography>
            {history.map((item, index) => (
              <Typography key={index}>
                เดารอบที่ {index + 1}: {item.guess.join('')} → ตัวเลขถูก: {item.correctDigits ?? '-'}, ตำแหน่งถูก: {item.correctPositions ?? '-'}
              </Typography>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}
