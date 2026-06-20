export interface PayloadCodec {
  packJson<T>(value: T, context: string): Promise<string>;
  unpackJson<T>(payload: string, context: string): Promise<T>;
}
