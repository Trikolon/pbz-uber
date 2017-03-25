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

export default class CalcCMD extends LWCommand {
    constructor() {
        super("calc", "Calculates a simple math expression", "calc <expression>", "TheBiochemic", true);
    }

    run(args) {
        args = args.join("");
        if (args.length > 0) {
            let expResult = CalcCMD.parseExpression(args);
            if (expResult === undefined || isNaN(expResult))
                throw new UsageError("This is not a valid expression!");
            return expResult.toString();
        }
        else
            throw new UsageError();
    }

    static parseExpression(expression) {
        let regex = /([^\d.()+\-*\/^|&%=!]|([^=!]=[^=]))/;
        if (!regex.test(expression)) {
// eslint-disable-next-line no-eval
            return eval(expression);
        }
    }
}
