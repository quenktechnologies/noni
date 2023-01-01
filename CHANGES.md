# Changelog

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
