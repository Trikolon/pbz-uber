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

import LWCommandSimple from "./LWCommandSimple";
import HelpCMD from "./Commands/HelpCMD";
import OpenCMD from "./Commands/OpenCMD";
import EchoCMD from "./Commands/EchoCMD";
import IpCMD from "./Commands/IpCMD";
import CalcCMD from "./Commands/CalcCMD";
import TimeCMD from "./Commands/TimeCMD";
import EffectCMD from "./Commands/EffectCMD";
import ConvertCMD from "./Commands/ConvertCMD";
import WikiCMD from "./Commands/WikiCMD";
import HistoryCMD from "./Commands/HistoryCMD";
import RawCMD from "./Commands/RawCMD";

/**
 * Stores command properties + logic and provides method to query them.
 */
export default class CommandList {
    //TODO: Add methods for adding new commands to the list + removing existing ones (on runtime)

    /**
     * @param {LWConsole} lwConsole - reference to console-object, required by some commands.
     * @constructor
     */
    constructor(lwConsole) {
        this._lwConsole = lwConsole;

        //Init cmds
        // TODO: Commands should be sorted alphabetically from the beginning
        this._commands = [
            new HelpCMD(this),
            new OpenCMD(),
            new EchoCMD(),
            new HistoryCMD(this._lwConsole.cmdHistory, (cmdString) => {
                this._lwConsole.sendCMD(cmdString);
            }),
            new IpCMD((str) => { //wrapped in anonymous function to prevent this-rebind
                this._lwConsole.print(str)
            }),
            new TimeCMD(),
            new CalcCMD(),
            new ConvertCMD((str) => { //do the same like at IPCmd
                this._lwConsole.print(str)
            }),
            new WikiCMD((str) => { //do the same like at IPCmd
                this._lwConsole.print(str)
            }),
            new EffectCMD(),
            new RawCMD(),

            new LWCommandSimple("motd", "Shows the message of the day", undefined, "Trikolon", true, () => lwConsole.motd),
            new LWCommandSimple("clear", "Clears the console", undefined, "Trikolon", true, () => {
                lwConsole.clear();
            }),
            new LWCommandSimple("exit", "Exit console", undefined, "Trikolon", true, () => {
                lwConsole.show(false);
            }),
            new LWCommandSimple("ridb", "A simple command that confirms that Robert is the best.", "[reply]",
                "Endebert", false,
                (args) => {
                    let output = "Paul:\t'Robert ist der Beste!'";
                    if (args.length > 0)
                        output += `\nRobert:\t'${args.join(" ")}'`;
                    else {
                        output += "\nThere was no response...";
                    }
                    return output;
                }),
            new LWCommandSimple("kleinhase", "Secret message", undefined, "Trikolon", false, "<3"),
            new LWCommandSimple("shutdown", "Halt, power-off or reboot the machine", undefined, "Trikolon", false,
                "You're not my master!"),
            new LWCommandSimple("rm", "remove files or directories", undefined, "Trikolon", false,
                "Please don't delete anything. We don't have backups."),
            new LWCommandSimple("ls", "list directory contents", undefined, "Trikolon", false,
                "cia_secrets, cute_cat_gifs, videos, passwords.txt")
        ];

        // Check command list for duplicate keys
        const duplicates = this._checkDuplicateKeys();
        if (duplicates.length > 0) {
            throw new Error(`Duplicate command key/s! There are commands with the same name: ${duplicates}`);
        }
    }

    /**
     * Checks command list for duplicates (two or more commands with the same name).
     * @returns {String[]} - List of duplicate command names found, can be empty.
     * @private
     */
    _checkDuplicateKeys() {
        const sorted = this.getOrderedList();
        const duplicates = [];
        for (let i = 0; i < sorted.length; i++) {
            if (i < sorted.length - 1 && sorted[i].name === sorted[i + 1].name) {
                const currDup = sorted[i].name;
                duplicates.push(currDup);
                while (i < sorted.length && currDup === sorted[i + 1].name) {
                    i++; //Skip next commands if they're also duplicates of current command
                }
            }
        }
        return duplicates;
    }

    get lwConsole() {
        return this._lwConsole;
    }


    /**
     * Get list of commands ordered alphabetically by command name
     * @returns {Array.<LWCommand>} - Copy of command array, sorted
     */
    getOrderedList() {
        return this._commands.slice().sort((a, b) => a.name.localeCompare(b.name));
    }


    /**
     * Searches command list for command matching commandName.
     * @param {String} commandName - Command name to search for.
     * @returns {function} - Matching command handler function or unknown-command handler.
     */
    getCommandHandler(commandName) {
        const result = this.getCommand(commandName);
        if (result) {
            return result.handler;
        }
        else {
            //No matching command found
            return function () {
                return "Unknown command"; //No error, unknown-cmd is success. Feels weird, doesn't it?
            }
        }
    }

    /**
     * Searches command list for command matching commandName.
     * @param {String} commandName  - Command name to search for.
     * @returns {undefined | LWCommand} Returns matching command or undefined if no match.
     */
    getCommand(commandName) {
        commandName = commandName.toLowerCase();
        for (let i = 0; i < this._commands.length; i++) {
            if (this._commands[i].name === commandName) {
                return this._commands[i]
            }
        }
    }

    /**
     * Searches command list for commands which names start with str.
     * @param {String} str - String to match with.
     * @returns {Array} - Array of suitable commands.
     */
    getMatchingCommands(str) {
        str = str.toLowerCase();
        const cmdList = [];
        for (let i = 0; i < this._commands.length; i++) {
            if (this._commands[i].name.startsWith(str)) {
                cmdList.push(this._commands[i]);
            }
        }
        return cmdList;
    }
}
