@echo off

set myPath=%~dp0

set denoPath=%myPath%bin\
if "a%myPath" == "a" set denoPath=
if not "a%denoPath" == "a" (
    if not exist %denoPath%deno.exe set denoPath=
)

set NO_COLOR=true
set DENO_DIR=%denoPath%
%denoPath%deno.exe run ^
    --cached-only ^
    --allow-read --allow-write --allow-env --allow-net --allow-run ^
    --unstable ^
    %myPath%src\levain.ts ^
    %*
