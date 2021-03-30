/*
 * lib.js
 * 
 * Copyright 2020 Alvarito050506 <donfrutosgomez@gmail.com>
 * Copyright 2020 SArpnt
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
 * @file CritterSDK Library.
 * @author Alvarito050506 <donfrutosgomez@gmail.com> 
 * @copyright 2020 Alvarito050506 <donfrutosgomez@gmail.com>
 * @copyright 2020 The Box Critters Modding Community
 * @license Apache-2.0
 * @version 0.5.1
 * 
 **/

"use strict";

/**
 * Generic callback.
 * @callback callback
 * @param {any} data - The data passed to the callback.
 * 
 **/

/**
 * Fetch API based request.
 * @param {Object} options - The request options.
 * @param {callback} ok_cb - The default callback.
 * @param {callback} err_cb - The error callback.
 * @param {Object} [data] - The request body.
 * @returns {Promise<Object>} The parsed JSON response.
 * 
 **/
function request(options, ok_cb, err_cb, data)
{
	fetch("https://" + options.hostname + options.path, {
		"method": options.method,
		"headers": options.headers,
		"body": (options.method == "POST" && typeof(data) != "undefined") ? JSON.stringify(data) : null
	}).then(function (res) {
		if (res.ok == true)
		{
			return res.json();
		} else
		{
			return new Promise (function (ok_cb, err_cb) {
				err_cb({
					"status": res.status
				});
			});
		}
	}).then(function(res) {
		ok_cb(res);
	});
}

/**
 * @module
 * @name CritterSDK
 * @author Alvarito050506 <donfrutosgomez@gmail.com>
 * @copyright 2020 Alvarito050506 <donfrutosgomez@gmail.com>
 * @copyright 2020 The Box Critters Modding Community
 * @license Apache-2.0
 * @version 0.5.1
 * 
 **/

/**
 * Box Critters Mod API wrapper.
 * 
 **/
class BCModAPI
{
	/**
	 * Creates a SDK instance.
	 * @param {string} [domain="api.bcmc.ga"] - The Box Critters API domain.
	 * @param {string} [token] - The hypothetical Box Critters API authentication token.
	 * 
	 **/
	constructor(domain, token)
	{
		if (!domain)
		{
			this.domain = "api.bcmc.ga"; // "api.boxcritters.com" Plz ;-)
		} else if (typeof(token) == "string")
		{
			this.domain = domain;
		} else
		{
			throw token + " is not a string.";
		}
		if (typeof(token) == "string")
		{
			this.token = token;
		}
	}

	/**
	 * Performs a GET request with this.token as the BoxCritters-Auth header.
	 * @param {string} path - The path of the request.
	 * @returns {Promise<Object>} The parsed JSON response.
	 * 
	 **/
	get(path)
	{
		if (typeof(path) != "string")
		{
			throw path + " is not a string.";
		}

		var res_data = String();

		var options = {
			"hostname": this.domain,
			"port": 443,
			"path": path,
			"method": "GET",
			"headers": {
				/* The hypothetical Box Critters API authentication token. */
				"BoxCritters-Auth": this.token
			}
		};

		return new Promise(function (ok_cb, err_cb) {
			request(options, ok_cb, err_cb);
		});
	}

	/**
	 * Performs a POST request with this.token as the BoxCritters-Auth header and data as request data.
	 * @param {string} path - The path of the request.
	 * @param {string} data - The data of the request.
	 * @returns {Promise<Object>} The parsed JSON response.
	 * 
	 **/
	post(path, data)
	{
		if (typeof(path) != "string")
		{
			throw path + " is not a string.";
		}

		if (typeof(data) != "object")
		{
			throw data + " is not an object.";
		}

		var res_data = String();
		var options = {
			"hostname": this.domain,
			"port": 443,
			"path": path,
			"method": "POST",
			"headers": {
				"Content-Type": "application/json",
				"Content-Length": JSON.stringify(data).length,
				/* The hypothetical Box Critters API authentication token. */
				"BoxCritters-Auth": this.token
			}
		};

		return new Promise(function (ok_cb, err_cb) {
			request(options, ok_cb, err_cb, data);
		});
	}
}
