export class Message<T> {
  constructor(
    public data?: T,
    public message: string = 'Sucess operation',
    public statusCode: number = 200,
  ) {
    this.statusCode = statusCode;
    this.message = message;
    if (data) this.data = data;
  }
}
