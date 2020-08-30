# Changelog

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
