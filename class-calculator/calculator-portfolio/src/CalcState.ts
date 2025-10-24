/**
 * 電卓の状態を表す列挙型
 */
export const enum Calcstate{
    /** 初期状態 */
    Ready,
    /** 第一オペラント文字列入力中の状態 */
    InputtingFirst,
    /** 演算子選択済みの状態 */
    OperatorEntered,
    /** 第二オペラント文字列入力中の状態 */
    InputtingSecond,
    /** 計算結果出力状態 */
    ResultShown,
    /** エラー状態 */
    Error
}