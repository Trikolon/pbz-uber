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
 * @constructor
 */
function CommandList(lwConsole) {
    "use strict";
    //this.getCommandHandler = getCommandHandler; //Currently unused
    this.getCommand = getCommand;
    let ERROR = CMDResult.prototype.ERROR_TYPE;
    let EFFECT = LWConsole.prototype.EFFECT_TYPE;

    function getCommandHandler(commandName) {
        let result = getCommand(commandName);
        if (result) {
            return result.handler;
        }
        else {
            //No matching command found
            return function () {
                return new CMDResult("Unknown command"); //No error, unknown-cmd is success. Feels weird, doesn't it?
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
        {
            name: "help",
            description: "Shows a list of commands",
            usage: "help [command]",
            visible: true,
            handler: function (args) {
                let result = new CMDResult();
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
                    result.value = msg;
                }
                else { //Show usage for single cmd
                    let cmd = getCommand(args[0]);
                    if (!cmd) {
                        result.value = "No help page available: Unknown command.";
                    }
                    else {
                        result.value = cmd.name + ":\nDescription: " + cmd.description + "\nUsage: " + cmd.usage;
                    }
                }
                return result;
            }
        },
        {
            name: "motd",
            description: "Shows the message of the day",
            usage: "motd",
            visible: true,
            handler: function () {
                return new CMDResult(lwConsole.motd);
            }
        },
        {
            name: "open",
            description: "Opens page from main navigation",
            usage: "open [keybase/github/twitter/email]",
            visible: true, //Visible in help page?
            handler: function (args) {
                if (args.length !== 1) {
                    return new CMDResult(undefined, ERROR.USAGE);
                }
                let url;
                switch (args[0]) {
                    default:
                        return "Sorry, I don't know this service";
                    case "keybase":
                        url = "//keybase.io/pbz";
                        break;
                    case "github":
                        url = "//github.com/Trikolon";
                        break;
                    case "twitter":
                        url = "//twitter.com/deppaws";
                        break;
                    case "email":
                        url = "mailto:paul@zuehlcke.de";
                        break;
                }
                window.open(url);
                return new CMDResult(args[0] + " opened.");
            }
        },
        {
            name: "echo",
            description: "Displays message on console - no pipes yet :-(",
            usage: "echo <message>",
            visible: true,
            handler: function (args) {
                if (!args || args.length === 0) {
                    return new CMDResult(undefined, ERROR.USAGE);
                }

                let init = true;
                let str = "";

                for (let i = 0; i < args.length; i++) {
                    if (!init) {
                        str += " ";
                    }
                    init = false;
                    str += args[i];
                }
                return new CMDResult(str);
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
                    return new CMDResult(undefined, ERROR.USAGE);
                }
                else {
                    if (args.length === 1) { //one arg => query arg ip
                        queryUrl += args[0] + "/"
                    }
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
                return new CMDResult("Getting data ...");
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
                    return new CMDResult(undefined, ERROR.USAGE);
                }
                else {
                    return new CMDResult(date);
                }
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
                        case EFFECT.INVERT: {
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
                        case EFFECT.FLICKER: {
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
                            throw "Invalid effect";
                        }
                    }
                }

                let state; // boolean state to change effect to
                if (!args || args.length === 0 || args.length > 2) {
                    return new CMDResult(undefined, ERROR.USAGE);
                }
                let effectType;
                switch (args[0].toLowerCase()) {
                    case "invert":
                        effectType = EFFECT.INVERT;
                        break;
                    case "flicker":
                        effectType = EFFECT.FLICKER;
                        break;
                    default:
                        return new CMDResult(undefined, ERROR.USAGE);
                }

                if (args.length === 1) { //Toggle
                    state = Cookies.get(args[0]) === "true";
                    state = !state;
                }
                else { // State overwrite
                    state = args[1] === "true";
                }
                try {
                    setEffect(effectType, state);
                }
                catch (e) {
                    return new CMDResult(undefined, ERROR.USAGE);
                }
                Cookies.set(args[0], state ? "true" : "false", {expires: 7}); //Save new state
                return new CMDResult("Effect " + args[0] + " turned " + (state ? "ON" : "OFF"));
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
                return new CMDResult("<3");
            }
        },
        {
            name: "shutdown",
            description: "",
            usage: "shutdown",
            visible: false,
            handler: function () {
                return new CMDResult("You're not my master!");
            }
        },
        {
            name: "make_me_a_sandwich",
            description: "<3 xkcd",
            usage: "make_me_a_sandwich",
            visible: false,
            handler: function () {
                return new CMDResult("Make it yourself!");
            }
        },
        {
            name: "rm",
            description: "",
            usage: "rm",
            visible: false,
            handler: function () {
                return new CMDResult("Please don't delete anything. We don't have backups.");
            }
        },
        {
            name: "ls",
            description: "",
            usage: "ls",
            visible: false,
            handler: function () {
                return new CMDResult("cia_secrets, cute_cat_gifs, videos, passwords.txt");
            }
        }
    ];
}
