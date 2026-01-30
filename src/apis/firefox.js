// Firefox Manifest V3 API implementation
export class Api {
  constructor() {
    this.runtime = {
      onInstalled: {
        addListener: (callback) => browser.runtime.onInstalled.addListener(callback)
      }
    };

    this.storage = {
      onChanged: {
        addListener: (callback) => browser.storage.onChanged.addListener(callback)
      },
      managed: {
        get: (keys) => browser.storage.managed.get(keys)
      },
      local: {
        get: (keys) => browser.storage.local.get(keys),
        set: (items) => browser.storage.local.set(items)
      }
    };

    this.declarativeNetRequest = {
      getDynamicRules: () => browser.declarativeNetRequest.getDynamicRules(),
      updateDynamicRules: (options) => browser.declarativeNetRequest.updateDynamicRules(options)
    };

    this.tabs = {
      query: (queryInfo) => browser.tabs.query(queryInfo),
      create: (createProperties) => browser.tabs.create(createProperties),
      remove: (tabId) => browser.tabs.remove(tabId),
      update: (tabId, updateProperties) => browser.tabs.update(tabId, updateProperties),
      onUpdated: {
        addListener: (callback) => browser.tabs.onUpdated.addListener(callback),
        removeListener: (callback) => browser.tabs.onUpdated.removeListener(callback)
      }
    };
  }
}
