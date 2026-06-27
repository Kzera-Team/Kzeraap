export class AuthenticatedAppErrorState {
  private currentError = '';

  get value(): string {
    return this.currentError;
  }

  set(value: string): void {
    this.currentError = value;
  }

  clear(): void {
    this.currentError = '';
  }
}
