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
import MotdCMD from "./Commands/MotdCMD";
import HelpCMD from "./Commands/HelpCMD";
import OpenCMD from "./Commands/OpenCMD";
import EchoCMD from "./Commands/EchoCMD";
import IpCMD from "./Commands/IpCMD";
import CalcCMD from "./Commands/CalcCMD";
import TimeCMD from "./Commands/TimeCMD";
import EffectCMD from "./Commands/EffectCMD";
import ClearCMD from "./Commands/ClearCMD";
import ExitCMD from "./Commands/ExitCMD";

/**
 * Stores command properties + logic and provides method to query them
 * @param lwConsole reference to console-object, required by some commands
 * @param config reference to configuration object used to store command-states
 * @constructor
 */
export default class CommandList {

    constructor(lwConsole, config) {
        this._lwConsole = lwConsole;
        this._config = config;

        //Init cmds
        this._commands = [
            new MotdCMD(),
            new HelpCMD(this),
            new OpenCMD(),
            new EchoCMD(),
            new IpCMD((str) => { //wrapped in anonymous function to prevent this-rebind
                this._lwConsole.print(str)
            }),
            new TimeCMD(),
            new CalcCMD(),
            new EffectCMD(),
            new ClearCMD(() => {
                this._lwConsole.clear()
            }),
            new ExitCMD(() => {
                this._lwConsole.show(false)
            }),

            //Some simple commands
            new LWCommandSimple("ridb", "A simple command that confirms that Robert is the best.", "Endebert", false,
                (args) => {
                    let output = "Paul:\t'Robert ist der Beste!'";
                    if (args.length > 0)
                        output += "\nRobert:\t'" + args.join(" ") + "'";
                    else {
                        output += "\nThere was no response...";
                    }
                    return output;
                }),
            new LWCommandSimple("kleinhase", "Secret message", "Trikolon", false, "<3"),
            new LWCommandSimple("shutdown", "Halt, power-off or reboot the machine", "Trikolon", false, "You're not my master!"),
            new LWCommandSimple("rm", "remove files or directories", "Trikolon", false, "Please don't delete anything. We don't have backups."),
            new LWCommandSimple("ls", "list directory contents", "Trikolon", false, "cia_secrets, cute_cat_gifs, videos, passwords.txt")

        ];
    }

    get lwConsole() {
        return this._lwConsole;
    }

    get config() {
        return this._config;
    }

    //this.getCommandHandler = getCommandHandler; //Currently unused
    // this.getCommand = getCommand;

    getCommandHandler(commandName) {
        let result = this.getCommand(commandName);
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

    getCommand(commandName) {
        commandName = commandName.toLowerCase();
        for (let i = 0; i < this._commands.length; i++) {
            if (this._commands[i].name === commandName) {
                return this._commands[i]
            }
        }
    }
}