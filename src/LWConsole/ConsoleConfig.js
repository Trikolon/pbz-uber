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

import ConfigStorage from "../Config/LocalStorageConfig";

/**
 * Singleton, holds populated config for console.
 * Could be extended in the future to support cmd-scopes.
 */
class ConsoleConfig extends ConfigStorage {
}

const instance = {
    default: undefined,
    custom: {}
};

export default (key) => {
    if (key) {
        if (!instance.custom.hasOwnProperty(key)) {
            instance.custom[key] = new ConsoleConfig(key);
        }
        return instance.custom[key];
    }
    else {
        if (!instance.default) {
            instance.default = new ConsoleConfig();
        }
        return instance.default;
    }

};
