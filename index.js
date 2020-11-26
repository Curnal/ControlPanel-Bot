// Start time
let startDate = new Date();

// Bot Dependencies
const Discord = require("discord.js");
const fs = require("fs");
const Enmap = require('enmap');
require('moment-duration-format');

// Set mobile status
Discord.Constants.DefaultOptions.ws.properties.$browser = "Discord Android";

// Create client
const client = new Discord.Client();

// Loads config.js
config = require('./config.js');
client.config = config;

// Start time
client.startDate = startDate;

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

client.defaultServerDB = {
    commandsRun: 0,
    prefix: "cp!!",
    panel: {
        apiKey: "",
        url: "",
        serversCreated: 0
    },
    nodes: [],
    store: {
        payments: [],
        packages: [],
        logChannel: null
    }

}

client.modules = [
    "general",
    "owner",
    "panel",
    "staff",
    "billing"
]

// Load modules
fs.readdir(`${process.cwd()}/modules/`, (err, files) => {
    if (err) { throw err }
    for (const file of files) {
        if (!file.endsWith(".js")) continue;
        require(`${process.cwd()}/modules/${file}`)(client);
    }
    client.log("BOT", "Starting...");
    client.log("BOT", "Loaded modules");

    // Load discord events
    client.loadEvents();

    // Load commands
    client.loadCommands();
});


// Log into client
try {
    client.login(client.config.token);
} catch(e) {
    console.error(`Invalid token: ${e}`);
    return;
}
