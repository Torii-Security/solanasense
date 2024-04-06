import { parseLogs } from '@debridge-finance/solana-transaction-parser';
import { PublicKey } from '@solana/web3.js';
import { parseArrayToJson } from '../../utils';
import { parseErrorFromArray } from '../../utils/errorsParser';
import { sendDataToELK } from '../integrations/elkIntegration';

export const processLogs = async (tx, context, programId: PublicKey, idl: any) => {
        let isError = tx.err ? true : false;
        let sanitizedLogs = tx.logs;
        let parsedLogs;
        try {
            parsedLogs = parseLogs(sanitizedLogs);
        } catch(e) {
            if (!tx.logs) return;
            //@todo Fix parsing other logs
            sanitizedLogs = tx.logs.filter(item => item.includes('Program')).filter(item => !item.includes('Program consumption'));
            parsedLogs = parseLogs(sanitizedLogs);
        }
        
        const onlyNeededProgramLogs = parsedLogs.filter((context) => context.programId === programId.toString());
        const finalMessage = {};
        finalMessage['log'] = [];
        for (const log of onlyNeededProgramLogs) {
            if (log.errors.length > 0) {
                // need to send if errors happened in observed program
                const parsedError = parseErrorFromArray(log.logMessages, idl);
                if (!parsedError) {
                    const formatted = parseArrayToJson(log.messages);
                    finalMessage['log'].push(formatted)
                } else {
                    finalMessage['log'].push(parsedError);
                }
            }

            if (isError) {
                // not interested in logging transactions if error happened in other instruction
                continue;
            }

            // if transaction passed, we need to log everything
            if(!log.logMessages) continue;
            const formatted = parseArrayToJson(log.logMessages);
            finalMessage['log'].push(formatted)
        }
        if (finalMessage['log'].length > 0) {
            finalMessage['programId'] = programId.toString();
            finalMessage['updatedAtSlot'] = context.slot;
            finalMessage['timestamp'] = Date.now().toString();
            finalMessage['tx'] = tx.signature;
            finalMessage['isError'] = isError;
            await sendDataToELK(finalMessage);  
        }
}