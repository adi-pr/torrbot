import { Client, LocalAuth } from "whatsapp-web.js";
import { checkTorrentStatus } from "./services/transmission";
// import * as qrcode from "qrcode-terminal";

export const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: '.wwebjs_cache'
    }),
});

export function sendMessage(content: string) {
    const contactIDs = process.env.ADMIN_NUMBERS?.split(',') || [];

    contactIDs.forEach((contactId) => {
        client.sendMessage(contactId, content);
    })
}

client.on('ready', () => {
    console.log('Client is ready!');
})

// client.on('qr', (qr) => {
//     qrcode.generate(qr, { small: true })
// })

client.on('ready', async () => {
    const contactIDs = process.env.ADMIN_NUMBERS?.split(',') || [];

    await checkTorrentStatus()

    contactIDs.forEach((contactId) => {
        client.sendMessage(contactId, "Bot is ready!");
    })
});

client.initialize();