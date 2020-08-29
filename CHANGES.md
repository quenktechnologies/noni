# Changelog

## [1.40.4] - 2020-08-29

### Added

- `pickKey` and `pickValue` to `data/record` allowing values or keys to be
quickly retrieved from a record using a test function.

## [1.40.3] - 2020-08-29

### Added 

- A function `make` in `data/record` that creates new records with a setter
defined for the `__proto__`. This should prevent accidental prototype 
overwrites.
