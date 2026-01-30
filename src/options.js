import { DEFAULT_INSTANCE, STORAGE_KEY } from './config';

const input = document.getElementById('instance_url');
const save = document.getElementById('save');
const reset = document.getElementById('reset');
const status = document.getElementById('status');

// Use browser API if available (Firefox), otherwise chrome API
const storageApi = typeof browser !== 'undefined' ? browser.storage.local : chrome.storage.local;

// Show status message
const showStatus = (message, isError = false) => {
  if (status) {
    status.textContent = message;
    status.className = isError ? 'error' : 'success';
    setTimeout(() => {
      status.textContent = '';
      status.className = '';
    }, 2000);
  }
};

// Get instance URL from storage
const getInstanceUrl = async () => {
  try {
    const result = await storageApi.get([STORAGE_KEY]);
    return result[STORAGE_KEY] || DEFAULT_INSTANCE;
  } catch (e) {
    return DEFAULT_INSTANCE;
  }
};

// Set instance URL in storage
const setInstanceUrl = async (url) => {
  await storageApi.set({ [STORAGE_KEY]: url });
};

// Initialize the input with current value
const init = async () => {
  try {
    input.value = await getInstanceUrl();
  } catch (e) {
    input.value = DEFAULT_INSTANCE;
  }
};

save.onclick = async () => {
  try {
    await setInstanceUrl(input.value);
    showStatus('Saved!');
  } catch (e) {
    showStatus('Error saving', true);
  }
};

reset.onclick = async () => {
  input.value = DEFAULT_INSTANCE;
  try {
    await setInstanceUrl(DEFAULT_INSTANCE);
    showStatus('Reset to default!');
  } catch (e) {
    showStatus('Error resetting', true);
  }
};

init();
