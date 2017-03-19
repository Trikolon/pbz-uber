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
function CommandHistory(size) {
    if (!size) {
        size = 20; //default
    }
    let history = new Array(size);
    let writePos = 0;
    let readPos = 0;
    let s = size;

    this.get = get;

    /**
     * Get command in cmd history, goes one back in history every call
     * @returns{String} cmd
     */
    function get() {
        let result = history[readPos];
        readPos--;
        if (readPos === -1) {
            readPos = s - 1;
        }
        if (typeof history[readPos] === "undefined") { //if history-array is not completely filled yet
            readPos = writePos === 0 ? s - 1 : writePos - 1;
        }
        return result;
    }

    /**
     * Add command to history array
     * @param cmd
     */
    this.add = function (cmd) {
        if (typeof cmd !== "undefined") {
            readPos = writePos; //On cmd-add, reset readpos
            history[writePos] = cmd;
            writePos++;
            if (writePos === s) {
                writePos = 0;
            }
        }
    };
}