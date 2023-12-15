# LUKSO discord bot

A discord bot that will:

- Coffee: send a weekly message that will randomly pair users of a channel together so that they can have a virtual coffee or mate or hot chocolate or tea ☕️
- Lunch Reminder: send a weekly reminder in a specific channel to @everyone about what they want for lunch for next week
- /solve command: use the `/solve` command in thread to automatically close a support / feature request thread

The bot uses `discord.js` library to setup the crons on the `on.ready` event, and the slash command on the `on.events` event.

## Install

```javascript
npm i
cp .env.example .env // fill in all the required info
npm start
```

## Infra

This bot is deployed as a GCP Cloud run instance. No database or redis server needed. 
In order to work properly, Cloud run needs a port exposed on the container to do health check. That's why there is a small web-server running (even though it's not needed by the discord bot) in the `src/bot.ts` file.

## Application

The main entrypoint is in `src/bot.ts`. It contains:
- the client init
- the loop to register the slash command (loop through all files in the `src/commands` folder)
- the listener registration (`on.ready` (crons) and `on.events` (slash commands))
- the client login
- the health-check web server

The cron are located in the `src/cron` folder:
- cronCoffee loops through the members of the `all-teams` channel, filter some members, and pair members using randomness, then sends a message
- cronLunch sends a message in the `berlin-team` channel

The slash commands are split in 2 categories: the one that are in production (in `commands` folder), and the ones that are not ready yet (in `commands-not-ready` folder).
To register a slash commands, it needs to be registered:
- once with the `script/deploy.ts` 
- every time the server starts (in the `src/bot.ts` and `listeners/events.ts`)

A slash command needs to export 2 attributes:
- data: the information about the command
- execute: the function to execute

The slash command `/solve` can be used:
- only in thread channel (channel with parentId that is a forum)
- only by original poster OR member of the `allowedRoles` roles
and it will:
- close the thread
- add the `Solved` tag
- post a last message on the thread

A lot more can be done on the bot! Check with Prazen for ideas :)