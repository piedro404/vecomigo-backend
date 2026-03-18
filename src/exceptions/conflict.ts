import { ErrorCodes, HTTP_STATUS } from "@utils/constants.js";
import { HttpException } from "./root.js";

export class ConflictException extends HttpException {
    constructor(message: string, errorCode: ErrorCodes, errors: any = null) {
        super(message, errorCode, HTTP_STATUS.CONFLICT, errors);
    }
}