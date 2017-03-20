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
    let config = new CookieConfig("consoleConfig", 14,
        {
            consoleOpen: false,
            flicker: true,
            invert: false
        });
    let lwConsole = new LWConsole(
        config,
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

    //Query config and set initial state
    if (config.get("consoleOpen")) {
        lwConsole.show(true);
    }
    if (!config.get("flicker")) {
        lwConsole.executeCmd(["effect", "flicker", "false"]);
    }
    if (config.get("invert")) {
        lwConsole.executeCmd(["effect", "invert", "true"]);
    }
}
let util = new JSUtil();