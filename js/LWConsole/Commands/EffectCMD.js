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

import LWCommand from "../LWCommand";
import UsageError from "../UsageError";
import config from "../ConsoleConfig";

export default class EffectCMD extends LWCommand {
    constructor() {
        super("effect", "Toggle effects, such as invert and flicker", "<flicker|invert|maximize> [true|false]", "Trikolon", true);

        //Get initial state from config and toggle effects if needed
        if (config(this.name).get("maximize")) {
            this.run(["maximize", "true"]);
        }
        let flicker = config(this.name).get("flicker");

        if (typeof flicker === "undefined") {
            config(this.name).set("flicker", true);
        }
        else {
            if (!flicker) {
                this.run(["flicker", "false"]);
            }
        }
        if (config(this.name).get("invert")) {
            this.run(["invert", "true"]);
        }
    }

    run(args) {
        let state; // boolean state to change effect to
        if (!args || args.length === 0 || args.length > 2) {
            throw new UsageError();
        }
        args[0] = args[0].toLowerCase();

        if (args.length === 1) { //Toggle
            state = config(this.name).get(args[0]);
            state = !state;
        }
        else { // State overwrite
            state = args[1] === "true";
        }
        EffectCMD.setEffect(args[0], state); //this can throw usage-error (caught by execution handler)

        config(this.name).set(args[0], state);
        return "Effect " + args[0] + " turned " + (state ? "ON" : "OFF");
    }

    static setEffect(effect, state) {
        switch (effect) {
            case "invert": {
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
            case "flicker": {
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
            case "maximize": {
                let navigationDom = document.getElementById("navigation");
                if (state) {
                    navigationDom.style.display = "none";
                }
                else {
                    navigationDom.style.display = "flex";
                }
                break;
            }
            default: {
                throw new UsageError();
            }
        }
    }
}
