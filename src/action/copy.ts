import { copySync, walkSync } from "https://deno.land/std/fs/mod.ts";
import * as path from "https://deno.land/std/path/mod.ts";

import Action from "../lib/action.ts";
import Config from "../lib/config.ts";
import Package from '../lib/package/package.ts';
import { parseArgs } from "../lib/parseArgs.ts";

export default class Copy implements Action {
    constructor(private config:Config) {
    }

    execute(pkg:Package, parameters:string[]):void {
        let args = parseArgs(parameters, {
            boolean: [
                "verbose",
                "strip"
            ]
        });

        if (args._.length < 2) {
            throw "Action - copy - You should inform the source(s) and the destination";            
        }

        const dst = path.resolve(pkg.baseDir, args._.pop());
        const src = args._.map((element:string) => path.resolve(pkg.pkgDir, element));

        let copyToDir = false;        
        try {
            const fileInfo = Deno.statSync(dst);
            if (fileInfo.isDirectory) {
                copyToDir = true;
            }
        } catch (err) {
        }

        if (src.length > 1 && !copyToDir) {
            throw "Action - copy - Unable to copy multiple sources to a single file";
        }

        if (!args.verbose) {
            console.log("COPY", src, "=>", dst);
        }

        for (let item of src) {
            const fileInfo = Deno.statSync(item);
            if (args.strip && fileInfo.isDirectory) {
                for (const entry of walkSync(item)) {
                    if (entry.path == item) {
                        continue;
                    }

                    const writeTo = path.resolve(dst, entry.name)
                    this.doCopy(args, entry.path, writeTo);
                }
            } else {
                let realDst = dst;
                if (copyToDir) {
                    realDst = path.resolve(dst, path.basename(item));
                }
    
                this.doCopy(args, item, realDst);
            }
        }
    }

    private doCopy(args:any, src: string, dst: string) {
        if (args.verbose) {
            console.log("COPY", src, "=>", dst);
        }
        
        try {
            copySync(src, dst, { overwrite: true });
        } catch (err) {
            console.error("ERROR: COPY", src, "=>", dst, err);
            throw err;
        }
    }
}