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
import config from "../ConsoleConfig"; //Singleton global config object for commands

export default class ExampleCMD extends LWCommand {
    constructor() {
        super(
            "example",
            "This is an example cmd to explain how commands are implemented",
            "example <param1> <param2>",
            "Trikolon",
            true);
    }

    run(args) {
        if (args.length !== 2) {
            throw new UsageError("Invalid command usage! This message is optional");
        }
        if (args[0] === "bananas") {
            //Commands can also throw other errors, which will be shown in the console
            throw new Error("No bananas allowed!");
        }

        let output = "";

        //Commands can store options in the config object. They are preserved across calls.
        // If the user has cookies enabled they are also preserved across sessions
        // In the future cmds will have their own config-scope so you won't have to mind key-conflicts with
        // other cmds anymore.
        if (config().get("cakeSetting")) {
            output += "Cake for you!\n";
        }
        else {
            output += "Maybe next time!\n";
            config().set("cakeSetting", true);
        }


        // lwConsole.print("If you have an async cmd you can also print messages yourself like this.");

        output += "The return value is the result of the cmd, this message will be displayed in the console"
            + "\nAlso, new lines are supported";

        return output;
    }
}