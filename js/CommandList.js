/**
 * Created by pbz on 12.03.17.
 */
"use strict";

function CommandList(console) {
    let isInverted = false;

    this.getCommandHandler = function (commandName) {
        commandName = commandName.toLowerCase();
        for (let i = 0; i < commands.length; i++) {
            if (commands[i].name == commandName) {
                return commands[i].handler;
            }
        }

        //No matching command found
        return function () {
            return "Unknown command.";
        }
    };

    let commands = [
        {
            name: "help",
            description: "Shows a list of commands",
            visible: true,
            handler: function () {
                let msg = "Available commands:";
                for (let i = 0; i < commands.length; i++) {
                    if (commands[i].visible) {
                        msg += "\n" + commands[i].name + ": " + commands[i].description;
                    }
                }
                return msg;
            }
        },
        {
            name: "motd",
            description: "Shows the message of the day",
            visible: true,
            handler: function () {
                return console.motd;
            }
        },
        {
            name: "open",
            description: "Usage: open [keybase/github/twitter/email]",
            visible: true, //Visible in help page?
            handler: function (args) {
                if (args.length !== 1) {
                    return "Invalid arguments!";
                }
                let url;
                switch (args[0]) {
                    default:
                        return "Sorry, I don't know this service";
                        break;
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
                return args[0] + " opened.";
            }
        },
        {
            name: "echo",
            description: "Displays message on console - no pipes yet :-(",
            visible: true,
            handler: function (args) {
                let init = true;
                let str = "";

                for (let i = 0; i < args.length; i++) {
                    if (!init) {
                        str += " ";
                    }
                    init = false;
                    str += args[i];
                }
                return str;
            }
        },
        {
            name: "ip",
            description: "Lookup an IP: Usage: ip [ip] (queries your IP if no argument is provided)",
            visible: true,
            handler: function (args) {
                let queryUrl = "https://ipinfo.io/";

                if (args.length > 1) {
                    return "Invalid Syntax! ip [addr]";
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
                        console.print("\nError: ipinfo.io returned code " + request.status);
                    }
                    console.print(request.responseText);
                };
                request.onerror = function (e) {
                    console.error(e);
                    console.print("Error: Could not send request to ipinfo.io. Check your internet connection.");
                };
                request.open("GET", queryUrl, true);
                request.send();
                return "Getting data ...";
            }
        },
        {
            name: "time",
            description: "Show time in different formats",
            visible: true,
            handler: function (args) { //TODO: support more arguments / extend functionality
                let date = new Date();
                let found = true;

                if (args && args.length == 1) {
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
                    return "Usage: time [utc/local/unix]";
                }
                else {
                    return date;
                }
            }
        },
        {
            name: "invert",
            description: "Invert website colors",
            visible: true,
            handler: function () {
                function invert(state) {
                    let invertStr;
                    if (state) {
                        invertStr = "100%";
                    }
                    else {
                        invertStr = "0%";
                    }
                    document.getElementById("monitor").style.filter = "invert(" + invertStr + ")";
                }

                isInverted = !isInverted;
                invert(isInverted);
                return "Page inverted!";
            }
        },
        {
            name: "clear",
            description: "Clears the console",
            visible: true, //Visible in help page?
            handler: function () {
                console.clear();
            }
        },
        {
            name: "exit",
            description: "Exit console",
            visible: true,
            handler: function () {
                util.toggleConsole();
            }
        },
        {
            name: "kleinhase",
            description: "Secret message",
            visible: false,
            handler: function () {
                return "<3";
            }
        },
        {
            name: "shutdown",
            description: "",
            visible: false,
            handler: function () {
                return "You're not my master!";
            }
        },
        {
            name: "make_me_a_sandwich",
            description: "<3 xkcd",
            visible: false,
            handler: function () {
                return "Make it yourself!";
            }
        },
        {
            name: "rm",
            description: "",
            visible: false,
            handler: function () {
                return "Please don't delete anything. We don't have backups.";
            }
        },
        {
            name: "ls",
            description: "",
            visible: false,
            handler: function () {
                return "cia_secrets, cute_cat_gifs, videos, passwords.txt";
            }
        }
    ];
}
