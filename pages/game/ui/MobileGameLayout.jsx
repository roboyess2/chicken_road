import './MobileGameLayout.scss';
import { GAME_LIMITS, money, multiplierFor } from '../../../entities/game/model/gameRules.js';
import { Chicken } from '../../../entities/chicken/ui/Chicken.jsx';
import { Icon } from '../../../shared/ui/Icon.jsx';
import { Road } from '../../../widgets/game-board/ui/Road.jsx';

export function MobileGameLayout({ game, soundMuted, toggleSound }) {
  const {
    gameConfig, apiStatus, balance, bet, step, phase, pendingHit, brakingLane, stoppedCars,
    setStoppedCars, round, result, active, canEditBet, currentPayout, currentMultiplier,
    primaryLabel, resultTitle, safePercent, changeBet, startRound, securePrize, jump,
  } = game;
  const { MIN_BET, MAX_BET, BET_STEP } = GAME_LIMITS;
  const statusTitle = phase === 'crashing'
    ? 'Машина сбивает цыплёнка'
    : result && result.kind === 'loss'
      ? resultTitle
      : result
        ? 'Очки сохранены'
        : active
          ? step > 0 ? 'Полоса пройдена' : 'Дорога свободна'
          : 'Готов к переходу?';
  const statusDetail = phase === 'crashing'
    ? 'Раунд завершается…'
    : result?.kind === 'loss'
      ? `Ставка ${money(result.amount)} потеряна`
      : result
        ? `Выплата ${money(result.amount)} добавлена к балансу`
        : active
          ? step > 0 ? 'Забери выплату или прыгай дальше' : 'Нажми кнопку, чтобы сделать первый прыжок'
          : `Шанс пройти этап — ${safePercent.toLocaleString('ru-RU')}%`;

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
          <div className="mobile-game-meta">
            <span className="mobile-meta-chip">РАУНД {String(Math.max(round, 1)).padStart(2, '0')}</span>
            <span className="mobile-meta-chip"><b>{step}</b> ПОЛОС</span>
            <span className="mobile-demo-state"><i /> {apiStatus === 'loaded' ? 'ДЕМО' : apiStatus === 'loading' ? 'ЗАГРУЗКА' : 'FALLBACK'}</span>
          </div>

          <div className="mobile-road-stage">
            <Road
              step={step}
              phase={phase}
              pendingHit={pendingHit}
              brakingLane={brakingLane}
              stoppedCars={stoppedCars}
              onStoppedCarsChange={setStoppedCars}
              visibleLanes={gameConfig.visibleLanes}
              safeMultiplier={gameConfig.safeMultiplier}
            />
          </div>

          <div className={`mobile-game-status ${phase === 'crashing' || result?.kind === 'loss' ? 'is-danger' : result ? 'is-success' : ''}`} aria-live="polite">
            <span className="mobile-status-dot" />
            <span><b>{statusTitle}</b><small>{statusDetail}</small></span>
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

            <div className="mobile-payout-controls">
              <div className="mobile-section-title"><b>Забрать сейчас</b><span>×{currentMultiplier.toFixed(2)}</span></div>
              <div className="mobile-payout-amount"><b>{money(currentPayout || bet)}</b><small>{step > 0 ? 'выплата с учётом ставки' : 'после первого прыжка'}</small></div>
            </div>
          </div>

          <div className="mobile-multiplier-track" aria-label="Следующие коэффициенты">
            {Array.from({ length: 5 }, (_, index) => {
              const stage = step + index + 1;
              return (
                <div key={stage} className={`mobile-track-step ${index === 0 ? 'is-next' : ''}`}>
                  <i>{stage}</i><span>×{multiplierFor(stage, gameConfig.safeMultiplier).toFixed(2)}</span>
                </div>
              );
            })}
          </div>

          <div className="mobile-actions">
            <button className="mobile-go-button" onClick={active ? jump : startRound} disabled={phase === 'jumping' || phase === 'crashing' || (!active && balance < bet)}>
              <span>{primaryLabel}</span><Icon name="arrow" size={18} />
            </button>
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
