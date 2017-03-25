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
        super("ascii", "Prints the ASCII Table, or some Characters/Code, if their corresponding mappings are specified.", "ascii [code, [code, [...]]]", "TheBiochemic", true);
    }

    run(args) {
        //if there are any codes specified
        if (args.length > 0) {
            let output = "";
            let iter = 0;
            while (iter < args.length) {
                let number = parseInt(args[iter], 10);
                if(!isNaN(number)){
                    let expression = number + "=" + AsciiCMD.getChar(number) + ",";
                    output += expression + "\n";
                    
                } else {
                    let expression = args[iter] + "=" + AsciiCMD.getDesc(args[iter]) + ",";
                    output += expression + "\n";
                }
                
                iter++;
            }
            return output;
        }
        else {
            //If the full table needs to be printed
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
            127: "[DEL]"
        };
        if (codes.hasOwnProperty(code)) {
            return codes[code];
        }
        else {
            return String.fromCharCode(code);
        }
    }

    static getDesc(char) {
        let descriptions = {
            "[NUL]":"0 (Null Character)",
            "[SOH]":"1 (Start of Header)",
            "[STX]":"2 (Start of Text)",
            "[ETX]":"3 (End of Text)",
            "[EOT]":"4 (End of Transmission)",
            "[ENQ]":"5 (Enquiry)",
            "[ACK]":"6 (Acknowledgment)",
            "[BEL]":"7 (Bell)",
            "[BS]":"8 (Backspace)",
            "[HT]":"9 (Horizontal Tab)",
            "[LF]":"10 (Line Feed)",
            "[VT]":"11 (Vertical Tab)",
            "[FF]":"12 (Form Feed)",
            "[CR]":"13 (Carriage Return)",
            "[SO]":"14 (Shift Out)",
            "[SI]":"15 (Shift In)",
            "[DLE]":"16 (Data Link Escape)",
            "[DC1]":"17 (Device Control 1)",
            "[DC2]":"18 (Device Control 2)",
            "[DC3]":"19 (Device Control 3)",
            "[DC4]":"20 (Device Control 4)",
            "[NAK]":"21 (Negative Acknowledgment)",
            "[SYN]":"22 (Synchronous Idle)",
            "[ETB]":"23 (End of Transmission Block)",
            "[CAN]":"24 (Cancel)",
            "[EM]":"25 (End of Medium)",
            "[SUB]":"26 (Substitute)",
            "[ESC]":"27 (Escape)",
            "[FS]":"28 (File Separator)",
            "[GS]":"29 (Group Separator)",
            "[RS]":"30 (Record Separator)",
            "[US]":"31 (Unit Separator)",
            "[SP]":"32 (Space)",
            "[DEL]":"127 (Delete)"
        };
        if (descriptions.hasOwnProperty(char)) {
            return descriptions[char];
        }
        else {
            return char.charCodeAt(0);
        }
    }
}
