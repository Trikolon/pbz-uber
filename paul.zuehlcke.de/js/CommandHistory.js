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
 * Class CommandHistory
 * Stores last <size> commands in buffer
 * @param size amount of commands to store in buffer
 * @constructor
 */
export default class CommandHistory {

    constructor(size = 20) {
        this.size = size;
        this._history = new Array(size);
        this._writePos = 0;
        this._readPos = 0;
    }

    /**
     * Get command in cmd history, goes one back in history every call
     * @returns{String} cmd
     */
    get() {
        let result = this._history[this._readPos];
        this._readPos--;
        if (this._readPos === -1) {
            this._readPos = this.size - 1;
        }
        if (typeof this._history[this._readPos] === "undefined") { //if history-array is not completely filled yet
            this._readPos = this._writePos === 0 ? this.size - 1 : this._writePos - 1;
        }
        return result;
    }

    /**
     * Add command to history array
     * @param cmd
     */
    add(cmd) {
        if (typeof cmd !== "undefined") {
            this._readPos = this._writePos; //On cmd-add, reset readpos
            this._history[this._writePos] = cmd;
            this._writePos++;
            if (this._writePos === this.size) {
                this._writePos = 0;
            }
        }
    }
}