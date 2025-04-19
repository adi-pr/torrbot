import type { Client, Message } from "whatsapp-web.js";

interface IListTorrentCommand {
    client: Client;
    message: Message;
    argStrings: string[];
}

function listTorrents({ client, message, argStrings }: IListTorrentCommand) {
    console.log("🚀 ~ listTorrents ~ args:", argStrings)
    
    message.reply("Listing torrents...");
}

export default listTorrents;