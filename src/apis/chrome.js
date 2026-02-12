// Chrome Manifest V3 API implementation
// Service workers don't have access to webextension-polyfill, use chrome.* APIs directly

export class Api {
  constructor() {
    this.runtime = {
      onInstalled: {
        addListener: (callback) => chrome.runtime.onInstalled.addListener(callback)
      }
    };

    this.storage = {
      onChanged: {
        addListener: (callback) => chrome.storage.onChanged.addListener(callback)
      },
      managed: {
        get: (keys) => chrome.storage.managed.get(keys)
      },
      local: {
        get: (keys) => chrome.storage.local.get(keys),
        set: (items) => chrome.storage.local.set(items)
      }
    };

    this.declarativeNetRequest = {
      getDynamicRules: () => chrome.declarativeNetRequest.getDynamicRules(),
      updateDynamicRules: (options) => chrome.declarativeNetRequest.updateDynamicRules(options)
    };

    this.tabs = {
      query: (queryInfo) => chrome.tabs.query(queryInfo),
      create: (createProperties) => chrome.tabs.create(createProperties),
      remove: (tabId) => chrome.tabs.remove(tabId),
      update: (tabId, updateProperties) => chrome.tabs.update(tabId, updateProperties),
      onUpdated: {
        addListener: (callback) => chrome.tabs.onUpdated.addListener(callback),
        removeListener: (callback) => chrome.tabs.onUpdated.removeListener(callback)
      }
    };
  }
}
