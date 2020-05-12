#!/usr/bin/env node

/*
 * cli.js
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

/**
 * @file CritterSDK Command Line Interface.
 * @author Alvarito050506 <donfrutosgomez@gmail.com> 
 * @copyright 2020 Alvarito050506 <donfrutosgomez@gmail.com>
 * @copyright 2020 The Box Critters Modding Community
 * @license Apache-2.0
 * @version 0.4.0
 * 
 **/

const readline = require("readline");
const fs = require("fs");
const crypto = require("crypto");
const https = require("https");

var rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

function request(options, ok_cb, err_cb, data)
{
	var res_data = String();
	const req = https.request(options, function (res) {
		if (res.statusCode >= 200 && res.statusCode < 300)
		{
			res.on("data", function (chunk) {
				res_data += chunk.toString();
			});
			res.on("end", function () {
				ok_cb(JSON.parse(res_data));
			});
		} else
		{
			err_cb({
				"status": res.statusCode
			});
		}
	});
	req.on("error", function (err) {
		err_cb(err);
	});

	if ((options.method == "POST" || options.method == "PUT" || options.method == "PATCH") && typeof(data) != "undefined")
	{
		req.write(JSON.stringify(data));
	}
	req.end();
}

function init()
{
	rl.question("Mod name: ", function(name) {
		rl.question("Mod version: (0.1.0) ", function(version) {
			rl.question("Mod description: ", function(description) {
				rl.question("Mod namespace (website): (https://boxcrittersmods.ga) ", function(namespace) {
					rl.question("Mod author: ", function(author) {
						var template = `// ==UserScript==\n// @name ${name}\n// @namespace ${namespace || "https://boxcrittersmods.ga"}\n// @version ${version || "0.1.0"}\n// @description ${description}\n// @author ${author}\n// @match https://boxcritters.com/play/index.html\n// @grant unsafeWindow\n// @require https://cdn.boxcrittersmods.ga/crittersdk/master/src/lib.js\n// @run-at document-end\n// ==/UserScript==\n`;
						fs.writeFile("./index.user.js", template, function (err) {
							if (err)
							{
								console.error(`\x1b[1;31mERR\x1b[0m: ${JSON.stringify(err)}.`);
								rl.close();
								return 1;
							}
							console.log("\x1b[1;37mINFO\x1b[0m: Project created sucefully!");
							rl.close();
						});
					});
				});
			});
		});
	});
	return 0;
}

function publish()
{
	rl.question("Mod URL: ", function(url) {
		if (url == "")
		{
			console.error("\x1b[1;31mERR\x1b[0m: Invalid URL.");
			return 1;
		}
		request({
			"hostname": "api.boxcrittersmods.ga",
			"port": 443,
			"path": `/modsubmit/${new Buffer.from(url).toString("base64")}`,
			"method": "GET"
		}, function (data) {}, function (err) {
			console.error(`\x1b[1;31mERR\x1b[0m: ${err}.`);
			rl.close();
			return 1;
		});
		console.log("\x1b[1;37mINFO\x1b[0m: Project submited sucefully!");
		rl.close();
	});
	return 0;
}

function help(argv)
{
	console.log(`\x1b[1;37mINFO\x1b[0m: Usage: ${argv[1].split("/").pop()} command`);
	console.log("Commands:")
	console.log("  init:    Creates a new empty project.");
	console.log("  publish: Submits the mod to the BCMC for approval and publishing.");
	console.log("  help:    Shows this help.\n");
	rl.close();
}

function main(argv)
{
	if (argv[2] && argv[2] == "init")
	{
		init();
	} else if (argv[2] && argv[2] == "publish")
	{
		publish();
	} else if (argv[2] && argv[2] == "help")
	{
		help(argv);
	} else
	{
		if (argv[2])
		{
			console.log("\x1b[1;31mERR\x1b[0m: Invalid argument.");
		} else
		{
			console.log("\x1b[1;31mERR\x1b[0m: Missing required argument.");
		}
		help(argv);
	}
	return 0;
}

main(process.argv);
