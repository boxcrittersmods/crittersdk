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
 * @version 0.5.0
 * 
 **/

const readline = require("readline");
const fs = require("fs");
const crypto = require("crypto");
const https = require("https");
const http = require("http");
const url = require("url");
const os = require("os");
const child = require("child_process");
const request = require("request");
const path = require("path");

var rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

function open(command)
{
	var start = (process.platform == "darwin" ? "open" : process.platform == "win32" ? "start": "xdg-open");
	return child.exec(`${start} ${command}`);
}

function init()
{
	rl.question("Mod name: ", function (name) {
		rl.question("Mod version: (0.1.0) ", function (version) {
			rl.question("Mod description: ", function (description) {
				rl.question("Mod namespace (website): (https://boxcrittersmods.ga) ", function (namespace) {
					rl.question("Mod author: ", function (author) {
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
	rl.question("Password: ", function (password) {
		fs.readFile(os.homedir() + "/.crittersdk.json", "utf8", function (err, data) {
			if (err)
			{
				console.error(`\x1b[1;31mERR\x1b[0m: ${err}.`);
				return;
			}
			var username = JSON.parse(data).username;
			var token = JSON.parse(data).token;
			var aes = crypto.createDecipher("aes-256-cbc", password);
			var dec = aes.update(token, "hex", "utf8");
			dec += aes.final("utf-8");
			request.get({
				"url": "https://api.github.com/gists",
				"headers": {
					"Accept": "application/json",
					"User-Agent": "CritterSDK",
					"Authorization": `token ${dec}`
				}
			},  function (err, res, body) {
				if (err)
				{
					console.error(`\x1b[1;31mERR\x1b[0m: ${err}.`);
					return;
				}
				var gists = JSON.parse(body);
				fs.readFile(process.cwd() + "/index.user.js", "utf8", function (err, data) {
					if (err)
					{
						console.error(`\x1b[1;31mERR\x1b[0m: ${err}.`);
						return;
					}
					var name = data.match(/\/\/\s*@name\s+(.*)\s*\n/i)[1];
					var description = data.match(/\/\/\s*@description\s+(.*)\s*\n/i)[1];
					var id;
					gists.forEach(function (gist) {
						if (gist.description == name)
						{
							id = gist.id;
						}
					});
					if (id)
					{
						request.patch({
							"url": `https://api.github.com/gists/${id}`,
							"headers": {
								"Accept": "application/json",
								"User-Agent": "CritterSDK",
								"Authorization": `token ${dec}`
							},
							"body": JSON.stringify({
								"description": name,
								"public": true,
								"files": {
									"index.user.js": {
										"content": data
									}
								}
							})
						},  function (err, res, body) {
							if (err)
							{
								console.error(`\x1b[1;31mERR\x1b[0m: ${err}.`);
								return;
							}
							console.log("\x1b[1;37mINFO\x1b[0m: Project published succefully!");
						});
					} else
					{
						request.post({
							"url": "https://api.github.com/gists",
							"headers": {
								"Accept": "application/json",
								"User-Agent": "CritterSDK",
								"Authorization": `token ${dec}`
							},
							"body": JSON.stringify({
								"description": name,
								"public": true,
								"files": {
									"index.user.js": {
										"content": data
									}
								}
							})
						},  function (err, res, body) {
							if (err)
							{
								console.error(`\x1b[1;31mERR\x1b[0m: ${err}.`);
								return;
							}
							request.get({
								"url": `https://api.boxcrittersmods.ga/modsubmit/${new Buffer.from(JSON.parse(body).files["index.user.js"].raw_url).toString("base64")}`,
								"headers": {
									"Accept": "application/json",
									"User-Agent": "CritterSDK",
								}
							}, function (err, res, body) {
								if (err)
								{
									console.error(`\x1b[1;31mERR\x1b[0m: ${err}.`);
									return;
								}
								console.log("\x1b[1;37mINFO\x1b[0m: Project submited succefully!");
							});
						});
					}
				});
			});
			rl.close();
		});
	});
	return 0;
}

function config()
{
	var token;
	var server = http.createServer(function (req, res) {
		var query = url.parse(req.url, true).query;
		res.writeHead(200, {
			"Content-Type": "text/html"
		});
		res.end(`<b style="font-family: sans-serif;">You can now close this window.</b>\n`);
		server.close();
		request.post({
			"url": `https://auth.boxcrittersmods.ga/${JSON.parse(JSON.stringify(query)).code}`,
			"headers": {
				"Accept": "application/json"
			}
		}, function (err, res, body) {
			if (err)
			{
				console.error(`\x1b[1;31mERR\x1b[0m: ${err}.`);
				return;
			}
			if (token)
			{
				return;
			}
			token = JSON.parse(body).access_token;
			if (JSON.parse(body).scope != "gist,read:user,user:email")
			{
				console.error(`\x1b[1;31mERR\x1b[0m: Invalid token.`);
				return;
			}
			request.get({
				"url": "https://api.github.com/user",
				"headers": {
					"Accept": "application/json",
					"User-Agent": "CritterSDK",
					"Authorization": `token ${token}`
				}
			},  function (err, res, body) {
				if (err)
				{
					console.error(`\x1b[1;31mERR\x1b[0m: ${err}.`);
					return;
				}
				var username = JSON.parse(body).login;
				rl.question("Create a new password: ", function (password) {
					var aes = crypto.createCipher("aes-256-cbc", password);
					var enc = aes.update(token, "utf8", "hex");
					enc += aes.final("hex");
					fs.writeFile(os.homedir() + "/.crittersdk.json", `{"username": "${username}", "token": "${enc}"}`, function (err) {
						if (err)
						{
							console.error(`\x1b[1;31mERR\x1b[0m: ${err}.`);
							return;
						}
						rl.close();
					});
				});
			});
		});
	});
	server.listen(7977);
	open("https://github.com/login/oauth/authorize?client_id=7b419d4d83d775bf93a3&scope=gist%20read:user%20user:email");
	return 0;
}

function help(argv)
{
	console.log(`\x1b[1;37mINFO\x1b[0m: Usage: ${argv[1].split("/").pop()} command`);
	console.log("Commands:")
	console.log("  init:    Creates a new empty project.");
	console.log("  config:  Configures the SDK.");
	console.log("  publish: Submits the mod to the BCMC for approval and publishing.");
	console.log("  help:    Shows this help.\n");
	console.log("To get more info, go to https://github.com/boxcritters/crittersdk.\n");
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
	} else if (argv[2] && argv[2] == "config")
	{
		config();
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
