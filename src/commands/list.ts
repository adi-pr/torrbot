import type { Client, Message } from "whatsapp-web.js";
import { transmission } from "../../services/transmission";

interface IListTorrentCommand {
    client: Client;
    message: Message;
    argStrings: string[];
}

function listTorrents({ client, message, argStrings }: IListTorrentCommand) {
    const flag = argStrings[0];

    if (flag === "active") {
        transmission.listTorrents().then((response) => {
            const torrents = response.arguments.torrents.filter(torrent => torrent.status === 4);
            if (torrents.length === 0) {
                message.reply("No active torrents found.");
                return;
            }

            const torrentList = torrents.map(torrent => {
                const eta = torrent.eta === -1 ? "unknown" : torrent.eta;
                const humanReadableEta = eta === "unknown" ? "unknown" : new Date(eta * 1000).toISOString().substr(11, 8);
                return `Name: ${torrent.name}, ETA: ${humanReadableEta}`;
            }).join("\n");

            message.reply(`Active torrents:\n${torrentList}`);
        }).catch((error) => {
            console.error("Error fetching active torrents:", error);
            message.reply("Error fetching active torrents.");
        });
    } else if (flag === "finished") {
        transmission.listTorrents().then((response) => {
            const finishedTorrents = response.arguments.torrents.filter(torrent => torrent.status === 6);
            const torrents = finishedTorrents;
            if (torrents.length === 0) {
                message.reply("No finished torrents found.");
                return;
            }
            const torrentList = torrents.map(torrent => `ID: ${torrent.id}, Name: ${torrent.name}, Status: ${torrent.status}`).join("\n");
            message.reply(`Finished torrents:\n${torrentList}`);
        }).catch((error) => {
            console.error("Error fetching finished torrents:", error);
            message.reply("Error fetching finished torrents.");
        });
    } else if (flag === "all") {
        transmission.listTorrents().then((response) => {
            const torrents = response.arguments.torrents;
            if (torrents.length === 0) {
                message.reply("No torrents found.");
                return;
            }
            const torrentList = torrents.map(torrent => `ID: ${torrent.id}, Name: ${torrent.name}, Status: ${torrent.status}`).join("\n");
            message.reply(`All torrents:\n${torrentList}`);
        }).catch((error) => {
            console.error("Error fetching all torrents:", error);
            message.reply("Error fetching all torrents.");
        });
    } else {
        message.reply("Invalid flag. Use 'active', 'finished', or 'all'.");
        return;
    }
    message.reply("Listing torrents...");
}

export default listTorrents;