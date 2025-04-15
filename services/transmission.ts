import { Transmission } from '@ctrl/transmission';
import { sendMessage } from '..';
import type { GetTorrentRepsonse, Torrent } from "@ctrl/transmission";

export const transmission = new Transmission({
    baseUrl: process.env.TRANSMISSION_BASE_URL || 'http://localhost:9091/',
    username: process.env.TRANSMISSION_USERNAME || '',
    password: process.env.TRANSMISSION_PASSWORD || '',
});

export async function checkTorrentStatus(data?: Array<Torrent>) {
    console.log("Checking for change")
    const response: GetTorrentRepsonse = await transmission.listTorrents()
    const torrents: Array<Torrent> = response.arguments.torrents;

    if (data) {
        data.forEach((torrent) => {
            const findID = (x: Torrent) => x.id == torrent.id
            const index = torrents.findIndex((findID))

            if (torrent.status !== data[index]?.status) {
                const messageContents = `Changed Torrent: ${torrent.name} ${torrent.status}`
                sendMessage(messageContents)
            }
        })
    }


    setTimeout(checkTorrentStatus, 10000, torrents)
}