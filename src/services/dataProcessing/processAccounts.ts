import { getAccountTypeFromData } from "../../utils";
import { sendDataToELK } from "../integrations/elkIntegration";

export default async (accountInfo, context, coder, idl) => {
    const { accountId, accountInfo: { data } } = accountInfo;
    const {slot} = context;

    console.log(`Account ${accountId.toBase58()} changed.`);
    
    try {
        const deserializedData = coder.accounts.decodeAny(data);
        const accountType = getAccountTypeFromData(data, idl);
        deserializedData['updatedAtSlot'] = slot;
        deserializedData['type'] = accountType;
        deserializedData['timestamp'] = Date.now().toString();
        await sendDataToELK(deserializedData);
    } catch (error) {
        console.error("Error deserializing data:", error);
    }
}