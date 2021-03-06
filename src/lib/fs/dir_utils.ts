import {WalkEntry, walkSync,} from "https://deno.land/std/fs/mod.ts";

export default class DirUtils {

    static listFileNames(path: string): string[] {
        return this.listFiles(path)
            .map<string>(it => it.path)
    }

    static listFiles(path: string): WalkEntry[] {
        const files = [...walkSync(path)]
        const root = files.shift()
        return files
    }

    static normalizePaths(paths: string[]): string[] {
        return paths.map<string>(it => this.normalizePath(it))
    }

    static normalizePath(path: string): string {
        return path.replace(/\\/g, '/');
    }

    static count(path: string) {
        return this.listFiles(path).length
    }
}
