# CritterSDK
[![npm package version](https://img.shields.io/npm/v/crittersdk)](https://npmjs.org/package/crittersdk)

A Box Critters Software Development Kit.

## Getting started
### Prerequisites
To use the CritterSDK you only need to have `Node.js >= 10.16.3` preinstalled.

### Installing
There is a [npm package](https://npmjs.org/package/crittersdk) that you can install by running:
```sh
npm install -g crittersdk
```

## Usage
### Bootstrap
First, you need to create a new project:
```sh
crittersdk init
```
After filling out some fields, you can write your JavaScript code in the `index.user.js` file.

### Configuring
If you want to publish your project, you need to configure the SDK first:
```
crittersdk config
```
You need to login with you GitHub account, then you need to provide a new password for the SDK, keep it safe because anyone with it can publish Gists in your behalf.

### Publishing
To publish your project do:
```
crittersdk publish
```
It will ask you for your SDK password, after answering your project Gist will be created or updated. If you project isn't still published, it will enter in revision phase. Then, if you script follows the BCMC mod distribution politics, someone of the Staff will approve and publish it.

## API reference
All the library API reference is avaiable [here](https://sdk.boxcrittersmods.ga/).

### Examples
You can view simple usage examples [here](https://github.com/boxcritters/crittersdk/tree/master/test).

## Licensing
All the code of this project is licensed under the [Apache License version 2.0](https://github.com/boxcritters/crittersdk/blob/master/LICENSE) (Apache-2.0).

```license
	Copyright 2020 Alvarito050506 <donfrutosgomez@gmail.com>
	Copyright 2020 The Box Critters Modding Community

	Licensed under the Apache License, Version 2.0 (the "License");
	you may not use this file except in compliance with the License.
	You may obtain a copy of the License at

		http://www.apache.org/licenses/LICENSE-2.0

	Unless required by applicable law or agreed to in writing, software
	distributed under the License is distributed on an "AS IS" BASIS,
	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	See the License for the specific language governing permissions and
	limitations under the License.
```

All the documentation of this project is licensed under the [Creative Commons Attribution-ShareAlike 4.0 International](https://creativecommons.org/licenses/by-sa/4.0/) (CC BY-SA 4.0) license.

[![CC BY-SA 4.0](https://i.creativecommons.org/l/by-sa/4.0/88x31.png)](https://creativecommons.org/licenses/by-sa/4.0/)
