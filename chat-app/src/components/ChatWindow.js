// src/components/ChatWindow.js
import React, { useState, useEffect, useRef } from 'react';
import { Box, TextField, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import MessageBubble from './MessageBubble';
import StatusBubble from './StatusBubble';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import { WEBSOCKET_URL } from '../config';

const ChatWindow = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  // eslint-disable-next-line
  const [isTyping, setIsTyping] = useState(false);
  // eslint-disable-next-line
  const [isRecording, setIsRecording] = useState(false);
  const clientRef = useRef(null);
  const chatEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const connectWebSocket = () => {
      clientRef.current = new W3CWebSocket(WEBSOCKET_URL);

      clientRef.current.onopen = () => {
        console.log('WebSocket Client Connected');
      };

      clientRef.current.onmessage = (message) => {
        const dataFromServer = JSON.parse(message.data);

        if (dataFromServer.is_visible === false) {
          return;
        }

        switch (dataFromServer.type) {
          case 'TYPING':
            setIsTyping(true);
            // Add a typing indicator as a message
            setMessages((prevMessages) => [
              ...prevMessages,
              { type: 'status', status: 'typing', key: 'typing', isUser: false },
            ]);
            break;
          case 'STOP_TYPING':
            setIsTyping(false);
            // Remove typing indicator
            setMessages((prevMessages) =>
              prevMessages.filter((msg) => msg.key !== 'typing')
            );
            break;
          case 'VOICE_RECORDING_START':
            setIsRecording(true);
            // Add a recording indicator as a message
            setMessages((prevMessages) => [
              ...prevMessages,
              { type: 'status', status: 'recording', key: 'recording', isUser: true },
            ]);
            break;
          case 'VOICE_RECORDING_STOP':
            setIsRecording(false);
            // Remove recording indicator
            setMessages((prevMessages) =>
              prevMessages.filter((msg) => msg.key !== 'recording')
            );
            break;
          case 'AI':
            setIsTyping(false);
            // Remove typing indicator if present
            setMessages((prevMessages) =>
              prevMessages.filter((msg) => msg.key !== 'typing')
            );
            setMessages((prevMessages) => [
              ...prevMessages,
              {
                type: 'message',
                text: dataFromServer.content,
                isUser: false,
                metadata: dataFromServer.metadata,
              },
            ]);
            break;
          case 'USER':
            setMessages((prevMessages) => [
              ...prevMessages,
              {
                type: 'message',
                text: dataFromServer.content,
                isUser: true,
                metadata: dataFromServer.metadata,
              },
            ]);
            break;
          default:
            console.warn('Unknown message type:', dataFromServer.type);
        }
      };

      clientRef.current.onclose = () => {
        console.log('WebSocket Client Disconnected. Attempting to reconnect...');
        setTimeout(() => {
          connectWebSocket();
        }, 2000);
      };

      clientRef.current.onerror = (error) => {
        console.error('WebSocket Error:', error);
      };
    };

    connectWebSocket();

    return () => {
      clientRef.current.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSend = () => {
    if (inputValue.trim()) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: 'message', text: inputValue, isUser: true },
      ]);

      clientRef.current.send(
        JSON.stringify({
          type: 'USER',
          content: inputValue,
        })
      );

      setInputValue('');
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);

    // Send typing notification
    clientRef.current.send(
      JSON.stringify({
        type: 'TYPING',
      })
    );

    // Set a timeout to send STOP_TYPING after user stops typing
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      clientRef.current.send(
        JSON.stringify({
          type: 'STOP_TYPING',
        })
      );
    }, 1000);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
      }}
    >
      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          padding: '10px',
          backgroundColor: '#e0e0e0',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {messages.map((msg, index) => {
          if (msg.type === 'message') {
            return (
              <MessageBubble
                key={index}
                message={msg.text}
                isUser={msg.isUser}
                metadata={msg.metadata}
              />
            );
          } else if (msg.type === 'status') {
            return (
              <StatusBubble
                key={msg.key}
                status={msg.status}
                isUser={msg.isUser}
              />
            );
          } else {
            return null;
          }
        })}
        <div ref={chatEndRef} />
      </Box>
      <Box
        sx={{
          display: 'flex',
          padding: '10px',
          backgroundColor: '#fff',
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type your message..."
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSend();
            }
          }}
        />
        <IconButton color="primary" onClick={handleSend}>
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default ChatWindow;
