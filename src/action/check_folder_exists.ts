import * as log from "https://deno.land/std/log/mod.ts";

import Action from "./action.ts";
import Package from "../lib/package/package.ts";
import Config from "../lib/config.ts";
import {existsSync} from "https://deno.land/std/fs/mod.ts";
import {parseArgs} from "../lib/parse_args.ts";

export default class CheckDirExists implements Action {

    constructor(private config: Config) {
    }

    async execute(pkg: Package, parameters: string[]): Promise<void> {
        log.info(`CHECK FOLDER EXISTS ${parameters.join(', ')}`)

        let args = parseArgs(parameters, {
            stringMany: [
                "saveVar"
            ]
        });

        this.verifyArgs(args); // throws

        const dirs = parameters;
        const found = dirs
            .find(it => existsSync(it))

        if (!found) {
            throw new Error(`dirs not found: ${dirs.join(', ')}`)
        }

        if (!this.config.context.action) {
            this.config.context.action = {};
        }

        if (!this.config.context.action.checkFolderExists) {
            this.config.context.action.checkFolderExists = {};
        }

        if (!this.config.context.action.checkFolderExists.env) {
            this.config.context.action.checkFolderExists.env = {};
        }
        
        this.config.setVar(args.saveVar, found);
        this.config.context.action.checkFolderExists.env[args.saveVar] = found;

        return Promise.resolve(undefined);
    }

    verifyArgs(args: any) {

        if (!args._ || args._.length === 0) {
            throw "Inform the dirs that at least one should exist"
        }
    }
}
