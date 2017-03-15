"use strict";

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

    //TODO: Some kind of state object is needed that stores state for cmds + manages cookies using Cookies.get and Cookies.set

}
let util = new JSUtil();