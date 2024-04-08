import { getAccountTypeFromData } from "../../utils";
import { sendDataToELK } from "../integrations/elkIntegration";

export default async (accountInfo, context, coder, idl, programId) => {
    const { accountId, accountInfo: { data } } = accountInfo;
    const {slot} = context;

    try {
        const deserializedData = coder.accounts.decodeAny(data);
        const accountType = getAccountTypeFromData(data, idl);
        deserializedData['updatedAtSlot'] = slot;
        deserializedData['type'] = accountType;
        deserializedData['timestamp'] = Date.now().toString();
        deserializedData['programId'] = programId.toString();
        deserializedData['accountId'] = accountId.toString();
        await sendDataToELK(deserializedData);
    } catch (error) {
        console.error("Error deserializing data:", error);
    }
}