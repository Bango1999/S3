## Synopsis

Web-facing end of SLmod, to be paired with my other repo [SLmod Stats Cron](https://github.com/Bango1999/SLSC), which runs locally on each DCS game server which is running my modded version of SLmod, [SLmod_S3](https://github.com/Bango1999/SLmod_S3), waiting for new data to send to this server.

[See it in action](http://stats.229ahb.com:4000/)

## Usage

Edit config.js according to your needs. There you can make your own set of tokens for authorization purposes<br/>
Each game server that runs [SLmod_S3](https://github.com/Bango1999/SLmod_S3) and [SLmod Stats Cron](https://github.com/Bango1999/SLSC) can send its Slmod Stats table to this server.<br/>
But they need one of the tokens you create in this file!

Access localhost:4000 in your browser to see the client-end

Flags:
- 'node server.js -v': verbose logging (recommended to get set up)
- 'node server.js -s': no logging (silent) except for errors
- 'node server.js -d': (default) normal logging

WINDOWS ONLY EASE OF ACCESS:
- you can run the app from any of the S3.bat files
- you can create shortcuts to the S3.bat and place them anywhere you want, and run from that

## Motivation

I fly helicopters in a simulator with a unit called the 229th. The simulator is DCS, and the mod is SLmod, which is really neat because it logs game statistics.

The idea was, let's get that data from SLmod and make it web-facing so people can look anytime, say, what their flight hours are for a particular server.

This could help IP's see logged hours, or just let people go and see their kills or deaths.

## Installation

1) Install node.js (full installer .msi file for Windows)<br />
   https://nodejs.org/en/download/<br/>
   or in linux (apt-get/yum install nodejs)

2) from a terminal, git clone https://github.com/Bango1999/S3.git

  3a) a) If Windows, go to the project folder you just cloned in file explorer and run the file Update_S3.bat<br/>
  3b) If not Windows, stay inside the terminal and run 'npm update'

4) Edit config.js in a text editor.<br />
   At the top of the file, you will see a bunch of 'const' variables.<br />
   Set them according to your personal server/setup. Defaults should mostly be fine.

  5a) If Windows, run the file S3_Debug.bat<br />
  5b) If not Windows, test by running 'node server.js -v' in the terminal window<br />


## API Reference

- /api/dcs/slmod/update -> accepts POST JSON content
- /api/web/fetch -> sends POST JSON content to client

## License

MIT
