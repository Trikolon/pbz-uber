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

export default class ConvertCMD extends LWCommand {
    constructor() {
        super("convert", "Converts from/to different units/bases. Currently supported: base, ascii",
            "convert <base> <fromBase> <toBase> <number>; convert <ascii> [asciiCode/asciiSymbol]", "Trikolon", true);
    }

    run(args) {
        if (args.length <= 1) {
            throw new UsageError();
        }

        let mode = args[0];
        args.shift();
        switch (mode) {
            case "base":
                return this.convertBase(args);
            case "ascii":
                return this.convertAscii(args);
        }
    }

    convertBase(args) {
        if (args.length !== 3) {
            throw new UsageError();
        }
        let fromBase = parseInt(args[0], 10);
        let toBase = parseInt(args[1], 10);
        return parseInt(args[2], fromBase).toString(toBase);
    }

    convertAscii(args) {
        return "Not implemented yet, see 'help ascii'";
    }
}
