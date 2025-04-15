import { Client, LocalAuth } from "whatsapp-web.js";
import { transmission } from "./services/transmission";
import type { GetTorrentRepsonse, Torrent } from "@ctrl/transmission";
// import * as qrcode from "qrcode-terminal";

export const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: '.wwebjs_cache'
    }),
});

client.on('ready', () => {
    console.log('Client is ready!');
})

// client.on('qr', (qr) => {
//     qrcode.generate(qr, { small: true })
// })

client.on('ready', async () => {
    const contactIDs = process.env.ADMIN_NUMBERS?.split(',') || [];

    contactIDs.forEach((contactId) => {
        client.sendMessage(contactId, "Bot is ready!");
    })
});

client.initialize();