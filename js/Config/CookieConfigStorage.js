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
import Cookies from "js-cookie";

/**
 * Implements methods save and load from ConfigStorage to manage config-object in the cookies
 */
export default class CookieConfigStorage extends ConfigStorage {

    /**
     * Trigger config refresh (reload from cookies)
     * @private
     * @return {undefined}
     */
    _loadConfig() {
        try {
            const result = Cookies.getJSON(this.name);
            if (typeof result === "undefined") {
                this._resetConfig();
            }
            else {
                this._config = result;
            }
        }
        catch (e) {
            console.error("ConfigStorage: Error while getting config from cookies");
            this._resetConfig();
        }
    }

    /**
     * Store in cookies
     * @private
     * @return {undefined}
     */
    _saveConfig() {
        Cookies.set(this.name, this._config, {expires: this.expiryTime});
    }
}