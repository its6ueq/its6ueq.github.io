import React from 'react';
import { Link } from 'react-router-dom';
import './MiniApps.css';

const MiniApps: React.FC = () => {
  const apps = [
    {
      id: 'pomodoro',
      name: 'Pomodoro Timer',
      description: 'Phương pháp Pomodoro 25 phút làm việc, 5 phút nghỉ',
      icon: 'fas fa-clock',
      color: '#e74c3c',
      path: '/mini-apps/pomodoro'
    },
    {
      id: 'stopwatch',
      name: 'Stopwatch',
      description: 'Đồng hồ bấm giờ chính xác',
      icon: 'fas fa-stopwatch',
      color: '#3498db',
      path: '/mini-apps/stopwatch'
    },
    {
      id: 'todo',
      name: 'Todo List',
      description: 'Danh sách công việc với lưu trữ local',
      icon: 'fas fa-tasks',
      color: '#2ecc71',
      path: '/mini-apps/todo'
    },
    {
      id: 'notes',
      name: 'Quick Notes',
      description: 'Ghi chú nhanh với auto-save',
      icon: 'fas fa-sticky-note',
      color: '#f39c12',
      path: '/mini-apps/notes'
    },
    {
      id: 'calculator',
      name: 'Calculator',
      description: 'Máy tính đơn giản',
      icon: 'fas fa-calculator',
      color: '#9b59b6',
      path: '/mini-apps/calculator'
    },
    {
      id: 'weather',
      name: 'Weather Widget',
      description: 'Thông tin thời tiết',
      icon: 'fas fa-cloud-sun',
      color: '#1abc9c',
      path: '/mini-apps/weather'
    }
  ];

  return (
    <div className="mini-apps-page">
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

      <div className="mini-apps-container">
        <div className="header">
          <Link to="/" className="back-btn">
            <i className="fas fa-arrow-left"></i> Back
          </Link>
          <h1 className="title">🎮 Mini Apps</h1>
          <p className="subtitle">Bộ sưu tập ứng dụng nhỏ tiện ích</p>
        </div>

        <div className="apps-grid">
          {apps.map((app) => (
            <Link key={app.id} to={app.path} className="app-card">
              <div className="app-icon" style={{ backgroundColor: app.color }}>
                <i className={app.icon}></i>
              </div>
              <div className="app-info">
                <h3 className="app-name">{app.name}</h3>
                <p className="app-description">{app.description}</p>
              </div>
              <div className="app-arrow">
                <i className="fas fa-chevron-right"></i>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MiniApps;
