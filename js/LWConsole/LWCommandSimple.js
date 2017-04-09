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

import LWCommand from "./LWCommand";

export default class LWCommandSimple extends LWCommand {

    /**
     * LWConsole Simple Command class for less complex commands
     * @param {String} name - See @link{LWCommand}
     * @param {String} description
     * @param {String} usage
     * @param {String} author
     * @param {boolean} visible
     * @param {function || String} handler "run"-handler or static return string handler
     */
    constructor(name, description, usage, author, visible, handler) {
        super(name, description, usage, author, visible);
        if (typeof handler === "string") {
            this.run = function () {
                return handler
            }
        }
        else {
            this.run = handler;
        }
    }
}