# Changelog

## [4.11.3](https://github.com/deepgram/deepgram-js-sdk/compare/v4.11.2...v4.11.3) (2025-12-17)

### Bug Fixes

* support keyterms with Flux models in ListenLiveClient ([#449](https://github.com/deepgram/deepgram-js-sdk/issues/449)) ([f87961a](https://github.com/deepgram/deepgram-js-sdk/commit/f87961a))

### Miscellaneous Chores

* **tools:** remove codecov from ci ([#445](https://github.com/deepgram/deepgram-js-sdk/issues/445)) ([b6a8fd6](https://github.com/deepgram/deepgram-js-sdk/commit/b6a8fd6))
* adds dx code owners ([#430](https://github.com/deepgram/deepgram-js-sdk/issues/430)) ([6634e40](https://github.com/deepgram/deepgram-js-sdk/commit/6634e40))

## [4.11.2](https://github.com/deepgram/deepgram-js-sdk/compare/v4.11.1...v4.11.2) (2025-08-06)

### Bug Fixes

* agent timing issue ([#428](https://github.com/deepgram/deepgram-js-sdk/issues/428)) ([cee9b19](https://github.com/deepgram/deepgram-js-sdk/commit/cee9b19))

## [4.11.1](https://github.com/deepgram/deepgram-js-sdk/compare/v4.11.0...v4.11.1) (2025-07-25)

### Bug Fixes

* fixes mips_opt_out placement ([c342789](https://github.com/deepgram/deepgram-js-sdk/commit/c342789))

## [4.11.0](https://github.com/deepgram/deepgram-js-sdk/compare/v4.10.0...v4.11.0) (2025-07-21)

### Features

* adds support for agent mip_opt_out ([#421](https://github.com/deepgram/deepgram-js-sdk/issues/421)) ([76f9653](https://github.com/deepgram/deepgram-js-sdk/commit/76f9653))

## [4.10.0](https://github.com/deepgram/deepgram-js-sdk/compare/v4.9.1...v4.10.0) (2025-07-21)

### Features

* adds ttl_seconds support ([#420](https://github.com/deepgram/deepgram-js-sdk/issues/420)) ([5ed8004](https://github.com/deepgram/deepgram-js-sdk/commit/5ed8004))

## [4.9.1](https://github.com/deepgram/deepgram-js-sdk/compare/v4.9.0...v4.9.1) (2025-07-09)

### Bug Fixes

* use type-only imports for Node.js stream module ([de726ef](https://github.com/deepgram/deepgram-js-sdk/commit/de726ef))

## [4.9.0](https://github.com/deepgram/deepgram-js-sdk/compare/v4.8.0...v4.9.0) (2025-07-08)

### Features

* adds support for speak fallback ([#414](https://github.com/deepgram/deepgram-js-sdk/issues/414)) ([8e59b55](https://github.com/deepgram/deepgram-js-sdk/commit/8e59b55))

## [4.8.0](https://github.com/deepgram/deepgram-js-sdk/compare/v4.7.0...v4.8.0) (2025-07-07)

### Features

* simplify and standardize examples ([81689db](https://github.com/deepgram/deepgram-js-sdk/commit/81689db))
* adds support for IUM ([aa6cee2](https://github.com/deepgram/deepgram-js-sdk/commit/aa6cee2))
* add timeout mechanism to WebSocket mock waitForConnection method ([a663956](https://github.com/deepgram/deepgram-js-sdk/commit/a663956))
* **tests:** add websockets e2e and unit tests ([5d85b4b](https://github.com/deepgram/deepgram-js-sdk/commit/5d85b4b))
* **tests:** add e2e tests for other apis ([28d33f8](https://github.com/deepgram/deepgram-js-sdk/commit/28d33f8))
* **tests:** add TTS test, fix offline tests for mocks ([d308561](https://github.com/deepgram/deepgram-js-sdk/commit/d308561))
* **tests:** add mock api responses when tests run offline ([2b004d0](https://github.com/deepgram/deepgram-js-sdk/commit/2b004d0))
* **test:** add useful unit tests ([6093bb7](https://github.com/deepgram/deepgram-js-sdk/commit/6093bb7))

### Bug Fixes

* add Node.js polyfills for webpack UMD build ([5cb550b](https://github.com/deepgram/deepgram-js-sdk/commit/5cb550b))
* **helpers:** checks for null as any injection bug ([f16d74f](https://github.com/deepgram/deepgram-js-sdk/commit/f16d74f))
* **tests:** update fetchWithAuth function calls to use options object ([44b0472](https://github.com/deepgram/deepgram-js-sdk/commit/44b0472))
* update live client tests to handle enhanced error events ([9350dbf](https://github.com/deepgram/deepgram-js-sdk/commit/9350dbf))

## [4.7.0](https://github.com/deepgram/deepgram-js-sdk/compare/v4.6.0...v4.7.0) (2025-06-25)

### Features

* **errors:** enhance WebSocket error output and abstract connection setup ([36778e9](https://github.com/deepgram/deepgram-js-sdk/commit/36778e9))

## [4.6.0](https://github.com/deepgram/deepgram-js-sdk/compare/v4.5.1...v4.6.0) (2025-06-24)

### Features

* **auth:** add support for DEEPGRAM_ACCESS_TOKEN as per the other SDKs ([7924959](https://github.com/deepgram/deepgram-js-sdk/commit/7924959))

## [4.5.1](https://github.com/deepgram/deepgram-js-sdk/compare/v4.5.0...v4.5.1) (2025-06-20)

### Bug Fixes

* confirm token fix in example ([bf1cf96](https://github.com/deepgram/deepgram-js-sdk/commit/bf1cf96))

## [4.5.0](https://github.com/deepgram/deepgram-js-sdk/compare/v4.4.0...v4.5.0) (2025-06-20)

### Features

* apply luke's suggestions ([517ea3c](https://github.com/deepgram/deepgram-js-sdk/commit/517ea3c))

### Bug Fixes

* make temporary auth tokens actually work ([5d5a56a](https://github.com/deepgram/deepgram-js-sdk/commit/5d5a56a))
* **auth:** address PR feedback ([a5f0bda](https://github.com/deepgram/deepgram-js-sdk/commit/a5f0bda))

## [4.4.0](https://github.com/deepgram/deepgram-js-sdk/compare/v4.3.0...v4.4.0) (2025-06-10)

### Features

* support context length option ([7b22b07](https://github.com/deepgram/deepgram-js-sdk/commit/7b22b07))

## [4.3.0](https://github.com/deepgram/deepgram-js-sdk/compare/v4.2.0...v4.3.0) (2025-06-09)

### Features

* make provider objects generic ([b0fc5cb](https://github.com/deepgram/deepgram-js-sdk/commit/b0fc5cb))

### Bug Fixes

* remove model/keyterm check ([ca207ec](https://github.com/deepgram/deepgram-js-sdk/commit/ca207ec))
* adds proper wav headers to index.js for wav file creation ([6739be8](https://github.com/deepgram/deepgram-js-sdk/commit/6739be8))

## [4.2.0](https://github.com/deepgram/deepgram-js-sdk/compare/v4.1.1...v4.2.0) (2025-05-19)

### Features

* update README.md for websocket agent url change ([27398b6](https://github.com/deepgram/deepgram-js-sdk/commit/27398b6))

## [4.1.1](https://github.com/deepgram/deepgram-js-sdk/compare/v4.1.0...v4.1.1) (2025-05-15)

### Bug Fixes

* type fix for language in agent ([a9f744c](https://github.com/deepgram/deepgram-js-sdk/commit/a9f744c))

## [4.1.0](https://github.com/deepgram/deepgram-js-sdk/compare/v4.0.1...v4.1.0) (2025-05-09)

### Features

* officially enable aura-2 in live text-to-speech ([6b122f9](https://github.com/deepgram/deepgram-js-sdk/commit/6b122f9))

## [4.0.1](https://github.com/deepgram/deepgram-js-sdk/compare/v4.0.0...v4.0.1) (2025-05-07)

### Bug Fixes

* settings object structure ([5a850ea](https://github.com/deepgram/deepgram-js-sdk/commit/5a850ea))

## [4.0.0](https://github.com/deepgram/deepgram-js-sdk/compare/v3.13.0...v4.0.0) (2025-05-05)

### ⚠ BREAKING CHANGES

* Voice Agent API updated to V1 spec. See [migration guide](docs/Migrating-v3-to-v4.md).

### Features

* release voice agent v1 ([96753f9](https://github.com/deepgram/deepgram-js-sdk/commit/96753f9))

## [3.13.0](https://github.com/deepgram/deepgram-js-sdk/compare/v3.12.1...v3.13.0) (2025-05-05)

### Features

* migrate to agent v1 ([3a8493b](https://github.com/deepgram/deepgram-js-sdk/commit/3a8493b))
* latest spec fixes ([1a37177](https://github.com/deepgram/deepgram-js-sdk/commit/1a37177))

### Bug Fixes

* experimental boolean is optional ([989ede8](https://github.com/deepgram/deepgram-js-sdk/commit/989ede8))
* remove bedrock ([6fa56b8](https://github.com/deepgram/deepgram-js-sdk/commit/6fa56b8))
* changed `updateInstructions` method to `updatePrompt` to match V1 ([b175a1f](https://github.com/deepgram/deepgram-js-sdk/commit/b175a1f))
* instructions -> prompt in updatePrompt to align with v1 spec ([16af51e](https://github.com/deepgram/deepgram-js-sdk/commit/16af51e))

## [3.12.1](https://github.com/deepgram/deepgram-js-sdk/compare/v3.12.0...v3.12.1) (2025-04-14)

### Bug Fixes

* updates for aura-2 ([461bc0d](https://github.com/deepgram/deepgram-js-sdk/commit/461bc0d))

## [3.12.0](https://github.com/deepgram/deepgram-js-sdk/compare/v3.11.3...v3.12.0) (2025-04-14)

### Features

* support token-based auth endpoint ([3186ef2](https://github.com/deepgram/deepgram-js-sdk/commit/3186ef2))

## [3.11.3](https://github.com/deepgram/deepgram-js-sdk/compare/v3.11.2...v3.11.3) (2025-03-26)

### Bug Fixes

* fixed circular dependency giving errors under webpack ([87c554b](https://github.com/deepgram/deepgram-js-sdk/commit/87c554b))

## [3.11.2](https://github.com/deepgram/deepgram-js-sdk/compare/v3.11.1...v3.11.2) (2025-03-03)

### Bug Fixes

* use string fallback in union types for agent ([711be7e](https://github.com/deepgram/deepgram-js-sdk/commit/711be7e))
* keyterm -> keyterms (revert) ([3536b1c](https://github.com/deepgram/deepgram-js-sdk/commit/3536b1c))
* AgentLiveSchema.context type to use 'role' instead of 'type' in messages array ([b39256d](https://github.com/deepgram/deepgram-js-sdk/commit/b39256d))

## [3.11.1](https://github.com/deepgram/deepgram-js-sdk/compare/v3.11.0...v3.11.1) (2025-02-13)

### Bug Fixes

* keyterms to keyterm ([490a2eb](https://github.com/deepgram/deepgram-js-sdk/commit/490a2eb))

## [3.11.0](https://github.com/deepgram/deepgram-js-sdk/compare/v3.10.1...v3.11.0) (2025-02-11)

### Features

* support nova-3 and keyterms in stt ([23bf960](https://github.com/deepgram/deepgram-js-sdk/commit/23bf960))
* support nova-3 in agent ([f84761b](https://github.com/deepgram/deepgram-js-sdk/commit/f84761b))

### Bug Fixes

* keyterms are optional ([c270a80](https://github.com/deepgram/deepgram-js-sdk/commit/c270a80))
* import errors ([e301786](https://github.com/deepgram/deepgram-js-sdk/commit/e301786))

## [3.10.1](https://github.com/deepgram/deepgram-js-sdk/compare/v3.10.0...v3.10.1) (2025-02-06)

### Bug Fixes

* type definition issues on agent schema ([21dcc9b](https://github.com/deepgram/deepgram-js-sdk/commit/21dcc9b))

## [3.10.0](https://github.com/deepgram/deepgram-js-sdk/compare/v3.9.0...v3.10.0) (2025-02-03)

### Features

* release voice agent ([73e53e3](https://github.com/deepgram/deepgram-js-sdk/commit/73e53e3))
* add from_finalize property to LiveTranscriptionEvent ([2039f59](https://github.com/deepgram/deepgram-js-sdk/commit/2039f59))

### Bug Fixes

* actually send normalised config ([5d7cbae](https://github.com/deepgram/deepgram-js-sdk/commit/5d7cbae))

## [3.9.0](https://github.com/deepgram/deepgram-js-sdk/compare/v3.8.1...v3.9.0) (2024-10-23)

### Features

* set up linting for typescript ([6590d73](https://github.com/deepgram/deepgram-js-sdk/commit/6590d73))
* add linting for yaml files ([1710c46](https://github.com/deepgram/deepgram-js-sdk/commit/1710c46))
* add lint and build to workflow ([18b4640](https://github.com/deepgram/deepgram-js-sdk/commit/18b4640))

### Bug Fixes

* move @types/node to dependencies instead of devDependencies ([18b4640](https://github.com/deepgram/deepgram-js-sdk/commit/18b4640))

## [3.8.1](https://github.com/deepgram/deepgram-js-sdk/compare/v3.8.0...v3.8.1) (2024-10-10)

### Bug Fixes

* handle blob response, append wav header ([bb5c8b2](https://github.com/deepgram/deepgram-js-sdk/commit/bb5c8b2))
* pass sample rate option ([753be7e](https://github.com/deepgram/deepgram-js-sdk/commit/753be7e))

## [3.8.0](https://github.com/deepgram/deepgram-js-sdk/compare/v3.7.0...v3.8.0) (2024-10-01)

### Features

* send back raw buffer instead of ArrayBuffer ([298df5c](https://github.com/deepgram/deepgram-js-sdk/commit/298df5c))

## [3.7.0](https://github.com/deepgram/deepgram-js-sdk/compare/v3.6.0...v3.7.0) (2024-09-18)

### Features

* add SpeakLiveClient and LiveTTSEvents ([39a535d](https://github.com/deepgram/deepgram-js-sdk/commit/39a535d))
* update AbstractLiveClient to handle binary data ([a7feb78](https://github.com/deepgram/deepgram-js-sdk/commit/a7feb78))
* add SpeakClient and example ([a3112bc](https://github.com/deepgram/deepgram-js-sdk/commit/a3112bc))
* rename reset method to clear, respond with "Clear" payload ([b409f8d](https://github.com/deepgram/deepgram-js-sdk/commit/b409f8d))

## [3.6.0](https://github.com/deepgram/deepgram-js-sdk/compare/v3.5.1...v3.6.0) (2024-08-29)

### Features

* add new models endpoints to SDK ([630387d](https://github.com/deepgram/deepgram-js-sdk/commit/630387d))

## [3.5.1](https://github.com/deepgram/deepgram-js-sdk/compare/v3.5.0...v3.5.1) (2024-08-05)

### Bug Fixes

* process is not defined in browser demos ([984591d](https://github.com/deepgram/deepgram-js-sdk/commit/984591d))

## [3.5.0](https://github.com/deepgram/deepgram-js-sdk/compare/v3.4.4...v3.5.0) (2024-07-12)

### Features

* implement `no_delay` ([726f676](https://github.com/deepgram/deepgram-js-sdk/commit/726f676))
* implements `finalize` on the liveclient ([cee0704](https://github.com/deepgram/deepgram-js-sdk/commit/cee0704))
* implement multi-lingual ([034d5b0](https://github.com/deepgram/deepgram-js-sdk/commit/034d5b0))

## [3.4.4](https://github.com/deepgram/deepgram-js-sdk/compare/v3.4.3...v3.4.4) (2024-07-09)

### Bug Fixes

* missing type for detect_language which supports multiple strings or a single bool ([ebf07a5](https://github.com/deepgram/deepgram-js-sdk/commit/ebf07a5))

## [3.4.3](https://github.com/deepgram/deepgram-js-sdk/compare/v3.4.2...v3.4.3) (2024-07-09)

### Bug Fixes

* use correct import of EventEmitter ([80e2331](https://github.com/deepgram/deepgram-js-sdk/commit/80e2331))

## [3.4.2](https://github.com/deepgram/deepgram-js-sdk/compare/v3.4.1...v3.4.2) (2024-07-09)

### Bug Fixes

* deprecation note in ListenLiveClient ([a22824e](https://github.com/deepgram/deepgram-js-sdk/commit/a22824e))

## [3.4.1](https://github.com/deepgram/deepgram-js-sdk/compare/v3.4.0...v3.4.1) (2024-07-04)

### Bug Fixes

* correct spelling of LiveClient ([ecf09df](https://github.com/deepgram/deepgram-js-sdk/commit/ecf09df))

## [3.4.0](https://github.com/deepgram/deepgram-js-sdk/compare/v3.3.5...v3.4.0) (2024-07-02)

### Features

* abstract client rebuilt for namespace options ([486fd86](https://github.com/deepgram/deepgram-js-sdk/commit/486fd86))
* rebuilding config and class interfaces ([501d6d0](https://github.com/deepgram/deepgram-js-sdk/commit/501d6d0))
* convert all legacy options to namespaced options ([154ba30](https://github.com/deepgram/deepgram-js-sdk/commit/154ba30))
* plug live client into new options ([8510726](https://github.com/deepgram/deepgram-js-sdk/commit/8510726))
* plug rest clients into new options ([e2f3d8f](https://github.com/deepgram/deepgram-js-sdk/commit/e2f3d8f))
* tie together namespace config with fetch and websocket options ([a7a4752](https://github.com/deepgram/deepgram-js-sdk/commit/a7a4752))
* switch to new websocket logic ([565ae2c](https://github.com/deepgram/deepgram-js-sdk/commit/565ae2c))

### Bug Fixes

* merge clones by default ([ff467bf](https://github.com/deepgram/deepgram-js-sdk/commit/ff467bf))
* resolves process undefined and logs more data for browser types ([b62f2e3](https://github.com/deepgram/deepgram-js-sdk/commit/b62f2e3))
* edit isBrowser to explicitly check for a window.document ([5612f86](https://github.com/deepgram/deepgram-js-sdk/commit/5612f86))

## [3.3.5](https://github.com/deepgram/deepgram-js-sdk/compare/v3.3.4...v3.3.5) (2024-06-21)

### Bug Fixes

* missing speaker in SyncPrerecordedResponse ([#260](https://github.com/deepgram/deepgram-js-sdk/issues/260)) ([119b53d](https://github.com/deepgram/deepgram-js-sdk/commit/119b53d))

## [3.3.4](https://github.com/deepgram/deepgram-js-sdk/compare/v3.3.3...v3.3.4) (2024-06-06)

### Bug Fixes

* make sure process.versions without node key also works ([c166430](https://github.com/deepgram/deepgram-js-sdk/commit/c166430))
* fallback from undefined process variable ([7ce44bd](https://github.com/deepgram/deepgram-js-sdk/commit/7ce44bd))

## [3.3.3](https://github.com/deepgram/deepgram-js-sdk/compare/v3.3.2...v3.3.3) (2024-05-20)

### Bug Fixes

* unconditional process reference ([bd51da7](https://github.com/deepgram/deepgram-js-sdk/commit/bd51da7))

## [3.3.2](https://github.com/deepgram/deepgram-js-sdk/compare/v3.3.1...v3.3.2) (2024-05-15)

### Bug Fixes

* override es5-ext to pre-vuln version, bump ejs for vuln ([8756508](https://github.com/deepgram/deepgram-js-sdk/commit/8756508))

## [3.3.1](https://github.com/deepgram/deepgram-js-sdk/compare/v3.3.0...v3.3.1) (2024-04-30)

### Bug Fixes

* process is undefined error in browsers ([#275](https://github.com/deepgram/deepgram-js-sdk/issues/275)) ([5e51f1c](https://github.com/deepgram/deepgram-js-sdk/commit/5e51f1c))

## [3.3.0](https://github.com/deepgram/deepgram-js-sdk/compare/v3.2.0...v3.3.0) (2024-04-27)

### Features

* release/3.x.x 20240427 ([#271](https://github.com/deepgram/deepgram-js-sdk/issues/271)) ([7a76f75](https://github.com/deepgram/deepgram-js-sdk/commit/7a76f75))

## [3.2.0](https://github.com/deepgram/deepgram-js-sdk/compare/v3.1.9...v3.2.0) (2024-03-11)

### Features

* speak endpoint added ([8948856](https://github.com/deepgram/deepgram-js-sdk/commit/8948856))

## [3.1.9](https://github.com/deepgram/deepgram-js-sdk/compare/v3.1.8...v3.1.9) (2024-02-06)

### Bug Fixes

* metadata response missing from analyze response ([#248](https://github.com/deepgram/deepgram-js-sdk/issues/248)) ([0212338](https://github.com/deepgram/deepgram-js-sdk/commit/0212338))

## [3.1.8](https://github.com/deepgram/deepgram-js-sdk/compare/v3.1.7...v3.1.8) (2024-02-06)

### Bug Fixes

* incorrect typing on extra metadata in schema ([#247](https://github.com/deepgram/deepgram-js-sdk/issues/247)) ([25111e9](https://github.com/deepgram/deepgram-js-sdk/commit/25111e9))

## [3.1.7](https://github.com/deepgram/deepgram-js-sdk/compare/v3.1.6...v3.1.7) (2024-02-06)

### Bug Fixes

* default URL should have protocol included ([#246](https://github.com/deepgram/deepgram-js-sdk/issues/246)) ([9316d91](https://github.com/deepgram/deepgram-js-sdk/commit/9316d91))

## [3.1.6](https://github.com/deepgram/deepgram-js-sdk/compare/v3.1.5...v3.1.6) (2024-01-31)

### Bug Fixes

* missing lines from merge conflict for text intelligence, add example ([#242](https://github.com/deepgram/deepgram-js-sdk/issues/242)) ([f3873d9](https://github.com/deepgram/deepgram-js-sdk/commit/f3873d9))

## [3.1.5](https://github.com/deepgram/deepgram-js-sdk/compare/v3.1.4...v3.1.5) (2024-01-31)

### Bug Fixes

* update package.json to reflect renamed repo ([a08f138](https://github.com/deepgram/deepgram-js-sdk/commit/a08f138))

## [3.1.4](https://github.com/deepgram/deepgram-js-sdk/compare/v3.1.3...v3.1.4) (2024-01-31)

### Bug Fixes

* update live example to demonstrate utteranceend and speechstarted ([7dd99c9](https://github.com/deepgram/deepgram-js-sdk/commit/7dd99c9))

## [3.1.3](https://github.com/deepgram/deepgram-js-sdk/compare/v3.1.2...v3.1.3) (2024-01-30)

### Bug Fixes

* rewrite links in comments ([117e7e3](https://github.com/deepgram/deepgram-js-sdk/commit/117e7e3))

## [3.1.2](https://github.com/deepgram/deepgram-js-sdk/compare/v3.1.1...v3.1.2) (2024-01-29)

### Bug Fixes

* add missing speech started VAD events param ([7e6a5ff](https://github.com/deepgram/deepgram-js-sdk/commit/7e6a5ff))

## [3.1.1](https://github.com/deepgram/deepgram-js-sdk/compare/v3.1.0...v3.1.1) (2024-01-25)

*No notable changes.*

## [3.1.0](https://github.com/deepgram/deepgram-js-sdk/compare/v3.0.1...v3.1.0) (2024-01-25)

### Features

* throw errors when using v2 callstack on the v3 SDK ([#226](https://github.com/deepgram/deepgram-js-sdk/issues/226)) ([e5fac7a](https://github.com/deepgram/deepgram-js-sdk/commit/e5fac7a))
* improve experience around usage of custom API endpoints ([#230](https://github.com/deepgram/deepgram-js-sdk/issues/230)) ([b779348](https://github.com/deepgram/deepgram-js-sdk/commit/b779348))
* sits for JS sdk ([#233](https://github.com/deepgram/deepgram-js-sdk/issues/233)) ([d8de666](https://github.com/deepgram/deepgram-js-sdk/commit/d8de666))
* add UtteranceEnd event to sdk ([#234](https://github.com/deepgram/deepgram-js-sdk/issues/234)) ([82f8b2f](https://github.com/deepgram/deepgram-js-sdk/commit/82f8b2f))
* add speechstarted event to sdk ([#235](https://github.com/deepgram/deepgram-js-sdk/issues/235)) ([1f80bab](https://github.com/deepgram/deepgram-js-sdk/commit/1f80bab))
* add missing feature toggles from Q1 feature audit ([#237](https://github.com/deepgram/deepgram-js-sdk/issues/237)) ([7f972d1](https://github.com/deepgram/deepgram-js-sdk/commit/7f972d1))

### Bug Fixes

* allows endpointing to be disabled with a value of false ([#236](https://github.com/deepgram/deepgram-js-sdk/issues/236)) ([1add378](https://github.com/deepgram/deepgram-js-sdk/commit/1add378))
* fix body not being serialized ([a330a3c](https://github.com/deepgram/deepgram-js-sdk/commit/a330a3c))

## [3.0.1](https://github.com/deepgram/deepgram-js-sdk/compare/v3.0.0...v3.0.1) (2023-12-05)

### Bug Fixes

* multiple post-release bug fixes ([#217](https://github.com/deepgram/deepgram-js-sdk/issues/217)) ([7c41660](https://github.com/deepgram/deepgram-js-sdk/commit/7c41660))

## [3.0.0](https://github.com/deepgram/deepgram-js-sdk/compare/2.4.0...v3.0.0) (2023-11-29)

### ⚠ BREAKING CHANGES

* Complete SDK rewrite. See [migration guide](docs/Migrating-v2-to-v3.md).

### Features

* JS SDK V3 ([#208](https://github.com/deepgram/deepgram-js-sdk/issues/208)) ([2734f69](https://github.com/deepgram/deepgram-js-sdk/commit/2734f69))

## [2.4.0](https://github.com/deepgram/deepgram-js-sdk/compare/2.3.0...2.4.0) (2023-07-27)

### Features

* filler words release ([11b90b8](https://github.com/deepgram/deepgram-js-sdk/commit/11b90b8))

## [2.3.0](https://github.com/deepgram/deepgram-js-sdk/compare/2.2.0...2.3.0) (2023-07-19)

### Features

* add a method to send KeepAlive ws messages ([#150](https://github.com/deepgram/deepgram-js-sdk/issues/150)) ([880e943](https://github.com/deepgram/deepgram-js-sdk/commit/880e943))
* add warning metadata and summarisation result to response type ([#152](https://github.com/deepgram/deepgram-js-sdk/issues/152)) ([1288778](https://github.com/deepgram/deepgram-js-sdk/commit/1288778))

### Bug Fixes

* update find-and-replace to accept strings or arrays of strings ([#146](https://github.com/deepgram/deepgram-js-sdk/issues/146)) ([f330bdf](https://github.com/deepgram/deepgram-js-sdk/commit/f330bdf))

## [2.2.0](https://github.com/deepgram/deepgram-js-sdk/compare/2.1.1...2.2.0) (2023-06-21)

### Features

* use nullish coalescing ([#136](https://github.com/deepgram/deepgram-js-sdk/issues/136)) ([06e03a6](https://github.com/deepgram/deepgram-js-sdk/commit/06e03a6))
* better VTT and SRT ([#141](https://github.com/deepgram/deepgram-js-sdk/issues/141)) ([c3cfc28](https://github.com/deepgram/deepgram-js-sdk/commit/c3cfc28))
* remove specific error typing from the method definitions ([#142](https://github.com/deepgram/deepgram-js-sdk/issues/142)) ([8fbbee7](https://github.com/deepgram/deepgram-js-sdk/commit/8fbbee7))
* add support for new beta release of summarisation ([#143](https://github.com/deepgram/deepgram-js-sdk/issues/143)) ([dfecdf2](https://github.com/deepgram/deepgram-js-sdk/commit/dfecdf2))

### Bug Fixes

* introduce a back-compat change to 'project.update' to accept project_id instead of object ([#134](https://github.com/deepgram/deepgram-js-sdk/issues/134)) ([e74947a](https://github.com/deepgram/deepgram-js-sdk/commit/e74947a))

## [2.1.1](https://github.com/deepgram/deepgram-js-sdk/compare/2.1.0...2.1.1) (2023-05-24)

### Miscellaneous Chores

* updated readme to have examples of all methods ([971a427](https://github.com/deepgram/deepgram-js-sdk/commit/971a427))

## [2.1.0](https://github.com/deepgram/deepgram-js-sdk/compare/2.0.0...2.1.0) (2023-05-24)

### Features

* allow arbitrary properties in the request object ([9f7aecb](https://github.com/deepgram/deepgram-js-sdk/commit/9f7aecb))

## [2.0.0](https://github.com/deepgram/deepgram-js-sdk/compare/1.21.0...2.0.0) (2023-05-15)

### ⚠ BREAKING CHANGES

* Removed browser SDK code. Custom endpoint override added to all methods.

### Features

* add custom endpoint override to pre-recorded transcription ([e8444b1](https://github.com/deepgram/deepgram-js-sdk/commit/e8444b1))
* add customisable endpoint to live transcription ([8573d00](https://github.com/deepgram/deepgram-js-sdk/commit/8573d00))
* add custom endpoint to billing ([5ee5fce](https://github.com/deepgram/deepgram-js-sdk/commit/5ee5fce))

## [1.21.0](https://github.com/deepgram/deepgram-js-sdk/compare/1.20.0...1.21.0) (2023-05-01)

### Features

* add keyword_boost to transcription options ([9ed8a93](https://github.com/deepgram/deepgram-js-sdk/commit/9ed8a93))

### Bug Fixes

* type of alternatives response ([6b734a1](https://github.com/deepgram/deepgram-js-sdk/commit/6b734a1))

## [1.20.0](https://github.com/deepgram/deepgram-js-sdk/compare/1.19.0...1.20.0) (2023-04-12)

### Features

* added ner option and sentiment for tonal sentiment analysis ([80f76c7](https://github.com/deepgram/deepgram-js-sdk/commit/80f76c7))

## [1.19.0](https://github.com/deepgram/deepgram-js-sdk/compare/1.18.3...1.19.0) (2023-04-03)

### Features

* update endpointing types to match new API ([0271231](https://github.com/deepgram/deepgram-js-sdk/commit/0271231))

## [1.18.3](https://github.com/deepgram/deepgram-js-sdk/compare/1.18.2...1.18.3) (2023-03-17)

### Bug Fixes

* output full error response as stringified JSON ([3fea092](https://github.com/deepgram/deepgram-js-sdk/commit/3fea092))

## [1.18.2](https://github.com/deepgram/deepgram-js-sdk/compare/1.18.1...1.18.2) (2023-03-16)

### Bug Fixes

* added reason to close event ([e44ffb8](https://github.com/deepgram/deepgram-js-sdk/commit/e44ffb8))

## [1.18.1](https://github.com/deepgram/deepgram-js-sdk/compare/1.18.0...1.18.1) (2023-02-27)

### Bug Fixes

* moving detected_language to correct type ([58568cc](https://github.com/deepgram/deepgram-js-sdk/commit/58568cc))

## [1.18.0](https://github.com/deepgram/deepgram-js-sdk/compare/1.17.0...1.18.0) (2023-02-23)

### Features

* match redaction parameters to spec ([b5d61c2](https://github.com/deepgram/deepgram-js-sdk/commit/b5d61c2))

### Bug Fixes

* fix built bundle not including nested browser types ([c5a522ef](https://github.com/deepgram/deepgram-js-sdk/commit/c5a522ef))
* changed times to be optional in Options object ([a9bffa2](https://github.com/deepgram/deepgram-js-sdk/commit/a9bffa2))

## [1.17.0](https://github.com/deepgram/deepgram-js-sdk/compare/1.16.0...1.17.0) (2023-02-07)

### Features

* update prerecorded redaction types to match API ([90ad713](https://github.com/deepgram/deepgram-js-sdk/commit/90ad713))
* update live streaming redaction types to match API ([e6f95c1](https://github.com/deepgram/deepgram-js-sdk/commit/e6f95c1))

## [1.16.0](https://github.com/deepgram/deepgram-js-sdk/compare/1.15.0...1.16.0) (2023-01-31)

### Features

* added configure function for mid-stream toggling ([3eecacf](https://github.com/deepgram/deepgram-js-sdk/commit/3eecacf))

## [1.15.0](https://github.com/deepgram/deepgram-js-sdk/compare/1.14.0...1.15.0) (2023-01-23)

### Features

* added tag to transcription endpoints, added delete endpoint to projects ([4577b9d](https://github.com/deepgram/deepgram-js-sdk/commit/4577b9d))

## [1.14.0](https://github.com/deepgram/deepgram-js-sdk/compare/1.13.0...1.14.0) (2022-12-12)

### Features

* add smart formatting ([806eef9](https://github.com/deepgram/deepgram-js-sdk/commit/806eef9))

## [1.13.0](https://github.com/deepgram/deepgram-js-sdk/compare/1.12.2...1.13.0) (2022-12-08)

### Features

* updating translation to translate ([152025c](https://github.com/deepgram/deepgram-js-sdk/commit/152025c))
* updated sentiment threshold parameter ([8601fcc](https://github.com/deepgram/deepgram-js-sdk/commit/8601fcc))

## [1.12.2](https://github.com/deepgram/deepgram-js-sdk/compare/1.12.1...1.12.2) (2022-12-06)

### Bug Fixes

* bug in httprequest ([1ee1ae9](https://github.com/deepgram/deepgram-js-sdk/commit/1ee1ae9))

## [1.12.1](https://github.com/deepgram/deepgram-js-sdk/compare/1.12.0...1.12.1) (2022-11-30)

### Bug Fixes

* updated error handling to show correct info ([52aa149](https://github.com/deepgram/deepgram-js-sdk/commit/52aa149))

## [1.12.0](https://github.com/deepgram/deepgram-js-sdk/compare/1.11.0...1.12.0) (2022-11-30)

### Features

* adding SSL options ([09872ea](https://github.com/deepgram/deepgram-js-sdk/commit/09872ea))

## [1.11.0](https://github.com/deepgram/deepgram-js-sdk/compare/1.10.2...1.11.0) (2022-11-15)

### Features

* added formatting features to live and pre-recorded transcriptions ([2d61d2c](https://github.com/deepgram/deepgram-js-sdk/commit/2d61d2c))

## [1.10.2](https://github.com/deepgram/deepgram-js-sdk/compare/1.10.1...1.10.2) (2022-10-29)

### Features

* adds translation feature ([#83](https://github.com/deepgram/deepgram-js-sdk/issues/83)) ([6b90c35](https://github.com/deepgram/deepgram-js-sdk/commit/6b90c35))
* adding sentiment parameters ([#84](https://github.com/deepgram/deepgram-js-sdk/issues/84)) ([93be92b](https://github.com/deepgram/deepgram-js-sdk/commit/93be92b))

## [1.10.1](https://github.com/deepgram/deepgram-js-sdk/compare/1.10.0...1.10.1) (2022-10-07)

### Bug Fixes

* CD action for versioning ([536ad23](https://github.com/deepgram/deepgram-js-sdk/commit/536ad23))

## [1.10.0](https://github.com/deepgram/deepgram-js-sdk/compare/1.9.0...1.10.0) (2022-10-07)

### Features

* added entity and topic detection ([#67](https://github.com/deepgram/deepgram-js-sdk/issues/67)) ([7d9fbba](https://github.com/deepgram/deepgram-js-sdk/commit/7d9fbba))

## [1.9.0](https://github.com/deepgram/deepgram-js-sdk/compare/1.8.0...1.9.0) (2022-09-27)

### Features

* added summarize option ([6156a14](https://github.com/deepgram/deepgram-js-sdk/commit/6156a14))

## [1.8.0](https://github.com/deepgram/deepgram-js-sdk/compare/1.7.0...1.8.0) (2022-09-20)

### Features

* added detect language option to preRecordedOptions ([4836d0d](https://github.com/deepgram/deepgram-js-sdk/commit/4836d0d))

## [1.7.0](https://github.com/deepgram/deepgram-js-sdk/compare/1.6.0...1.7.0) (2022-09-09)

### Features

* adding paragraphs feature to SDK ([fc6be4b](https://github.com/deepgram/deepgram-js-sdk/commit/fc6be4b))

## [1.6.0](https://github.com/deepgram/deepgram-js-sdk/compare/1.5.0...1.6.0) (2022-09-02)

### Features

* added better error handling in both Node and Browser SDKs ([19d6859](https://github.com/deepgram/deepgram-js-sdk/commit/19d6859))

## [1.5.0](https://github.com/deepgram/deepgram-js-sdk/compare/1.4.9...1.5.0) (2022-08-17)

### Features

* added updates to diarize option, updated transcription response to include speaker_confidence ([#52](https://github.com/deepgram/deepgram-js-sdk/issues/52)) ([03b4b66](https://github.com/deepgram/deepgram-js-sdk/commit/03b4b66))

## [1.4.9](https://github.com/deepgram/deepgram-js-sdk/compare/1.4.8...1.4.9) (2022-08-17)

### Features

* added updates to diarize option, updated speaker_confidence ([faf6df2](https://github.com/deepgram/deepgram-js-sdk/commit/faf6df2))

## [1.4.8](https://github.com/deepgram/deepgram-js-sdk/compare/1.4.7...1.4.8) (2022-08-05)

### Bug Fixes

* adding missing types ([ec41274](https://github.com/deepgram/deepgram-js-sdk/commit/ec41274))

## [1.4.7](https://github.com/deepgram/deepgram-js-sdk/compare/1.4.6...1.4.7) (2022-08-04)

### Bug Fixes

* issue with type files not exporting Deepgram class ([#57](https://github.com/deepgram/deepgram-js-sdk/issues/57)) ([d20f008](https://github.com/deepgram/deepgram-js-sdk/commit/d20f008))

## [1.4.6](https://github.com/deepgram/deepgram-js-sdk/compare/1.4.5...1.4.6) (2022-08-05)

### Bug Fixes

* issue with type files not exporting Deepgram class ([ce79181](https://github.com/deepgram/deepgram-js-sdk/commit/ce79181))

## [1.4.5](https://github.com/deepgram/deepgram-js-sdk/compare/1.4.4...1.4.5) (2022-08-03)

### Bug Fixes

* change ReadStreamSource to accept stream.Readable instead of only fs.ReadStream ([6a2d2e2](https://github.com/deepgram/deepgram-js-sdk/commit/6a2d2e2))

## [1.4.4](https://github.com/deepgram/deepgram-js-sdk/compare/1.4.3...1.4.4) (2022-07-15)

### Features

* added replace parameter ([30e3a6d](https://github.com/deepgram/deepgram-js-sdk/commit/30e3a6d))

## [1.4.3](https://github.com/deepgram/deepgram-js-sdk/compare/1.4.2...1.4.3) (2022-07-07)

### Features

* added tier to type definitions of accepted options ([5b83eb6](https://github.com/deepgram/deepgram-js-sdk/commit/5b83eb6))

## [1.4.2](https://github.com/deepgram/deepgram-js-sdk/compare/1.4.1...1.4.2) (2022-06-24)

### Bug Fixes

* browser is now built to @deepgram/sdk/browser ([62663fb](https://github.com/deepgram/deepgram-js-sdk/commit/62663fb))

## [1.4.1](https://github.com/deepgram/deepgram-js-sdk/compare/1.4.0...1.4.1) (2022-06-23)

### Bug Fixes

* fixing npm deployment ([bd2d58a](https://github.com/deepgram/deepgram-js-sdk/commit/bd2d58a))

## [1.4.0](https://github.com/deepgram/deepgram-js-sdk/compare/1.3.1...1.4.0) (2022-05-19)

### Features

* added browser live transcription option ([46fdb03](https://github.com/deepgram/deepgram-js-sdk/commit/46fdb03))
* added browser support for all management APIs ([41915f2](https://github.com/deepgram/deepgram-js-sdk/commit/41915f2))
* added webpack config to minimize shipped code ([470e102](https://github.com/deepgram/deepgram-js-sdk/commit/470e102))
* added X-DG-Agent header for browser SDK tracking ([bd9a7dd](https://github.com/deepgram/deepgram-js-sdk/commit/bd9a7dd))

## [1.3.1](https://github.com/deepgram/deepgram-js-sdk/compare/1.3.0...1.3.1) (2022-04-02)

### Bug Fixes

* change for webpack require statements ([4e4a5b6](https://github.com/deepgram/deepgram-js-sdk/commit/4e4a5b6))
* modifying how user-agent gets created ([c463d79](https://github.com/deepgram/deepgram-js-sdk/commit/c463d79))

## [1.3.0](https://github.com/deepgram/deepgram-js-sdk/compare/1.2.4...1.3.0) (2022-03-22)

### Features

* new endpoints release ([#37](https://github.com/deepgram/deepgram-js-sdk/issues/37)) ([b579785](https://github.com/deepgram/deepgram-js-sdk/commit/b579785))

## [1.2.4](https://github.com/deepgram/deepgram-js-sdk/compare/1.2.3...1.2.4) (2022-03-16)

### Bug Fixes

* fixing version parameter of transcription options ([#35](https://github.com/deepgram/deepgram-js-sdk/issues/35)) ([ff37ea8](https://github.com/deepgram/deepgram-js-sdk/commit/ff37ea8))

## [1.2.3](https://github.com/deepgram/deepgram-js-sdk/compare/1.2.2...1.2.3) (2022-03-16)

### Bug Fixes

* fix types to match current api response ([#26](https://github.com/deepgram/deepgram-js-sdk/issues/26)) ([eec0cde](https://github.com/deepgram/deepgram-js-sdk/commit/eec0cde))
* fixing version parameter of transcription options ([a934c5e](https://github.com/deepgram/deepgram-js-sdk/commit/a934c5e))

## [1.2.2](https://github.com/deepgram/deepgram-js-sdk/compare/1.2.1...1.2.2) (2022-02-25)

### Bug Fixes

* fixing real-time socket close bug ([#22](https://github.com/deepgram/deepgram-js-sdk/issues/22)) ([e432c98](https://github.com/deepgram/deepgram-js-sdk/commit/e432c98))
* updating wordBase object to add speaker ([#18](https://github.com/deepgram/deepgram-js-sdk/issues/18)) ([ad137e0](https://github.com/deepgram/deepgram-js-sdk/commit/ad137e0))

## [1.2.1](https://github.com/deepgram/deepgram-js-sdk/compare/1.2.0...1.2.1) (2022-02-02)

### Bug Fixes

* fixing real-time socket close bug ([2514269](https://github.com/deepgram/deepgram-js-sdk/commit/2514269))

## [1.2.0](https://github.com/deepgram/deepgram-js-sdk/compare/1.1.0...1.2.0) (2022-01-12)

### Features

* added the ability to create temporary keys ([db808a9](https://github.com/deepgram/deepgram-js-sdk/commit/db808a9))

## [1.1.0](https://github.com/deepgram/deepgram-js-sdk/compare/1.0.3...1.1.0) (2021-11-04)

### Features

* adding WebVTT and SRT helper functions ([#11](https://github.com/deepgram/deepgram-js-sdk/issues/11)) ([463d777](https://github.com/deepgram/deepgram-js-sdk/commit/463d777))

## [1.0.3](https://github.com/deepgram/deepgram-js-sdk/compare/1.0.2...1.0.3) (2021-10-29)

### Features

* add support for using a ReadStream when transcribing ([#9](https://github.com/deepgram/deepgram-js-sdk/issues/9)) ([0162107](https://github.com/deepgram/deepgram-js-sdk/commit/0162107))

### Bug Fixes

* removed user-facing log ([#7](https://github.com/deepgram/deepgram-js-sdk/issues/7)) ([2fbd24f](https://github.com/deepgram/deepgram-js-sdk/commit/2fbd24f))

## [1.0.2](https://github.com/deepgram/deepgram-js-sdk/compare/1.0.1...1.0.2) (2021-07-14)

### Features

* adding utterances and modifying property names ([e83c6d1](https://github.com/deepgram/deepgram-js-sdk/commit/e83c6d1))

## [1.0.1](https://github.com/deepgram/deepgram-js-sdk/compare/1.0.0...1.0.1) (2021-07-07)

### Bug Fixes

* fixing live transcription auth ([a35d86e](https://github.com/deepgram/deepgram-js-sdk/commit/a35d86e))

## [1.0.0](https://github.com/deepgram/deepgram-js-sdk/compare/0.6.5...1.0.0) (2021-07-07)

### Features

* version 1.0.0 release ([3e307c1](https://github.com/deepgram/deepgram-js-sdk/commit/3e307c1))

## [0.6.5](https://github.com/deepgram/deepgram-js-sdk/compare/0.6.4...0.6.5) (2021-05-11)

### Miscellaneous Chores

* updated README to denote alpha status ([259feee](https://github.com/deepgram/deepgram-js-sdk/commit/259feee))

## [0.6.4](https://github.com/deepgram/deepgram-js-sdk/compare/0.6.3...0.6.4) (2021-05-04)

### Miscellaneous Chores

* 0.6.4 release ([9827fec](https://github.com/deepgram/deepgram-js-sdk/commit/9827fec))

## [0.6.3](https://github.com/deepgram/deepgram-js-sdk/compare/0.6.2...0.6.3) (2021-05-04)

### Bug Fixes

* update CD.yml ([70c5ebd](https://github.com/deepgram/deepgram-js-sdk/commit/70c5ebd))

## [0.6.2](https://github.com/deepgram/deepgram-js-sdk/compare/0.6.1...0.6.2) (2021-05-04)

### Miscellaneous Chores

* update package.json ([bfe7716](https://github.com/deepgram/deepgram-js-sdk/commit/bfe7716))

## [0.6.1](https://github.com/deepgram/deepgram-js-sdk/compare/0.6.0...0.6.1) (2021-05-04)

### Bug Fixes

* fixing build package ([4dbfdbf](https://github.com/deepgram/deepgram-js-sdk/commit/4dbfdbf))

## [0.6.0](https://github.com/deepgram/deepgram-js-sdk/compare/0.5.0...0.6.0) (2021-05-04)

### Bug Fixes

* fixed issue with key deletion ([66a299c](https://github.com/deepgram/deepgram-js-sdk/commit/66a299c))

## 0.5.0 (2021-05-03)

### Features

* initial release with transcription and key management ([38c015d](https://github.com/deepgram/deepgram-js-sdk/commit/38c015d))
