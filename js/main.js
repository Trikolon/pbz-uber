/**
 * Lightweight Console
 *
 * @param consoleDiv dom of div holding the console
 * @param consoleOutDOM dom of text-area for console-output
 * @param consoleInDOM dom of text-input for console-input
 * @constructor
 */
function LWConsole(consoleDiv, consoleOutDOM, consoleInDOM) {
    var consoleOut = "";
    var motd = "Welcome to " + window.location.hostname + "\nType 'help' for help.\n";
    var isInverted = false;
    var commands = [
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
        for (var i = 0; i < commands.length; i++) {
            if (commands[i].name === cmd[0].toLowerCase()) {
                cmd.shift(); //remove cmd name from array, only leaving args
                return commands[i].handler(cmd); //Execute handler with array of args
            }
        }
        return "Unknown command.";
    }


    // Command handlers

    function helpCMD() {
        var msg = "Available commands:";
        for (var i = 0; i < commands.length; i++) {
            if (commands[i].visible) {
                msg += "\n" + commands[i].name + ": " + commands[i].description;
            }
        }
        return msg;
    }

    function echoCMD(args) {
        var init = true;
        var str = "";

        for (var i = 0; i < args.length; i++) {
            if (!init) {
                str += " ";
            }
            init = false;
            str += args[i];
        }
        return str;
    }

    //TODO: Make async
    function ipCMD(args) {
        var queryUrl = "https://ipinfo.io/";

        if (args.length > 1) {
            return "Invalid Syntax! ip [addr]";
        }
        else {
            if (args.length === 1) { //one arg => query arg ip
                queryUrl += args[0] + "/"
            }
        }

        queryUrl += "json";

        var xmlHttp = new XMLHttpRequest();
        try {
            xmlHttp.open("GET", queryUrl, false);
            xmlHttp.send(null);
        }
        catch (e) {
            console.error(e);
            return "Error: Could not send request to ipinfo.io. Check your internet connection.";
        }

        var result = xmlHttp.responseText;

        if (xmlHttp.status !== 200) {
            result += "\nError: ipinfo.io returned code " + xmlHttp.status;
        }

        return result;
    }

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
}


function JSUtil() {
    var lwConsole = new LWConsole(
        document.getElementById("lwConsole"),
        document.getElementById("consoleOut"),
        document.getElementById("consoleIn")
    );

    this.toggleConsole = function () {
        lwConsole.show(!lwConsole.isVisible());
    }
}
var util = new JSUtil();