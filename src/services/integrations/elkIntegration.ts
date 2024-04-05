import axios from 'axios';
import { SOLANA_CONFIG } from '../../config';

export async function sendDataToELK(data: any) {
    try {
        await axios.post(SOLANA_CONFIG.ELK_URL, data, {
            headers: { 'Content-Type': 'application/json' },
        });
        console.log('Data sent to ELK successfully');
    } catch (error) {
        console.error('Failed to send data to ELK:', error);
    }
}