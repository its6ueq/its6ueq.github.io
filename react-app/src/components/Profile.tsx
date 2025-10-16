import React from 'react';
import './Profile.css';

interface ProfileProps {
  name: string;
  username: string;
  avatar: string;
}

const Profile: React.FC<ProfileProps> = ({ name, username, avatar }) => {
  return (
    <div className="profile-section">
      <div className="avatar-wrap">
        <div className="glow-ring"></div>
        <img src={avatar} alt="Avatar" />
      </div>
      <h1 className="name">{name}</h1>
      <p className="username">{username}</p>
    </div>
  );
};

export default Profile;
