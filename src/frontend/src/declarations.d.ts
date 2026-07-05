declare module "@ffmpeg/ffmpeg" {
  export class FFmpeg {
    loaded: boolean;
    load(options: { coreURL: string; wasmURL: string }): Promise<void>;
    on(event: string, callback: (data: any) => void): void;
    writeFile(name: string, data: any): Promise<void>;
    exec(args: string[]): Promise<void>;
    readFile(name: string): Promise<any>;
  }
}

declare module "@ffmpeg/util" {
  export function fetchFile(file: File | string): Promise<any>;
  export function toBlobURL(url: string, type: string): Promise<string>;
}

declare module "pdf-lib" {
  export interface PDFPage {
    drawImage(image: any, options: any): void;
    drawText(text: string, options: any): void;
  }
  export interface PDFImage {
    scale(factor: number): { width: number; height: number };
  }
  export class PDFDocument {
    static create(): Promise<PDFDocument>;
    static load(data: ArrayBuffer): Promise<PDFDocument>;
    copyPages(pdf: PDFDocument, indices: number[]): Promise<PDFPage[]>;
    addPage(page: PDFPage): void;
    addPage(dims?: [number, number]): PDFPage;
    getPageIndices(): number[];
    embedJpg(bytes: Uint8Array): Promise<PDFImage>;
    embedPng(bytes: Uint8Array): Promise<PDFImage>;
    save(options?: any): Promise<Uint8Array>;
  }
  export function rgb(r: number, g: number, b: number): any;
}
