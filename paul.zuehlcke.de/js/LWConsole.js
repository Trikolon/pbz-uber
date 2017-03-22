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
 * Lightweight Console
 *
 * @param config pulled from cookies, holds state of effects + console open state
 * @param consoleDiv dom of div holding the console
 * @param consoleOutDOM dom of text-area for console-output
 * @param consoleInDOM dom of text-input for console-input
 * @param hostname included in motd, may have further use in the future
 * @constructor
 */
function LWConsole(config, consoleDiv, consoleOutDOM, consoleInDOM, hostname) {
    "use strict";

    let consoleOut = ""; //Content of console-out text-area
    let cmdList = new CommandList(this, config); //Load commands
    let cmdHistory = new CommandHistory(); //Initialise cmd history (for ARROW_UP support)

    this.motd = "Welcome to " + hostname + "!\nType 'help' for help.\n";
    //bind methods called in CommandList to console
    this.print = print;
    this.clear = clear;
    this.executeCmd = executeCMD; //Allow external cmd calls

    //Attach key handler for cmd-send and cmd-history
    document.addEventListener("keydown", function (e) {
        if (consoleInDOM === document.activeElement) {
            if (e.keyCode === 13) { // enter => send cmd
                e.preventDefault();
                let value = consoleInDOM.value;
                if (value === "") { //Do not trigger cmd when input is empty
                    return;
                }
                sendCMD(value);
                consoleInDOM.value = ""; //Empty after cmd sent
            }
            else if (e.keyCode === 38) { //keyup => get last cmd
                e.preventDefault();
                let lastCmd = cmdHistory.get();
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
    print(this.motd);


    //Methods ======================================
    /**
     * Changes visibility of console-div depending on parameter
     * @param state boolean true = visible; false = hidden
     */
    this.show = function (state) {
        if (state) {
            consoleDiv.style.display = "flex";
            //Set focus to console
            consoleInDOM.focus();
        }
        else {
            consoleDiv.style.display = "none";
        }
        config.store("consoleOpen", state === true); // === to filter type
    };

    /**
     * Getter for visibility state
     * @returns {boolean}
     */
    this.isVisible = function () {
        return config.get("consoleOpen");
    };

    /**
     * Prints message to console and updates cursor position (scroll)
     * @param str message to print
     */
    function print(str) {
        if (str && str !== "") {
            consoleOut += str + "\n"; //Append string to print and newline
            consoleOutDOM.value = consoleOut; //update textarea text
            consoleOutDOM.scrollTop = consoleOutDOM.scrollHeight; //scroll down in textarea for console-like behavior
        }
    }

    /**
     * Clears console content
     */
    function clear() {
        consoleOut = "";
        consoleOutDOM.value = consoleOut;
    }

    /**
     * Executes user cmd and updates output accordingly
     * @param cmd raw cmd by user
     */
    function sendCMD(cmd) {
        let splitCMD = cmd.split(" "); //split cmd by space (cmd name, args)
        print("> " + cmd); //Print cmd from user
        cmdHistory.add(cmd); //Save cmd
        print(executeCMD(splitCMD)); //Print result of cmd-execution
    }

    /**
     * Takes command as array and calls corresponding cmd-handler on match
     * @param cmdArr command-array. cmd[0] is command name, cmd[>1] is parameter
     * @returns {String} result of command
     */
    function executeCMD(cmdArr) {
        let cmdName = cmdArr[0]; //Name
        cmdArr.shift(); //args

        let cmd = cmdList.getCommand(cmdName); //Fetch command
        if (!cmd) {
            return "Unknown command.";
        }
        try {
            return cmd.handler(cmdArr); //Execute handler with params (cmdArray)
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

/**
 * Custom error type which inherits from Error. To be thrown on invalid command usage.
 * @param message optional
 * @constructor
 */
function UsageError(message) {
    this.name = "UsageError";
    this.message = message;
    this.stack = (new Error()).stack;
}
UsageError.prototype = new Error;