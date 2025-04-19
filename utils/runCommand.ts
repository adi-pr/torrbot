import type { Client, Message } from "whatsapp-web.js";

export async function runCommand(input: string, client: Client, message: Message) {
    const [rawCommand, ...argStrings] = input.split(' ');
    const command = rawCommand && rawCommand.startsWith('!') ? rawCommand.slice(1) : rawCommand || '';
    
    try {
        const funcModule = await import(`../src/commands/${command}`);
        const func = funcModule.default;
        
        if (typeof func !== 'function') {
            throw new Error(`${command} is not a valid function`);
        }
        
        return func({client, message, argStrings});
    } catch (error) {
        console.error(`Error running function "${command}":`, error);
        throw error;
    }
}