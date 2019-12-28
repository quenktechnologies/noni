/// <reference types="node" />
/**
 * Provides an API for working with module pointers.
 */
import { Either } from '../../../data/either';
export declare const TOKEN_HASH = "#";
export declare const STATE_PATH = 1;
export declare const STATE_MEMBER = 2;
export declare const STATE_FINISHED = 3;
/**
 * Pointer is a syntax for indicating the path to a module and desired export.
 * It has the following syntax:
 * <module_path>#<member>
 *
 * where <module_path> is a valid node module and <member> is the desired
 * export.
 */
export declare type Pointer = string;
/**
 * Path
 */
export declare type Path = string;
/**
 * Position of a token within a pointer string.
 */
export declare type Position = number;
/**
 * Name of an export.
 */
export declare type Name = string;
/**
 * Token
 */
export declare type Token = Module | Member;
/**
 * Module part of the pointer.
 */
export declare class Module {
    path: Path;
    position: Position;
    constructor(path: Path, position: Position);
    type: string;
    toString(): string;
}
/**
 * Member part of the pointer.
 */
export declare class Member {
    name: Name;
    position: Position;
    constructor(name: Name, position: Position);
    type: string;
    toString(): string;
}
/**
 * Failure indicates some error occured during lexing.
 */
export declare class Failure {
    message: string;
    text: string;
    position: Position;
    constructor(message: string, text: string, position: Position);
}
/**
 * Import represents a pointer compiled into a single object that contains
 * the information about the desired module and its export.
 */
export declare class Import {
    module: Path;
    member: Name;
    constructor(module: Path, member: Name);
}
/**
 * tokenize a Pointer into its useful lexical parts.
 */
export declare const tokenize: (ptr: string) => Either<Failure, Token[]>;
/**
 * compile a Pointer into an Import object.
 */
export declare const compile: (ptr: string) => Either<Error, Import>;
/**
 * compileList compiles a list of pointers.
 *
 * If any of the compilations fail the whole process is considered failed.
 */
export declare const compileList: (ptrs: string[]) => Either<Error, Import[]>;
/**
 * iterp a Pointer as a module import returning the exported member from
 * the specified module.
 */
export declare const interp: (ptr: string, loader?: NodeJS.Require) => Either<Error, any>;
/**
 * isPointer tests whether a string can be used as a valid
 * pointer.
 */
export declare const isPointer: (ptr: string) => boolean;
/**
 * getPath retrieves the module path of a valid Pointer.
 *
 * If the ptr is not valid an empty string is returned.
 */
export declare const getPath: (ptr: string) => string;
/**
 * getMember retrieves the member part of a valid Pointer.
 *
 * If the ptr is not valid an empty string is returned.
 */
export declare const getMember: (ptr: string) => string;
