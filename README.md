# janus-test

This branch is modified to work on the Vacillate VM provisioned for the Decidio team. It uses SSL termination on WSS/HTTPS by virtue of the node-http-proxy. All services but Janus use a self-signed SSL certificate. **The Janus instance is not configured to refuse HTTP or normal WS requests/connections. However all requests made by the client and express server should go through the proxy.** 

**It is important to note here that since the Janus instance and all other services are running on the same host, the proxy simply routes SSL-terminated traffic through localhost. The proxy prevents the mixed-content warning when accessing Janus, while allowing it to keep using HTTP. DO NOT proxy traffic over the web, it no longer has HTTPS protection!!**

A test app for the Janus WebRTC server. Contains a Fedora dockerfile for a Janus container, and a simple express api server. In addition, original source code for reunitus react app taken from 
https://github.com/agonza1/reunitus.

The purpose of this project is to serve as a proof of concept for how communication works with clients between Janus and clients, and how a server might make a call to Janus using the barebones HTTP API.

## Setup 
Run <code>npm install</code> in the reunitus and express projects.

## Startup
Build and start the docker image by using <code>docker compose up</code> in the janus directory. Start the react dev server and express server with <code>npm start</code>. 

The react app is hosted on <code>localhost:3000</code>. The express server is hosted on <code>localhost:3001</code>. The Janus container should now be hosted on port <code>8088</code>.

## Repo Privacy
This repo doesn't follow best practices, and there are some secrets committed here, mainly in the janus config files. **Do not expose this repo to the public!**

## Helpful Links
- https://janus.conf.meetecho.com/docs/deploy.html
- https://webrtc.ventures/2020/12/janus-webrtc-media-server-video-conference-app/
- https://janus.conf.meetecho.com/docs/videoroom.html
- https://github.com/meetecho/janus-gateway
- https://janus.conf.meetecho.com/docs/JS.html
