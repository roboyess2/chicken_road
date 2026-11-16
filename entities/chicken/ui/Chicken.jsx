import carOne from '../assets/cars/1.png';
import carTwo from '../assets/cars/2.png';
import carThree from '../assets/cars/3.png';
import idleChickenImage from '../assets/chicken_stay.webp';
import flyingChickenImage from '../assets/chicken_fly.webp';
import deadChickenImage from '../assets/chicken_dead.png';

const CAR_IMAGES = [carOne, carTwo, carThree];

export function SquashedChicken() {
  return (
    <img className="chicken squashed-chicken" src={deadChickenImage} alt="Цыплёнок сбит" draggable="false" />
  );
}

export function Chicken({ jumping = false, crashed = false }) {
  if (crashed) return <SquashedChicken />;
  return (
    <img
      className={`chicken ${jumping ? 'is-flying' : 'is-idle'}`}
      src={jumping ? flyingChickenImage : idleChickenImage}
      alt={jumping ? 'Цыплёнок перелетает дорогу' : 'Цыплёнок стоит'}
      draggable="false"
    />
  );
}

export function Car({ variant = 0, delay = '0s', duration = '4s', braking = false, brakeReady = false, stopped = false, brakeStartTop, stoppedTop, onBrakeEnd }) {
  const carState = [braking && 'is-braking', brakeReady && 'is-brake-ready', stopped && 'is-stopped'].filter(Boolean).join(' ');
  return (
    <span
      className={`car car-variant-${variant % CAR_IMAGES.length} ${carState}`}
      style={{
        '--delay': delay,
        '--duration': duration,
        ...(brakeStartTop ? { '--brake-start-top': brakeStartTop } : {}),
        ...(stoppedTop ? { '--stopped-top': stoppedTop } : {}),
      }}
      aria-hidden="true"
      onAnimationEnd={(event) => {
        if (event.target === event.currentTarget && event.animationName === 'car-brake') onBrakeEnd?.();
      }}
    >
      <img className="car-model" src={CAR_IMAGES[variant % CAR_IMAGES.length]} alt="" draggable="false" />
    </span>
  );
}
