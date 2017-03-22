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
 * Stores command properties + logic and provides method to query them
 * @param lwConsole reference to console-object, required by some commands
 * @param config reference to configuration object used to store command-states
 * @constructor
 */
function CommandList(lwConsole, config) {
    "use strict";
    //this.getCommandHandler = getCommandHandler; //Currently unused
    this.getCommand = getCommand;

    function getCommandHandler(commandName) {
        let result = getCommand(commandName);
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

    function getCommand(commandName) {
        commandName = commandName.toLowerCase();
        for (let i = 0; i < commands.length; i++) {
            if (commands[i].name === commandName) {
                return commands[i]
            }
        }
    }

    let commands = [
        // {
        //     // ======= Example command to explain cmd implementation
        //     //Identifier of cmd (first arg of user input)
        //     name: "example",
        //     //Description for help-cmd
        //     description: "This is an example cmd to explain how commands are implemented",
        //     //Usage description of command to be printed on UsageError// d
        //     usage: "example <param1> <param2>",
        //     //Should this cmd be visible in the help page? "help example" will always work.
        //     visible: true,
        //     /**
        //      * Handler of command to be executed when cmd.name matches first keyword of user-input
        //      * @param args string-array containing additional arguments provided by user. Example: ["apple", "potato"]
        //      * @returns {string} result message of command to be printed to the console
        //      */
        //     handler: function (args) {
        //         if (args.length !== 2) {
        //             throw new UsageError("Invalid command usage! This message is optional");
        //         }
        //         if (args[0] === "bananas") {
        //             //Commands can also throw other errors, which will be shown in the console
        //             throw new Error("No bananas allowed!");
        //         }
        //
        //         //Commands can store options in the config object. They are preserved across calls.
        //         // If the user has cookies enabled they are also preserved across sessions
        //         // In the future cmds will have their own config-scope so you won't have to mind key-conflicts with
        //         // other cmds anymore.
        //         if (config.get("cakeSetting")) {
        //             lwConsole.print("Cake for you!");
        //         }
        //         else {
        //             lwConsole.print("Maybe next time");
        //             config.store("cakeSetting", true);
        //         }
        //
        //
        //         lwConsole.print("If you have an async cmd you can also print messages yourself like this.");
        //
        //         return "This is the result of the cmd, this message will be displayed in the console"
        //             + "\nAlso, new lines are supported";
        //     }
        // },
        {
            name: "help",
            description: "Shows a list of commands",
            usage: "help [command]",
            visible: true,
            handler: function (args) {
                // let result = new CMDResult();
                if (args.length > 1) {
                    return getCommandHandler("help")(["help"]);
                }
                if (args.length === 0) { //Show list of commands without usage
                    let msg = "Available commands:";
                    for (let i = 0; i < commands.length; i++) {
                        if (commands[i].visible) {
                            msg += "\n" + commands[i].name + ": " + commands[i].description;
                        }
                    }
                    return msg;
                }
                //Show usage for single cmd
                let cmd = getCommand(args[0]);
                if (!cmd) {
                    return "No help page available: Unknown command.";
                }
                return cmd.name + ":" +
                    (cmd.description && cmd.description !== "" ? "\nDescription: " + cmd.description : "") +
                    (cmd.usage && cmd.description !== "" ? "\nUsage: " + cmd.usage : "") +
                    (cmd.author && cmd.author !== "" ? "\nAuthor: " + cmd.author : "");
            }
        },
        {
            name: "motd",
            description: "Shows the message of the day",
            usage: "motd",
            visible: true,
            handler: function () {
                return lwConsole.motd;
            }
        },
        {
            name: "open",
            description: "Opens page from main navigation",
            usage: "open [keybase/github/twitter/email/source]",
            visible: true, //Visible in help page?
            handler: function (args) {
                if (args.length !== 1) {
                    throw new UsageError();
                }
                let urls = {
                    "keybase": "//keybase.io/pbz",
                    "github": "//github.com/Trikolon",
                    "twitter": "//twitter.com/deppaws",
                    "email": "mailto:paul@zuehlcke.de",
                    "source": "//github.com/Trikolon/pbz-uber"
                };
                args[0] = args[0].toLowerCase(); //Ignore case

                if (!urls.hasOwnProperty(args[0])) {
                    throw new UsageError("Sorry, I don't know this service");
                }
                window.open(urls[args[0]]);
                return args[0] + " opened.";
            }
        },
        {
            name: "echo",
            description: "Displays message on console - no pipes yet :-(",
            usage: "echo <message>",
            visible: true,
            handler: function (args) {
                if (!args || args.length === 0) {
                    throw new UsageError();
                }
                return args.join(" ");
            }
        },
        {
            name: "ip",
            description: "Lookup an IP (queries your IP if no argument is provided)",
            usage: "ip [ip]",
            visible: true,
            handler: function (args) {
                let queryUrl = "https://ipinfo.io/";
                if (args.length > 1) {
                    throw new UsageError();
                }

                if (args.length === 1) { //one arg => query arg ip
                    queryUrl += args[0] + "/"
                }

                queryUrl += "json";

                let request = new XMLHttpRequest();
                request.onload = function () {
                    if (request.status !== 200) {
                        lwConsole.print("\nError: ipinfo.io returned code " + request.status);
                    }
                    lwConsole.print(request.responseText);
                };
                request.onerror = function (e) {
                    console.error(e);
                    lwConsole.print("Error: Could not send request to ipinfo.io. Check your internet connection.");
                };
                request.open("GET", queryUrl, true);
                request.send();
                return "Getting data ...";
            }
        },
        {
            name: "calc",
            description: "Calculates a the result of a simple math expression",
            usage: "calc <expression>",
            author: "TheBiochemic",
            visible: true,
            handler: function (args) {
                let expression = args.join("");

                if (args.length > 0) {
                    let expResult = parseExpression(expression);
                    if (expResult === undefined || isNaN(expResult))
                        throw new UsageError("This is not a valid expression!");
                    return expResult.toString();
                }
                else
                    throw new UsageError();

                function parseExpression(expression) {
                    let firstNumber = parseFloat(expression);
                    let iter = 0;

                    //If the expression starts with a legit number -123...
                    if (!isNaN(firstNumber)) {
                        iter++;
                        while (iter < expression.length) {

                            //check until there is an operand -123+...
                            if (isOperand(expression[iter])) {
                                let secondNumber = parseExpression(expression.substring(iter + 1, expression.length));
                                return operate(firstNumber, secondNumber, expression[iter]);

                            }
                            iter++;
                        }
                        return firstNumber;
                    }

                    //if the expression starts with (...
                    if (isNaN(firstNumber) && expression[iter] === "(") {
                        let level = 0;
                        iter++;
                        while (iter < expression.length) {
                            //if it finds another ( -> (123+(...
                            if (expression[iter] === "(") {
                                level++;
                            }
                            if (expression[iter] === ")") {
                                if (level === 0) {
                                    return parseExpression(expression.substring(1, iter));
                                }
                                level--
                            }
                            iter++;
                        }
                    }
                }

                function isOperand(character) {
                    return character === "+" ||
                        character === "-" ||
                        character === "*" ||
                        character === "/" ||
                        character === "^";
                }

                function operate(firstNumber, secondNumber, operator) {
                    switch (operator) {
                        case "+":
                            return firstNumber + secondNumber;
                        case "-":
                            return firstNumber - secondNumber;
                        case "*":
                            return firstNumber * secondNumber;
                        case "/":
                            return firstNumber / secondNumber;
                        case "^":
                            return Math.pow(firstNumber, secondNumber);
                    }
                }
            }
        },
        {
            name: "time",
            description: "Show time in different formats",
            usage: "time <utc/local/unix>",
            visible: true,
            handler: function (args) {
                let date = new Date();
                let found = true;

                if (args && args.length === 1) {
                    switch (args[0].toLowerCase()) {
                        case "utc":
                            date = date.toUTCString();
                            break;
                        case "local":
                            date = date.toLocaleString();
                            break;
                        case "unix":
                            date = Math.floor(date / 1000);
                            break;
                        default:
                            found = false;
                    }
                }
                else {
                    found = false;
                }
                if (!found) {
                    throw new UsageError();
                }
                return date;
            }
        },
        {
            name: "effect",
            description: "Toggle effects, such as invert and flicker",
            usage: "effect <flicker|invert> [true|false]",
            visible: true,
            handler: function (args) {
                function setEffect(effect, state) {
                    switch (effect) {
                        case "invert": {
                            let invertStr;
                            if (state) {
                                invertStr = "100%";
                            }
                            else {
                                invertStr = "0%";
                            }
                            document.getElementById("content").style.filter = "invert(" + invertStr + ")";
                            break;
                        }
                        case "flicker": {
                            let contentDom = document.getElementById("content");
                            let containsClass = contentDom.className.indexOf("monitor") !== -1;
                            if (state) {
                                if (!containsClass) {
                                    contentDom.className += "monitor";
                                }
                            }
                            else {
                                if (containsClass) {
                                    contentDom.className =
                                        contentDom.className.replace(/(?:^|\s)monitor(?!\S)/g, '');
                                }
                            }
                            break;
                        }
                        default: {
                            throw new UsageError();
                        }
                    }
                }

                let state; // boolean state to change effect to
                if (!args || args.length === 0 || args.length > 2) {
                    throw new UsageError();
                }
                args[0] = args[0].toLowerCase();

                if (args.length === 1) { //Toggle
                    state = config.get(args[0]);
                    state = !state;
                }
                else { // State overwrite
                    state = args[1] === "true";
                }
                setEffect(args[0], state); //this can throw usage-error (caught by execution handler)

                config.store(args[0], state);
                return "Effect " + args[0] + " turned " + (state ? "ON" : "OFF");
            }
        },
        {
            name: "clear",
            description: "Clears the console",
            usage: "clear",
            visible: true, //Visible in help page?
            handler: function () {
                lwConsole.clear();
            }
        },
        {
            name: "exit",
            description: "Exit console",
            usage: "exit",
            visible: true,
            handler: function () {
                util.toggleConsole();
            }
        },
        {
            name: "kleinhase",
            description: "Secret message",
            usage: "kleinhase",
            visible: false,
            handler: function () {
                return "<3";
            }
        },
        {
            name: "shutdown",
            description: "",
            usage: "shutdown",
            visible: false,
            handler: function () {
                return "You're not my master!";
            }
        },
        {
            name: "make_me_a_sandwich",
            description: "<3 xkcd",
            usage: "make_me_a_sandwich",
            visible: false,
            handler: function () {
                return "Make it yourself!";
            }
        },
        {
            name: "rm",
            description: "",
            usage: "rm",
            visible: false,
            handler: function () {
                return "Please don't delete anything. We don't have backups.";
            }
        },
        {
            name: "ls",
            description: "",
            usage: "ls",
            visible: false,
            handler: function () {
                return "cia_secrets, cute_cat_gifs, videos, passwords.txt";
            }
        },
        {
            name: "ridb",
            description: "A simple command that confirms that Robert is the best.",
            usage: "ridb [response]",
            author: "Endebert",
            visible: false,
            handler: function (args) {
                let output = "Paul:\t'Robert ist der Beste!'";
                if (args.length > 0)
                    output += "\nRobert:\t'" + args.join(" ") + "'";
                else {
                    output += "\nThere was no response...";
                }
                return output;
            }
        }
    ];
}
