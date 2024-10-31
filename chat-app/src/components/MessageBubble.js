// src/components/MessageBubble.js
import React from 'react';
import { Paper, Typography, Tooltip } from '@mui/material';

const MessageBubble = ({ message, isUser, metadata }) => {
  const bubbleContent = (
    <Paper
      elevation={2}
      sx={{
        padding: '10px',
        margin: '10px',
        maxWidth: '60%',
        alignSelf: isUser ? 'flex-end' : 'flex-start',
        backgroundColor: isUser ? '#1976d2' : '#f1f0f0',
        color: isUser ? '#fff' : '#000',
        borderRadius: isUser ? '15px 15px 0 15px' : '15px 15px 15px 0',
        animation: 'fadeIn 0.5s',
        position: 'relative',
      }}
    >
      <Typography variant="body1">{message}</Typography>
      {/* Subtext for AI messages */}
      {!isUser && metadata && (
        <>
          {metadata.actions && metadata.actions.length > 0 && (
            <Typography variant="caption" sx={{ display: 'block', marginTop: '5px' }}>
              Action: {metadata.actions.join(', ')}
            </Typography>
          )}
          {metadata.image_id && (
            <Typography variant="caption" sx={{ fontStyle: 'italic' }}>
              Image attached
            </Typography>
          )}
        </>
      )}
    </Paper>
  );

  // Wrap with Tooltip if metadata.model exists
  if (!isUser && metadata && metadata.model) {
    return (
      <Tooltip title={<pre>{metadata.model}</pre>} placement="top" arrow>
        {bubbleContent}
      </Tooltip>
    );
  } else {
    return bubbleContent;
  }
};

export default MessageBubble;
