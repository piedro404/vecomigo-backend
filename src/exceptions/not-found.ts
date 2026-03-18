import { ErrorCodes, HTTP_STATUS } from "@utils/constants.js";
import { HttpException } from "./root.js";

export class NotFoundException extends HttpException {
    constructor(message: string, errorCode: ErrorCodes, errors: any = null) {
        super(message, errorCode, HTTP_STATUS.NOT_FOUND, errors);
    }
}