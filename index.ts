import { Client, LocalAuth } from "whatsapp-web.js";
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

client.on('ready', () => {
    const contactIDs = ['5926002376@c.us', "5926576607@c.us"];
    
    contactIDs.forEach((contactId) => {
        client.sendMessage(contactId, "Bot is ready!");
    })
});

client.initialize();