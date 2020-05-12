// ==UserScript==
// @name Test
// @namespace https://boxcrittersmods.ga
// @version 0.1.0
// @description Test
// @author Alvarito050506
// @match https://boxcritters.com/play/index.html
// @grant unsafeWindow
// @require https://cdn.boxcrittersmods.ga/crittersdk/master/src/lib.js
// @run-at document-end
// ==/UserScript==

/*
 * index.user.js
 * 
 * Copyright 2020 Alvarito050506 <donfrutosgomez@gmail.com>
 * Copyright 2020 The Box Critters Modding Community
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * 
 * 
 */

var critter_api = new BCModAPI();

critter_api.get("/").then(function (data) {
	console.log(JSON.stringify(data));
}).catch(function (err) {
	console.error("Error: " + JSON.stringify(err));
});
