/**
 * 定数を管理するクラス
 */
export class Config {
    /** 最大入力文字数 */
    public static readonly MAX_DIGITS: number = 8;
    /** エラー表示用メッセージ */
    public static readonly ERROR_MESSAGE: string = "エラー";
    /** 指数表記の閾値（絶対値の上限） */
    public static readonly EXPONENTIAL_THRESHOLD_MAX = 99999999;
    /** 指数表記の閾値（絶対値の下限） */
    public static readonly EXPONENTIAL_THRESHOLD_MIN = 0.0000001;
}