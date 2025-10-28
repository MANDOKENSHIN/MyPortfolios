import { Calculator } from "../Calculator";
import type { IDisplay } from "../IDisplay";
import { Operation } from "../Operation";
import { Calcstate } from "../CalcState";

/**
 * DOM代わりのモック作成用のクラス
 */
class MockDisplay implements IDisplay {
    /** 取得したテキスト */
    public renderText: string = "";

    /**
     * テキストの表示
     * @param text - 表示用テキスト
     */
    public render(text: string) {
        this.renderText = text;
    }

    /**
     * エラーメッセージの表示
     * @param message - エラーメッセージ
     */
    public renderError(message: string) {
        this.renderText = message;
    }
}

// Calculatorクラスのテスト
describe("Calculatorクラスのテスト", () => {
    let display: MockDisplay;
    let calculator: Calculator;

    // 各テスト前にインスタンス生成
    beforeEach(() => {
        display = new MockDisplay();
        calculator = new Calculator(display);
        calculator.setState(Calcstate.Ready);
        calculator.setLeft(null);
        calculator.setOperator(null);
    });

    // 初期状態のテスト
    describe("初期状態のテスト", () => {
        test("displayインスタンスが正しく渡されているか", () => {
            expect(display).toBeInstanceOf(MockDisplay);
        });

        test("calculatorインスタンスが生成されているか", () => {
            expect(calculator).toBeInstanceOf(Calculator);
        });

        test("初期状態にセットされているか", () => {
            expect(calculator.getState()).toBe(Calcstate.Ready);
        });

        test("演算子なしにセットされているか", () => {
            expect(calculator.getLeft()).toBe(null);
        });

        test("左オペラントなしにセットされているか", () => {
            expect(calculator.getOperator()).toBe(null);
        });
    });

    //数字入力のテスト 
    describe("数字入力（handleDigit(),handleDecimalPoint()）のテスト", () => {
        test("1桁の数字を入力できるか", () => {
            calculator.handle({ kind: "digit", value: 5 });
            expect(calculator.getState()).toBe(Calcstate.InputtingFirst);
            expect(display.renderText).toBe("5");
        });

        test("複数桁の数字を入力できるか", () => {
            calculator.handle({ kind: "digit", value: 1 });
            calculator.handle({ kind: "digit", value: 2 });
            calculator.handle({ kind: "digit", value: 3 });
            calculator.handle({ kind: "digit", value: 0 });
            expect(calculator.getState()).toBe(Calcstate.InputtingFirst);
            expect(display.renderText).toBe("1230");
        });

        test("0を先頭に表示できないか", () => {
            calculator.handle({ kind: "digit", value: 0 });
            calculator.handle({ kind: "digit", value: 1 });
            expect(calculator.getState()).toBe(Calcstate.InputtingFirst);
            expect(display.renderText).toBe("1");
        });

        test("最大桁数を超える入力は無視されるか", () => {
            for (let i = 0; i < 15; i++) {
                calculator.handle({ kind: "digit", value: 9 });
            }
            expect(calculator.getState()).toBe(Calcstate.InputtingFirst);
            expect(display.renderText).toBe("99999999");
        });

        test("少数点を含んだ8桁数字を入力できるか", () => {
            calculator.handle({ kind: "digit", value: 3 });
            calculator.handle({ kind: "decimal" });
            calculator.handle({ kind: "digit", value: 1 });
            calculator.handle({ kind: "digit", value: 4 });
            calculator.handle({ kind: "digit", value: 1 });
            calculator.handle({ kind: "digit", value: 5 });
            calculator.handle({ kind: "digit", value: 9 });
            calculator.handle({ kind: "digit", value: 2 });
            calculator.handle({ kind: "digit", value: 6 });
            expect(calculator.getState()).toBe(Calcstate.InputtingFirst);
            expect(display.renderText).toBe("3.1415926");
        });

        test("第一オペラント文字列入力中かつ8文字入力済みの場合は処理終了となるか", () => {
            calculator.handle({ kind: "digit", value: 1 });
            calculator.handle({ kind: "digit", value: 1 });
            calculator.handle({ kind: "digit", value: 1 });
            calculator.handle({ kind: "digit", value: 1 });
            calculator.handle({ kind: "digit", value: 1 });
            calculator.handle({ kind: "digit", value: 1 });
            calculator.handle({ kind: "digit", value: 1 });
            calculator.handle({ kind: "digit", value: 1 });
            calculator.handle({ kind: "decimal" });
            expect(calculator.getState()).toBe(Calcstate.InputtingFirst);
            expect(display.renderText).toBe("11111111");
        });

        test("第一オペラント文字列入力中かつ8文字入力済み（マイナスは無視）の場合は処理終了となるか", () => {
            calculator.handle({ kind: "op", value: Operation.Subtract });
            calculator.handle({ kind: "digit", value: 1 });
            calculator.handle({ kind: "digit", value: 1 });
            calculator.handle({ kind: "digit", value: 1 });
            calculator.handle({ kind: "digit", value: 1 });
            calculator.handle({ kind: "digit", value: 1 });
            calculator.handle({ kind: "digit", value: 1 });
            calculator.handle({ kind: "digit", value: 1 });
            calculator.handle({ kind: "digit", value: 1 });
            calculator.handle({ kind: "decimal" });
            expect(calculator.getState()).toBe(Calcstate.InputtingFirst);
            expect(display.renderText).toBe("-11111111");
        });

        test("エラー状態から数字入力で全クリアされるか", () => {
            // 0で割り算を試みてエラー状態にする
            calculator.handle({ kind: "digit", value: 5 });
            calculator.handle({ kind: "op", value: Operation.Divide });
            calculator.handle({ kind: "digit", value: 0 });
            calculator.handle({ kind: "equal" });
            expect(calculator.getState()).toBe(Calcstate.Error);
            expect(display.renderText).toBe("エラー");
            // 数字入力で全クリアされるか
            calculator.handle({ kind: "digit", value: 8 });
            expect(calculator.getState()).toBe(Calcstate.InputtingFirst);
            expect(display.renderText).toBe("8");
        });

        test("エラー状態から小数点入力で全クリアされるか", () => {
            // 0で割り算を試みてエラー状態にする
            calculator.handle({ kind: "digit", value: 5 });
            calculator.handle({ kind: "op", value: Operation.Divide });
            calculator.handle({ kind: "digit", value: 0 });
            calculator.handle({ kind: "equal" });
            expect(calculator.getState()).toBe(Calcstate.Error);
            expect(display.renderText).toBe("エラー");
            // 小数点入力で全クリアされるか
            calculator.handle({ kind: "decimal" });
            expect(calculator.getState()).toBe(Calcstate.InputtingFirst);
            expect(display.renderText).toBe("0.");
        });

        test("小数点を複数回入力できないか", () => {
            calculator.handle({ kind: "digit", value: 3 });
            calculator.handle({ kind: "decimal" });
            calculator.handle({ kind: "decimal" });
            calculator.handle({ kind: "digit", value: 1 });
            expect(calculator.getState()).toBe(Calcstate.InputtingFirst);
            expect(display.renderText).toBe("3.1");
        });

        test("小数点を先頭に入力できるか", () => {
            calculator.handle({ kind: "decimal" });
            calculator.handle({ kind: "digit", value: 3 });
            expect(calculator.getState()).toBe(Calcstate.InputtingFirst);
            expect(display.renderText).toBe("0.3");
        });

        test("第一オペラント入力→イコール押下後に数字を入力すると続けて入力されるか", () => {
            calculator.handle({ kind: "digit", value: 4 });
            calculator.handle({ kind: "equal" });
            expect(calculator.getState()).toBe(Calcstate.InputtingFirst);
            expect(display.renderText).toBe("4");
            // 続けて数字入力されるか
            calculator.handle({ kind: "digit", value: 5 });
            expect(calculator.getState()).toBe(Calcstate.InputtingFirst);
            expect(display.renderText).toBe("45");
        });

        test("計算結果表示後に数字入力で全てクリアされるか", () => {
            calculator.handle({ kind: "digit", value: 2 });
            calculator.handle({ kind: "op", value: Operation.Multiply });
            calculator.handle({ kind: "digit", value: 3 });
            calculator.handle({ kind: "equal" });
            expect(calculator.getState()).toBe(Calcstate.ResultShown);
            expect(display.renderText).toBe("6");
            // 数字入力で全クリアされるか
            calculator.handle({ kind: "digit", value: 7 });
            expect(calculator.getState()).toBe(Calcstate.InputtingFirst);
            expect(display.renderText).toBe("7");
        });

        test("計算結果表示後に小数点入力で全てクリアされるか", () => {
            calculator.handle({ kind: "digit", value: 2 });
            calculator.handle({ kind: "op", value: Operation.Multiply });
            calculator.handle({ kind: "digit", value: 3 });
            calculator.handle({ kind: "equal" });
            expect(calculator.getState()).toBe(Calcstate.ResultShown);
            expect(display.renderText).toBe("6");
            calculator.handle({ kind: "decimal" });
            expect(calculator.getState()).toBe(Calcstate.InputtingFirst);
            expect(display.renderText).toBe("0.");
        });

        test("演算子入力直後に小数点入力は無視されるか", () => {
            calculator.handle({ kind: "digit", value: 8 });
            calculator.handle({ kind: "op", value: Operation.Add });
            calculator.handle({ kind: "decimal" });
            expect(calculator.getState()).toBe(Calcstate.OperatorEntered);
            expect(display.renderText).toBe("8 + ");
        });

        test("マイナス入力直後に数字入力できるか", () => {
            calculator.handle({ kind: "op", value: Operation.Subtract });
            calculator.handle({ kind: "digit", value: 5 });
            expect(calculator.getState()).toBe(Calcstate.InputtingFirst);
            expect(display.renderText).toBe("-5");
        });

        test("マイナス入力直後に小数点入力できるか", () => {
            calculator.handle({ kind: "op", value: Operation.Subtract });
            calculator.handle({ kind: "decimal" });
            expect(calculator.getState()).toBe(Calcstate.InputtingFirst);
            expect(display.renderText).toBe("-0.");
        });

        test("マイナス入力後の演算子入力は無視されるか", () => {
            calculator.handle({ kind: "op", value: Operation.Subtract });
            calculator.handle({ kind: "op", value: Operation.Add });
            expect(calculator.getState()).toBe(Calcstate.InputtingFirst);
            expect(display.renderText).toBe("-");
        });
    });

    // 演算子入力のテスト
    describe("演算子入力（handleOperator()）のテスト", () => {
        test("第一オペラント入力後に演算子を入力できるか", () => {
            calculator.handle({ kind: "digit", value: 9 });
            expect(calculator.getState()).toBe(Calcstate.InputtingFirst);
            calculator.handle({ kind: "op", value: Operation.Add });
            expect(calculator.getState()).toBe(Calcstate.OperatorEntered);
            expect(display.renderText).toBe("9 + ");
        });

        test("演算子入力直後に別の演算子を入力できるか", () => {
            calculator.handle({ kind: "digit", value: 9 });
            expect(calculator.getState()).toBe(Calcstate.InputtingFirst);
            calculator.handle({ kind: "op", value: Operation.Add });
            expect(calculator.getState()).toBe(Calcstate.OperatorEntered);
            calculator.handle({ kind: "op", value: Operation.Multiply });
            expect(calculator.getState()).toBe(Calcstate.OperatorEntered);
            expect(display.renderText).toBe("9 × ");
        });

        test("初期状態でマイナス演算子を入力できるか", () => {
            calculator.handle({ kind: "op", value: Operation.Subtract });
            expect(calculator.getState()).toBe(Calcstate.InputtingFirst);
            expect(display.renderText).toBe("-");
        });

        test("初期状態でマイナス以外の演算子入力は無視されるか", () => {
            calculator.handle({ kind: "op", value: Operation.Add });
            expect(calculator.getState()).toBe(Calcstate.Ready);
            expect(display.renderText).toBe("");
        });

        test("小数点入力後に演算子を入力できるか", () => {
            calculator.handle({ kind: "digit", value: 2 });
            calculator.handle({ kind: "decimal" });
            expect(calculator.getState()).toBe(Calcstate.InputtingFirst);
            calculator.handle({ kind: "op", value: Operation.Multiply });
            expect(calculator.getState()).toBe(Calcstate.OperatorEntered);
            expect(calculator.getLeft()).toBe(2);
        });

        test("第二オペラント入力後に演算子を入力すると計算が実行されるか", () => {
            calculator.handle({ kind: "digit", value: 8 });
            expect(calculator.getState()).toBe(Calcstate.InputtingFirst);
            calculator.handle({ kind: "op", value: Operation.Add });
            expect(calculator.getState()).toBe(Calcstate.OperatorEntered);
            calculator.handle({ kind: "digit", value: 4 });
            expect(calculator.getState()).toBe(Calcstate.InputtingSecond);
            calculator.handle({ kind: "op", value: Operation.Multiply });
            expect(calculator.getState()).toBe(Calcstate.OperatorEntered);
            expect(calculator.getLeft()).toBe(12);
            expect(calculator.getOperator()).toBe(Operation.Multiply);
        });

        test("計算結果表示後に演算子を入力できるか", () => {
            calculator.handle({ kind: "digit", value: 6 });
            expect(calculator.getState()).toBe(Calcstate.InputtingFirst);
            calculator.handle({ kind: "op", value: Operation.Subtract });
            expect(calculator.getState()).toBe(Calcstate.OperatorEntered);
            calculator.handle({ kind: "digit", value: 2 });
            expect(calculator.getState()).toBe(Calcstate.InputtingSecond);
            calculator.handle({ kind: "equal" });
            expect(calculator.getState()).toBe(Calcstate.ResultShown);
            expect(display.renderText).toBe("4");
            // 演算子入力できるか
            calculator.handle({ kind: "op", value: Operation.Add });
            expect(calculator.getState()).toBe(Calcstate.OperatorEntered);
            expect(calculator.getLeft()).toBe(4);
            expect(calculator.getOperator()).toBe(Operation.Add);
        });

        test("エラー状態では演算子入力は無視されるか", () => {
            // 0で割り算を試みてエラー状態にする
            calculator.handle({ kind: "digit", value: 5 });
            expect(calculator.getState()).toBe(Calcstate.InputtingFirst);
            calculator.handle({ kind: "op", value: Operation.Divide });
            expect(calculator.getState()).toBe(Calcstate.OperatorEntered);
            calculator.handle({ kind: "digit", value: 0 });
            expect(calculator.getState()).toBe(Calcstate.InputtingSecond);
            // 演算子入力は無視されるか
            calculator.handle({ kind: "op", value: Operation.Add });
            expect(calculator.getState()).toBe(Calcstate.Error);
            expect(calculator.getLeft()).toBe(5);
            expect(calculator.getOperator()).toBe(Operation.Divide);
            expect(display.renderText).toBe("エラー");
        });
    });

    // イコール入力のテスト
    describe("イコール入力（handleEqual()）のテスト", () => {
        test("初期状態でイコール入力は無視されるか", () => {
            calculator.handle({ kind: "equal" });
            expect(calculator.getState()).toBe(Calcstate.Ready);
            expect(display.renderText).toBe("");
        });

        test("第一オペラント入力後にイコール入力は無視されるか", () => {
            calculator.handle({ kind: "digit", value: 3 });
            expect(calculator.getState()).toBe(Calcstate.InputtingFirst);
            calculator.handle({ kind: "equal" });
            expect(calculator.getState()).toBe(Calcstate.InputtingFirst);
            expect(display.renderText).toBe("3");
        });

        test("結果表示後にイコール入力は無視されるか", () => {
            calculator.handle({ kind: "digit", value: 4 });
            expect(calculator.getState()).toBe(Calcstate.InputtingFirst);
            calculator.handle({ kind: "op", value: Operation.Add });
            expect(calculator.getState()).toBe(Calcstate.OperatorEntered);
            calculator.handle({ kind: "digit", value: 5 });
            expect(calculator.getState()).toBe(Calcstate.InputtingSecond);
            calculator.handle({ kind: "equal" });
            expect(calculator.getState()).toBe(Calcstate.ResultShown);
            expect(display.renderText).toBe("9");
            // 続けてイコール入力
            calculator.handle({ kind: "equal" });
            expect(calculator.getState()).toBe(Calcstate.ResultShown);
            expect(display.renderText).toBe("9");
        });

        test("エラー状態ではイコール入力は無視されるか", () => {
            // 0で割り算を試みてエラー状態にする
            calculator.handle({ kind: "digit", value: 5 });
            expect(calculator.getState()).toBe(Calcstate.InputtingFirst);
            calculator.handle({ kind: "op", value: Operation.Divide });
            expect(calculator.getState()).toBe(Calcstate.OperatorEntered);
            calculator.handle({ kind: "digit", value: 0 });
            expect(calculator.getState()).toBe(Calcstate.InputtingSecond);
            calculator.handle({ kind: "equal" });
            expect(calculator.getState()).toBe(Calcstate.Error);
            expect(calculator.getLeft()).toBe(5);
            expect(calculator.getOperator()).toBe(Operation.Divide);
            expect(display.renderText).toBe("エラー");
            // イコール入力は無視されるか
            calculator.handle({ kind: "equal" });
            expect(calculator.getState()).toBe(Calcstate.Error);
            expect(display.renderText).toBe("エラー");
        });

        test("演算子入力後にイコールが入力されれば最後の数字が表示されるか", () => {
            calculator.handle({ kind: "digit", value: 7 });
            expect(calculator.getState()).toBe(Calcstate.InputtingFirst);
            calculator.handle({ kind: "op", value: Operation.Multiply });
            expect(calculator.getState()).toBe(Calcstate.OperatorEntered);
            calculator.handle({ kind: "equal" });
            expect(calculator.getState()).toBe(Calcstate.ResultShown);
            expect(display.renderText).toBe("7");
            expect(calculator.getLeft()).toBe(null);
            expect(calculator.getOperator()).toBe(null);
        });

        test("第二オペラント入力後にイコールが入力されれば計算が実行されるか", () => {
            calculator.handle({ kind: "digit", value: 9 });
            expect(calculator.getState()).toBe(Calcstate.InputtingFirst);
            calculator.handle({ kind: "op", value: Operation.Subtract });
            expect(calculator.getState()).toBe(Calcstate.OperatorEntered);
            calculator.handle({ kind: "digit", value: 4 });
            expect(calculator.getState()).toBe(Calcstate.InputtingSecond);
            calculator.handle({ kind: "equal" });
            expect(calculator.getState()).toBe(Calcstate.ResultShown);
            expect(display.renderText).toBe("5");
            expect(calculator.getLeft()).toBe(5);
            expect(calculator.getOperator()).toBe(null);
        });

        test("負の数の計算が正しく行われるか", () => {
            calculator.handle({ kind: "op", value: Operation.Subtract });
            expect(calculator.getState()).toBe(Calcstate.InputtingFirst);
            calculator.handle({ kind: "digit", value: 3 });
            expect(calculator.getState()).toBe(Calcstate.InputtingFirst);
            calculator.handle({ kind: "op", value: Operation.Add });
            expect(calculator.getState()).toBe(Calcstate.OperatorEntered);
            calculator.handle({ kind: "digit", value: 5 });
            expect(calculator.getState()).toBe(Calcstate.InputtingSecond);
            calculator.handle({ kind: "equal" });
            expect(calculator.getState()).toBe(Calcstate.ResultShown);
            expect(display.renderText).toBe("2");
            expect(calculator.getLeft()).toBe(2);
            expect(calculator.getOperator()).toBe(null);
        });
    });

    // クリア入力のテスト
    describe("クリア入力（handleAllClear()）のテスト", () => {
        test("初期状態でクリア入力は無視されるか", () => {
            calculator.handle({ kind: "clear" });
            expect(calculator.getState()).toBe(Calcstate.Ready);
            expect(calculator.getLeft()).toBe(null);
            expect(calculator.getOperator()).toBe(null);
            expect(display.renderText).toBe("0");
        });

        test("第一オペラント入力後にクリア入力で初期状態に戻るか", () => {
            calculator.handle({ kind: "digit", value: 5 });
            expect(calculator.getState()).toBe(Calcstate.InputtingFirst);
            expect(display.renderText).toBe("5");
            // クリア入力
            calculator.handle({ kind: "clear" });
            expect(calculator.getState()).toBe(Calcstate.Ready);
            expect(display.renderText).toBe("0");
            expect(calculator.getLeft()).toBe(null);
            expect(calculator.getOperator()).toBe(null);
        });

        test("演算子入力後にクリア入力で初期状態に戻るか", () => {
            calculator.handle({ kind: "digit", value: 6 });
            calculator.handle({ kind: "op", value: Operation.Multiply });
            expect(calculator.getState()).toBe(Calcstate.OperatorEntered);
            expect(display.renderText).toBe("6 × ");
            // クリア入力
            calculator.handle({ kind: "clear" });
            expect(calculator.getState()).toBe(Calcstate.Ready);
            expect(display.renderText).toBe("0");
            expect(calculator.getLeft()).toBe(null);
            expect(calculator.getOperator()).toBe(null);
        });

        test("第二オペラント入力後にクリア入力で初期状態に戻るか", () => {
            calculator.handle({ kind: "digit", value: 7 });
            calculator.handle({ kind: "op", value: Operation.Add });
            calculator.handle({ kind: "digit", value: 4 });
            expect(display.renderText).toBe("7 + 4");
            // クリア入力
            calculator.handle({ kind: "clear" });
            expect(calculator.getState()).toBe(Calcstate.Ready);
            expect(display.renderText).toBe("0");
            expect(calculator.getLeft()).toBe(null);
            expect(calculator.getOperator()).toBe(null);
        });

        test("エラー状態でクリア入力で初期状態に戻るか", () => {
            // 0で割り算を試みてエラー状態にする
            calculator.handle({ kind: "digit", value: 5 });
            calculator.handle({ kind: "op", value: Operation.Divide });
            calculator.handle({ kind: "digit", value: 0 });
            calculator.handle({ kind: "equal" });
            expect(calculator.getState()).toBe(Calcstate.Error);
            expect(display.renderText).toBe("エラー");
            // クリア入力
            calculator.handle({ kind: "clear" });
            expect(calculator.getState()).toBe(Calcstate.Ready);
            expect(display.renderText).toBe("0");
            expect(calculator.getLeft()).toBe(null);
            expect(calculator.getOperator()).toBe(null);
        });

        test("計算結果表示後にクリア入力で初期状態に戻るか", () => {
            calculator.handle({ kind: "digit", value: 8 });
            calculator.handle({ kind: "op", value: Operation.Subtract });
            calculator.handle({ kind: "digit", value: 3 });
            calculator.handle({ kind: "equal" });
            expect(calculator.getState()).toBe(Calcstate.ResultShown);
            expect(display.renderText).toBe("5");
            // クリア入力
            calculator.handle({ kind: "clear" });
            expect(calculator.getState()).toBe(Calcstate.Ready);
            expect(display.renderText).toBe("0");
            expect(calculator.getLeft()).toBe(null);
            expect(calculator.getOperator()).toBe(null);
        });
    });

    // handleError();のテスト
    describe("handleError();のテスト", () => {
        test("エラー状態がセットされ、エラーが入力される", () => {
            calculator.handleError("エラー")
            expect(calculator.getState()).toBe(Calcstate.Error);
            expect(display.renderText).toBe("エラー");
        });
    });

    // その他のテスト
    describe("その他のテスト", () => {
        test("計算結果を使った計算ができるか", () => {
            calculator.handle({ kind: "digit", value: 2 });
            expect(calculator.getState()).toBe(Calcstate.InputtingFirst);
            calculator.handle({ kind: "op", value: Operation.Add });
            expect(calculator.getState()).toBe(Calcstate.OperatorEntered);
            calculator.handle({ kind: "digit", value: 3 });
            expect(calculator.getState()).toBe(Calcstate.InputtingSecond);
            calculator.handle({ kind: "equal" });
            expect(calculator.getState()).toBe(Calcstate.ResultShown);
            expect(display.renderText).toBe("5");
            // 続けて演算子入力
            calculator.handle({ kind: "op", value: Operation.Multiply });
            expect(calculator.getState()).toBe(Calcstate.OperatorEntered);
            expect(calculator.getLeft()).toBe(5);
            expect(calculator.getOperator()).toBe(Operation.Multiply);
            expect(display.renderText).toBe("5 × ");
            // 第二オペラント入力
            calculator.handle({ kind: "digit", value: 4 });
            expect(calculator.getState()).toBe(Calcstate.InputtingSecond);
            expect(display.renderText).toBe("5 × 4");
            // イコール入力
            calculator.handle({ kind: "equal" });
            expect(calculator.getState()).toBe(Calcstate.ResultShown);
            expect(display.renderText).toBe("20");
            expect(calculator.getLeft()).toBe(20);
            expect(calculator.getOperator()).toBe(null);
        });
        // main.tsでキャッチできるため以下は安心
        test("handle()の異常系", () => {
            const invalidToken = { kind: 'unknown' as any, value: 0 };
            expect(() => calculator.handle(invalidToken)).toThrow(`予期せぬエラーが発生しました。${invalidToken}`);
        });

        test("8桁を超える大きな数の計算結果は、科学記法が適用されるか", () => {
            calculator.handle({ kind: "digit", value: 9 });
            expect(calculator.getState()).toBe(Calcstate.InputtingFirst);
            calculator.handle({ kind: "digit", value: 9 });
            calculator.handle({ kind: "digit", value: 9 });
            calculator.handle({ kind: "digit", value: 9 });
            calculator.handle({ kind: "digit", value: 9 });
            calculator.handle({ kind: "digit", value: 9 });
            calculator.handle({ kind: "digit", value: 9 });
            calculator.handle({ kind: "digit", value: 9 });
            calculator.handle({ kind: "op", value: Operation.Add });
            expect(calculator.getState()).toBe(Calcstate.OperatorEntered);
            calculator.handle({ kind: "digit", value: 1 });
            expect(calculator.getState()).toBe(Calcstate.InputtingSecond);
            calculator.handle({ kind: "equal" });
            expect(calculator.getState()).toBe(Calcstate.ResultShown);
            expect(display.renderText).toContain("e+");
        });

        test("8桁を超える小さな数の計算結果は、科学記法が適用されるか", () => {
            calculator.handle({ kind: "decimal" });
            expect(calculator.getState()).toBe(Calcstate.InputtingFirst);
            calculator.handle({ kind: "digit", value: 0 });
            calculator.handle({ kind: "digit", value: 0 });
            calculator.handle({ kind: "digit", value: 0 });
            calculator.handle({ kind: "digit", value: 0 });
            calculator.handle({ kind: "digit", value: 0 });
            calculator.handle({ kind: "digit", value: 0 });
            calculator.handle({ kind: "digit", value: 1 });
            calculator.handle({ kind: 'op', value: Operation.Divide });
            expect(calculator.getState()).toBe(Calcstate.OperatorEntered);
            calculator.handle({ kind: "digit", value: 1 });
            expect(calculator.getState()).toBe(Calcstate.InputtingSecond);
            calculator.handle({ kind: "digit", value: 0 });
            calculator.handle({ kind: 'equal' });
            expect(calculator.getState()).toBe(Calcstate.ResultShown);
            expect(display.renderText).toContain("e-");
        });
    });
});
