import { Idl } from "@coral-xyz/anchor";
import { IdlErrorCode } from "@coral-xyz/anchor/dist/cjs/idl";

// Define TypeScript interfaces for error details and the structure of the events array
interface ErrorDetail {
    code: number;
    name: string;
    msg: string;
  }
  
  interface EventsArray {
    errors: ErrorDetail[];
  }
  
  // Function to parse the input array and find the error number
  function findErrorNumber(inputArray: string[]): number | null {
    // Regular expression to find the error number
    const errorNumberRegex = /Error Number: (\d+)/;
  
    for (const item of inputArray) {
      const match = item.match(errorNumberRegex);
      if (match) {
        return parseInt(match[1], 10);
      }
    }
  
    // Return null if no error number found
    return null;
  }
  
  // Function to find error details by code in the events array
  function findErrorDetailsByCode(errors: IdlErrorCode[], errorCode: number): IdlErrorCode | undefined {
    return errors.find(error => error.code === errorCode);
  }
  
  export const parseErrorFromArray = (inputArray: string[], idl: Idl): IdlErrorCode | undefined => {

    const errors = idl.errors;

    if (!errors) {
        console.log("Cannot parse errors - missing data in IDL");
        return null;
    }   

    const errorCode = findErrorNumber(inputArray);

    if (!errorCode) {
        console.log("Cannot find error code in array");
        return null;
    }

    const errorDetails = findErrorDetailsByCode(errors, errorCode);

    return errorDetails;
  }