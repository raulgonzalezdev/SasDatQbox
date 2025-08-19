'use client';
import { useState, useEffect } from 'react';
import { Box, IconButton, Typography, Paper } from '@mui/material';
import MicOffIcon from '@mui/icons-material/MicOff';
import MicIcon from '@mui/icons-material/Mic';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import VideocamIcon from '@mui/icons-material/Videocam';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import CallEndIcon from '@mui/icons-material/CallEnd';
import { useTranslations } from 'next-intl';

export default function VideoCallInterface() {
  const t = useTranslations('Dashboard.consultation');
  const [isMicMuted, setMicMuted] = useState(false);
  const [isCamOff, setCamOff] = useState(false);
  const [isSharingScreen, setSharingScreen] = useState(false);
  const [isRecording, setRecording] = useState(false);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTimer(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '70vh', bgcolor: 'black', borderRadius: 2, overflow: 'hidden' }}>
      {/* Paciente's Video Feed (main) */}
      <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
        <Typography>{t('videoCall.patientVideo')}</Typography>
      </Box>

      {/* Doctor's Video Feed (small, floating) */}
      <Paper sx={{ position: 'absolute', top: 16, right: 16, width: 200, height: 150, bgcolor: 'grey.800', border: '2px solid white' }}>
        <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
          <Typography variant="body2">{t('videoCall.myVideo')}</Typography>
        </Box>
      </Paper>
      
      {/* Timer */}
      <Typography sx={{ position: 'absolute', top: 16, left: 16, color: 'white', bgcolor: 'rgba(0,0,0,0.5)', p: 1, borderRadius: 1 }}>
        {formatTime(timer)}
      </Typography>

      {/* Controls */}
      <Box sx={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        gap: 2,
        p: 2,
        background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
      }}>
        <IconButton onClick={() => setMicMuted(!isMicMuted)} sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.2)' }}>
          {isMicMuted ? <MicOffIcon /> : <MicIcon />}
        </IconButton>
        <IconButton onClick={() => setCamOff(!isCamOff)} sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.2)' }}>
          {isCamOff ? <VideocamOffIcon /> : <VideocamIcon />}
        </IconButton>
        <IconButton onClick={() => setSharingScreen(!isSharingScreen)} sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.2)' }}>
          {isSharingScreen ? <StopScreenShareIcon /> : <ScreenShareIcon />}
        </IconButton>
        <IconButton onClick={() => setRecording(!isRecording)} sx={{ color: isRecording ? 'red' : 'white', bgcolor: 'rgba(255,255,255,0.2)' }}>
          <FiberManualRecordIcon />
        </IconButton>
        <IconButton sx={{ color: 'white', bgcolor: 'red' }}>
          <CallEndIcon />
        </IconButton>
      </Box>
    </Box>
  );
}
