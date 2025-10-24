import { Calcstate } from "./CalcState";
import { Config } from "./Config";
import { Evaluator } from "./Evaluator";
import type { IDisplay } from "./IDisplay";
import { InputBuffer } from "./InputBuffer";
import { NumberFormatter } from "./NumberFormatter";
import type { KeyToken } from "./KeyToken";
import { Operation } from "./Operation";
import { DivisionByZeroError } from "./DivisionByZeroError";

/**
 * 電卓の主要なロジック＆状態を管理するクラス
 */
export class Calculator {
    /** 電卓の状態 */
    private state: Calcstate = Calcstate.Ready;
    /** 左オペラント */
    private left: number | null = null;
    /** 演算子 */
    private operator: Operation | null = null;

    private readonly buffer: InputBuffer;
    private readonly evaluator: Evaluator;
    private readonly formatter: NumberFormatter;
    private readonly display: IDisplay;

    constructor(display: IDisplay) {
        this.display = display;
        this.formatter = new NumberFormatter(Config.MAX_DIGITS);
        this.evaluator = new Evaluator();
        this.buffer = new InputBuffer(Config.MAX_DIGITS);
    };

    /**
     * 入力されたキーを処理
     * @param token - 入力キーのトークン
     */
    public handle(token: KeyToken): void {
        switch (token.kind) {
            case "digit":
                this.handleDigit(token.value);
                break;
            case "op":
                this.handleOperator(token.value);
                break;
            case "decimal":
                this.handleDecimalPoint();
                break;
            case "equal":
                this.handleEqual();
                break;
            case "clear":
                this.handleAllClear();
                break;
            default:
                throw new Error(`予期せぬエラーが発生しました。${token}`);
        }
    };

    /**
     * 数字入力時の処理
     * @param d - 入力された数字
     */
    public handleDigit(d: number): void {
        // エラー状態の場合
        if (this.state === Calcstate.Error) {
            this.handleAllClear();
        }
        // 状態を更新（初期状態 or 計算結果状態 → 第一オペラント文字列入力中の状態）
        if (this.state === Calcstate.Ready || this.state === Calcstate.ResultShown) {
            this.state = Calcstate.InputtingFirst;
        }
        // 状態を更新（演算子入力状態 → 第二オペラント文字列入力中の状態）
        if (this.state === Calcstate.OperatorEntered) {
            this.state = Calcstate.InputtingSecond;
        }

        // 数字を追加
        this.buffer.pushDigit(d);
        // 表示を更新
        this.updateDisplay();
    };

    /**
     * 小数点入力時の処理
     */
    public handleDecimalPoint(): void {
        // 演算子入力直後の場合は無視
        if (this.state === Calcstate.OperatorEntered) return;
        // 初期状態の場合は第一オペラント文字列入力中の状態へ
        if (this.state === Calcstate.Ready) {
            this.state = Calcstate.InputtingFirst;
        }
        // 計算結果表示後 or エラーの場合は全クリアして第一オペラント文字列入力中の状態へ
        if (this.state === Calcstate.ResultShown || this.state === Calcstate.Error) {
            this.handleAllClear();
            this.state = Calcstate.InputtingFirst;
        }

        // 小数点を追加
        this.buffer.pushDecimal();
        this.updateDisplay();
    };

    /**
     * 演算子入力時の処理
     * @param op - 入力された演算子
     */
    public handleOperator(op: Operation): void {
        // エラー状態の場合は無視
        if (this.state === Calcstate.Error) return;
        // 初期状態でマイナスが押された場合は負の数入力とみなす
        if (this.state === Calcstate.Ready && op === Operation.Subtract) {
            this.buffer.setNegative();
            this.state = Calcstate.InputtingFirst;
            this.display.render("-");
            return;
        }
        // 初期状態の場合は無視（マイナス以外）
        if (this.state === Calcstate.Ready) return;

        // 演算子入力直後の場合は演算子を上書き
        if (this.state === Calcstate.OperatorEntered) {
            this.operator = op;
            this.updateDisplay();
            return;
        }

        // 結果表示後 
        if (this.state === Calcstate.ResultShown && this.left !== null) {
            this.state = Calcstate.OperatorEntered;
            this.operator = op;
            this.updateDisplay();
            return;
        }

        // 第一オペランド入力後
        if (this.state === Calcstate.InputtingFirst) {
            this.state = Calcstate.OperatorEntered;
            this.left = this.buffer.toNumber();
            this.buffer.clear();
            this.operator = op;
            this.updateDisplay();
            return;
        }

        // 第二オペランド入力後
        try {
            if (this.state === Calcstate.InputtingSecond && this.left !== null && this.operator !== null) {
                const right = this.buffer.toNumber();
                const result = this.evaluator.compute(this.left, this.operator, right);
                this.buffer.clear();
                const formatted = this.formatter.formatForDisplay(result);
                this.left = Number(formatted);
                this.display.render(formatted);
            } else {
                throw new Error("不正な状態です");
            }
        } catch (error:unknown) {
            if (error instanceof DivisionByZeroError) {
                this.handleError(Config.ERROR_MESSAGE);
                console.error("エラー", error);
                return;
            } else {
                this.handleError(Config.ERROR_MESSAGE);
                console.error("予期せぬエラーが発生しました。", error);
                return;
            }
        }

        this.state = Calcstate.OperatorEntered;
        this.operator = op;
        this.updateDisplay()
        console.log("メモ：catch後もreturnがないとここの処理は実行される。");
    }

