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

import Cookies from "js-cookie";

/**
 * Stores state/config and manages cookies
 * Depends on cookie.js
 * @param name name of cookie stored in browser
 * @param expiryTime time to store config-cookie in browser for (days)
 * @param defaultConfig initial config options
 * @constructor
 */

export default class CookieConfig {
    constructor(name = "consoleConfig", expiryTime = 14, defaultConfig = {}) {
        this.name = name;
        this.expiryTime = expiryTime;
        this.defaultConfig = defaultConfig;
        this._config = defaultConfig;
        this._loadConfig();
    }

    /**
     * Store a value in config by key
     * This triggers a cookie-write
     * @param key
     * @param value
     */
    store(key, value) {
        if (typeof key === "undefined" || typeof value === "undefined") {
            console.warn("config.store() called with invalid parameters");
        }
        else {
            this._config[key] = value;
            this._saveConfig();
        }
    }

    /**
     * Get a value from config by key
     * @param key
     * @returns {*}
     */
    get(key) {
        if (this._config.hasOwnProperty(key)) {
            return this._config[key];
        }
    }


    /**
     * Reset config to default values
     * @type {_resetConfig}
     */
    _resetConfig() {
        this._config = {};
        //copy defaultConfig to config. Beware: Nested objects are still copied as reference
        for (let p in this.defaultConfig) {
            if (this.defaultConfig.hasOwnProperty(p)) {
                this._config[p] = this.defaultConfig[p];
            }
        }
        this._saveConfig();
    }

    /**
     * Trigger config refresh (reload from cookies)
     * @type {getConfig}
     */
    _loadConfig() {
        try {
            let result = Cookies.getJSON(this.name);
            if (typeof result === "undefined") {
                this._resetConfig();
            }
            else {
                this._config = result;
            }
        }
        catch (e) {
            console.error("CookieConfig: Error while getting config from cookies");
            this._resetConfig();
        }
    }

    _saveConfig() {
        Cookies.set(this.name, this._config, {expires: this.expiryTime});
    }
}