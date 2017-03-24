/*
 * Copyright [2015-2017] Fraunhofer Gesellschaft e.V., Institute for
 * Open Communication Systems (FOKUS)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

 export default class LWCommand {

     static lwConsole;
     static cmdList;
     static config;

     constructor(name, description, usage, author, visible, handler = () => {return new Error("No handler set")}) {
         this.name = name;
         this.description = description;
         this.usage = usage;
         this.author = author;
         this.visible = visible;
         this._handler = handler;
     }

     set(handler) {
         this._handler = handler;
     }

     run(args) {
         return this._handler(args);
     }
 }