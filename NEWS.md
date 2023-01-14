# Noni News

## 2023-01-14

Happy New Year! Part of the strategic plan for 2023 is to bring this and other
modules up to date with current QT needs as well as web application development
in this age.

Code from the first third-party module was added recently (crypto/uuid) and we
may follow that pattern for small, well tested and established algorithms we
don't want to start from scratch here.

We are boosting the automation at QT in general (finally) and aim to stop 
pushing built code to master but instead have a github action or build script 
handle it (or alternatively never check in the built code at all). Overall 
general clean up and re-writing of some of our modules is long over due.

## 2020-08-29

In prior releases I investigated and added tests for prototype pollution in
the `data/record` submodule. When using object literals as records it is 
very easy to accidentally write code suitable to this. Basically anything
that does `obj[key] = value` where `key` and `value` are user supplied.

The recently added `make` function helps protect against that and applications
using this library should use that instead of raw object literals.
