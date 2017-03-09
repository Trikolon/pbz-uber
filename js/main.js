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
    let motd = "Welcome to " + hostname + "!\nType 'help' for help.\n";
    let isInverted = false;
    let commands = [
        {
            name: "help",
            description: "Shows a list of commands",
            visible: true,
            handler: helpCMD
        },
        {
            name: "motd",
            description: "Shows the message of the day",
            visible: true,
            handler: function () {
                return motd;
            }
        },
        {
            name: "echo",
            description: "Displays message on console - no pipes yet :-(",
            visible: true,
            handler: echoCMD
        },
        {
            name: "ip",
            description: "Lookup an IP: Usage: ip [ip] (queries your IP if no argument is provided)",
            visible: true,
            handler: ipCMD
        },
        {
            name: "invert",
            description: "Invert website colors",
            visible: true,
            handler: function () {
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
                consoleOut = "";
                consoleOutDOM.value = consoleOut;
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
        }
    ];

    //Get initial state depending on dom
    this.visible = window.getComputedStyle(consoleDiv).getPropertyValue("display") === "flex";

    //Attach key handler to enter key
    document.addEventListener("keydown", function (e) {
        if (consoleInDOM === document.activeElement && e.keyCode == 13) {
            e.preventDefault();
            let value = consoleInDOM.value;
            if (value === "") { //Do not trigger cmd when input is empty
                return;
            }
            sendCMD(value);
            consoleInDOM.value = ""; //Empty after cmd sent
        }
    });

    //Set initial content of textarea
    print(motd);


    //Methods ======================================
    /**
     * Changes visibility of console-div depending on parameter
     * @param state boolean true = visible; false = hidden
     */
    this.show = function (state) {
        if (state) {
            consoleDiv.style.display = "flex";
            this.visible = true;
            //Set focus to console
            consoleInDOM.focus();
        }
        else {
            consoleDiv.style.display = "none";
            this.visible = false;
        }
    };

    /**
     * Getter for visibility state
     * @returns {boolean}
     */
    this.isVisible = function () {
        return this.visible;
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
     * Executes user cmd and updates output accordingly
     * @param cmd raw cmd by user
     */
    function sendCMD(cmd) {
        let splitCMD = cmd.split(" "); //split cmd by space (cmd name, args)
        print("> " + cmd); //Print cmd from user
        print(executeCMD(splitCMD)); //Print result of cmd-execution
    }

    /**
     * Takes command as array and calls corresponding cmd-handler on match
     * @param cmd command-array. cmd[0] is command name, cmd[>1] is parameter
     * @returns {String} result of command
     */
    function executeCMD(cmd) {
        for (let i = 0; i < commands.length; i++) {
            if (commands[i].name === cmd[0].toLowerCase()) {
                cmd.shift(); //remove cmd name from array, only leaving args
                return commands[i].handler(cmd); //Execute handler with array of args
            }
        }
        return "Unknown command.";
    }


    // Command handlers

    function helpCMD() {
        let msg = "Available commands:";
        for (let i = 0; i < commands.length; i++) {
            if (commands[i].visible) {
                msg += "\n" + commands[i].name + ": " + commands[i].description;
            }
        }
        return msg;
    }

    function echoCMD(args) {
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

    function ipCMD(args) {
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
                print("\nError: ipinfo.io returned code " + request.status);
            }
            print(request.responseText);
        };
        request.onerror = function (e) {
            console.error(e);
            print("Error: Could not send request to ipinfo.io. Check your internet connection.");
        };
        request.open("GET", queryUrl, true);
        request.send();
        return "Getting data ...";
    }

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
}


function JSUtil() {
    let lwConsole = new LWConsole(
        document.getElementById("lwConsole"),
        document.getElementById("consoleOut"),
        document.getElementById("consoleIn"),
        window.location.hostname
    );

    this.toggleConsole = function () {
        lwConsole.show(!lwConsole.isVisible());
    };

    /**
     * Handler for  console shortcuts 'C'=> open and 'ESC'=> close
     */
    document.addEventListener("keydown", function (e) {
        if (!lwConsole.isVisible() && e.keyCode == 67) {
            e.preventDefault();
            lwConsole.show(true);
        }
        else if (lwConsole.isVisible() && e.keyCode == 27) {
            e.preventDefault();
            lwConsole.show(false);
        }

    });
}
let util = new JSUtil();