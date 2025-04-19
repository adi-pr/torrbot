import { Client, LocalAuth } from "whatsapp-web.js";
import { checkTorrentStatus } from "./services/transmission";
// import * as qrcode from "qrcode-terminal";

export const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: '.wwebjs_cache'
    }),
});

const adminContactIDs = process.env.ADMIN_NUMBERS?.split(',') || [];

export function sendMessage(content: string) {
    adminContactIDs.forEach((contactId) => {
        client.sendMessage(contactId, content);
    })
}

client.on('ready', async () => {
    console.log('Client is ready!');

    const adminContactIDs = process.env.ADMIN_NUMBERS?.split(',') || [];

    await checkTorrentStatus()

    adminContactIDs.forEach((contactId) => {
        sendMessage("Bot is ready!");
    })
})

// Uncomment the following lines to be able to log into whatsapp and generate the .wwedjs_cache folder
// client.on('qr', (qr) => {
//     qrcode.generate(qr, { small: true })
// })

client.on('message', async (message) => {
    const content = message.body.toLowerCase();

    if (adminContactIDs.includes(message.from)) {
        if (content.startsWith('!')) {
            message.reply('Command received: ' + content);
        }
    } else {
        message.reply('Unrecognized user. Please contact the admin.');

        // Notifdy admin about unauthorized access attempt
        const adminMessage = `Unauthorized access attempt detected from ${message.from} (${message.deviceType}) at ${message.timestamp}.\n\nMessage: ${message.body}`;
        sendMessage(adminMessage);
    }
});

client.on('disconnected', (reason) => {
    console.log('Client was logged out', reason);
});

client.on('auth_failure', () => {
    console.error('Authentication failed');
});

client.initialize();