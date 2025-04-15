import { Transmission } from '@ctrl/transmission';

export const transmission = new Transmission({
    baseUrl: process.env.TRANSMISSION_BASE_URL || 'http://localhost:9091/',
    username: process.env.TRANSMISSION_USERNAME || '',
    password: process.env.TRANSMISSION_PASSWORD || '',
});