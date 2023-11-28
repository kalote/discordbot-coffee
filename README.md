# LUKSO discord bot

A simple discord bot that will:

- send a weekly message that will randomly pair users of a channel together so that they can have a virtual coffee or mate or hot chocolate or tea ☕️
- send a weekly reminder in a specific channel to @everyone about what they want for lunch for next week

## Install

```javascript
npm i
cp .env.example .env // fill in all the required info
npm start
```

## To do on prod

- put the @ here in cronLunch.ts
- remove `.tag` in cronCoffee.ts
- remove comments on ready.ts
