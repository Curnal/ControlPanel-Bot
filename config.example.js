/*

 Made by: FlaringPhoenix#0001

*/

// Do not change
let author = "FlaringPhoenix#0001";

// Basic options (all required)
let botName = "ControlPanel";
let owners = ["707022994421186651"];

// Token
let token = "";

// Time format for console logging
let timeFormat = "D MMM YYYY HH:mm:ss";

// Prefix for bot dms
let dmPrefix = "cp!";

// Your server links
let links = {
    discord: "https://discord.gg/NEYMcRW",
    website: "https://bluefoxhost.com",
}

// Default embed options
let embed = {
    color: "#27a9e1",
    footer: "ControlPanel"
}

// Toggle command trigger message
let deleteCommands = false;

// If a command is disabled the bot will ignore it
let disabledCommands = [];

// Toggle logging messages in console
let log = {
    commands: true,
    errors: true,
}

module.exports = {
    author,
    botName,
    owners,
    token,
    timeFormat,
    dmPrefix,
    links,
    embed,
    deleteCommands,
    disabledCommands,
    log,
}
