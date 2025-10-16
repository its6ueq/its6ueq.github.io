import React, { useState, useEffect, useRef } from 'react';
import './PomodoroTimer.css';

interface TimerState {
  minutes: number;
  seconds: number;
  isRunning: boolean;
  isBreak: boolean;
  cycles: number;
}

const PomodoroTimer: React.FC = () => {
  const [timer, setTimer] = useState<TimerState>({
    minutes: 25,
    seconds: 0,
    isRunning: false,
    isBreak: false,
    cycles: 0
  });

  const [history, setHistory] = useState<Array<{
    date: string;
    cycles: number;
    totalTime: number;
  }>>([]);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('pomodoro-history');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem('pomodoro-history', JSON.stringify(history));
  }, [history]);

  // Timer logic
  useEffect(() => {
    if (timer.isRunning) {
      intervalRef.current = setInterval(() => {
        setTimer(prev => {
          if (prev.seconds > 0) {
            return { ...prev, seconds: prev.seconds - 1 };
          } else if (prev.minutes > 0) {
            return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
          } else {
            // Timer finished
            const newIsBreak = !prev.isBreak;
            const newMinutes = newIsBreak ? 5 : 25;
            const newCycles = newIsBreak ? prev.cycles + 1 : prev.cycles;
            
            // Save to history when cycle completes
            if (newIsBreak && prev.cycles > 0) {
              const today = new Date().toISOString().split('T')[0];
              const existingDay = history.find(h => h.date === today);
              
              if (existingDay) {
                setHistory(prevHistory => 
                  prevHistory.map(h => 
                    h.date === today 
                      ? { ...h, cycles: h.cycles + 1, totalTime: h.totalTime + 25 }
                      : h
                  )
                );
              } else {
                setHistory(prevHistory => [
                  ...prevHistory,
                  { date: today, cycles: 1, totalTime: 25 }
                ]);
              }
            }
            
            return {
              ...prev,
              minutes: newMinutes,
              seconds: 0,
              isRunning: false,
              isBreak: newIsBreak,
              cycles: newCycles
            };
          }
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timer.isRunning, timer.isBreak, timer.cycles, history]);

  const startTimer = () => {
    setTimer(prev => ({ ...prev, isRunning: true }));
  };

  const pauseTimer = () => {
    setTimer(prev => ({ ...prev, isRunning: false }));
  };

  const resetTimer = () => {
    setTimer(prev => ({
      ...prev,
      minutes: prev.isBreak ? 5 : 25,
      seconds: 0,
      isRunning: false
    }));
  };

  const skipTimer = () => {
    setTimer(prev => ({
      ...prev,
      minutes: prev.isBreak ? 25 : 5,
      seconds: 0,
      isRunning: false,
      isBreak: !prev.isBreak
    }));
  };

  const formatTime = (minutes: number, seconds: number) => {
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    const totalSeconds = timer.isBreak ? 5 * 60 : 25 * 60;
    const remainingSeconds = timer.minutes * 60 + timer.seconds;
    return ((totalSeconds - remainingSeconds) / totalSeconds) * 100;
  };

  const todayStats = history.find(h => h.date === new Date().toISOString().split('T')[0]);

  return (
    <div className="pomodoro-page">
      {/* Video Background */}
      <video 
        id="video-background"
        autoPlay 
        loop 
        muted 
        playsInline
      >
        <source src="/video.mp4" type="video/mp4" />
        Trình duyệt của bạn không hỗ trợ thẻ video.
      </video>

      <div className="pomodoro-container">
        <div className="header">
          <a href="/mini-apps" className="back-btn">
            <i className="fas fa-arrow-left"></i> Back
          </a>
          <h1 className="title">🍅 Pomodoro Timer</h1>
          <p className="subtitle">25 phút tập trung, 5 phút nghỉ ngơi</p>
        </div>

        <div className="timer-section">
          <div className={`timer-card ${timer.isBreak ? 'break-mode' : 'work-mode'}`}>
            <div className="timer-mode">
              {timer.isBreak ? '☕ Break Time' : '💻 Work Time'}
            </div>
            
            <div className="timer-display">
              <div className="timer-time">
                {formatTime(timer.minutes, timer.seconds)}
              </div>
              <div className="timer-progress">
                <div 
                  className="progress-bar"
                  style={{ width: `${getProgressPercentage()}%` }}
                ></div>
              </div>
            </div>

            <div className="timer-controls">
              {!timer.isRunning ? (
                <button className="start-btn" onClick={startTimer}>
                  <i className="fas fa-play"></i> Start
                </button>
              ) : (
                <button className="pause-btn" onClick={pauseTimer}>
                  <i className="fas fa-pause"></i> Pause
                </button>
              )}
              
              <button className="reset-btn" onClick={resetTimer}>
                <i className="fas fa-redo"></i> Reset
              </button>
              
              <button className="skip-btn" onClick={skipTimer}>
                <i className="fas fa-forward"></i> Skip
              </button>
            </div>

            <div className="timer-stats">
              <div className="stat-item">
                <span className="stat-label">Cycles Today:</span>
                <span className="stat-value">{todayStats?.cycles || 0}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Total Time:</span>
                <span className="stat-value">{todayStats?.totalTime || 0} min</span>
              </div>
            </div>
          </div>
        </div>

        <div className="history-section">
          <h3 className="history-title">📊 Recent Activity</h3>
          <div className="history-list">
            {history.slice(-5).reverse().map((day, index) => (
              <div key={index} className="history-item">
                <div className="history-date">{day.date}</div>
                <div className="history-stats">
                  <span>{day.cycles} cycles</span>
                  <span>{day.totalTime} min</span>
                </div>
              </div>
            ))}
            {history.length === 0 && (
              <div className="no-history">No activity yet. Start your first Pomodoro!</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PomodoroTimer;
