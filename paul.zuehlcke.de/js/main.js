function JSUtil() {
    "use strict";
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
        if (!lwConsole.isVisible() && e.keyCode === 67) {
            e.preventDefault();
            lwConsole.show(true);
        }
        else if (lwConsole.isVisible() && e.keyCode === 27) {
            e.preventDefault();
            lwConsole.show(false);
        }

    });

    /**
     * Set initial state by cookie
     */
    let flickerCookie = Cookies.get("flicker");
    let invertCookie = Cookies.get("invert");

    if (typeof flickerCookie === "undefined") {
        Cookies.set("flicker", "true", {expires: 7});
    }
    else {
        if (Cookies.get("flicker") === "false") { //Is flicker disabled?
            lwConsole.executeCmd(["effect", "flicker", "false"]);
        }
    }
    if (typeof invertCookie === "undefined") {
        Cookies.set("invert", "false", {expires: 7});
    }
    else {
        if (Cookies.get("invert") === "true") { //Is invert enabled?
            lwConsole.executeCmd(["effect", "invert", "true"]);
        }
    }


}
let util = new JSUtil();