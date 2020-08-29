# Noni News

## 2020-08-29

In prior releases I investigated and added tests for prototype pollution in
the `data/record` submodule. When using object literals as records it is 
very easy to accidentally write code suciptable to this. Basically anything
that does `obj[key] = value` where `key` and `value` are user supplied.

The recently added `make` function helps protect against that and applications
using this libray should use that instead of raw object literals.
