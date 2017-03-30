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

export default class WikiCMD extends LWCommand {
    constructor(print) {
        super("wiki", "Provides a Wikipedia summary of the requested topic, if possible", "<topic>", "TheBiochemic", true);
        this.print = print;
    }

    run(args) {
        let keyword = args.join(" ");
        let queryUrl = "https://en.wikipedia.org/w/api.php?format=json&action=query&redirects=1&prop=extracts&exintro=&explaintext=&origin=*&titles=" + keyword;
        if (args.length < 1) {
            throw new UsageError();
        } else {
            //If the pattern is met:
            let request = new XMLHttpRequest();
            request.onload = () => {
                try {
                    if (request.status !== 200) {
                        throw new Error("wikipedia.org returned code " + request.status);
                    }
                    let pages = JSON.parse(request.responseText).query.pages;
                    if (pages.hasOwnProperty("-1")) {
                        throw new Error("No article found");
                    }
                    let article = pages[Object.keys(pages)[0]];
                    let text = article.extract;
                    if (text.length > 1000) text = text.substring(0, 1000) + " [...]";
                    this.print("\n *** " + article.title + " ***\n\n" + text +
                        "\n\nFull article under: https://en.wikipedia.org/wiki/" + (article.title.split(" ").join("_")));
                }
                catch (e) {
                    this.print(e.name + ": " + e.message);
                }
            };
            request.onerror = function (e) {
                console.error(e);
                this.print("Error: Could not send request to wikipedia.org. Check your internet connection.");
            };
            request.open("GET", queryUrl, true);
            request.send();
            return "Loading ...";
        }
    }
}
