import './MobileGameLayout.scss';
import { GAME_LIMITS, money } from '../../../entities/game/model/gameRules.js';
import { Chicken } from '../../../entities/chicken/ui/Chicken.jsx';
import { Icon } from '../../../shared/ui/Icon.jsx';
import { Road } from '../../../widgets/game-board/ui/Road.jsx';

const MOBILE_VISIBLE_LANES = 4; // Стартовый тротуар и три дорожные полосы.

export function MobileGameLayout({ game, soundMuted, toggleSound }) {
  const {
    gameConfig, balance, bet, step, phase, pendingHit, brakingLane, stoppedCars,
    setStoppedCars, active, canEditBet, currentPayout,
    primaryLabel, changeBet, startRound, securePrize, jump,
  } = game;
  const { MIN_BET, MAX_BET, BET_STEP } = GAME_LIMITS;

  return (
    <div className="mobile-layout">
      <header className="mobile-topbar">
        <a className="mobile-brand" href="#top" aria-label="Chicken Road — начало">
          <span className="mobile-brand-mark"><Chicken /></span>
          <span>FEATHER<span>PLAY</span></span>
        </a>
        <div className="mobile-header-actions">
          <button className={`mobile-icon-button ${soundMuted ? 'is-muted' : ''}`} onClick={toggleSound} aria-pressed={soundMuted} aria-label={soundMuted ? 'Включить звук' : 'Выключить звук'} title={soundMuted ? 'Включить звук' : 'Выключить звук'}>
            <Icon name={soundMuted ? 'volumeOff' : 'volume'} size={18} />
          </button>
        </div>
        <div className="mobile-balance"><small>БАЛАНС</small><b>{money(balance)}</b></div>
      </header>

      <main className="mobile-main">
        <section className="mobile-game-card" aria-label="Игровое поле">
          <div className="mobile-road-stage">
            <Road
              step={step}
              phase={phase}
              pendingHit={pendingHit}
              brakingLane={brakingLane}
              stoppedCars={stoppedCars}
              onStoppedCarsChange={setStoppedCars}
              visibleLanes={MOBILE_VISIBLE_LANES}
              safeMultiplier={gameConfig.safeMultiplier}
              onJump={jump}
              mobileLayout
            />
          </div>

        </section>

        <section className="mobile-controls" aria-label="Ставка и управление">
          <div className="mobile-controls-main">
            <div className="mobile-bet-controls">
              <div className="mobile-section-title"><b>Ставка</b><span>ОЧКИ</span></div>
              <div className={`mobile-bet-stepper ${!canEditBet ? 'is-locked' : ''}`}>
                <button onClick={() => changeBet(bet - BET_STEP)} disabled={!canEditBet || bet <= MIN_BET} aria-label="Уменьшить ставку">−</button>
                <div><b>{bet.toLocaleString('ru-RU')}</b><small>виртуальных очков</small></div>
                <button onClick={() => changeBet(bet + BET_STEP)} disabled={!canEditBet || bet >= Math.min(MAX_BET, balance)} aria-label="Увеличить ставку">+</button>
              </div>
              <div className="mobile-bet-presets">
                {[20, 50, 100].map((preset) => (
                  <button key={preset} className={bet === preset ? 'is-selected' : ''} onClick={() => changeBet(preset)} disabled={!canEditBet || preset > balance}>{preset}</button>
                ))}
              </div>
            </div>

          </div>

          <div className={`mobile-actions ${active ? 'is-active' : ''}`}>
            {!active && <button className="mobile-go-button" onClick={startRound} disabled={balance < bet}>
              <span>{primaryLabel}</span><Icon name="arrow" size={18} />
            </button>}
            <button className="mobile-cashout-button" onClick={() => securePrize()} disabled={phase !== 'running' || step === 0}>
              <span>ЗАБРАТЬ</span><b>{money(currentPayout)}</b>
            </button>
          </div>

          <div className="mobile-control-foot">
            <span><i /> ВИРТУАЛЬНЫЕ ОЧКИ</span>
            {balance < bet && !active && <b>Недостаточно очков</b>}
          </div>
        </section>
      </main>
    </div>
  );
}
