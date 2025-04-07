export class ErrorApp extends Error {
  readonly status: number;

  private constructor(message: string, status: number) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
  }

  public static badRequest(message: string) {
    return new ErrorApp(message, 400);
  }

  public static unauthorized(message: string) {
    return new ErrorApp(message, 401);
  }

  public static forbidden(message: string) {
    return new ErrorApp(message, 403);
  }

  public static notFount(message: string) {
    return new ErrorApp(message, 404);
  }

  public static internal(message: string) {
    return new ErrorApp(message, 500);
  }
}
