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

import CommandList from "./CommandList";
import CommandHistory from "./CommandHistory";
import UsageError from "./UsageError";
import config from "./ConsoleConfig";

/**
 * Lightweight Console
 */
export default class LWConsole {

    /**
     *
     * @param consoleDiv dom of div holding the console
     * @param consoleOutDOM dom of text-area for console-output
     * @param consoleInDOM dom of text-input for console-input
     * @param hostname included in motd, may have further use in the future
     */
    constructor(consoleDiv, consoleOutDOM, consoleInDOM, hostname) {
        this.consoleDiv = consoleDiv;
        this.consoleOutDOM = consoleOutDOM;
        this.consoleInDOM = consoleInDOM;
        this.hostname = hostname;
        this.motd = "Welcome to " + hostname + "!\nType 'help' for a list of commands.\n";
        config().set("motd", this.motd);

        this._consoleOut = ""; //Content of console-out text-area
        this._cmdList = new CommandList(this); //Load commands
        this._cmdHistory = new CommandHistory(); //Initialise cmd history (for ARROW_UP support)

        //Attach key handler for cmd-send and cmd-history
        document.addEventListener("keydown", (e) => {
            if (consoleInDOM === document.activeElement) {
                if (e.keyCode === 13) { // enter => send cmd
                    e.preventDefault();
                    let value = consoleInDOM.value;
                    if (value === "") { //Do not trigger cmd when input is empty
                        return;
                    }
                    this.sendCMD(value);
                    consoleInDOM.value = ""; //Empty after cmd sent
                }
                else if (e.keyCode === 38) { //keyup => get last cmd
                    e.preventDefault();
                    let lastCmd = this._cmdHistory.get();
                    if (lastCmd) {
                        consoleInDOM.value = lastCmd;
                    }
                }

            }
        });

        // Focus the console-input whenever the console div is clicked.
        consoleDiv.onclick = function () {
            if (window.getSelection().toString() === "") { //Do not steal focus if user is selecting text
                consoleInDOM.focus();
            }
        };

        //Set initial content of textarea
        this.print(this.motd);
    }


    /**
     * Changes visibility of console-div depending on parameter
     * @param state boolean true = visible; false = hidden
     */
    show(state) {
        if (state) {
            this.consoleDiv.style.display = "flex";
            //Set focus to console
            this.consoleInDOM.focus();
        }
        else {
            this.consoleDiv.style.display = "none";
        }
        config().set("consoleOpen", state === true); // === to filter type
    }

    /**
     * Getter for visibility state
     * @returns {boolean}
     */
    isVisible() {
        return config().get("consoleOpen");
    }

    /**
     * Prints message to console and updates cursor position (scroll)
     * @param str message to print
     */
    print(str) {
        if (str && str !== "") {
            this._consoleOut += str + "\n"; //Append string to print and newline
            this.consoleOutDOM.value = this._consoleOut; //update textarea text
            this.consoleOutDOM.scrollTop = this.consoleOutDOM.scrollHeight; //scroll down in textarea for console-like behavior
        }
    }

    /**
     * Clears console content
     */
    clear() {
        this._consoleOut = "";
        this.consoleOutDOM.value = this._consoleOut;
    }

    /**
     * Executes user cmd and updates output accordingly
     * @param cmd raw cmd by user
     */
    sendCMD(cmd) {
        let splitCMD = cmd.split(" "); //split cmd by space (cmd name, args)
        this.print("> " + cmd); //Print cmd from user
        this._cmdHistory.add(cmd); //Save cmd
        this.print(this.executeCMD(splitCMD)); //Print result of cmd-execution
    }

    /**
     * Takes command as array and calls corresponding cmd-handler on match
     * @param cmdArr command-array. cmd[0] is command name, cmd[>1] is parameter
     * @returns {String} result of command
     */
    executeCMD(cmdArr) {
        let cmdName = cmdArr[0]; //Name
        cmdArr.shift(); //args

        let cmd = this._cmdList.getCommand(cmdName); //Fetch command
        if (!cmd) {
            return "Unknown command.";
        }
        try {
            return cmd.run(cmdArr); //Execute handler with params (cmdArray)
        }
        catch (e) {
            if (e instanceof Error) {
                if (e instanceof UsageError) {
                    return (e.message ? e.message + "\n" : "") +
                        (cmd.usage && cmd.usage !== "" ? "Usage: " + cmd.usage : "Invalid usage.");
                }
                else {
                    return e.name + ": " + e.message;
                }
            }
            else { // This only happens when a command is not throwing an error-object (bad practise)
                console.warn("Command returned invalid error-object", "cmd", cmd, "args", cmdArr);
                console.error(e);
                return "Unknown error in command execution, check console for details";
            }
        }
    }
}