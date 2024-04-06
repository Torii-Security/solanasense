import { Connection, PublicKey } from '@solana/web3.js';
import { processLogs } from '../dataProcessing/processLogs';

export const subscribeToLogs = async (connection: Connection, programId: PublicKey, idl: any) => {
    return connection.onLogs(programId, async (tx, context) => {
        try {
            await processLogs(tx, context, programId, idl);
        } catch(e) {
            console.log(e);
        }
    });
}