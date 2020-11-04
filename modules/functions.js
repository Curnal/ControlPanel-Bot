const moment = require('moment');
const fs = require("fs");
const Discord = require('discord.js');
const { report } = require('snekfetch');

module.exports = (client) => {

    client.download = (savePath, file) => {
        return new Promise(async (resolve, reject) => {

            await fs.writeFileSync(savePath, file, function (err) {
                if (err) {
                    reject(err);
                }
            });
        })
    }

    client.wait = (ms) => {
        let start = new Date().getTime();
        let end = start;
        while (end < start + ms) {
            end = new Date().getTime();
        }
        return;
    }

    client.log = (title, msg) => {
        let time = moment().format(client.config.timeFormat);
        if (!title) title = 'Log';
        console.log(`${time} [${title}] ${msg}`);
    };

    client.checkPerms = (message) => {
        return (message.member.hasPermission('ADMINISTRATOR') || client.isOwner(message));
    }

    client.isOwner = (message) => {
        return (client.config.owners.includes(message.author.id));
    }

    client.check = (id) => {
        client.serverDB.ensure(id, client.defaultServerDB);
    }

    // CREDIT: https://github.com/ledlamp/puppeteer-discord-bot/
    client.getSite = async (channel, url) => {
        let browser = await puppeteer.launch({args: ["--no-sandbox"/*openvz*/]});
        try {
            var page = await browser.newPage();
            await page.setViewport({ width: 1440, height: 900 });
            await page.goto(url, { waitUntil: 'networkidle2' });
            var screenshot = await page.screenshot({type: 'png'});
            await channel.send({files: [{attachment: screenshot, name: "screenshot.png" }]});
        } catch {
        } finally {
            try {
                await page.close();
            } catch (e) {
                process.exit(1);
            }
        }
    }

}