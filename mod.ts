import { LSB } from "./modules/lsb.ts";

/**
 * LSB manager
 */
export async function main(value) {

    let array = value.split(" ");
    if(array[0] == "encode" && array[1] != undefined && array[2] != undefined && array[3] != undefined) {
        // check file array[1] and array[2] exist
        try {
            if(Deno.statSync(array[1]).isFile && Deno.statSync(array[2]).isFile) {
                let encoded = await LSB.PNG.write(array[1], Deno.readFileSync(array[2]));
                Deno.writeFileSync(array[3], encoded.buffer);
                console.log("Encoded file saved in " + array[3]);
                if(encoded.step < 20){
                    console.log(">> Warning: LSB can be detected");
                } else if(encoded.step < 100){
                    console.log(">> Warning: LSB could be detected by deepscan");
                } else {
                    console.log(">> Info: LSB is hidden");
                    return
                }
            } else { 
                console.log(">> Error: file not found");
                return
            }
        } catch (error) {
            console.log(">> Error: file not found");
            return
        }
    }

    if(array[0] == "decode" && array[1] != undefined && array[2] != undefined) {
        // check file array[1] exist
        try {
            if(Deno.statSync(array[1]).isFile) {
                let decoded = await LSB.PNG.read(array[1]);
                Deno.writeFileSync(array[2], decoded);
                console.log(">> Decoded file saved in " + array[2]);
            } else { 
                console.log(">> Error: file not found");
            }
        } catch (error) {
            console.log(">> Error: file not found");
            return
        }
    }
}

export async function help() {
    console.log("Show help");
}