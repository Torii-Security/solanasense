import dotenv from 'dotenv';
dotenv.config();

export const SOLANA_CONFIG = {
    PROGRAM_ID: process.env.PROGRAM_ID,
    CONNECTION_URL: process.env.CONNECTION_URL,
    ELK_URL: process.env.ELK_URL,
    IDL_PATH: process.env.IDL_PATH
};