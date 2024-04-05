import { Connection, PublicKey } from '@solana/web3.js';
import { BorshCoder, Idl, Program, AnchorProvider, Wallet} from "@coral-xyz/anchor";
import * as fs from 'fs';
import { discriminator } from '@coral-xyz/anchor/dist/cjs/coder/borsh/discriminator';
import camelcase from 'camelcase';
    
function getAccountDiscriminator(name: string): Buffer {
    const discriminatorPreimage = `account:${camelcase(name, {
      pascalCase: true,
      preserveConsecutiveUppercase: true,
    })}`;
    return discriminator(discriminatorPreimage);
  }

/**
 * Gets the account type from the data using Anchor's discriminator.
 * @param data The raw account data from Solana.
 * @returns The name of the account type, or null if not found.
 */
function getAccountTypeFromData(data: Buffer): string | null {
    // The discriminator is the first 8 bytes of the account data
    const discriminator = data.slice(0, 8);

    for (const account of idl.accounts) {
        const accountDiscriminator = getAccountDiscriminator(account.name);

        // Check if the discriminator matches
        if (discriminator.equals(accountDiscriminator)) {
            return account.name; // Return the matching account name
        }
    }

    return null; // Return null if no account type matches
}

// Load your IDL
const idl: Idl = JSON.parse(fs.readFileSync('orca.json', 'utf8'));

// Your program's ID
const programId = new PublicKey('whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc');

// Setup connection
// const connection = new Connection("wss://mainnet.helius-rpc.com/?api-key=ff08e17a-b01b-4ce5-9b29-61ccaa6e51d3", "confirmed");
const connection = new Connection("https://mainnet.helius-rpc.com/?api-key=ff08e17a-b01b-4ce5-9b29-61ccaa6e51d3", "confirmed");

// Initialize Anchor provider
// const provider = new AnchorProvider(connection, AnchorProvider.local().wallet, { commitment: "confirmed" });

// Initialize your program
// const program = new Program(idl, programId, provider);

// Use BorshCoder for deserialization
const coder = new BorshCoder(idl);

async function main() {

    // Listen to account changes for the program
    const subscriptionId = connection.onProgramAccountChange(programId, async (accountInfo, context) => {
        const { accountId, accountInfo: { data } } = accountInfo;
        const {slot} = context;

        console.log(`Account ${accountId.toBase58()} changed.`);
        
        // Assuming you know the layout/name of the data structure you're interested in, e.g., "YourDataType"
        try {
            const deserializedData = coder.accounts.decodeAny(data);
            const accountType = getAccountTypeFromData(data);
            deserializedData['updatedAtSlot'] = slot;
            deserializedData['type'] = accountType;
            deserializedData['timestamp'] = Date.now().toString();
            const formattedData = JSON.stringify(deserializedData, null, 2); // Indent with 2 spaces
            console.log("Deserialized Data:", formattedData);

            console.log("Deserialized Data:", deserializedData);
        } catch (error) {
            console.error("Error deserializing data:", error);
        }
    });

    console.log(`Subscribed to account changes for program ${programId.toBase58()} with subscription ID ${subscriptionId}`);
}

main().catch(console.error);