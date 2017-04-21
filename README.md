## Synopsis

Web-facing end of SLmod, to be paired with my other repo [SLmod Stats Cron](https://github.com/Bango1999/SLSC), which runs locally on each DCS game server which is running my modded version of SLmod, [SLmod_S3](https://github.com/Bango1999/SLmod_S3), waiting for new data to send to this server.

[See the Demo](http://1stcav.servegame.com:229/)

## Usage

Edit config.js according to your needs. There you can make your own set of tokens for authorization purposes<br/>
Each game server that runs [SLmod_S3](https://github.com/Bango1999/SLmod_S3) and [SLmod Stats Cron](https://github.com/Bango1999/SLSC) can send its Slmod Stats table to this server.<br/>
But they need one of the tokens you create in this file!

Runs web server on local port 4000, accepts POSTS to<br/>
/api/dcs/slmod/update<br/>
and<br/>
/api/web/fetch

The former route is for other repo to upload json to,<br/>
The latter route is for the web server to query the json via ajax request.

Access localhost:4000 in your browser to see the client-end

## Motivation

I fly helicopters in a simulator with a unit called the 229th. The simulator is DCS, and the mod is SLmod, which is really neat because it logs game statistics.

The idea was, let's get that data from SLmod and make it web-facing so people can look anytime, say, what their flight hours are for a particular server.

This could help IP's see logged hours, or just let people go and see their kills or deaths.

## Installation

install nodejs and npm if not already done<br />
cd to repo<br />
npm update<br />
npm start

## API Reference

/api/dcs/slmod/update -> sends POST json to server<br />
/api/web/fetch -> sends POST json to client

## License

MIT
