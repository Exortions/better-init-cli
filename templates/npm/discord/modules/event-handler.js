const fs = require('fs');

const Discord = require('discord.js');

function loadAllEvents(client) {
    fs.readdirSync(__dirname.substring(0, __dirname.length - 7) + `events/`).forEach(file => {
        const eventName = file.split('.')[0];
        const event = require(__dirname.substring(0, __dirname.length - 7) + `events/${file}`);
        client.on(eventName, () => {
            event(client);
        });
    });
}

module.exports = loadAllEvents;