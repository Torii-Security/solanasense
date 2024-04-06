import { Connection, PublicKey } from '@solana/web3.js';
import processAccounts from '../dataProcessing/processAccounts';

export const subscribeToAccountChanges = (connection: Connection, programId: PublicKey, coder: any, idl: any) => {
    return connection.onProgramAccountChange(programId, async (accountInfo, context) => {
        await processAccounts(accountInfo, context, coder, idl, programId)
    });
};