import { decode, encode } from "https://deno.land/x/pngs/mod.ts";

export namespace LSB {
    const encoder = new TextEncoder();

    const decoder = new TextDecoder();

    export function writeInto(dst: Uint8Array, byte: number, offset = 0) {
        for (let i = 0; i < 8; i++) {
            if ((byte & (1 << i)) != 0) {
                dst[offset + i] |= 1 << 0;
            } else {
                dst[offset + i] &= ~(1 << 0);
            }
        }
    }

    export function readFrom(src: Uint8Array, offset = 0) {
        let byte = 0;

        for (let i = 0; i < 8; i++) {
            if ((src[offset + i] & (1 << 0)) != 0) {
                byte |= 1 << i;
            }
        }

        return byte;
    }

    export function write(data: Uint8Array, content: Uint8Array) {
        const buffer = data.slice(),
            header = new DataView(new ArrayBuffer(4));

        const step = Math.floor((data.byteLength - 64) / content.byteLength);
        header.setUint32(0, step);

        let offset = 0;

        for (let i = 0; i < 4; i++) {
            writeInto(buffer, header.getUint8(i), offset);
            offset += 16;
        }

        for (let i = 0; i < content.byteLength; i++) {
            writeInto(buffer, content[i], offset);
            offset += step;
        }

        return { buffer, step };
    }

    export function read(data: Uint8Array) {
        const header = new DataView(new ArrayBuffer(4));

        let offset = 0;

        for (let i = 0; i < 4; i++) {
            header.setUint8(i, readFrom(data, offset));
            offset += 16;
        }

        const step = header.getUint32(0),
            byteLength = Math.floor(data.byteLength / step);

        const content = new Uint8Array(byteLength);

        for (let i = 0; i < byteLength; i++) {
            content[i] = readFrom(data, offset);
            offset += step;
        }

        return content;
    }

    export function writeText(data: Uint8Array, text: string) {
        return write(data, encoder.encode(text));
    }

    export function readText(data: Uint8Array) {
        return decoder.decode(read(data));
    }

    export namespace PNG {
        export function write(path: string, content: Uint8Array) {
            const { image, width, height, colorType, bitDepth } = decode(
                Deno.readFileSync(path),
            );

            const { buffer, step } = LSB.write(image, content);

            return {
                buffer: encode(buffer, width, height, {
                    color: colorType,
                    depth: bitDepth,
                }),
                step,
            };
        }

        export function writeText(path: string, text: string) {
            return write(path, encoder.encode(text));
        }

        export function read(path: string) {
            const image = decode(Deno.readFileSync(path)).image;
            return LSB.read(image);
        }

        export function readText(path: string) {
            return decoder.decode(read(path));
        }
    }
}