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

export default class AsciiCMD extends LWCommand {
    constructor() {
        super("ascii", "Prints the ASCII Table, or a some Characters, if codes are specified.", "ascii [code, [code, [...]]]", "TheBiochemic", true);
    }

    run(args) {
        //if there are any codes specified
        if (args.length > 0) {
            let output = "";
            let iter = 0;
            while (iter < args.length) {
                let expression = parseInt(args[iter], 10) + "=" + AsciiCMD.getChar(parseInt(args[iter], 10)) + ",";
                if (expression.length < 8) output += expression + "\t\t";
                else output += expression + "\t";
                if (iter % 8 === 7) output += "\n";
                iter++;
            }
            return output;
        }
        else {
            let output = "";
            let iter = 0;
            while (iter < 256) {
                let expression = iter + "=" + AsciiCMD.getChar(iter) + ",";
                if (expression.length < 8) output += expression + "\t\t";
                else output += expression + "\t";
                if (iter % 8 === 7) output += "\n";
                iter++;
            }
            return output;

        }
    }


    static getChar(code) {
        let codes = {
            0: "[NUL]",
            1: "[SOH]",
            2: "[STX]",
            3: "[ETX]",
            4: "[EOT]",
            5: "[ENQ]",
            6: "[ACK]",
            7: "[BEL]",
            8: "[BS]",
            9: "[HT]",
            10: "[LF]",
            11: "[VT]",
            12: "[FF]",
            13: "[CR]",
            14: "[SO]",
            15: "[SI]",
            16: "[DLE]",
            17: "[DC1]",
            18: "[DC2]",
            19: "[DC3]",
            20: "[DC4]",
            21: "[NAK]",
            22: "[SYN]",
            23: "[ETB]",
            24: "[CAN]",
            25: "[EM]",
            26: "[SUB]",
            27: "[ESC]",
            28: "[FS]",
            29: "[GS]",
            30: "[RS]",
            31: "[US]",
            32: "[SP]",
            255: "[DEL]"
        };
        if (codes.hasOwnProperty(code)) {
            return codes[code];
        }
        else {
            return String.fromCharCode(code);
        }
    }
}
