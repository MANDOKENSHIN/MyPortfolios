import type { Operation } from "./Operation";

/**
 * 各入力キーの型を定義
 */
export type KeyToken =
    /** 数字キー(0-9) */
    | { kind: "digit"; value: number }
    /** 小数点キー */
    | { kind: "decimal" }
    /** 演算子キー */
    | { kind: "op"; value: Operation }
    /** 等号キー */
    | { kind: "equal" }
    /** クリアキー */
    | { kind: "clear" };