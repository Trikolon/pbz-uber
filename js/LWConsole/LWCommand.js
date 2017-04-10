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

/**
 * Abstract class for LWConsole commands
 * Implemented commands inherit from this
 */
 export default class LWCommand {

    /**
     * @param {String} name - identifier of the command, shown in help
     * @param {String | undefined} description - shown in help
     * @param {String | undefined} usage - usage shown in help
     * @param {String | undefined} author - name of the author, preferably nickname
     * @param {boolean} visible - boolean flag, should the command be shown in the command list?
     */
     constructor(name, description, usage, author, visible = true) {
         if (new.target === LWCommand) {
             throw new TypeError(`Can't construct instance of abstract class ${new.target}`);
         }
         this.name = name;
         this.description = description;
         this.usage = usage;
         this.author = author;
         this.visible = visible;
     }

    /**
     * Method called when the user executes a matching command
     * @abstract
     * @param {Array} args - string-array, arguments provided by user excluding command name
     * @returns {String} - Result of command execution for display
     */
     run(args) {
        throw new Error("No handler set");
     }
 }