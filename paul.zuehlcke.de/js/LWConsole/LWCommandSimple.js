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

/**
 * Simple command type that only returns string
 */
export default class LWCommandSimple extends LWCommand {

    constructor(name, description, author, visible, handler) {
        super(name, description, undefined, author, visible);
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