import { Car, Chicken } from '../../../entities/chicken/ui/Chicken.jsx';

export function Road({ step, phase, pendingHit, visibleLanes, safeMultiplier }) {
  const laneStart = Math.max(0, step - 2);
  const rows = Array.from({ length: visibleLanes }, (_, index) => laneStart + index);
  const colorSet = ['mint', 'coral', 'blue', 'gold', 'mint'];
  const cameraLocked = step >= 2;
  const playerLane = phase === 'lost' || phase === 'crashing' || (phase === 'jumping' && !cameraLocked) ? step + 1 : step;
  return (
    <div className="road-scene" data-phase={phase} aria-label={`Курочка прошла ${step} полос, дорога бесконечная`}>
      <div className="road-sky">
        <span className="sun-glow" />
        <span className="cloud cloud-a" /><span className="cloud cloud-b" />
        <span className="hill hill-a" /><span className="hill hill-b" />
        <span className="tree tree-a">♣</span><span className="tree tree-b">♣</span><span className="tree tree-c">♣</span>
      </div>
      <div className="road-edge edge-left"><span>✿</span><span>✿</span><span>✿</span></div>
      <div className="road-edge edge-right"><span>✿</span><span>✿</span><span>✿</span></div>
      <div className="road-lanes">
        {rows.map((lane) => {
          const crossed = lane < step;
          const current = lane === playerLane;
          const isHitLane = (phase === 'crashing' || phase === 'lost') && lane === step + 1;
          return (
            <div className={`road-lane ${current ? 'lane-current' : ''} ${crossed ? 'lane-crossed' : ''} ${isHitLane ? 'lane-hit' : ''}`} key={lane}>
              <span className="lane-mark">{lane === 0 ? 'СТАРТ' : `#${lane}`}</span>
              {lane > 0 && <span className={`lane-multiplier ${crossed ? 'is-secured' : ''}`}>×{Math.min(1e12, safeMultiplier ** lane).toFixed(2)}</span>}
              <span className="lane-dash" />
              {crossed && <span className="road-blocker"><i /><i /><i /></span>}
              {!crossed && lane > 0 && <Car color={colorSet[(lane - 1) % colorSet.length]} delay={`${lane * -0.45}s`} duration={`${1.25 + (lane % 4) * 0.2}s`} />}
              {isHitLane && <Car color="coral" delay="0s" duration=".55s" />}
              {current && <span className={`chicken-position ${phase === 'jumping' ? 'jumping' : ''} ${phase === 'crashing' ? 'crashing' : ''} ${cameraLocked ? 'camera-locked' : ''} ${phase === 'lost' ? 'falling' : ''}`}><Chicken crashed={phase === 'lost'} /></span>}
              {lane === step + 1 && phase === 'jumping' && !pendingHit && <span className="safe-landing"><span>✦</span></span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
