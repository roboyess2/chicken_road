export const GAME_LIMITS = Object.freeze({ STARTING_BALANCE: 1000, VISIBLE_LANES: 7, MIN_BET: 10, MAX_BET: 300, BET_STEP: 10 });
export const DEFAULT_GAME_CONFIG = Object.freeze({ collisionChance: 0.18, safeMultiplier: 1.16, visibleLanes: GAME_LIMITS.VISIBLE_LANES });
export const money = (amount) => `${Math.floor(amount).toLocaleString('ru-RU')} оч.`;
export const multiplierFor = (steps, factor) => Math.min(1e12, factor ** steps);
export const payoutFor = (bet, steps, factor) => Math.min(Number.MAX_SAFE_INTEGER, Math.floor(bet * multiplierFor(steps, factor)));
export function isValidGameConfig(config) { return Number.isFinite(config?.collisionChance) && config.collisionChance >= 0 && config.collisionChance < 1 && Number.isFinite(config?.safeMultiplier) && config.safeMultiplier >= 1 && Number.isInteger(config?.visibleLanes) && config.visibleLanes >= 5 && config.visibleLanes <= 11; }
