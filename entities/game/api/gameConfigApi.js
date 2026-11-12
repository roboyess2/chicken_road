import { isValidGameConfig } from '../model/gameRules.js';

// Adapter boundary: replace this function with an HTTP client when the backend is ready.
export async function getGameConfig({ signal } = {}) {
  const response = await fetch(`${import.meta.env.BASE_URL}mock-api/game-config.json`, { cache: 'no-store', signal });
  if (!response.ok) throw new Error('Game config request failed');
  const config = await response.json();
  if (!isValidGameConfig(config)) throw new Error('Invalid game config');
  return config;
}
