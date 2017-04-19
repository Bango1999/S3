## Synopsis

Web-facing end of SLmod, to be paired with my other repo TODO UPLOAD

## Usage

Edit config.js according to your needs. There you can make your own set of tokens for authorization purposes
each game server that runs my sister app TODO can send its SlmodStats.lua table to this server
but they need one of the tokens you generate in this file

Runs server on local port 4000, accepts POSTS to /api/dcs/slmod/update and /api/web/fetch directories
Latter route is for other repo to upload json to,
and latter route is for the web server to query the json via ajax request.

access localhost:4000 to see the client end

## Motivation

I fly helicopters in a simulator with a unit called the 229th. The simulator is DCS, and the mod is SLmod, which is really neat because it logs game statistics.

The idea was, let's get that data from SLmod and make it web-facing so people can look anytime, say, what their flight hours are for a particular server.

This could help IP's see logged hours, or just let people go and see their kills or deaths.

## Installation

install nodejs and npm if not already done
cd to repo
npm update
npm start

## API Reference

/api/dcs/slmod/update   {POST json to server}
/api/web/fetch          {POST json to client}


## License

MIT
