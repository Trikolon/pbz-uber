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
     * TODO: config object stored as a whole
     */
    let flickerCookie = Cookies.get("flicker");
    let invertCookie = Cookies.get("invert");
    let consoleStatusCookie = Cookies.get("console");

    if (typeof consoleStatusCookie === "undefined") {
        Cookies.set("console", "false", {expires: 7});
    }
    else {
        if (consoleStatusCookie === "true") {
            lwConsole.show(true);
        }
    }
    if (typeof flickerCookie === "undefined") {
        Cookies.set("flicker", "true", {expires: 7});
    }
    else {
        if (flickerCookie === "false") { //Is flicker disabled?
            lwConsole.executeCmd(["effect", "flicker", "false"]);
        }
    }
    if (typeof invertCookie === "undefined") {
        Cookies.set("invert", "false", {expires: 7});
    }
    else {
        if (invertCookie === "true") { //Is invert enabled?
            lwConsole.executeCmd(["effect", "invert", "true"]);
        }
    }


}
let util = new JSUtil();