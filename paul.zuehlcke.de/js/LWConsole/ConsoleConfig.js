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
 * Singleton. TODO: doc
 */
class ConsoleConfig extends ConfigStorage {
    constructor() {
        super("consoleConfig", 14, {
            consoleOpen: false,
            flicker: true,
            invert: false
        });
    }

    //TODO: Overwrite store and get to support cmd-scopes
}

let instance;

export default () => {
    if (!instance) {
        instance = new ConsoleConfig();
    }
    return instance;
};
