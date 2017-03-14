/**
 * Created by paul on 13.03.17.
 */
"use strict";

/**
 * Lightweight Console
 *
 * @param consoleDiv dom of div holding the console
 * @param consoleOutDOM dom of text-area for console-output
 * @param consoleInDOM dom of text-input for console-input
 * @param hostname included in motd, may have further use in the future
 * @constructor
 */
function LWConsole(consoleDiv, consoleOutDOM, consoleInDOM, hostname) {
    let consoleOut = "";
    this.motd = "Welcome to " + hostname + "!\nType 'help' for help.\n";
    let cmdList = new CommandList(this);
    let cmdHistory = new CommandHistory();
    //bind methods called in CommandList to console
    this.print = print;
    this.clear = clear;

    //Get initial state depending on dom
    let visible = window.getComputedStyle(consoleDiv).getPropertyValue("display") === "flex";

    //Attach key handler for cmd-send and cmd-history
    document.addEventListener("keydown", function (e) {
        if (consoleInDOM === document.activeElement) {
            if (e.keyCode == 13) { // enter => send cmd
                e.preventDefault();
                let value = consoleInDOM.value;
                if (value === "") { //Do not trigger cmd when input is empty
                    return;
                }
                sendCMD(value);
                consoleInDOM.value = ""; //Empty after cmd sent
            }
            else if (e.keyCode == 38) { //keyup => get last cmd
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
        if (window.getSelection().toString() == "") { //Do not steal focus if user is selecting text
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
            visible = true;
            //Set focus to console
            consoleInDOM.focus();
        }
        else {
            consoleDiv.style.display = "none";
            visible = false;
        }
    };

    /**
     * Getter for visibility state
     * @returns {boolean}
     */
    this.isVisible = function () {
        return visible;
    };

    /**
     * Prints message to console and updates cursor position (scroll)
     * @param str message to print
     */
    function print(str) {
        if (str) {
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
     * @param cmd command-array. cmd[0] is command name, cmd[>1] is parameter
     * @returns {String} result of command
     */
    function executeCMD(cmd) {
        let cmdName = cmd[0]; //Name
        cmd.shift(); //args
        try {
            return cmdList.getCommandHandler(cmdName)(cmd);
        }
        catch (e) {
            console.error(e);
            return "Error in command execution. Check browser console for details.";
        }
    }
}

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
            readPos = writePos === 0 ? s - 1 : writePos - 1
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