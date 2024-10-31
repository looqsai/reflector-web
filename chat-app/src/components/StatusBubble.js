// src/components/StatusBubble.js
import React from 'react';
import { Paper, Typography, keyframes } from '@mui/material';

const typingAnimation = keyframes`
  0% { opacity: 0.5; }
  50% { opacity: 1; }
  100% { opacity: 0.5; }
`;

const StatusBubble = ({ status, isUser }) => {
  let message = '';
  switch (status) {
    case 'typing':
      message = 'AI is thinking...';
      break;
    case 'recording':
      message = 'User is recording...';
      break;
    default:
      return null;
  }

  return (
    <Paper
      elevation={2}
      sx={{
        padding: '10px',
        margin: '10px',
        maxWidth: '60%',
        alignSelf: isUser ? 'flex-end' : 'flex-start',
        backgroundColor: isUser ? '#1976d2' : '#e0e0e0',
        color: isUser ? '#fff' : '#000',
        borderRadius: isUser ? '15px 15px 0 15px' : '15px 15px 15px 0',
        opacity: 0.8,
        animation: `${typingAnimation} 1.5s infinite`,
      }}
    >
      <Typography variant="body1">{message}</Typography>
    </Paper>
  );
};

export default StatusBubble;