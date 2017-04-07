/*
 Copyright 2017 Paul Zuehlcke - paul.zuehlcke.de

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

import ConfigStorage from "./ConfigStorage";

/**
 * Implements methods save and load from ConfigStorage to manage config-object in the local storage of the browser
 */
export default class LocalStorageConfig extends ConfigStorage {
    constructor() {
        super(...arguments);
        this._disabled = typeof(Storage) === "undefined";
    }


    /**
     * Trigger config refresh (reload from local storage)
     * @private
     */
    _loadConfig() {
        if (this._disabled) {
            console.warn("LocalStorageConfig: local-storage not supported / allowed by browser. Data will not be saved.");
            return;
        }
        try {
            let result = localStorage.getItem(this.name);
            if (result === null) {
                this._resetConfig();
            }
            else {
                result = JSON.parse(result);
                this._config = result;
            }
        }
        catch (e) {
            console.error("ConfigStorage: Error while getting config from local-storage", e);
            this._resetConfig();
        }
    }

    /**
     * Save config to local storage if possible
     * @private
     */
    _saveConfig() {
        if (this._disabled) {
            console.warn("LocalStorageConfig: local-storage not supported / allowed by browser. Data will not be saved.");
            return;
        }
        let configStr = JSON.stringify(this._config);
        localStorage.setItem(this.name, configStr);
    }
}