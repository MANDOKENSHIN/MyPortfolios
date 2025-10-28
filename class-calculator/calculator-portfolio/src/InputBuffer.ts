/**
 * 入力文字を制御・調整するクラス
 */
export class InputBuffer {
    private readonly maxDigits: number;
    private value: string = "";

    constructor(maxDigits: number) {
        this.maxDigits = maxDigits;
    }

    /**
     * 数値入力時の処理
     * @param d - 入力された数値(0-9)
     */
    public pushDigit(d: number): void {
        // 現在の桁数を取得（小数点とマイナスを除く）
        const currentDigits = this.value.replace(/[.\-]/g, "").length;
        // 桁数上限に達していれば処理終了
        if (currentDigits >= this.maxDigits) return;

        // 先頭0の制御
        if (this.value === "0") {
            // 0の後に数字が来たら置き換え
            this.value = d.toString();
        } else if (this.value === "-0") {
            // -0の後に数字が来たら置き換え
            this.value = "-" + d.toString();
        } else {
            // それ以外は末尾に追加
            this.value += d.toString();
        }
    }

    /**
     * 小数点入力時の処理
     */
    public pushDecimal(): void {
        // 現在の桁数を取得（小数点とマイナスを除く）
        const currentDigits = this.value.replace(/[.\-]/g, "").length;
        // 桁数上限に達していれば処理終了
        if (currentDigits >= this.maxDigits) return;

        // すでに入力済みの場合処理終了
        if (this.hasDecimal()) return;
        // 先頭が小数点の場合は0を追加
        if (this.value === "") {
            this.value = "0.";
            return;
        }
        // 先頭がマイナスの場合は-0を追加
        if (this.value === "-") {
            this.value = "-0.";
            return;
        }

        this.value += ".";
    }

    /**
     * マイナスから入力時の処理
     */
    public setNegative(): void {
        if (this.value === "") {
            this.value = "-";
        }
    }

    /**
     * マイナス入力のみかを判断
     */
    public isSetNegative(): boolean {
        return this.value === "-";
    }

    /**
     * 入力数字をクリア
     */
    public clear(): void {
        this.value = "";
    }

    /**
     * バッファの数字文字列を数値に変換
     * @returns - 変換後の数値
     */
    public toNumber(): number {
        // 数字文字列が空 or マイナスのみの場合は0を返す
        if (this.value === "" || this.value === "-") {
            return 0;
        }

        // 数字文字列の末尾が小数点である場合は除去
        if (this.value.endsWith(".")) {
            this.value = this.value.slice(0, -1);
        };

        return Number(this.value);
    }

    /**
     * 数字文字列を受け取る
     * @returns - 数字文字列
     */
    public getValue(): string {
        return this.value;
    }

    /**
     * 数字文字列を受け取る
     * @returns - 数字文字列
     */
    public setValue(value: string): void {
        this.value = value;
    }

    /**
     * 小数点有無を判断
     * @returns - 小数点の有無
     */
    public hasDecimal(): boolean {
        return this.value.includes(".");
    }
}

