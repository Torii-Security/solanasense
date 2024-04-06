import { Connection, PublicKey } from '@solana/web3.js';
import { SOLANA_CONFIG } from './config';
import { BorshCoder, Idl} from "@coral-xyz/anchor";
import { subscribeToAccountChanges } from './services/dataRetrival/accountChanges';
import { getIdl } from './utils';
import { subscribeToLogs } from './services/dataRetrival/logs';

async function main() {
    const connection = new Connection(SOLANA_CONFIG.CONNECTION_URL, "confirmed");
    const programId = new PublicKey(SOLANA_CONFIG.PROGRAM_ID);
    const idl: Idl = getIdl(SOLANA_CONFIG.IDL_PATH);
    const coder = new BorshCoder(idl);

    const accountChangeSubscription = await subscribeToAccountChanges(connection, programId, coder, idl);
    const accountOnLogsSubscription = await subscribeToLogs(connection, programId, idl);

    const cleanup = () => {
        connection.removeAccountChangeListener(accountChangeSubscription)
            .then(() => {
                console.log(`Unsubscribed from changes to program ${programId.toBase58()}`);
            })
            .catch((error) => {
                console.error("Failed to unsubscribe:", error);
            });

        connection.removeOnLogsListener(accountOnLogsSubscription)
            .then(() => {
                console.log(`Unsubscribed from changes to program ${programId.toBase58()}`);
            })
            .catch((error) => {
                console.error("Failed to unsubscribe:", error);
            });
    }

    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);
}

main().catch(console.error);