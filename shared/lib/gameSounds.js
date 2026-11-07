let audioContext;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;
  try {
    audioContext ??= new AudioContextClass();
    if (audioContext.state === 'suspended') audioContext.resume().catch(() => {});
    return audioContext;
  } catch {
    return null;
  }
}

export function prepareGameAudio() {
  getAudioContext();
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
  oscillator.connect(gain).connect(context.destination);
  oscillator.start(startAt);
  oscillator.stop(startAt + duration + 0.01);
}

export function playSafeHop() {
  const context = getAudioContext();
  if (!context) return;
  const now = context.currentTime;
  tone(context, 540, now, 0.14, { type: 'triangle', volume: 0.055, endFrequency: 740 });
  tone(context, 790, now + 0.09, 0.22, { type: 'sine', volume: 0.065, endFrequency: 1120 });
}

export function playCashout() {
  const context = getAudioContext();
  if (!context) return;
  const now = context.currentTime;
  tone(context, 740, now, 0.13, { type: 'sine', volume: 0.06 });
  tone(context, 990, now + 0.075, 0.2, { type: 'triangle', volume: 0.065 });
  tone(context, 1480, now + 0.11, 0.24, { type: 'sine', volume: 0.035 });
}

export function playCrashPass() {
  const context = getAudioContext();
  if (!context) return;
  const now = context.currentTime;
  tone(context, 125, now, 0.62, { type: 'sawtooth', volume: 0.045, endFrequency: 48 });
  tone(context, 72, now + 0.3, 0.28, { type: 'triangle', volume: 0.075, endFrequency: 38 });

  const bufferLength = Math.floor(context.sampleRate * 0.24);
  const buffer = context.createBuffer(1, bufferLength, context.sampleRate);
  const channel = buffer.getChannelData(0);
  for (let i = 0; i < bufferLength; i += 1) {
    const fade = 1 - i / bufferLength;
    channel[i] = (Math.random() * 2 - 1) * fade * fade;
  }
  const noise = context.createBufferSource();
  const filter = context.createBiquadFilter();
  const gain = context.createGain();
  noise.buffer = buffer;
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(700, now + 0.34);
  filter.frequency.exponentialRampToValueAtTime(120, now + 0.55);
  gain.gain.setValueAtTime(0.0001, now + 0.34);
  gain.gain.exponentialRampToValueAtTime(0.13, now + 0.37);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.58);
  noise.connect(filter).connect(gain).connect(context.destination);
  noise.start(now + 0.34);
  noise.stop(now + 0.6);
}
