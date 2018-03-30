export class ResponseMessage {
  private statusCode: number;

  constructor(statusCode = 200) {
    this.statusCode = statusCode;
  }
}

export const successResponse = new ResponseMessage();
