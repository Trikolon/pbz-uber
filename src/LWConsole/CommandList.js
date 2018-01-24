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

import LWCommand from './LWCommand';
import LWCommandSimple from './LWCommandSimple';
import HelpCMD from './Commands/HelpCMD';
import OpenCMD from './Commands/OpenCMD';
import EchoCMD from './Commands/EchoCMD';
import IpCMD from './Commands/IpCMD';
import CalcCMD from './Commands/CalcCMD';
import TimeCMD from './Commands/TimeCMD';
import EffectCMD from './Commands/EffectCMD';
import ConvertCMD from './Commands/ConvertCMD';
import HistoryCMD from './Commands/HistoryCMD';
import RawCMD from './Commands/RawCMD';

/**
 * Stores command properties + logic and provides method to query them.
 */
export default class CommandList {
  /**
   * @param {LWConsole} lwConsole - reference to console-object, required by some commands.
   * @constructor
   */
  constructor(lwConsole) {
    this._lwConsole = lwConsole;
    this._commands = [];

    // Init cmds
    const commands = [
      new HelpCMD(this),
      new OpenCMD(),
      new EchoCMD(),
      new HistoryCMD(this._lwConsole.cmdHistory, (cmdString) => {
        this._lwConsole.sendCMD(cmdString);
      }),
      new IpCMD((str) => { // wrapped in anonymous function to prevent this-rebind
        this._lwConsole.print(str);
      }),
      new TimeCMD(),
      new CalcCMD(),
      new ConvertCMD((str) => { // do the same like at IPCmd
        this._lwConsole.print(str);
      }),
      new EffectCMD(),
      new RawCMD(),

      new LWCommandSimple(
        'motd', 'Shows the message of the day', undefined, 'Trikolon', true,
        () => lwConsole.motd,
      ),
      new LWCommandSimple('clear', 'Clears the console', undefined, 'Trikolon', true, () => {
        lwConsole.clear();
      }),
      new LWCommandSimple('exit', 'Exit console', undefined, 'Trikolon', true, () => {
        lwConsole.show(false);
      }),
      new LWCommandSimple(
        'ridb', 'A simple command that confirms that Robert is the best.', '[reply]',
        'Endebert', false,
        (args) => {
          let output = "Paul:\t'Robert ist der Beste!'";
          if (args.length > 0) {
            output += `\nRobert:\t'${args.join(' ')}'`;
          } else {
            output += '\nThere was no response...';
          }
          return output;
        },
      ),
      new LWCommandSimple('kleinhase', 'Secret message', undefined, 'Trikolon', false, '<3'),
      new LWCommandSimple(
        'shutdown', 'Halt, power-off or reboot the machine', undefined, 'Trikolon', false,
        "You're not my master!",
      ),
      new LWCommandSimple(
        'rm', 'remove files or directories', undefined, 'Trikolon', false,
        "Please don't delete anything. We don't have backups.",
      ),
      new LWCommandSimple(
        'ls', 'list directory contents', undefined, 'Trikolon', false,
        'cia_secrets, cute_cat_gifs, videos, passwords.txt',
      ),
    ];

    for (let i = 0; i < commands.length; i += 1) {
      this.add(commands[i]);
    }
  }

  /**
   * Adds a new command to the list. Checks for duplicate name and object.
   * @param {LWCommand} command - Command instance to be added to the list.
   * @throws {Error} - If command object or command with the same name already exists in the list
   * or argument is not
   * a LWCommand object.
   * @returns {undefined}
   */
  add(command) {
    // Only allow LWCommand objects to be added
    if (!(command instanceof LWCommand)) {
      throw new Error('Invalid argument type, expected LWCommand');
    }
    // Check if command to add (or name) already exists in list
    for (let i = 0; i < this._commands.length; i += 1) {
      if (this._commands[i].name === command.name) {
        if (this._commands[i] === command) {
          // Object matches
          throw new Error('Command already in list!');
        } else {
          // Only name matches (different instance)
          throw new Error('Command with the same name exists. Field has to be unique');
        }
      }
    }

    // Add command to list
    this._commands.push(command);
    // Sort the list by command name
    this._commands.sort((a, b) => a.name.localeCompare(b.name));
  }


  /**
   * Removes command from the list.
   * @param {LWCommand | String} command - Command by object or name to be removed from the list.
   * @throws {Error} - If argument command is not of type {LWCommand} or {String}.
   * @returns {boolean} - true if object has been removed from the list, false otherwise.
   */
  remove(command) {
    let index = -1;
    if (typeof command === 'string') {
      index = this._commands.indexOf(this.getCommand(command));
    } else if (command instanceof LWCommand) {
      index = this._commands.indexOf(command);
    } else {
      throw new Error(`Invalid argument type ${typeof command}`);
    }
    if (index < 0) { // Not found, can't remove
      return false;
    }

    this._commands.splice(index, 1);
    return true;
  }


  get lwConsole() {
    return this._lwConsole;
  }

  get commands() {
    return this._commands;
  }

  /**
   * Searches command list for command matching commandName.
   * @param {String} commandName - Command name to search for.
   * @returns {function} - Matching command handler function or unknown-command handler.
   */
  getCommandHandler(commandName) {
    const result = this.getCommand(commandName);
    if (result) {
      return result.handler;
    }

    // No matching command found
    return () => 'Unknown command'; // No error, unknown-cmd is success. Feels weird, doesn't it?
  }

  /**
   * Searches command list for command matching commandName.
   * @param {String} commandName  - Command name to search for.
   * @returns {undefined | LWCommand} Returns matching command or undefined if no match.
   */
  getCommand(commandName) {
    const name = commandName.toLowerCase();
    for (let i = 0; i < this._commands.length; i += 1) {
      if (this._commands[i].name === name) {
        return this._commands[i];
      }
    }
    return undefined;
  }

  /**
   * Searches command list for commands which names start with str.
   * @param {String} str - String to match with.
   * @returns {Array} - Array of suitable commands.
   */
  getMatchingCommands(str) {
    const s = str.toLowerCase();
    const cmdList = [];
    for (let i = 0; i < this._commands.length; i += 1) {
      if (this._commands[i].name.startsWith(s)) {
        cmdList.push(this._commands[i]);
      }
    }
    return cmdList;
  }
}
