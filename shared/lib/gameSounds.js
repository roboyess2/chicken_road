import chickenDeathSound from '../assets/chicken_dead.mp3';

let audioContext;
let masterGain;
let audioMuted = false;
let chickenDeathAudio;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;
  try {
    if (!audioContext) {
      audioContext = new AudioContextClass();
      masterGain = audioContext.createGain();
      masterGain.gain.value = audioMuted ? 0 : 1;
      masterGain.connect(audioContext.destination);
    }
    if (audioContext.state === 'suspended') audioContext.resume().catch(() => {});
    return audioContext;
  } catch {
    return null;
  }
}

export function prepareGameAudio() {
  getAudioContext();
}

export function setAudioMuted(muted) {
  audioMuted = Boolean(muted);
  if (chickenDeathAudio) chickenDeathAudio.muted = audioMuted;
  if (audioContext && masterGain) {
    masterGain.gain.setTargetAtTime(audioMuted ? 0 : 1, audioContext.currentTime, 0.015);
  }
}

export function playChickenDeath() {
  if (audioMuted || typeof window === 'undefined' || !window.Audio) return;
  if (!chickenDeathAudio) {
    chickenDeathAudio = new window.Audio(chickenDeathSound);
    chickenDeathAudio.volume = 0.5;
  }
  chickenDeathAudio.pause();
  chickenDeathAudio.currentTime = 0;
  chickenDeathAudio.play().catch(() => {});
}

function tone(context, frequency, startAt, duration, { type = 'sine', volume = 0.07, endFrequency } = {}) {
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, startAt);
  if (endFrequency) oscillator.frequency.exponentialRampToValueAtTime(endFrequency, startAt + duration);
  gain.gain.setValueAtTime(0.0001, startAt);
  gain.gain.exponentialRampToValueAtTime(volume, startAt + Math.min(0.025, duration / 4));
  gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);
  oscillator.connect(gain).connect(masterGain ?? context.destination);
  oscillator.start(startAt);
  oscillator.stop(startAt + duration + 0.01);
}

export function playSafeHop() {
  if (audioMuted) return;
  const context = getAudioContext();
  if (!context) return;
  const now = context.currentTime;
  tone(context, 540, now, 0.14, { type: 'triangle', volume: 0.055, endFrequency: 740 });
  tone(context, 790, now + 0.09, 0.22, { type: 'sine', volume: 0.065, endFrequency: 1120 });
}

export function playCashout() {
  if (audioMuted) return;
  const context = getAudioContext();
  if (!context) return;
  const now = context.currentTime;
  tone(context, 740, now, 0.13, { type: 'sine', volume: 0.06 });
  tone(context, 990, now + 0.075, 0.2, { type: 'triangle', volume: 0.065 });
  tone(context, 1480, now + 0.11, 0.24, { type: 'sine', volume: 0.035 });
}

