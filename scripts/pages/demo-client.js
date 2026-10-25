import { createDemoApi, ApiError } from './demo-api.mjs';

let storage;
try { storage = globalThis.localStorage; } catch { storage = undefined; }

export { ApiError };
export const apiFetch = createDemoApi({
  seed: __PAGES_SEED__,
  key: __PAGES_STORAGE_KEY__,
  storage,
});
