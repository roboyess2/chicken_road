import { useLayoutEffect, useRef, useState } from 'react';
import { Car, Chicken } from '../../../entities/chicken/ui/Chicken.jsx';

export function Road({ step, phase, pendingHit, brakingLane, stoppedCars, onStoppedCarsChange, visibleLanes, safeMultiplier }) {
  const lanesRef = useRef(null);
  const [brakePositions, setBrakePositions] = useState({});
  const laneStart = Math.max(0, step - 2);
  const rows = Array.from({ length: visibleLanes }, (_, index) => laneStart + index);
  const cameraLocked = step >= 2;
  const playerLane = phase === 'jumping' || phase === 'crashing' || phase === 'lost' ? step + 1 : step;
  const cameraMoving = cameraLocked && phase === 'jumping';
  const cameraSettled = cameraLocked && (phase === 'crashing' || phase === 'lost');

  useLayoutEffect(() => {
    if (brakingLane == null) {
      if (Object.keys(brakePositions).length) setBrakePositions({});
      return;
    }
    if (phase !== 'jumping' || pendingHit || brakePositions[brakingLane]) return;
    const laneNode = lanesRef.current?.querySelector(`[data-lane="${brakingLane}"]`);
    const carNode = laneNode?.querySelector('.car.is-braking');
    const carImage = carNode?.querySelector('.car-model');
    const barrier = laneNode?.querySelector('.road-blocker-stopped');
    if (!laneNode || !carNode || !carImage || !barrier) return;

    const laneRect = laneNode.getBoundingClientRect();
    const carRect = carNode.getBoundingClientRect();
    const imageRect = carImage.getBoundingClientRect();
    const barrierRect = barrier.getBoundingClientRect();
    if (!laneRect.height) return;

    // Keep the car's nose just before the barrier, even when the sprite is scaled beyond its box.
    const imageBottomOffset = imageRect.bottom - carRect.top;
    const stoppedTop = barrierRect.top - laneRect.top - imageBottomOffset - 5;
    const stoppedTopPercent = `${(stoppedTop / laneRect.height) * 100}%`;
    setBrakePositions((previous) => previous[brakingLane] ? previous : {
      ...previous,
      [brakingLane]: { from: window.getComputedStyle(carNode).top, to: stoppedTopPercent },
    });
  }, [brakingLane, phase, pendingHit, brakePositions]);

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
      <div
        ref={lanesRef}
        className={`road-lanes ${cameraMoving ? 'camera-moving' : ''} ${cameraSettled ? 'camera-settled' : ''}`}
        style={{ '--camera-shift': `${100 / visibleLanes}%`, '--lane-width': `${100 / visibleLanes}%` }}
      >
        {rows.map((lane) => {
          const crossed = lane < step;
          const current = lane === playerLane;
          const isHitLane = (phase === 'crashing' || phase === 'lost') && lane === step + 1;
          const stoppedTop = stoppedCars[lane];
          const isBraking = lane === brakingLane && phase === 'jumping' && !pendingHit;
          const isStopped = Boolean(stoppedTop);
          const brakePosition = brakePositions[lane];
          const showCar = lane > 0 && (!crossed || isStopped || isBraking);
          const showBarrier = crossed || isStopped || isBraking;
          return (
            <div className={`road-lane ${current ? 'lane-current' : ''} ${crossed ? 'lane-crossed' : ''} ${isHitLane ? 'lane-hit' : ''}`} data-lane={lane} key={lane}>
              <span className="lane-mark">{lane === 0 ? 'СТАРТ' : `#${lane}`}</span>
              {lane > 0 && <span className={`lane-multiplier ${crossed ? 'is-secured' : ''}`}>×{Math.min(1e12, safeMultiplier ** lane).toFixed(2)}</span>}
              <span className="lane-dash" />
              {showBarrier && <span className={`road-blocker ${isStopped || isBraking ? 'road-blocker-stopped' : ''}`} aria-hidden="true"><i /><i /><i /></span>}
              {showCar && <Car
                variant={(lane - 1) % 3}
                delay={`${lane * -0.45}s`}
                duration={`${1.25 + (lane % 4) * 0.2}s`}
                braking={isBraking}
                brakeReady={Boolean(brakePosition)}
                stopped={isStopped}
                brakeStartTop={brakePosition?.from}
                stoppedTop={stoppedTop || brakePosition?.to}
                onBrakeEnd={() => onStoppedCarsChange((previous) => previous[lane] ? previous : { ...previous, [lane]: brakePosition?.to })}
              />}
              {isHitLane && <Car variant={step % 3} delay="0s" duration=".55s" />}
              {current && <span className={`chicken-position ${phase === 'jumping' ? 'jumping' : ''} ${phase === 'crashing' ? 'crashing' : ''} ${cameraLocked ? 'camera-locked' : ''} ${phase === 'lost' ? 'falling' : ''}`}><Chicken crashed={phase === 'lost'} /></span>}
              {lane === step + 1 && phase === 'jumping' && !pendingHit && <span className="safe-landing"><span>✦</span></span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
