import React from 'react';


const getInitials = (name: string = ''): string => {
  if (!name) return '?';

  const nameParts = name.trim().split(' ').filter(Boolean); 
  if (nameParts.length === 0) return '?';
  
  const firstInitial = nameParts[0][0];
  const lastInitial = nameParts.length > 1 ? nameParts[nameParts.length - 1][0] : '';

  return `${firstInitial}${lastInitial}`.toUpperCase();
};


const generateColor = (name: string = ''): string => {
  if (!name) return '#cccccc'; 

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash; 
  }
  
  
  const colors: string[] = ['#678978ff', '#7d6867ff', '#727c8eff', '#857766ff', '#68596fff', '#747f82ff', '#715564ff'];
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};


interface Mentor {
  name: string;
  image?: string | null; 
}

interface AvatarProps {
  mentor: Mentor;
  className?: string; 
}

const Avatar: React.FC<AvatarProps> = ({ mentor, className = 'mentor-avatar' }) => {
  if (mentor.image) {
    return (
      <img
        src={`${process.env.NEXT_PUBLIC_API_URL}${mentor.image}`}
        alt={mentor.name}
        className={className} 
      />
    );
  }


  const initials = getInitials(mentor.name);
  const backgroundColor = generateColor(mentor.name);


  const avatarClasses = `${className} initials-avatar`;

  return (
    <div
      className={avatarClasses}
      style={{ backgroundColor }}
      aria-label={mentor.name} 
    >
      <span>{initials}</span>
    </div>
  );
};

export default Avatar;