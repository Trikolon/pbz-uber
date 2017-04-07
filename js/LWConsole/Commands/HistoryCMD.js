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

import LWCommand from "../LWCommand";
import UsageError from "../UsageError";

export default class HistoryCMD extends LWCommand {
    constructor(cmdHistory, sendCmd) {
        super(
            "history",
            "Shows command history or executes command by index",
            "[index]",
            "Trikolon",
            true);
        this._cmdHistory = cmdHistory;
        this._sendCmd = sendCmd;
    }

    run(args) {
        if (args.length === 0) {
            if (this._cmdHistory) {
                let result = "";
                let history = this._cmdHistory.get();
                for (let i = 0; i < history.length; i++) {
                    result += i + 1 + ": " + history[i];
                    if (i !== history.length - 1) {
                        result += "\n";
                    }
                }
                return result;
            }
            else {
                return "No entries";
            }
        }
        else if (args.length === 1) {
            let index;
            try {
                index = parseInt(args[0], 10);
            }
            catch (e) { // Catch this to mask error
                throw new UsageError("Index must be number");
            }
            index--;
            if (index >= 0 && index < this._cmdHistory.get().length) {
                this._sendCmd(this._cmdHistory.get(index));
            }
            else {
                throw new UsageError("Index out of bounds");
            }
        }
        else {
            throw new UsageError();
        }
    }
}