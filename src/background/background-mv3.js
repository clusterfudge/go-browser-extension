import { DEFAULT_INSTANCE } from '../config';

const STORAGE_KEY = 'trottoInstanceUrl';

export class Background {
  constructor(apiImplementation) {
    this.api = apiImplementation;
  }

  run() {
    this.registerListeners();
  }

  registerListeners() {
    this.api.runtime.onInstalled.addListener(this.handleInstall.bind(this));
    this.api.storage.onChanged.addListener(this.handleStorageChange.bind(this));
  }

  async getInstanceUrl() {
    try {
      // First check managed storage (enterprise policy)
      const managed = await this.api.storage.managed.get(['TrottoInstanceUrl']);
      if (managed.TrottoInstanceUrl) {
        return managed.TrottoInstanceUrl;
      }
    } catch (e) {
      // Managed storage may not be available
    }

    // Fall back to local storage
    const local = await this.api.storage.local.get([STORAGE_KEY]);
    return local[STORAGE_KEY] || DEFAULT_INSTANCE;
  }

  async setInstanceUrl(url) {
    await this.api.storage.local.set({ [STORAGE_KEY]: url });
  }

  async updateRedirectRules() {
    const instanceUrl = await this.getInstanceUrl();
    
    // Remove existing rules and add new ones
    const existingRules = await this.api.declarativeNetRequest.getDynamicRules();
    const existingRuleIds = existingRules.map(rule => rule.id);

    // Rule to redirect go/* requests to the instance URL
    // Using regex to capture the path after "go/"
    const rules = [
      {
        id: 1,
        priority: 1,
        action: {
          type: 'redirect',
          redirect: {
            regexSubstitution: instanceUrl + '/\\1?s=crx'
          }
        },
        condition: {
          regexFilter: '^https?://go/(.+)$',
          resourceTypes: ['main_frame']
        }
      },
      {
        id: 2,
        priority: 1,
        action: {
          type: 'redirect',
          redirect: {
            url: instanceUrl + '/?s=crx'
          }
        },
        condition: {
          regexFilter: '^https?://go/?$',
          resourceTypes: ['main_frame']
        }
      }
    ];

    await this.api.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: existingRuleIds,
      addRules: rules
    });
  }

  async handleInstall(details) {
    // Store the default instance URL
    const currentUrl = await this.getInstanceUrl();
    if (!currentUrl || currentUrl === DEFAULT_INSTANCE) {
      await this.setInstanceUrl(DEFAULT_INSTANCE);
    }

    // Set up redirect rules
    await this.updateRedirectRules();

    if (details.reason !== 'install') return;

    const instanceUrl = await this.getInstanceUrl();
    if (instanceUrl !== DEFAULT_INSTANCE) return;

    // On fresh install, open go/ to teach Chrome it's a valid URL
    const tabs = await this.api.tabs.query({ currentWindow: true, url: '*://www.trot.to/getting-started' });
    
    if (tabs.length === 0) {
      // Open a new tab next to the current tab
      const activeTabs = await this.api.tabs.query({ active: true });
      const createArgs = { url: 'https://go/' };

      if (activeTabs.length === 1) {
        createArgs.index = activeTabs[0].index + 1;
      }

      const newTab = await this.api.tabs.create(createArgs);
      
      // Close the tab once it starts loading (it will redirect to the instance)
      const listener = (tabId, changeInfo) => {
        if (tabId !== newTab.id) return;
        if (changeInfo.status === 'loading') {
          this.api.tabs.remove(newTab.id);
          this.api.tabs.onUpdated.removeListener(listener);
        }
      };
      this.api.tabs.onUpdated.addListener(listener);
    } else {
      await this.api.tabs.update(tabs[0].id, { url: 'https://go/__init__', active: true });
    }
  }

  async handleStorageChange(changes, namespace) {
    // Update redirect rules when instance URL changes
    if (namespace === 'local' && changes[STORAGE_KEY]) {
      await this.updateRedirectRules();
    }
    if (namespace === 'managed' && changes.TrottoInstanceUrl) {
      await this.updateRedirectRules();
    }
  }
}
