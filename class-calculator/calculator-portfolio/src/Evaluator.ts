import { DivisionByZeroError } from "./DivisionByZeroError";
import { Operation } from "./Operation";

/**
 * 四則演算を実行するクラス
 */
export class Evaluator {
    /**
     * 二項の演算を実行する
     * @param a - 第一オペラント文字列
     * @param op - 演算子
     * @param b - 第二オペラント文字列
     * @returns - 計算結果
     */
    public compute(a: number, op: Operation, b: number): number {
        switch (op) {
            // 加算
            case Operation.Add:
                return a + b;
            // 減算
            case Operation.Subtract:
                return a - b;
            // 乗算
            case Operation.Multiply:
                return a * b;
            // 除算
            case Operation.Divide:
                if (b === 0) {
                    throw new DivisionByZeroError("Divide by zero");
                }
                return a / b;

            // 上記以外の演算子入る場合エラー
            default:
                throw new Error(`予期せぬ演算子が入力されました。${op}`);
        }
    }
}