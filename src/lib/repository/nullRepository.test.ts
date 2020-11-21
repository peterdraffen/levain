import {assertEquals} from "https://deno.land/std@0.78.0/testing/asserts.ts";
import Config from "../config.ts";
import NullRepository from "./nullRepository.ts";

const repo = new NullRepository(new Config([]),)

Deno.test('should have a name', () => {
    assertEquals(repo.name, 'nullRepo')
})

Deno.test('should not have packages', () => {
    assertEquals(repo.packages, [])
})