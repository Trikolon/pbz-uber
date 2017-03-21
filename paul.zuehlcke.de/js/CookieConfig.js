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

/**
 * Stores state/config and manages cookies
 * Depends on cookie.js
 * @param name name of cookie stored in browser
 * @param expiryTime time to store config-cookie in browser for (days)
 * @param defaultConfig initial config options
 * @constructor
 */
function CookieConfig(name, expiryTime, defaultConfig) {
    let config;
    if (!name) {
        name = "consoleConfig";
    }
    if (!expiryTime) {
        expiryTime = 7;
    }
    if (!defaultConfig) {
        defaultConfig = {};
    }
    getConfig();

    function resetConfig() {
        config = {};
        //copy defaultConfig to config. Beware: Nested objects are still copied as reference
        for (let p in defaultConfig) {
            if (defaultConfig.hasOwnProperty(p)) {
                config[p] = defaultConfig[p];
            }
        }
        storeConfig();
    }

    function storeConfig() {
        Cookies.set(name, config, {expires: expiryTime});
    }

    function getConfig() {
        try {
            let result = Cookies.getJSON(name);
            if (typeof result === "undefined") {
                resetConfig();
            }
            else {
                config = result;
            }
        }
        catch (e) {
            console.error("CookieConfig: Error while getting config from cookies");
            resetConfig();
        }
    }

    /**
     * Store a value in config by key
     * This triggers a cookie-write
     * @param key
     * @param value
     */
    this.store = function (key, value) {
        if (typeof key === "undefined" || typeof value === "undefined") {
            console.warn("config.store() called with invalid parameters");
        }
        else {
            config[key] = value;
            storeConfig();
        }
    };

    /**
     * Get a value from config by key
     * @param key
     * @returns {*}
     */
    this.get = function (key) {
        if (config.hasOwnProperty(key)) {
            return config[key];
        }
    };

    /**
     * Reset config to default values
     * @type {resetConfig}
     */
    this.reset = resetConfig;

    /**
     * Trigger config refresh (reload from cookies)
     * @type {getConfig}
     */
    this.load = getConfig;
}