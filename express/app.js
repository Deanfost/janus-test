import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import Janus from 'janus-room/janus.js';
import fetch from 'node-fetch';
import cors from 'cors';
import https from 'https';

const janusURL = 'https://localhost:7001/janus'; // PROXY ADDRESS FOR JANUS HTTP (actual: http://localhost:8088)

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

// USE THIS FOR ALL FETCH CALLS, it allows for self-signed certs
const httpsAgent = new https.Agent({
	rejectUnauthorized: false
});

// API routes
app.post('/create-room/:roomID', async function (req, res, next) {
	// Create new room
	let { roomID } = req.params;
	roomID = parseInt(roomID);
	let endpoint = janusURL;
	try {
		let result = await fetch(endpoint, {
			method: 'POST',
			agent: httpsAgent,
			body: JSON.stringify({
				janus: 'Create',
				transaction: Janus.randomString()
			})
		});
		let body = await result.json();
		if (body['janus'] != 'success') return next(body);
		const sessionId = body['data']['id'];
		endpoint += '/' + sessionId; // http://localhost:8088/janus/<sessionid>
		const sessionEndpoint = endpoint;

		// Attach session to videoroom plugin
		result = await fetch(endpoint, {
			method: 'POST',
			agent: httpsAgent,
			body: JSON.stringify({
				janus: 'attach',
				plugin: 'janus.plugin.videoroom',
				transaction: Janus.randomString()
			})
		});
		body = await result.json();
		if (body['janus'] != 'success') return next(body);
		const pluginId = body['data']['id'];
		endpoint += '/' + pluginId; // http://localhost:8088/janus/<session>/<pluginid>

		// Fetch a create request for the session
		result = await fetch(endpoint, {
			method: 'POST',
			agent: httpsAgent,
			body: JSON.stringify({
				janus: 'message',
				transaction: Janus.randomString(),
				body: {
					request: 'create',
					room: roomID,
					publishers: 20,
					bitrate: 1000, // 480p
					bitrate_cap: true,
					fir_freq: 10,
					audiolevel_event: true, // Tell subs that a person is speaking
				}
			})
		});
		body = await result.json();
		if (body['janus'] != 'success') return next(body);
		const room = body['plugindata']['data'];

		// Destroy current session
		await fetch(sessionEndpoint, {
			method: 'POST',
			agent: httpsAgent, 
			body: JSON.stringify({
				"janus" : "destroy",
        		"transaction" : Janus.randomString()
			})
		});

		// send response
		res.json(room);
	} catch (error) {
		console.log(err);
		next();
	}
});

app.delete('/destroy-room/:roomID', async function (req, res, next) {
	// Create new room
	let { roomID } = req.params;
	roomID = parseInt(roomID);
	let endpoint = janusURL;
	try {
		let result = await fetch(endpoint, {
			method: 'POST',
			agent: httpsAgent,
			body: JSON.stringify({
				janus: 'Create',
				transaction: Janus.randomString()
			})
		});
		let body = await result.json();
		if (body['janus'] != 'success') return next(body);
		const sessionId = body['data']['id'];
		endpoint += '/' + sessionId; // http://localhost:8088/janus/<sessionid>
		const sessionEndpoint = endpoint;

		// Attach session to videoroom plugin
		result = await fetch(endpoint, {
			method: 'POST',
			agent: httpsAgent,
			body: JSON.stringify({
				janus: 'attach',
				plugin: 'janus.plugin.videoroom',
				transaction: Janus.randomString()
			})
		});
		body = await result.json();
		if (body['janus'] != 'success') return next(body);
		const pluginId = body['data']['id'];
		endpoint += '/' + pluginId; // http://localhost:8088/janus/<session>/<pluginid>

		// Fetch a create request for the session
		result = await fetch(endpoint, {
			method: 'POST',
			agent: httpsAgent,
			body: JSON.stringify({
				janus: 'message',
				transaction: Janus.randomString(),
				body: {
					request: 'destroy',
					room: roomID
				}
			})
		});
		body = await result.json();
		if (body['janus'] != 'success') return next(body);
		const room = body['plugindata']['data'];

		// Destroy current session
		await fetch(sessionEndpoint, {
			method: 'POST',
			agent: httpsAgent, 
			body: JSON.stringify({
				"janus" : "destroy",
        		"transaction" : Janus.randomString()
			})
		});

		// send response
		res.json(room);
	} catch (error) {
		console.log(err);
		next();
	}
});

app.get('/list-rooms', async function (req, res, next) {
	try {
		let endpoint = janusURL;
		// Find existing rooms; create new session
		let result = await fetch(endpoint, {
			method: 'POST',
			agent: httpsAgent,
			body: JSON.stringify({
				janus: 'Create',
				transaction: Janus.randomString()
			})
		});
		let body = await result.json();
		if (body['janus'] != 'success') return next(body);
		const sessionId = body['data']['id'];
		endpoint += '/' + sessionId; // http://localhost:8088/janus/<sessionid>
		const sessionEndpoint = endpoint;

		// Attach session to videoroom plugin
		result = await fetch(endpoint, {
			method: 'POST',
			agent: httpsAgent,
			body: JSON.stringify({
				janus: 'attach',
				plugin: 'janus.plugin.videoroom',
				transaction: Janus.randomString()
			})
		});
		body = await result.json();
		if (body['janus'] != 'success') return next(body);
		const pluginId = body['data']['id'];
		endpoint += '/' + pluginId; // http://localhost:8088/janus/<session>/<pluginid>

		// List created rooms; talk to video room plugin
		result = await fetch(endpoint, {
			method: 'POST',
			agent: httpsAgent,
			body: JSON.stringify({
				janus: 'message',
				transaction: Janus.randomString(),
				body: {
					request: 'list'
				}
			})
		});
		body = await result.json();
		if (body['janus'] != 'success') return next(body);
		const rooms = body['plugindata']['data']['list'];

		// Destroy current session
		await fetch(sessionEndpoint, {
			method: 'POST',
			agent: httpsAgent, 
			body: JSON.stringify({
				"janus" : "destroy",
        		"transaction" : Janus.randomString()
			})
		});

		// Send response
		res.json(rooms);
	} catch (err) {
		console.error(err);
		next(err);
	}
});

export default app;
