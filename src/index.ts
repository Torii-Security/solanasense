import { Connection, PublicKey } from '@solana/web3.js';
import { SOLANA_CONFIG } from './config';
import { BorshCoder, Idl} from "@coral-xyz/anchor";
import { subscribeToAccountChanges } from './services/dataRetrival/accountChanges';
import { getIdl } from './utils';

async function main() {
    const connection = new Connection(SOLANA_CONFIG.CONNECTION_URL, "confirmed");
    const programId = new PublicKey(SOLANA_CONFIG.PROGRAM_ID);
    const idl: Idl = getIdl(SOLANA_CONFIG.IDL_PATH);
    const coder = new BorshCoder(idl);

    await subscribeToAccountChanges(connection, programId, coder, idl);
}

main().catch(console.error);