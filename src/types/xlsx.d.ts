declare module 'xlsx' {
  export interface WorkBook {
    SheetNames: string[];
    Sheets: Record<string, WorkSheet>;
  }

  export interface WorkSheet {
    [key: string]: unknown;
  }

  export function read(data: ArrayBuffer, options: { type: 'array' }): WorkBook;

  export const utils: {
    sheet_to_json<T extends Record<string, unknown>>(sheet: WorkSheet, options: { defval: string; raw: boolean }): T[];
    sheet_to_csv(sheet: WorkSheet): string;
  };
}
