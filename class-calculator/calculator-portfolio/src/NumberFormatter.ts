import { Config } from "./Config";

/**
 * 計算結果の表示フォーマットを管理するクラス
 */
export class NumberFormatter {
    private readonly maxDigits: number;

    constructor(maxDigits: number) {
        this.maxDigits = maxDigits;
    }

    /**
     * 指数表記の必要性を判断
     * @param n - 計算結果数値
     * @returns - 指数表記の必要性 (true: 必要, false: 不要)
     */
    private shouldUseExponential(n: number): boolean {
        // 計算結果を絶対値で取得
        const absValue = Math.abs(n);

        // 絶対値99999999より大きな数値かを判断
        if (absValue > Config.EXPONENTIAL_THRESHOLD_MAX) {
            return true;
        }
        // 絶対値0.0000001未満かつ0でない数値かを判断
        if (absValue < Config.EXPONENTIAL_THRESHOLD_MIN && absValue !== 0) {
            return true;
        }

        // 上記以外で8桁を超える場合
        const resultString = n.toString();
        const resultDigitsCount = resultString.replace(/[.\-]/g, "").length;
        if (resultDigitsCount > Config.MAX_DIGITS) {
            return true;
        }

        // 計算結果の桁数が８桁を超えない場合
        return false;
    }

    /**
     * 仮数部が8桁以内時の処理
     * @param n - 計算結果数値
     */
    private toStandardNotation(n: number): string {
        let resultString = n.toString();

        // "e-7"には科学記法を適用させない
        if (resultString.includes("e-7")) {
            resultString = n.toFixed(7);
        }

        // 末尾0を除去
        resultString = resultString.replace(/(\.\d*?)0+$/, '$1');
        // 小数点のみが残った場合は削除（例: 1. → 1）
        if (resultString.endsWith('.')) {
            resultString = resultString.slice(0, -1);
        }
        return resultString;
    }

    /**
     * 計算結果の表示用フォーマット
     * @param n - 計算結果数値
     */
    public formatForDisplay(n: number): string {
        // 計算結果が8桁を超える場合
        if (this.shouldUseExponential(n)) {
            return n.toExponential(this.maxDigits - 1);
        }

        // 計算結果が8桁以内
        return this.toStandardNotation(n);
    }
}