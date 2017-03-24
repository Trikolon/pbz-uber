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


export default class LocalStorageConfig extends ConfigStorage {
    constructor() {
        super(...arguments);
        if (typeof(Storage) === "undefined") {
            throw new Error("Local storage not supported by browser");
        }
    }

    /**
     * Trigger config refresh (reload from cookies)
     * @type {getConfig}
     */
    _loadConfig() {
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

    _saveConfig() {
        let configStr = JSON.stringify(this._config);
        localStorage.setItem(this.name, configStr);
    }
}