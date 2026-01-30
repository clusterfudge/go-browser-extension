// the value of `__DEFAULT_INSTANCE__` is set by webpack according to the `instance` argument provided
// to `yarn dev` or `yarn build`
export const DEFAULT_INSTANCE = __DEFAULT_INSTANCE__;
export const STORAGE_KEY = 'trottoInstanceUrl';

// For use in options page and popup (which still have access to chrome.storage)
export const getInstanceUrl = async () => {
  const result = await chrome.storage.local.get([STORAGE_KEY]);
  return result[STORAGE_KEY] || DEFAULT_INSTANCE;
};

export const setInstanceUrl = async (url) => {
  await chrome.storage.local.set({ [STORAGE_KEY]: url });
};
