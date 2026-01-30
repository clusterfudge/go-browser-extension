// Chrome Manifest V3 API implementation for popup/options (non-service-worker contexts)

export class Api {
  constructor() {
    this.tabs = {
      query: (queryInfo) => chrome.tabs.query(queryInfo),
      create: (createProperties) => chrome.tabs.create(createProperties),
      remove: (tabId) => chrome.tabs.remove(tabId),
      update: (tabId, updateProperties) => chrome.tabs.update(tabId, updateProperties)
    };

    this.storage = {
      local: {
        get: (keys) => chrome.storage.local.get(keys),
        set: (items) => chrome.storage.local.set(items)
      }
    };
  }
}
