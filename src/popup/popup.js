import { DEFAULT_INSTANCE, STORAGE_KEY } from '../config';

export class Popup {
  constructor(apiImplementation) {
    this.api = apiImplementation;
  }

  async getInstanceUrl() {
    try {
      const result = await this.api.storage.local.get([STORAGE_KEY]);
      return result[STORAGE_KEY] || DEFAULT_INSTANCE;
    } catch (e) {
      return DEFAULT_INSTANCE;
    }
  }

  async run() {
    const instanceUrl = await this.getInstanceUrl();
    await this.api.tabs.create({ url: instanceUrl });
    window.close();
  }
}
