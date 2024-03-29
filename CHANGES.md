# Changelog

## [1.50.0] - 2023-04-06

### Added
 - Functions for partial application up to arity of 5.

## [1.49.0] - 2023-04-02

### Added
 - `raise` to except module to quickly turn errors into `Except<T>` values.

### Changed
 - Split `error` module into `except` and `err`. `error` is deprecated.

## [1.48.0] - ???

## [1.47.0] - 2023-03-03

### Changed
 - Changed Future to no longer use internal callbacks to avoid #78. It's all
   Promises now and support for abort() is more or less gone (for now).
  
## [1.46.0] - 2023-01-23

### Added
- Two Stack data structures one uses Maybe, the other does not.

### Changed
- doFuture() no longer creates chains and can work with try/catch.
- Raise now invokes an error handling machinery.

## [1.45.0] - 2023-01-14

### Added
- `isBrowser`   function to platform for browser/node detection.
- `crypto/uuid` to support generating v4 uuids.

### Changed
- We now have a build script for browser based tests via mocha.

## [1.44.2] - 2022-12-31

### Added
- `isEqual` function for lists and records.

## [1.44.1] - 2022-12-09

### Added
- `exec` and `execFile` wrappers

## [1.43.0] - 2022-05-01

### Added
- `some` to `control/monad/future`.

### Changed
- The noni package is now built to ES6 (ES2015)

## [1.40.6] - 2020-08-30

### Added

- `forEach`, a side-effect full alternative to map.

## [1.40.5] - 2020-08-30

### Changed
- `compact` in `data/record` and `data/array` now accept types that may have
null or undefined members.

## [1.40.4] - 2020-08-29

### Added

- `pickKey` and `pickValue` to `data/record` allowing values or keys to be
quickly retrieved from a record using a test function.

## [1.40.3] - 2020-08-29

### Added 

- A function `make` in `data/record` that creates new records with a setter
defined for the `__proto__`. This should prevent accidental prototype 
overwrites.
