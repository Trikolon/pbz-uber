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

import LWCommand from '../LWCommand';
import UsageError from '../UsageError';

export default class OpenCMD extends LWCommand {
  constructor() {
    super(
      'open', 'Opens page from main navigation', '[keybase/github/twitter/email/liquidradio/source]',
      'Trikolon', true,
    );
  }

  // eslint-disable-next-line class-methods-use-this
  run(args) {
    if (args.length !== 1) {
      throw new UsageError();
    }
    const urls = {
      keybase: '//keybase.io/pbz',
      github: '//github.com/Trikolon',
      twitter: '//twitter.com/deppaws',
      email: 'mailto:paul@zuehlcke.de',
      liquidradio: '//liquidradio.pro',
      source: '//github.com/Trikolon/pbz-uber',
    };
    args[0] = args[0].toLowerCase(); // Ignore case

    if (!urls[args[0]]) {
      throw new UsageError("Sorry, I don't know this service");
    }
    window.open(urls[args[0]]);
    return `${args[0]} opened.`;
  }
}
