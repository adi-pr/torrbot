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
        // Track old torrent IDs
        const oldIDs = new Set(data.map(t => t.id));

        // Detect status changes and finished downloads
        data.forEach((torrent) => {
            const current = torrents.find(x => x.id === torrent.id);
            if (!current) return;

            if (torrent.status !== current.status) {
                if (current.status === 6) {
                    transmission.removeTorrent(torrent.id, false);
                    sendMessage(`Download Finished: ${torrent.name}`);
                } else {
                    sendMessage(`Status changed: ${torrent.name} from ${torrent.status} to ${current.status}`);
                }
            }

            if (!torrent.isFinished && current.isFinished) {
                sendMessage(`Download Finished: ${torrent.name}`);
            }
        });

        // Detect newly added torrents
        const newTorrents = torrents.filter(t => !oldIDs.has(t.id));
        newTorrents.forEach(t => {
            sendMessage(`New Torrent Added: ${t.name} (ID: ${t.id})`);
        });
    }

    setTimeout(checkTorrentStatus, 10000, torrents)
}