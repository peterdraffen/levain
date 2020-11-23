import {assert, assertEquals} from "https://deno.land/std@0.78.0/testing/asserts.ts";
import Config from "../config.ts";
import FileSystemRepository from "./file_system_repository.ts";
import FileSystemPackage from "../package/file_system_package.ts";

Deno.test('should have a name', () => {
    const repo = new FileSystemRepository(new Config([]), '.')

    assertEquals(repo.name, 'fileSystemRepo for .')
})

//
// List
//
Deno.test('should list packages when root folder does not exist', () => {
    const repo = getTestRepo('thisFolderDoesNotExist')

    assertEquals(repo.packages, [])
})

Deno.test('should list .yml and .yaml packages, and include subfolder', () => {
    const repo = getTestRepo()

    const packages = repo.packages
    const packageNames = packages.map(pkg => pkg.name)
    assertEquals(packageNames, ['amazingYml', 'awesomeYaml', 'insideSubfolder'])
})

Deno.test('should list FileSystemPackages', () => {
    const repo = getTestRepo()

    const packages = repo.packages
    packages.forEach(pkg => assert(pkg instanceof FileSystemPackage))
})

function getTestRepo(rootDir = './testdata/testRepo') {
    return new FileSystemRepository(new Config([]), rootDir)
}