    /**
     * イコール入力時の処理
     */
    public handleEqual(): void {
        // 初期状態の場合は無視
        if (this.state === Calcstate.Ready) return;
        // 第一オペランド入力中の場合は無視
        if (this.state === Calcstate.InputtingFirst) return;
        // 結果表示後の場合は無視
        if (this.state === Calcstate.ResultShown) return;
        // エラー状態の場合は無視
        if (this.state === Calcstate.Error) return;

        // 演算子入力直後の場合は最後の数字を表示
        if (this.state === Calcstate.OperatorEntered && this.left !== null) {
            this.state = Calcstate.ResultShown;
            this.buffer.pushDigit(this.left);
            this.left = null;
            this.operator = null;
            this.updateDisplay();
            return;
        }

        // 第二オペランド入力後の場合
        try {
            if (this.state === Calcstate.InputtingSecond && this.left !== null && this.operator !== null) {
                this.state = Calcstate.ResultShown;
                const right = this.buffer.toNumber();
                const result = this.evaluator.compute(this.left, this.operator, right);
                this.buffer.clear();
                const formatted = this.formatter.formatForDisplay(result);
                this.left = Number(formatted);
                this.display.render(formatted);
                this.operator = null;
            } else {
                throw new Error("不正な状態です");
            }
        } catch (error:unknown) {
            if (error instanceof DivisionByZeroError) {
                this.handleError(Config.ERROR_MESSAGE);
                console.error("エラー:", error);
            } else {
                this.handleError(Config.ERROR_MESSAGE);
                console.error("予期せぬエラーが発生しました。", error);
            }
        }
    }

    /**
     * クリア処理
     */
    public handleAllClear(): void {
        this.state = Calcstate.Ready;
        this.left = null;
        this.operator = null;
        this.buffer.clear();
        this.display.render("0");
    }

    /**
     * 電卓の状態を取得
     * @returns - 電卓の状態
     */
    public getState(): Calcstate {
        return this.state;
    }

    /**
     * 左オペラントを取得
     * @returns - 左オペラント
     */
    public getLeft(): number | null {
        return this.left;
    }

    /**
     * 左オペラントをセット
     * @param left - セットしたいオペラント
     */
    public setLeft(left: number | null): void {
        this.left = left;
    }

    /**
     * 演算子を取得
     * @returns - 演算子
     */
    public getOperator(): Operation | null {
        return this.operator;
    }

    /**
     * 演算子をセット
     * @param left - セットしたい演算子
     */
    public setOperator(operator:Operation): void {
        this.operator = operator;
    }

    /**
     * エラー処理
     * @param message - エラーメッセージ
     */
    public handleError(message: string): void {
        this.state = Calcstate.Error;
        this.display.renderError(message);
    }

    /**
     * 表示を更新
     */
    private updateDisplay(): void {
        if (this.left !== null && this.operator !== null) {
            const leftFormatted = this.formatter.formatForDisplay(this.left);
            const opSymbol = this.getOperatorSymbol(this.operator);
            const rightPart = this.buffer.getValue();
            this.display.render(`${leftFormatted} ${opSymbol} ${rightPart}`);
        } else {
            const value = this.buffer.getValue();
            this.display.render(value);
        }
    }

    /**
     * 演算子の表示記号を取得
     * @param op 演算子
     */
    private getOperatorSymbol(op: Operation): string {
        switch (op) {
            case Operation.Add: return "+";  // Operation.Add
            case Operation.Subtract: return "-";  // Operation.Subtract
            case Operation.Multiply: return "×";  // Operation.Multiply
            case Operation.Divide: return "÷";  // Operation.Divide
            default: return "";
        }
    }
}