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

import CommandList from './CommandList';
import CommandHistory from './CommandHistory';
import UsageError from './UsageError';
import config from './ConsoleConfig';

/**
 * Lightweight Console
 */
export default class LWConsole {
  /**
   * @param {HTMLElement} consoleDiv -  Dom of div holding the console.
   * @param {HTMLElement} consoleOutDOM - Dom of text-area for console-output.
   * @param {HTMLElement} consoleInDOM - Dom of text-input for console-input.
   * @param {String} hostname - Included in motd, may have further use in the future.
   * @constructor
   */
  constructor(consoleDiv, consoleOutDOM, consoleInDOM, hostname) {
    this.consoleDiv = consoleDiv;
    this.consoleOutDOM = consoleOutDOM;
    this.consoleInDOM = consoleInDOM;
    this.hostname = hostname;

    this.motd = `Welcome to ${hostname}!\nType 'help' for a list of commands.\n`;

    this._consoleOut = ''; // Content of console-out text-area
    // Initialise cmd history(for ARROW_UP support)
    this._cmdHistory = new CommandHistory(config().get('history'));
    // get iterator of history for easy traversal
    this._cmdHistoryIterator = this._cmdHistory.iterator();

    // Attach key handler for cmd-send, cmd-history and auto-complete
    document.addEventListener('keydown', (e) => {
      this._keyHandler(e);
    });

    // Focus the console-input whenever the console div is clicked.
    this.consoleDiv.onclick = () => {
      if (window.getSelection().toString() === '') { // Do not steal focus if user is selecting text
        consoleInDOM.focus();
      }
    };

    this._cmdList = new CommandList(this); // Load commands

    // Set initial content of textarea
    this.print(this.motd);

    // Get initial state from config
    if (config().get('consoleOpen')) {
      this.show(true);
    }
  }

  /**
   * Getter for command history object
   * @returns {CommandHistory} - Command history
   */
  get cmdHistory() {
    return this._cmdHistory;
  }

  /**
   * Handles key-press events for console
   * @param {Object} event - Event including key-code being evaluated.
   * @returns {undefined}
   * @private
   */
  _keyHandler(event) {
    if (this.consoleInDOM === document.activeElement) {
      // eslint-disable-next-line default-case
      switch (event.keyCode) {
        // enter => send cmd
        case 13: {
          event.preventDefault();
          if (this.consoleInDOM.value !== '') { // Do not trigger cmd when input is empty
            this.sendCMD(this.consoleInDOM.value);
            this.consoleInDOM.value = ''; // Empty after cmd sent
          }
          break;
        }
        // keyup => traverse through history (back in time)
        case 38: {
          event.preventDefault();
          const prev = this._cmdHistoryIterator.prev();
          if (prev !== undefined) { // only set if not undefined
            this.consoleInDOM.value = prev;
          }
          break;
        }
        // keydown => traverse through history (forward in time)
        case 40: {
          event.preventDefault();
          const next = this._cmdHistoryIterator.next();
          if (next !== undefined) { // only set if not undefined
            this.consoleInDOM.value = next;
          }
          break;
        }
        // tab => auto complete
        case 9: {
          event.preventDefault();
          this._autoComplete();
          break;
        }
      }
    }
  }

  /**
   * Auto-complete console input by querying command list
   * @private
   * @returns {undefined}
   */
  _autoComplete() {
    // Require at least one character for auto-complete
    if (this.consoleInDOM.value !== '') {
      // Get commands matching input
      const cmdList = this._cmdList.getMatchingCommands(this.consoleInDOM.value);
      if (cmdList.length > 0) {
        if (cmdList.length === 1) { // Single command match
          if (this.consoleInDOM.value === cmdList[0].name) { // If input fully matches cmd
            this.consoleInDOM.value = cmdList[0].name
              + (cmdList[0].usage ? ` ${cmdList[0].usage}` : ''); // Show usage
          } else {
            this.consoleInDOM.value = cmdList[0].name; // Else complete cmd
          }
        } else { // Multiple commands match, print a list of them to consoleOUT
          let cmdListStr = '';
          cmdList.forEach((cmd) => {
            cmdListStr += `${cmd.name} `;
          });
          this.print(cmdListStr);
        }
      }
    }
  }

  // eslint-disable-next-line valid-jsdoc
  /**
   * @see {@link CommandList#add}
   */
  addCommand(command) {
    return this._cmdList.add(command);
  }

  // eslint-disable-next-line valid-jsdoc
  /**
   * @see {@link CommandList#remove}
   */
  removeCommand(command) {
    return this._cmdList.remove(command);
  }


  /**
   * Changes visibility of console-div depending on parameter.
   * @param {boolean} state - true = visible; false = hidden
   * @returns {undefined}
   */
  show(state) {
    if (state) {
      this.consoleDiv.style.display = 'flex';
      // Set focus to console
      this.consoleInDOM.focus();
    } else {
      this.consoleDiv.style.display = 'none';
    }
    config().set('consoleOpen', state === true); // === to filter type
  }

  /**
   * Getter for visibility state
   * @returns {boolean} - Visibility state from config
   */
  // eslint-disable-next-line class-methods-use-this
  isVisible() {
    return config().get('consoleOpen');
  }

  /**
   * Prints message to console and updates cursor position (scroll).
   * @param {String} str - Message to print.
   * @returns {undefined}
   */
  print(str) {
    if (str && str !== '') {
      this._consoleOut += `${str}\n`; // Append string to print and newline
      this.consoleOutDOM.value = this._consoleOut; // update textarea text
      // scroll down in textarea for console-like behavior
      this.consoleOutDOM.scrollTop = this.consoleOutDOM.scrollHeight;
    }
  }

  /**
   * Clears console content.
   * @returns {undefined}
   */
  clear() {
    this._consoleOut = '';
    this.consoleOutDOM.value = this._consoleOut;
  }

  /**
   * Executes user cmd and updates output accordingly.
   * @param {String} cmd - Raw cmd by user.
   * @returns {undefined}
   */
  sendCMD(cmd) {
    const splitCMD = cmd.split(' '); // split cmd by space (cmd name, args)
    this.print(`> ${cmd}`); // Print cmd from user
    this.print(this.executeCMD(splitCMD)); // Print result of cmd-execution
    this._cmdHistory.add(cmd); // Save cmd
    this._cmdHistoryIterator = this._cmdHistory.iterator(); // update iterator
    config().set('history', this._cmdHistory.get().slice(this._cmdHistory.get().length - 20));
  }

  /**
   * Takes command as array and calls corresponding cmd-handler on match
   * @param {Array} cmdArr - Command-array. cmd[0] is command name, cmd[>1] is parameter.
   * @returns {String} - Result of command.
   */
  executeCMD(cmdArr) {
    const [cmdName] = cmdArr; // Name
    cmdArr.shift(); // args

    const cmd = this._cmdList.getCommand(cmdName); // Fetch command
    if (!cmd) {
      return 'Unknown command.';
    }
    try {
      return cmd.run(cmdArr); // Execute handler with params (cmdArray)
    } catch (e) {
      if (e instanceof Error) {
        if (e instanceof UsageError) {
          return (e.message ? `${e.message} \n` : '') +
            (cmd.usage && cmd.usage !== '' ? `Usage: ${cmd.name} ${cmd.usage}` : 'Invalid usage.');
        }

        return `${e.name}: ${e.message}`;
      }
      // This only happens when a command is not throwing an error-object (bad practise)
      log.warn('Command returned invalid error-object', 'cmd', cmd, 'args', cmdArr);
      log.error(e);
      return 'Unknown error in command execution, check console for details';
    }
  }
}
