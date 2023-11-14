/**
 * Provides an API for working with module pointers.
 */
import { right, left, Either } from "../../../data/either";
import { Type } from "../../../data/type";

export const TOKEN_HASH = "#";
export const STATE_PATH = 1;
export const STATE_MEMBER = 2;
export const STATE_FINISHED = 3;

/**
 * Pointer is a syntax for indicating the path to a module and desired export.
 * It has the following syntax:
 * <module_path>#<member>
 *
 * where <module_path> is a valid node module and <member> is the desired
 * export.
 */
export type Pointer = string;

/**
 * Path
 */
export type Path = string;

/**
 * Position of a token within a pointer string.
 */
export type Position = number;

/**
 * Name of an export.
 */
export type Name = string;

/**
 * Token
 */
export type Token = Module | Member;

/**
 * Module part of the pointer.
 */
export class Module {
  constructor(public path: Path, public position: Position) {}

  type = "module";

  toString() {
    return this.path;
  }
}

/**
 * Member part of the pointer.
 */
export class Member {
  constructor(public name: Name, public position: Position) {}

  type = "member";

  toString() {
    return this.name;
  }
}

/**
 * Failure indicates some error occured during lexing.
 */
export class Failure {
  constructor(
    public message: string,
    public text: string,
    public position: Position
  ) {}
}

/**
 * Import represents a pointer compiled into a single object that contains
 * the information about the desired module and its export.
 */
export class Import {
  constructor(public module: Path, public member: Name) {}
}

/**
 * tokenize a Pointer into its useful lexical parts.
 */
export const tokenize = (ptr: Pointer): Either<Failure, Token[]> => {
  let toks: Token[] = [];

  let state = STATE_PATH;

  let i = 0;

  let curr = "";

  let next = "";

  let buf = "";

  if (ptr.length === 0) return left(new Failure(`Unexpected EOF!`, ptr, 0));

  while (i < ptr.length) {
    curr = ptr[i];

    next = ptr[i + 1];

    if (state === STATE_PATH && curr === TOKEN_HASH && buf.length === 0) {
      return left(new Failure(`Expected "module" but found #!`, curr, i));
    } else if (state === STATE_PATH && curr === TOKEN_HASH) {
      toks.push(new Module(buf, i - buf.length));

      buf = "";

      next = "";

      state = STATE_MEMBER;
    } else if (state === STATE_PATH && next == null) {
      return left(new Failure(`Expecting "#" but found EOF!`, curr, i));
    } else if (state === STATE_MEMBER && next == null) {
      buf = curr == null ? "" : `${buf}${curr}`;

      if (buf.length === 0)
        return left(new Failure("Unexpected EOF!", curr, i));

      toks.push(new Member(buf, i - buf.length));

      buf = "";

      next = "";
    } else {
      buf = `${buf}${curr}`;
    }

    i++;
  }

  return right(toks);
};

/**
 * compile a Pointer into an Import object.
 */
export const compile = (ptr: Pointer): Either<Error, Import> => {
  let eToks = tokenize(ptr);

  if (eToks.isLeft()) return left(new Error(eToks.takeLeft().message));

  let toks = eToks.takeRight();

  if (toks.length !== 2)
    return left(
      new Error("Source string lacks enough information " + "to compile!")
    );

  return right(new Import(toks[0].toString(), toks[1].toString()));
};

/**
 * compileList compiles a list of pointers.
 *
 * If any of the compilations fail the whole process is considered failed.
 */
export const compileList = (ptrs: Pointer[]): Either<Error, Import[]> =>
  ptrs.reduce(
    (p, c) => p.chain((l) => compile(c).map((i) => l.concat(i))),
    <Either<Error, Import[]>>right([])
  );

/**
 * iterp a Pointer as a module import returning the exported member from
 * the specified module.
 */
export const interp = (ptr: Pointer, loader = require): Either<Error, Type> => {
  let eImp = compile(ptr);

  if (eImp.isLeft()) return eImp;

  let imp = eImp.takeRight();

  try {
    return right(loader(imp.module)[imp.member]);
  } catch (e) {
    return <Either<Error, Type>>left(e);
  }
};

/**
 * isPointer tests whether a string can be used as a valid
 * pointer.
 */
export const isPointer = (ptr: string): boolean => compile(ptr).isRight();

/**
 * getPath retrieves the module path of a valid Pointer.
 *
 * If the ptr is not valid an empty string is returned.
 */
export const getPath = (ptr: Pointer): Path => {
  let eM = compile(ptr);

  return eM.isLeft() ? "" : eM.takeRight().module;
};

/**
 * getMember retrieves the member part of a valid Pointer.
 *
 * If the ptr is not valid an empty string is returned.
 */
export const getMember = (ptr: Pointer): Name => {
  let eM = compile(ptr);

  return eM.isLeft() ? "" : eM.takeRight().member;
};
