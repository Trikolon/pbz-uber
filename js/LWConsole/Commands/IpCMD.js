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

export default class IpCMD extends LWCommand {
    constructor(print) {
        super("ip", "Lookup an IP (queries your IP if no argument is provided)", "[ip]", "Trikolon", true);
        this.print = print;
    }

    run(args) {
        let queryUrl = "https://ipinfo.io/";
        if (args.length > 1) {
            throw new UsageError();
        }

        if (args.length === 1) { //one arg => query arg ip
            queryUrl += `${args[0]}/`;
        }

        queryUrl += "json";

        const request = new XMLHttpRequest();
        request.onload = () => {
            if (request.status !== 200) {
                this.print(`\nError: ipinfo.io returned code ${request.status}`);
            }
            this.print(request.responseText);
        };
        request.onerror = function (e) {
            console.error(e);
            this.print("Error: Could not send request to ipinfo.io. Check your internet connection.");
        };
        request.open("GET", queryUrl, true);
        request.send();
        return "Getting data ...";
    }
}
