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

import LWConsole from "./LWConsole/LWConsole";

(function () {
    "use strict";

    console.log("%cWELCOME FELLOW DEV ~", "background: #0088ff; color: #ffffff; font-size: 24px");
    console.log("%cFeel free to contribute!\nSource: https://github.com/Trikolon/pbz-uber", "background: #0088ff; color: #ffffff");

    let lwConsole = new LWConsole(
        document.getElementById("lwConsole"),
        document.getElementById("consoleOut"),
        document.getElementById("consoleIn"),
        window.location.hostname
    );

    //Methods used by onclick handlers
    window.toggleConsole = function () {
        lwConsole.show(!lwConsole.isVisible());
    };

    window.maxConsole = function () {
        lwConsole.executeCMD(["effect", "maximize"]);
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
}());