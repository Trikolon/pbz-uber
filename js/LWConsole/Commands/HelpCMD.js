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

export default class HelpCMD extends LWCommand {
    constructor(cmdList) {
        super("help", "Shows a list of commands", "[command]", "Trikolon", true);
        this.cmdList = cmdList;
    }

    run(args) {
        if (args.length > 1) {
            return this.cmdList.getCommandHandler("help")(["help"]);
        }
        if (args.length === 0) { //Show list of commands without usage
            const commands = this.cmdList.getOrderedList();
            let msg = "Available commands:";
            for (let i = 0; i < commands.length; i++) {
                if (commands[i].visible) {
                    msg += `\n ${commands[i].name}: ${commands[i].description}`;
                }
            }
            return msg;
        }
        //Show usage for single cmd
        const cmd = this.cmdList.getCommand(args[0]);
        if (!cmd) {
            return "No help page available: Unknown command.";
        }
        return `${cmd.name}:${(cmd.description && cmd.description !== "" ? `\nDescription: ${cmd.description}` : "")}${(cmd.usage && cmd.description !== "" ? `\nUsage: ${cmd.name} ${cmd.usage}` : "")}${(cmd.author && cmd.author !== "" ? `\nAuthor: ${cmd.author}` : "")}`;
    }
}