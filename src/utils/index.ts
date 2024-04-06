import { discriminator as anchorDiscriminator } from '@coral-xyz/anchor/dist/cjs/coder/borsh/discriminator';
import camelcase from 'camelcase';
import { Idl} from "@coral-xyz/anchor";
import * as fs from 'fs';

function getAccountDiscriminator(name: string): Buffer {
    const discriminatorPreimage = `account:${camelcase(name, {
      pascalCase: true,
      preserveConsecutiveUppercase: true,
    })}`;
    return anchorDiscriminator(discriminatorPreimage);
  }

/**
 * Gets the account type from the data using Anchor's discriminator.
 * @param data The raw account data from Solana.
 * @returns The name of the account type, or null if not found.
 */
export const getAccountTypeFromData = (data: Buffer, idl: any): string | null => {
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

export const getIdl = (path: string): Idl => {
  return JSON.parse(fs.readFileSync(path, 'utf8'));
}

export const parseArrayToJson = (array) => {
  // Initialize an empty object to store our key-value pairs
  const result = {};

  // Iterate over each element in the array
  array.forEach(item => {
    // Split the string into a key-value pair
    let [key, value] = item.split(': ');

    // Adjust the key to match the required format
    key = key.toLowerCase().replace(' ', '_');

    // Convert numerical values from string to number
    if (!isNaN(value)) {
      value = Number(value);
    }

    // Assign the key-value pair to the result object
    result[key] = value;
  });

  return result;
}