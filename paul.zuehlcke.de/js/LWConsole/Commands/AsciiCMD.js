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

export default class AsciiCMD extends LWCommand {
    constructor() {
        super("ascii", "Prints the ASCII Table, or a some Characters, if codes are specified.", "ascii [code, [code, [...]]]", "TheBiochemic", true);
    }

    run(args) {
        //if there are any codes specified
        if (args.length > 0) {
            let output = "";
            let iter = 0;
            while(iter<args.length) {
                let expression = parseInt(args[iter])+"="+AsciiCMD.getChar(parseInt(args[iter])) + ",";
                if(expression.length <8) output += expression + "\t\t";
                else output += expression + "\t";
                if(iter%8 == 7)output += "\n";
                iter++;
            }
            return output;
        }
        else {
            let output = "";
            let iter = 0;
            while(iter<256) {
                let expression = iter+"="+AsciiCMD.getChar(iter) + ",";
                if(expression.length <8) output += expression + "\t\t";
                else output += expression + "\t";
                if(iter%8 == 7)output += "\n";
                iter++;
            }
            return output;

        }
    }

    static getChar(code) {
        switch(code) {
            case 0: return "[NUL]";
            case 1: return  "[SOH]";
            case 2: return  "[STX]";
            case 3: return  "[ETX]";
            case 4: return  "[EOT]";
            case 5: return  "[ENQ]";
            case 6: return  "[ACK]";
            case 7: return  "[BEL]";
            case 8: return  "[BS]";
            case 9: return  "[HT]";
            case 10: return  "[LF]";
            case 11: return  "[VT]";
            case 12: return  "[FF]";
            case 13: return  "[CR]";
            case 14: return  "[SO]";
            case 15: return  "[SI]";
            case 16: return  "[DLE]";
            case 17: return  "[DC1]";
            case 18: return  "[DC2]";
            case 19: return  "[DC3]";
            case 20: return  "[DC4]";
            case 21: return  "[NAK]";
            case 22: return  "[SYN]";
            case 23: return  "[ETB]";
            case 24: return  "[CAN]";
            case 25: return  "[EM]";
            case 26: return  "[SUB]";
            case 27: return  "[ESC]";
            case 28: return  "[FS]";
            case 29: return  "[GS]";
            case 30: return  "[RS]";
            case 31: return  "[US]";
            case 32: return  "[SP]";
            case 255: return  "[DEL]";
            default: return String.fromCharCode(code);
        }
    }
}
