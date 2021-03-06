import * as log from "https://deno.land/std/log/mod.ts";

import Config from "../config.ts";
import ExtraBin from "../extra_bin.ts";
import OsUtils from "../os/os_utils.ts";

export default class GitUtils {
    readonly gitCmd: string;

    constructor(private config: Config) {
        this.gitCmd = `${ExtraBin.gitDir}\\cmd\\git.exe`;
    }

    async clone(url: string, dst: string, options?: any) {
        log.info(`-- GIT - CLONE - ${url} => ${dst}`);
        OsUtils.onlyInWindows();

        const command = `cmd /u /c ${this.gitCmd} clone --progress --single-branch --no-tags --depth 1 ${url} ${dst}`;
        await OsUtils.runAndLog(command);
    }

    async pull(dir: string, options?: any) {
        log.info(`-- GIT - PULL - ${dir}`);
        OsUtils.onlyInWindows();

        const command = `cmd /u /c pushd ${dir} && ${this.gitCmd} pull --force -q --progress --no-tags --depth=1 --update-shallow --allow-unrelated-histories --no-commit --rebase && popd`;
        let tries = 0;
        do {
            tries++;
            if (tries > 1) {
                log.info(`-- GIT - PULL - ${dir} - RETRY`);
            }

            try {
                await OsUtils.runAndLog(command);

                log.info(`-- GIT - PULL - ${dir} - OK`);
                log.info("");
                return;
            } catch (error) {
                log.info(`${tries} - git error - ${error}`)
            }
        } while (tries < 3)

        throw Error(`Unable to GIT PULL ${dir}`)
    }
}
