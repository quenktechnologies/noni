
AFPL
===

> Core TypeScript library for Quenk Technologies Limited.

# Introduction

AFPL (A Funcitonal Programming Library) is the standard Typescript library
used at [Quenk Technologies Limited](https://quenk.com).

This library provides various types, interfaces, classes and functions for performing
common tasks in web application development all while under the 
influence of functional programming languages like Haskell and PureScript.

## Why Not Haskell Or Purescript?

We already have a significant investment in tools and design patterns around the JavaScript
environment on both the front and backend. As well as a few command line
tools and the occasional Cordova app.

While the purity of PureScript is much desired, Typescript's closeness to actual
ECMAScript meant it was they easiest statically language to transtion to without 
too much headache.

# Project Structure

This project is organised according to [QTP-2018-01](https://github.com/quenktechnologies/quenk-typescript-javascript-style-guide).

At some point in the future it may be desirable to be able to acquire
some of this project's submodules by themselves. A build process
would have to be designed to support such, until then the entire tree
must be installed.

# Installation
```sh
npm install --save @quenk/afpl
```

# Usage

The entire source tree is build to `lib`. Import the desired submodule from there:

```sh
 import {Maybe} from '@quenk/afpl/lib/data/maybe';

 // Do something with Maybe.
```

# License

Apache-2.0 (c) Quenk Technologies Limited
