function LWConsole() {
    var consoleDiv = document.getElementById("lwConsole");
    var consoleOutDOM = document.getElementById("consoleOut");
    var consoleInDOM = document.getElementById("consoleIn");
    var consoleOut = "";
    var motd = "Welcome to paul.zuehlcke.de!\nType 'help' for help.\n";
    var commands = [
        {
            "name": "clear",
            "description": "Clears the console",
            "handler": clearCMD
        },
        {
            "name": "motd",
            "description": "Shows the message of the day",
            "handler": motdCMD
        },
        {
            "name": "help",
            "description": "Shows a list of commands",
            "handler": helpCMD
        },
        {
            "name": "invert",
            "description": "Invert website colors",
            "handler": invertCMD
        },
        {
            "name": "exit",
            "description": "Exit console",
            "handler": exitCMD
        },
        {
            "name": "echo",
            "description": "Displays message on console - no pipes yet :-(",
            "handler": echoCMD
        }
    ];

    //Get initial state depending on dom
    this.visible = window.getComputedStyle(consoleDiv).getPropertyValue("visibility") === "visible";

    //Attach key handler to enter key
    document.addEventListener("keydown", function (e) {
        if (consoleInDOM === document.activeElement && e.keyCode == 13) {
            var value = consoleInDOM.value;
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

    this.show = function (state) {
        if (state) {
            consoleDiv.style.visibility = "visible";
            this.visible = true;
            //Set focus to console
            consoleInDOM.focus();
        }
        else {
            consoleDiv.style.visibility = "hidden";
            this.visible = false;
        }
    };

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
        var splitCMD = cmd.split(" "); //split cmd by space (cmd name, args)
        print("> " + cmd); //Print cmd from user
        print(executeCMD(splitCMD)); //Print result of cmd-execution
    }

    function executeCMD(cmd) {
        for (var c in commands) {
            if (commands[c].name === cmd[0]) {
                cmd.shift(); //remove cmd name from array, only leaving args
                return commands[c].handler(cmd); //Execute handler with array of args
            }
        }
        return "Unknown command.";
    }


    // Command handlers

    function clearCMD() {
        consoleOut = "";
        consoleOutDOM.value = consoleOut;
    }

    function motdCMD() {
        return motd;
    }

    function helpCMD() {
        var msg = "Available commands:";
        for (var c in commands) {
            msg += "\n" + commands[c].name + ": " + commands[c].description;
        }
        return msg;
    }

    function invertCMD() {
        util.toggleInvert();
        return "Page inverted!";
    }

    function exitCMD() { //hide for now, could destroy in the future
        util.toggleConsole();
    }

    function echoCMD(args) {
        var init = true;
        var str = "";

        for (var arg in args) {
            if (!init) {
                str += "";
            }
            str += args[arg];
        }
        return str;
    }
}


function JSUtil() {
    var isInverted = false;
    var lwConsole = new LWConsole();

    function invert(state) {
        var invertStr;
        if (state) {
            invertStr = "100%";
        }
        else {
            invertStr = "0%";
        }
        document.getElementById("monitor").style.filter = "invert(" + invertStr + ")";
    }

    this.toggleInvert = function () {
        isInverted = !isInverted;
        invert(isInverted);
    };

    this.toggleConsole = function () {
        lwConsole.show(!lwConsole.isVisible());
    }
}
var util = new JSUtil();