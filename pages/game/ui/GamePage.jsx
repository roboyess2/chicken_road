import './GamePage.scss';
import { useGameSession } from '../../../features/game-session/model/useGameSession.js';
import { GAME_LIMITS, multiplierFor, money } from '../../../entities/game/model/gameRules.js';
import { Icon } from '../../../shared/ui/Icon.jsx';
import { Chicken } from '../../../entities/chicken/ui/Chicken.jsx';
import { Road } from '../../../widgets/game-board/ui/Road.jsx';

export function GamePage() {
  const game = useGameSession();
  const {
    gameConfig, apiStatus, balance, bet, step, phase, pendingHit, round, result, sessionStats,
    active, canEditBet, currentPayout, currentMultiplier, primaryLabel, resultTitle, safePercent, expectedReturn,
    changeBet, startRound, securePrize, jump, resetSession,
  } = game;
  const { STARTING_BALANCE, MIN_BET, MAX_BET, BET_STEP } = GAME_LIMITS;

  return (
    <div className="app-shell">
      <div className="ambient ambient-one" /><div className="ambient ambient-two" />
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Chicken Road — начало">
          <span className="brand-mark"><Chicken /></span>
          <span className="brand-name">FEATHER<span>PLAY</span></span>
        </a>
        <div className="topbar-center"><span className="live-dot" /> ДЕМО-ЗАЕЗД <span className="api-state">· JSON {apiStatus === 'loaded' ? 'ЗАГРУЖЕН' : apiStatus === 'loading' ? 'ЗАГРУЗКА' : 'FALLBACK'}</span></div>
        <div className="header-balance"><small>БАЛАНС · ДЕМО</small><b>{money(balance)}</b></div>
        <button className="reset-button" onClick={resetSession} disabled={active} title="Сбросить демо-сессию"><Icon name="refresh" size={16} /><span>Сбросить</span></button>
      </header>

      <main id="top" className="main-layout">
        <section className="game-column">
          <div className="hero-row">
            <div>
              <div className="eyebrow"><span className="eyebrow-line" /> ONE MORE HOP</div>
              <h1>CHICKEN <span>ROAD</span></h1>
              <p className="hero-copy">Сколько полос ты решишь пройти?</p>
            </div>
            <div className="demo-pill"><span className="pill-dot" /> ТОЛЬКО ВИРТУАЛЬНЫЕ ОЧКИ</div>
          </div>

          <section className="game-card" aria-label="Игровое поле">
            <div className="game-card-top">
              <div className="round-label"><span className="round-icon"><Icon name="spark" size={15} /></span><span>РАУНД <b>{String(Math.max(round, 1)).padStart(2, '0')}</b></span></div>
              <div className="step-counter"><span>ПОЛОСЫ</span><b>{step} пройдено</b><span className="infinity-mark">∞</span></div>
            </div>

            <div className="road-wrap">
              <div className="scene-label scene-label-left"><span className="scene-label-dot" /> ГОРОДСКОЙ ПЕРЕХОД</div>
              <Road step={step} phase={phase} pendingHit={pendingHit} visibleLanes={gameConfig.visibleLanes} safeMultiplier={gameConfig.safeMultiplier} />
              <div className="road-underlay" />
            </div>

            <div className="game-status-row">
              <div className={`status-message ${phase === 'lost' ? 'status-danger' : result && phase !== 'running' ? 'status-success' : ''}`}>
                <span className="status-icon">{phase === 'lost' ? '×' : result && phase !== 'running' ? '✓' : <span className="pulse-dot" />}</span>
                <div><b>{result && phase !== 'running' ? resultTitle : active ? (step === 0 ? 'Дорога свободна. Решай, когда прыгать.' : 'Успел! Заберёшь очки или рискнёшь ещё?') : 'Выбери ставку и начни переход.'}</b><small>{result && phase !== 'running' ? (result.kind === 'loss' ? `Раунд завершён · ставка ${money(result.amount)} потеряна` : `Выплата ${money(result.amount)} уже добавлена к балансу`) : active ? 'Один прыжок — один случайный исход. Тайминг не влияет.' : 'Шанс столкновения на каждом этапе фиксирован.'}</small></div>
              </div>
              <div className="road-odds"><span>ШАНС ПРОЙТИ ЭТАП</span><b>{safePercent.toLocaleString('ru-RU')}<small>%</small></b></div>
            </div>
          </section>

          <section className="lower-row">
            <div className="session-card">
              <div className="lower-card-heading"><div><span className="mini-icon"><Icon name="spark" size={15} /></span><b>СЕССИЯ</b></div><span className="session-caption">только эта вкладка</span></div>
              <div className="session-stats">
                <div><span>Раунды</span><b>{sessionStats.rounds}</b></div><div><span>Собрано</span><b className="stat-green">{sessionStats.wins}</b></div><div><span>Столкновения</span><b className="stat-red">{sessionStats.losses}</b></div>
              </div>
            </div>
            <div className="recent-card">
              <div className="lower-card-heading"><div><span className="mini-icon history-icon">↗</span><b>ПОСЛЕДНИЙ РЕЗУЛЬТАТ</b></div></div>
              {result ? <div className={`last-result ${result.kind === 'loss' ? 'last-loss' : ''}`}><span className="result-badge">{result.kind === 'loss' ? '−' : '+'}</span><b>{result.kind === 'loss' ? `−${money(result.amount)}` : `+${money(result.amount)}`}</b><small>{result.steps} {result.steps === 1 ? 'этап' : result.steps < 5 ? 'этапа' : 'этапов'}</small></div> : <div className="empty-result">Сыграй первый раунд</div>}
            </div>
          </section>
        </section>

        <aside className="control-column">
          <section className="balance-card">
            <div className="balance-top"><span>ТВОЙ БАЛАНС</span><span className="balance-chip"><Icon name="coin" size={14} /> ДЕМО</span></div>
            <div className="balance-amount">{money(balance)}</div>
            <div className="balance-foot"><span className="balance-spark"><Icon name="spark" size={15} /></span> Стартовый запас <b>{money(STARTING_BALANCE)}</b></div>
          </section>

          <section className="bet-card">
            <div className="bet-heading"><div><span className="section-kicker">01 / СТАВКА</span><h2>Выбери размер</h2></div><span className="bet-currency">ОЧКИ</span></div>
            <div className={`bet-stepper ${!canEditBet ? 'is-locked' : ''}`}>
              <button aria-label="Уменьшить ставку" onClick={() => changeBet(bet - BET_STEP)} disabled={!canEditBet || bet <= MIN_BET}>−</button>
              <div className="bet-value"><b>{bet.toLocaleString('ru-RU')}</b><span>виртуальных очков</span></div>
              <button aria-label="Увеличить ставку" onClick={() => changeBet(bet + BET_STEP)} disabled={!canEditBet || bet >= Math.min(MAX_BET, balance)}>+</button>
            </div>
            <div className="bet-presets">{[20, 50, 100].map((preset) => <button key={preset} className={bet === preset ? 'selected' : ''} onClick={() => changeBet(preset)} disabled={!canEditBet || preset > balance}>{preset}</button>)}</div>

            <div className="divider" />

            <div className="payout-heading"><div><span className="section-kicker">02 / ВЫПЛАТА</span><h2>Забрать сейчас</h2></div><span className="multiplier-badge">×{currentMultiplier.toFixed(2)}</span></div>
            <div className="payout-value"><b>{money(currentPayout || bet)}</b><span>{step > 0 ? 'включая ставку' : 'после первого прыжка'}</span></div>

            <div className="multiplier-track">
              {Array.from({ length: 5 }, (_, index) => {
                const stage = step + index + 1;
                return <div key={stage} className={`multiplier-step ${index === 0 ? 'next' : ''}`}><i>{stage}</i><span>×{multiplierFor(stage, gameConfig.safeMultiplier).toFixed(2)}</span></div>;
              })}
            </div>

            <div className="action-buttons">
              <button className="primary-action" onClick={active ? jump : startRound} disabled={phase === 'jumping' || (!active && balance < bet)}>
                <span>{primaryLabel}</span><Icon name="arrow" size={18} />
              </button>
              <button className="cashout-action" onClick={() => securePrize()} disabled={phase !== 'running' || step === 0}>
                <span><Icon name="lock" size={16} /> Забрать {money(currentPayout)}</span><b>ЗАФИКСИРОВАТЬ</b>
              </button>
            </div>
            {balance < bet && !active && <div className="low-balance">Недостаточно очков. Сбрось демо-сессию, чтобы начать заново.</div>}
          </section>

          <section className="rules-card">
            <div className="rules-title"><span><Icon name="info" size={17} /></span><b>ПРАВИЛА И ВЕРОЯТНОСТЬ</b></div>
            <div className="rule-line"><span>Шанс столкновения</span><b>{(gameConfig.collisionChance * 100).toLocaleString('ru-RU')}% на этап</b></div>
            <div className="rule-line"><span>Рост выплаты</span><b>×{gameConfig.safeMultiplier.toLocaleString('ru-RU')} за успех</b></div>
            <div className="rule-note">Правила загружаются из открытого JSON-файла. Шансы не подстраиваются под игрока. Ожидаемая выплата за этап — {expectedReturn.toFixed(2).replace('.', ',')}% от суммы до этапа.</div>
          </section>

          <div className="demo-disclaimer"><span className="disclaimer-mark">i</span><span>Демо-очки не имеют денежной ценности. Результат генерируется в браузере и не защищён от вмешательства.</span></div>
        </aside>
      </main>

      <footer className="footer"><span>FEATHERPLAY LAB</span><span>ВИРТУАЛЬНАЯ ИГРА · БЕЗ ДЕНЕЖНЫХ СТАВОК</span><span>v1.0 / RESEARCH BUILD</span></footer>
    </div>
  );
}



