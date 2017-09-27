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

import * as log from "loglevel";

/**
 * Abstract class which implements methods to manage state/config object.
 * Save and load must be overwritten in oder to store config.
 */
export default class ConfigStorage {

    /**
     * @param {String} name - Parent key of config object.
     * @param {Number} expiryTime - How long should the data be kept in storage.
     * @param {Object} defaultConfig - Initial state for config object, also used for reset.
     */
    constructor(name = "consoleConfig", expiryTime = 14, defaultConfig = {}) {
        if (new.target === ConfigStorage) {
            throw new TypeError(`Can't construct instance of abstract class ${new.target}`);
        }
        this.name = name;
        this.expiryTime = expiryTime;
        this.defaultConfig = defaultConfig;
        this._config = defaultConfig;
        this._loadConfig();
    }

    /**
     * Store a value in config by key.
     * This triggers a cookie-write.
     * @param {String} key - Key to store object/value in-
     * @param {Object} value - Object / value to store.
     * @returns {undefined}
     */
    set(key, value) {
        if (typeof key === "undefined" || typeof value === "undefined") {
            log.warn("config.store() called with invalid parameters");
        }
        else {
            this._config[key] = value;
            this._saveConfig();
        }
    }

    /**
     * Get a value from config by key.
     * @param {String} key - Key to query object for.
     * @returns {Object | undefined} - Requested object or undefined if no match.
     */
    get(key) {
        if (this._config.hasOwnProperty(key)) {
            return this._config[key];
        }
    }


    /**
     * Reset config to default values.
     * @private
     * @returns {undefined}
     */
    _resetConfig() {
        this._config = {};
        //copy defaultConfig to config. Beware: Nested objects are still copied as reference
        for (const p in this.defaultConfig) {
            if (this.defaultConfig.hasOwnProperty(p)) {
                this._config[p] = this.defaultConfig[p];
            }
        }
        this._saveConfig();
    }

    /**
     * Trigger config refresh (reload from storage).
     * @private
     * @abstract
     * @returns {undefined}
     */
    _loadConfig() {
        throw new Error("Abstract method call");
    }

    /**
     * Trigger config save to storage.
     * @private
     * @abstract
     * @returns {undefined}
     */
    _saveConfig() {
        throw new Error("Abstract method call");
    }
}