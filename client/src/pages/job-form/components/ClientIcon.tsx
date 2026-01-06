import React, { useState } from 'react';

interface ClientIconProps {
  size?: 'sm' | 'md';
  logoUrl?: string | null;
  clientName?: string;
}

const ClientIcon: React.FC<ClientIconProps> = ({ size = 'md', logoUrl, clientName = '' }) => {
  const [imageError, setImageError] = useState(false);
  const pixelSize = size === 'sm' ? '20px' : '32px';

  const getInitials = (name: string): string => {
    if (!name) return '?';
    const words = name.trim().split(' ').filter(word => word.length > 0);
    if (words.length === 0) return '?';
    if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  };

  const initials = getInitials(clientName);

  if (!logoUrl || imageError) {
    return (
      <div style={{
        width: pixelSize,
        height: pixelSize,
        borderRadius: '10px',
        backgroundColor: '#E4E4E7',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Plus Jakarta Sans',
        fontWeight: 600,
        fontSize: size === 'sm' ? '10px' : '12px',
        color: '#09090B'
      }}>
        {initials}
      </div>
    );
  }

  // Show client logo image
  return (
    <div style={{
      width: pixelSize,
      height: pixelSize,
      borderRadius: '10px',
      backgroundColor: '#F3F4F6',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '1px solid #E5E7EB',
      overflow: 'hidden'
    }}>
      <img
        src={logoUrl}
        alt="Client logo"
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        onError={() => setImageError(true)}
      />
    </div>
  );
};

export default ClientIcon;