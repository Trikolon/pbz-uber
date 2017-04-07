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
 * This class is a simple array wrapper, designed to store the history of the commandline.
 */
export default class CommandHistory {

    /**
     * Initialize a new CommandHistory instance (optionally based on an existing history array).
     * @param {Array} history - array this history is based on. Leave undefined for empty array.
     */
    constructor(history = []) {
        this._history = history;
    }

    /**
     * Get history for given index.
     * @param {int} [index] - target index in history array.
     * @returns {string} command - command at given index.
     */
    get(index) {
        if (index === undefined)
            return this._history;
        else
            return this._history[index];
    }

    /**
     * Returns the size of the history.
     * @returns {Number}
     */
    size() {
        return this._history.length;
    }

    /**
     * Adds entry to history.
     * @param entry - entry to be stored in history
     * @returns {Number}
     */
    add(entry) {
        return this._history.push(entry);
    }

    /**
     * Returns an iterator for this history for easy traversal.
     * @returns {HistoryIterator} iterator
     */
    iterator() {
        return new HistoryIterator(this);
    }
}

/**
 * Small iterator to traverse through a history
 */
class HistoryIterator {

    /**
     * Initialize this iterator on the given history.
     *
     * Be aware that you need to initialize a new iterator when the history changes,
     * as the index is not reset automatically.
     * @param {CommandHistory} history - history, this iterator is based on.
     */
    constructor(history) {
        this._history = history;
        this._i = history.size();
    }

    /**
     * Returns true, if there is a next element to get via next(), false otherwise.
     * @returns {boolean}
     */
    hasNext() {
        return this._i < (this._history);
    }

    /**
     * Returns the next entry in the history (i.e. forward in time).
     *
     * @returns {string | undefined} requested entry, undefined if no next entry exists
     */
    next() {
        let next = this._history.get(++this._i);
        if (next === undefined)
            this._i--;
        return next;
    }

    /**
     * Returns the previous entry in the history (i.e. back in time).
     *
     * @returns {string | undefined} requested entry, undefined if no previous entry exists
     */
    prev() {
        let prev = this._history.get(--this._i);
        if (prev === undefined)
            this._i++;
        return prev;
    }
}