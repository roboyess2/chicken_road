import { useEffect, useRef, useState } from 'react';
import { DEFAULT_GAME_CONFIG, GAME_LIMITS, multiplierFor, payoutFor } from '../../../entities/game/model/gameRules.js';
import { getGameConfig } from '../../../entities/game/api/gameConfigApi.js';

export function useGameSession() {
  const [gameConfig, setGameConfig] = useState(DEFAULT_GAME_CONFIG);
  const [apiStatus, setApiStatus] = useState('loading');
  const [balance, setBalance] = useState(GAME_LIMITS.STARTING_BALANCE);
  const [bet, setBet] = useState(20);
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState('idle');
  const [pendingHit, setPendingHit] = useState(false);
  const [round, setRound] = useState(0);
  const [result, setResult] = useState(null);
  const [sessionStats, setSessionStats] = useState({ rounds: 0, wins: 0, losses: 0 });
  const timerRef = useRef(null);
  const active = phase === 'running' || phase === 'jumping';
  const canEditBet = !active;
  const currentPayout = step > 0 ? payoutFor(bet, step, gameConfig.safeMultiplier) : 0;
  const currentMultiplier = multiplierFor(step, gameConfig.safeMultiplier);

  useEffect(() => {
    const controller = new AbortController();
    getGameConfig({ signal: controller.signal }).then((config) => { setGameConfig(config); setApiStatus('loaded'); })
      .catch((error) => { if (error.name !== 'AbortError') setApiStatus('fallback'); });
    return () => { controller.abort(); window.clearTimeout(timerRef.current); };
  }, []);

  function changeBet(nextBet) {
    if (!canEditBet) return;
    setBet(Math.min(GAME_LIMITS.MAX_BET, Math.max(GAME_LIMITS.MIN_BET, Math.min(balance || GAME_LIMITS.MIN_BET, nextBet))));
  }
  function startRound() {
    if (active || balance < bet) return;
    setBalance((value) => value - bet); setStep(0); setResult(null); setPendingHit(false);
    setRound((value) => value + 1); setSessionStats((value) => ({ ...value, rounds: value.rounds + 1 })); setPhase('running');
  }
  function securePrize(kind = 'cashout') {
    if (phase !== 'running' || step === 0) return;
    const payout = currentPayout;
    setBalance((value) => value + payout); setResult({ kind, amount: payout, steps: step });
    setSessionStats((value) => ({ ...value, wins: value.wins + 1 })); setPhase('cashed');
  }
  function randomUnit() {
    if (window.crypto?.getRandomValues) { const sample = new Uint32Array(1); window.crypto.getRandomValues(sample); return sample[0] / 4294967296; }
    return Math.random();
  }
  function jump() {
    if (phase !== 'running') return;
    const hit = randomUnit() < gameConfig.collisionChance;
    setPendingHit(hit); setPhase('jumping');
    timerRef.current = window.setTimeout(() => {
      setPendingHit(false);
      if (hit) { setPhase('lost'); setResult({ kind: 'loss', amount: bet, steps: step }); setSessionStats((value) => ({ ...value, losses: value.losses + 1 })); return; }
      setStep((value) => value + 1); setPhase('running');
    }, 620);
  }
  function resetSession() {
    if (active) return;
    setBalance(GAME_LIMITS.STARTING_BALANCE); setBet(20); setStep(0); setRound(0); setResult(null);
    setSessionStats({ rounds: 0, wins: 0, losses: 0 }); setPhase('idle');
  }
  const primaryLabel = phase === 'jumping' ? 'ПРЫЖОК…' : phase === 'running' ? 'ПРЫГАТЬ' : 'НАЧАТЬ РАУНД';
  const resultTitle = result?.kind === 'loss' ? 'Машина задела курочку' : 'Очки сохранены';
  const safePercent = (1 - gameConfig.collisionChance) * 100;
  const expectedReturn = safePercent * multiplierFor(step + 1, gameConfig.safeMultiplier) / multiplierFor(step, gameConfig.safeMultiplier);
  return { gameConfig, apiStatus, balance, bet, step, phase, pendingHit, round, result, sessionStats, active, canEditBet, currentPayout, currentMultiplier, primaryLabel, resultTitle, safePercent, expectedReturn, changeBet, startRound, securePrize, jump, resetSession };
}
