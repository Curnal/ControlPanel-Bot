// Start time
let startDate = new Date();

// Bot Dependencies
const Discord = require("discord.js");
const fs = require("fs");
const Enmap = require('enmap');
require('moment-duration-format');

// Create client
const client = new Discord.Client();

// Loads config.js
config = require('./config.js');
client.config = config;

// Start time
client.startDate = startDate;

// Categories of commands
const modules = [ 'general', 'owner', 'staff', 'panel' ];
client.modules = modules;

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

client.serverDB = new Enmap({
    name: "servers",
    fetchAll: true,
    autoFetch: true,
    dataDir: "./database/servers/",
    cloneLevel: 'deep'
});

client.userDB = new Enmap({
    name: "users",
    fetchAll: true,
    autoFetch: true,
    dataDir: "./database/users/",
    cloneLevel: 'deep'
});

// Sets default settings for each server
const defaultServerDB = {
    commandsRun: 0,
    prefix: "cp!!",
    panel: {
        apiKey: "",
        url: ""
    },
    nodes: []
}

client.defaultServerDB = defaultServerDB;

// Load modules
fs.readdir(`${process.cwd()}/modules/`, (err, files) => {
    if (err) { throw err }
    for (const file of files) {
        if (!file.endsWith(".js")) continue;
        require(`${process.cwd()}/modules/${file}`)(client);
    }
});

// Command handler
modules.forEach(cmd => {
    fs.readdir(`./commands/${cmd}/`, (err, files) => {
        if (err) { throw err }
        files.forEach(f => {
            let commandName = f.split(".")[0];
            const props = require(`./commands/${cmd}/${f}`);
            if (!client.config.disabledCommands.includes(commandName)) {
                client.commands.set(commandName, props);
                props.help.aliases.forEach(a => {
                    client.aliases.set(a, props.help.name)
                });
            }
        });
    });
});

// Discord Event handler
fs.readdir(`${process.cwd()}/events/`, (err, files) => {
    if (err) { throw err }
    for (const file of files) {
        if (!file.endsWith(".js")) continue;
        let event = require(`${process.cwd()}/events/${file}`);
        let eventName = file.split(".")[0];
        client.on(eventName, event.bind(null, client));
        delete require.cache[require.resolve(`${process.cwd()}/events/${file}`)];
    }
});

// Log into client
try {
    client.login(client.config.token);
} catch(e) {
    console.error(`Invalid token: ${e}`);
    return;
}