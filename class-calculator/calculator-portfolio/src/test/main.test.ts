/**
 * @jest-environment jsdom
 */
import { DomDisplay } from "../DomDisplay";
import { Calculator } from "../Calculator";
import { KeyMapper } from "../KeyMapper";
import { Config } from "../Config";

// アプリ統合テスト
describe("アプリ統合テスト", () => {
    let display: DomDisplay;
    let calculator: Calculator;
    let mapper: KeyMapper;

    // テスト前に仮想DOMを生成
    beforeEach(() => {
        document.body.innerHTML = `
    <div class="calculator">
        <div class="display">
            <div class="output" id="screen">0</div>
        </div>
        <div class="keys">
            <div class="row">
                <button class="clear" data-key="clear">C</button>
                <button class="operator" data-key="op:/">÷</button>
                <button class="operator" data-key="op:*">×</button>
                <button class="operator" data-key="op:-">-</button>
            </div>
            <div class="row">
                <button data-key="7">7</button>
                <button data-key="8">8</button>
                <button data-key="9">9</button>
                <button class="operator" data-key="op:+">+</button>
            </div>
            <div class="row">
                <button data-key="4">4</button>
                <button data-key="5">5</button>
                <button data-key="6">6</button>
                <button class="equal" data-key="equal">=</button>
            </div>
            <div class="row">
                <button data-key="1">1</button>
                <button data-key="2">2</button>
                <button data-key="3">3</button>
                <button class="zero" data-key="0">0</button>
            </div>
            <div class="row">
                <button data-key="decimal">.</button>
            </div>
        </div>
    </div>`;

        // テスト前にインスタンスを生成
        display = new DomDisplay(document.getElementById("screen")!);
        calculator = new Calculator(display);
        mapper = new KeyMapper();

        // 各ボタンにクリックイベントを設定
        document.querySelectorAll(".keys > .row > button").forEach(btn => {
            btn.addEventListener("click", e => {
                try {
                    const token = mapper.resolve(e.target as HTMLElement);
                    if (token) {
                        calculator.handle(token);
                    }
                } catch (error: unknown) {
                    calculator.handleError(Config.ERROR_MESSAGE);
                    console.error("予期せぬエラーが発生しました。", error);
                }
            });
        });
    });

    // 初期化のテスト
    describe("初期化のテスト", () => {
        test("必要なDOM要素が存在するか", () => {
            const screen = document.getElementById("screen");
            const buttons = document.querySelectorAll(".keys > .row > button");
            expect(screen).toBeTruthy();
            expect(buttons.length).toBe(17);
        });

        test("必要なインスタンスが生成されているか", () => {
            expect(display).toBeInstanceOf(DomDisplay);
            expect(calculator).toBeInstanceOf(Calculator);
            expect(mapper).toBeInstanceOf(KeyMapper);
        });

        test("画面に0が表示されているか", () => {
            const screen = document.getElementById("screen");
            expect(screen?.textContent).toBe("0");
        });
    });

    // 数字ボタン入力のテスト
    describe("数字ボタン入力のテスト", () => {
        test("0-3のボタンがクリックされると数字が入力できるか", () => {
            const button1 = document.querySelector('[data-key="1"]') as HTMLButtonElement;
            const button2 = document.querySelector('[data-key="2"]') as HTMLButtonElement;
            const button3 = document.querySelector('[data-key="3"]') as HTMLButtonElement;
            const button0 = document.querySelector('[data-key="0"]') as HTMLButtonElement;

            button1.click();
            button2.click();
            button3.click();
            button0.click();

            const screen = document.getElementById("screen");
            expect(screen?.textContent).toBe("1230");
        });

        test("4-6のボタンがクリックされると数字が入力できるか", () => {
            const button4 = document.querySelector('[data-key="4"]') as HTMLButtonElement;
            const button5 = document.querySelector('[data-key="5"]') as HTMLButtonElement;
            const button6 = document.querySelector('[data-key="6"]') as HTMLButtonElement;

            button4.click();
            button5.click();
            button6.click();

            const screen = document.getElementById("screen");
            expect(screen?.textContent).toBe("456");
        });

        test("7-9のボタンがクリックされると数字が入力できるか", () => {
            const button7 = document.querySelector('[data-key="7"]') as HTMLButtonElement;
            const button8 = document.querySelector('[data-key="8"]') as HTMLButtonElement;
            const button9 = document.querySelector('[data-key="9"]') as HTMLButtonElement;

            button7.click();
            button8.click();
            button9.click();

            const screen = document.getElementById("screen");
            expect(screen?.textContent).toBe("789");
        });

        test("小数点ボタンがクリックされると数字が入力できるか", () => {
            const buttonDecimal = document.querySelector('[data-key="decimal"]') as HTMLButtonElement;

            buttonDecimal.click();

            const screen = document.getElementById("screen");
            expect(screen?.textContent).toBe("0.");
        });
    });

    // 演算子ボタン入力のテスト
    describe("演算子ボタン入力のテスト", () => {
        // +ボタン入力のテスト
        describe("+ボタン入力のテスト", () => {
            test("数値入力前に+ボタンをクリックしても画面に表示されない", () => {
                const buttonAdd = document.querySelector('[data-key="op:+"]') as HTMLButtonElement;

                buttonAdd.click();

                const screen = document.getElementById("screen");
                expect(screen?.textContent).toBe("0");
            });

            test("数値入力後に+ボタンをクリックすると画面に表示される", () => {
                const button7 = document.querySelector('[data-key="7"]') as HTMLButtonElement;
                const buttonAdd = document.querySelector('[data-key="op:+"]') as HTMLButtonElement;

                button7.click();
                buttonAdd.click();

                const screen = document.getElementById("screen");
                expect(screen?.textContent).toBe("7 + ");
            });
        });

        // -ボタン入力のテスト
        describe("-ボタン入力のテスト", () => {
            test("数値入力前に×ボタンをクリックすると画面に表示される", () => {
                const buttonSubtract = document.querySelector('[data-key="op:-"]') as HTMLButtonElement;

                buttonSubtract.click();

                const screen = document.getElementById("screen");
                expect(screen?.textContent).toBe("-");
            });

            test("数値入力後に-ボタンをクリックすると画面に表示される", () => {
                const button7 = document.querySelector('[data-key="7"]') as HTMLButtonElement;
                const buttonSubtract = document.querySelector('[data-key="op:-"]') as HTMLButtonElement;

                button7.click();
                buttonSubtract.click();

                const screen = document.getElementById("screen");
                expect(screen?.textContent).toBe("7 - ");
            });
        });

        // ×ボタン入力のテスト
        describe("×ボタン入力のテスト", () => {
            test("数値入力前に×ボタンをクリックしても画面に表示されない", () => {
                const buttonMultiply = document.querySelector('[data-key="op:*"]') as HTMLButtonElement;

                buttonMultiply.click();

                const screen = document.getElementById("screen");
                expect(screen?.textContent).toBe("0");
            });

            test("数値入力後に+ボタンをクリックすると画面に表示される", () => {
                const button7 = document.querySelector('[data-key="7"]') as HTMLButtonElement;
                const buttonMultiply = document.querySelector('[data-key="op:*"]') as HTMLButtonElement;

                button7.click();
                buttonMultiply.click();

                const screen = document.getElementById("screen");
                expect(screen?.textContent).toBe("7 × ");
            });
        });

        // ÷ボタン入力のテスト
        describe("÷ボタン入力のテスト", () => {
            test("数値入力前に÷ボタンをクリックしても画面に表示されない", () => {
                const buttonDivide = document.querySelector('[data-key="op:/"]') as HTMLButtonElement;

                buttonDivide.click();

                const screen = document.getElementById("screen");
                expect(screen?.textContent).toBe("0");
            });

            test("数値入力後に÷ボタンをクリックすると画面に表示される", () => {
                const button7 = document.querySelector('[data-key="7"]') as HTMLButtonElement;
                const buttonDivide = document.querySelector('[data-key="op:/"]') as HTMLButtonElement;

                button7.click();
                buttonDivide.click();

                const screen = document.getElementById("screen");
                expect(screen?.textContent).toBe("7 ÷ ");
            });
        });
    });

    // 複雑な式の計算ができるか
    describe("正しく計算ができるか", () => {
        // =ボタン入力でのテスト
        describe("=ボタン入力でのテスト", () => {
            // 加算が正しくできているか
            describe("加算が正しくできているか", () => {
                test("13.5 + 141", () => {
                    const button1 = document.querySelector('[data-key="1"]') as HTMLButtonElement;
                    const button3 = document.querySelector('[data-key="3"]') as HTMLButtonElement;
                    const buttonDecimal = document.querySelector('[data-key="decimal"]') as HTMLButtonElement;
                    const button4 = document.querySelector('[data-key="4"]') as HTMLButtonElement;
                    const button5 = document.querySelector('[data-key="5"]') as HTMLButtonElement;
                    const buttonAdd = document.querySelector('[data-key="op:+"]') as HTMLButtonElement;
                    const buttonEqual = document.querySelector('[data-key="equal"]') as HTMLButtonElement;

                    button1.click();
                    button3.click();
                    buttonDecimal.click();
                    button5.click();
                    buttonAdd.click();
                    button1.click();
                    button4.click();
                    button1.click();
                    buttonEqual.click();

                    const screen = document.getElementById("screen");
                    expect(screen?.textContent).toBe("154.5");
                });
            });

            // 減算が正しくできているか
            describe("減算が正しくできているか", () => {
                test("13.5 - 141", () => {
                    const button1 = document.querySelector('[data-key="1"]') as HTMLButtonElement;
                    const button3 = document.querySelector('[data-key="3"]') as HTMLButtonElement;
                    const buttonDecimal = document.querySelector('[data-key="decimal"]') as HTMLButtonElement;
                    const button4 = document.querySelector('[data-key="4"]') as HTMLButtonElement;
                    const button5 = document.querySelector('[data-key="5"]') as HTMLButtonElement;
                    const buttonSubtract = document.querySelector('[data-key="op:-"]') as HTMLButtonElement;
                    const buttonEqual = document.querySelector('[data-key="equal"]') as HTMLButtonElement;

                    button1.click();
                    button3.click();
                    buttonDecimal.click();
                    button5.click();
                    buttonSubtract.click();
                    button1.click();
                    button4.click();
                    button1.click();
                    buttonEqual.click();

                    const screen = document.getElementById("screen");
                    expect(screen?.textContent).toBe("-127.5");
                });
            });

            // 乗算が正しくできているか
            describe("乗算が正しくできているか", () => {
                test("13.5 × 141", () => {
                    const button1 = document.querySelector('[data-key="1"]') as HTMLButtonElement;
                    const button3 = document.querySelector('[data-key="3"]') as HTMLButtonElement;
                    const buttonDecimal = document.querySelector('[data-key="decimal"]') as HTMLButtonElement;
                    const button4 = document.querySelector('[data-key="4"]') as HTMLButtonElement;
                    const button5 = document.querySelector('[data-key="5"]') as HTMLButtonElement;
                    const buttonMultiply = document.querySelector('[data-key="op:*"]') as HTMLButtonElement;
                    const buttonEqual = document.querySelector('[data-key="equal"]') as HTMLButtonElement;

                    button1.click();
                    button3.click();
                    buttonDecimal.click();
                    button5.click();
                    buttonMultiply.click();
                    button1.click();
                    button4.click();
                    button1.click();
                    buttonEqual.click();

                    const screen = document.getElementById("screen");
                    expect(screen?.textContent).toBe("1903.5");
                });
            });

            // 除算が正しくできているか
            describe("除算が正しくできているか", () => {
                test("1000 ÷ 25", () => {
                    const button1 = document.querySelector('[data-key="1"]') as HTMLButtonElement;
                    const button0 = document.querySelector('[data-key="0"]') as HTMLButtonElement;
                    const button2 = document.querySelector('[data-key="2"]') as HTMLButtonElement;
                    const button5 = document.querySelector('[data-key="5"]') as HTMLButtonElement;
                    const buttonDivide = document.querySelector('[data-key="op:/"]') as HTMLButtonElement;
                    const buttonEqual = document.querySelector('[data-key="equal"]') as HTMLButtonElement;

                    button1.click();
                    button0.click();
                    button0.click();
                    button0.click();
                    buttonDivide.click();
                    button2.click();
                    button5.click();
                    buttonEqual.click();

                    const screen = document.getElementById("screen");
                    expect(screen?.textContent).toBe("40");
                });

                test("1000 ÷ 0", () => {
                    const button1 = document.querySelector('[data-key="1"]') as HTMLButtonElement;
                    const button0 = document.querySelector('[data-key="0"]') as HTMLButtonElement;
                    const buttonDivide = document.querySelector('[data-key="op:/"]') as HTMLButtonElement;
                    const buttonEqual = document.querySelector('[data-key="equal"]') as HTMLButtonElement;

                    button1.click();
                    button0.click();
                    button0.click();
                    button0.click();
                    buttonDivide.click();
                    button0.click();
                    buttonEqual.click();

                    const screen = document.getElementById("screen");
                    expect(screen?.textContent).toBe("エラー");
                });
            });
        });

        // 演算子２回で左オペラントに計算結果が入るか
        describe("演算子２回で左オペラントに計算結果が入るか", () => {
            test("1000 ÷ 25 +", () => {
                const button1 = document.querySelector('[data-key="1"]') as HTMLButtonElement;
                const button0 = document.querySelector('[data-key="0"]') as HTMLButtonElement;
                const button2 = document.querySelector('[data-key="2"]') as HTMLButtonElement;
                const button5 = document.querySelector('[data-key="5"]') as HTMLButtonElement;
                const buttonAdd = document.querySelector('[data-key="op:+"]') as HTMLButtonElement;
                const buttonDivide = document.querySelector('[data-key="op:/"]') as HTMLButtonElement;

                button1.click();
                button0.click();
                button0.click();
                button0.click();
                buttonDivide.click();
                button2.click();
                button5.click();
                buttonAdd.click();

                const screen = document.getElementById("screen");
                expect(screen?.textContent).toBe("40 + ");
            });
        });
    });

    // エラー表示後のボタンクリックテスト
    describe("エラー表示後のボタンクリックテスト", () => {
        // クリックした数字が表示されるか
        describe("クリックした数字が表示されるか", () => {
            test("エラー → 1", () => {
                const button1 = document.querySelector('[data-key="1"]') as HTMLButtonElement;
                const button0 = document.querySelector('[data-key="0"]') as HTMLButtonElement;
                const buttonDivide = document.querySelector('[data-key="op:/"]') as HTMLButtonElement;
                const buttonEqual = document.querySelector('[data-key="equal"]') as HTMLButtonElement;

                button1.click();
                button0.click();
                buttonDivide.click();
                button0.click();
                buttonEqual.click();

                const screen = document.getElementById("screen");
                expect(screen?.textContent).toBe("エラー");

                button1.click();
                expect(screen?.textContent).toBe("1");
            });
        });

        // 小数点がクリックされると0.が表示されるか
        describe("小数点がクリックされると0.が表示されるか", () => {
            test("エラー → 0.", () => {
                const button1 = document.querySelector('[data-key="1"]') as HTMLButtonElement;
                const button0 = document.querySelector('[data-key="0"]') as HTMLButtonElement;
                const buttonDecimal = document.querySelector('[data-key="decimal"]') as HTMLButtonElement;
                const buttonDivide = document.querySelector('[data-key="op:/"]') as HTMLButtonElement;
                const buttonEqual = document.querySelector('[data-key="equal"]') as HTMLButtonElement;

                button1.click();
                button0.click();
                buttonDivide.click();
                button0.click();
                buttonEqual.click();

                const screen = document.getElementById("screen");
                expect(screen?.textContent).toBe("エラー");

                buttonDecimal.click();
                expect(screen?.textContent).toBe("0.");
            });
        });

        // 演算子がクリックされると0.が表示されるか
        describe("マイナス以外の演算子がクリックされると無視されるか", () => {
            test("エラー → エラー", () => {
                const button1 = document.querySelector('[data-key="1"]') as HTMLButtonElement;
                const button0 = document.querySelector('[data-key="0"]') as HTMLButtonElement;
                const buttonDivide = document.querySelector('[data-key="op:/"]') as HTMLButtonElement;
                const buttonEqual = document.querySelector('[data-key="equal"]') as HTMLButtonElement;

                button1.click();
                button0.click();
                buttonDivide.click();
                button0.click();
                buttonEqual.click();

                const screen = document.getElementById("screen");
                expect(screen?.textContent).toBe("エラー");

                buttonDivide.click();
                expect(screen?.textContent).toBe("エラー");
            });
        });

        // 演算子がクリックされると0.が表示されるか
        describe("マイナスがクリックされると-が表示されるか", () => {
            test("エラー → -", () => {
                const button1 = document.querySelector('[data-key="1"]') as HTMLButtonElement;
                const button0 = document.querySelector('[data-key="0"]') as HTMLButtonElement;
                const buttonSubtract = document.querySelector('[data-key="op:-"]') as HTMLButtonElement;
                const buttonDivide = document.querySelector('[data-key="op:/"]') as HTMLButtonElement;
                const buttonEqual = document.querySelector('[data-key="equal"]') as HTMLButtonElement;

                button1.click();
                button0.click();
                buttonDivide.click();
                button0.click();
                buttonEqual.click();

                const screen = document.getElementById("screen");
                expect(screen?.textContent).toBe("エラー");

                buttonSubtract.click();
                expect(screen?.textContent).toBe("-");
            });
        });

        // クリアボタンがクリックされると0が表示されるか
        describe("クリアボタンがクリックされると0が表示されるか", () => {
            test("エラー → 0", () => {
                const button1 = document.querySelector('[data-key="1"]') as HTMLButtonElement;
                const button0 = document.querySelector('[data-key="0"]') as HTMLButtonElement;
                const buttonDivide = document.querySelector('[data-key="op:/"]') as HTMLButtonElement;
                const buttonEqual = document.querySelector('[data-key="equal"]') as HTMLButtonElement;
                const buttonClear = document.querySelector('[data-key="clear"]') as HTMLButtonElement;

                button1.click();
                button0.click();
                buttonDivide.click();
                button0.click();
                buttonEqual.click();

                const screen = document.getElementById("screen");
                expect(screen?.textContent).toBe("エラー");

                buttonClear.click();
                expect(screen?.textContent).toBe("0");
            });
        });
    });

    // 特殊文字関連のテスト
    describe("特殊文字関連のテスト", () => {
        // 小数点2回連続でクリックすると無視されるか
        describe("小数点2回連続でクリックすると無視されるか", () => {
            test("1. → 1.", () => {
                const button1 = document.querySelector('[data-key="1"]') as HTMLButtonElement;
                const buttonDecimal = document.querySelector('[data-key="decimal"]') as HTMLButtonElement;

                button1.click();
                buttonDecimal.click();
                buttonDecimal.click();

                const screen = document.getElementById("screen");
                expect(screen?.textContent).toBe("1.");
            });
        });

        // 小数点2回目のクリックは無視されるか
        describe("小数点2回目のクリックは無視されるか", () => {
            test("1.1 → 1.1", () => {
                const button1 = document.querySelector('[data-key="1"]') as HTMLButtonElement;
                const buttonDecimal = document.querySelector('[data-key="decimal"]') as HTMLButtonElement;

                button1.click();
                buttonDecimal.click();
                button1.click();
                buttonDecimal.click();

                const screen = document.getElementById("screen");
                expect(screen?.textContent).toBe("1.1");
            });
        });

        // 小数点→演算子クリックは数字と演算子が表示されるか
        describe("小数点→演算子クリックは数字と演算子が表示されるか", () => {
            test("1. → 1 ÷ ", () => {
                const button1 = document.querySelector('[data-key="1"]') as HTMLButtonElement;
                const buttonDecimal = document.querySelector('[data-key="decimal"]') as HTMLButtonElement;
                const buttonDivide = document.querySelector('[data-key="op:/"]') as HTMLButtonElement;

                button1.click();
                buttonDecimal.click();
                buttonDivide.click();

                const screen = document.getElementById("screen");
                expect(screen?.textContent).toBe("1 ÷ ");
            });
        });

        // 同じ演算子2回目のクリックは無視されるか
        describe("同じ演算子2回目のクリックは無視されるか", () => {
            test("1 ÷  → 1 ÷ ", () => {
                const button1 = document.querySelector('[data-key="1"]') as HTMLButtonElement;
                const buttonDivide = document.querySelector('[data-key="op:/"]') as HTMLButtonElement;

                button1.click();
                buttonDivide.click();
                buttonDivide.click();

                const screen = document.getElementById("screen");
                expect(screen?.textContent).toBe("1 ÷ ");
            });
        });

        // 異なる演算子をクリックすると上書きされるか
        describe("異なる演算子をクリックすると上書きされるか", () => {
            test("1 ÷  → 1 + ", () => {
                const button1 = document.querySelector('[data-key="1"]') as HTMLButtonElement;
                const buttonDivide = document.querySelector('[data-key="op:/"]') as HTMLButtonElement;
                const buttonAdd = document.querySelector('[data-key="op:+"]') as HTMLButtonElement;

                button1.click();
                buttonDivide.click();
                buttonAdd.click();

                const screen = document.getElementById("screen");
                expect(screen?.textContent).toBe("1 + ");
            });
        });

        // 演算子→小数点クリックは無視されるか
        describe("演算子→小数点クリックは無視されるか", () => {
            test("1 ÷ → 1 ÷", () => {
                const button1 = document.querySelector('[data-key="1"]') as HTMLButtonElement;
                const buttonDecimal = document.querySelector('[data-key="decimal"]') as HTMLButtonElement;
                const buttonDivide = document.querySelector('[data-key="op:/"]') as HTMLButtonElement;

                button1.click();
                buttonDivide.click();
                buttonDecimal.click();

                const screen = document.getElementById("screen");
                expect(screen?.textContent).toBe("1 ÷ ");
            });
        });

        // 式入力後にクリアボタンをクリックすると画面表示が0になるか
        describe("式入力後にクリアボタンをクリックすると画面表示が0になるか", () => {
            test("11 ÷ 11 → 0", () => {
                const button1 = document.querySelector('[data-key="1"]') as HTMLButtonElement;
                const buttonDivide = document.querySelector('[data-key="op:/"]') as HTMLButtonElement;
                const buttonClear = document.querySelector('[data-key="clear"]') as HTMLButtonElement;

                button1.click();
                button1.click();
                buttonDivide.click();
                button1.click();
                button1.click();
                buttonClear.click();

                const screen = document.getElementById("screen");
                expect(screen?.textContent).toBe("0");
            });
        });
    });

    // 桁数制限のテスト
    describe("桁数制限のテスト", () => {
        // -と.以外の数値を8桁以上入力しても無視されるか
        describe("-と.以外の数値を8桁以上入力しても無視されるか", () => {
            test("-1.1111111 → -1.1111111", () => {
                const button1 = document.querySelector('[data-key="1"]') as HTMLButtonElement;
                const buttonSubtract = document.querySelector('[data-key="op:-"]') as HTMLButtonElement;
                const buttonDecimal = document.querySelector('[data-key="decimal"]') as HTMLButtonElement;

                buttonSubtract.click();
                button1.click();
                buttonDecimal.click();
                button1.click();
                button1.click();
                button1.click();
                button1.click();
                button1.click();
                button1.click();
                button1.click();
                button1.click();
                button1.click();
                button1.click();

                const screen = document.getElementById("screen");
                expect(screen?.textContent).toBe("-1.1111111");
            });
        });

        // 計算結果が8桁を超えると科学記法で表示されるか（境界値テスト）
        describe("計算結果が8桁を超えると科学記法で表示されるか（境界値テスト）", () => {
            test("99999999 + 1", () => {
                const button1 = document.querySelector('[data-key="1"]') as HTMLButtonElement;
                const button9 = document.querySelector('[data-key="9"]') as HTMLButtonElement;
                const buttonAdd = document.querySelector('[data-key="op:+"]') as HTMLButtonElement;
                const buttonEqual = document.querySelector('[data-key="equal"]') as HTMLButtonElement;

                button9.click();
                button9.click();
                button9.click();
                button9.click();
                button9.click();
                button9.click();
                button9.click();
                button9.click();
                buttonAdd.click();
                button1.click();
                buttonEqual.click();

                const screen = document.getElementById("screen");
                expect(screen?.textContent).toBe("1.0000000e+8");
            });

            test("0.0000001 ÷ 10", () => {
                const button1 = document.querySelector('[data-key="1"]') as HTMLButtonElement;
                const button0 = document.querySelector('[data-key="0"]') as HTMLButtonElement;
                const buttonDecimal = document.querySelector('[data-key="decimal"]') as HTMLButtonElement;
                const buttonDivide = document.querySelector('[data-key="op:/"]') as HTMLButtonElement;
                const buttonEqual = document.querySelector('[data-key="equal"]') as HTMLButtonElement;

                button0.click();
                buttonDecimal.click();
                button0.click();
                button0.click();
                button0.click();
                button0.click();
                button0.click();
                button0.click();
                button1.click();
                buttonDivide.click();
                button1.click();
                button0.click();
                buttonEqual.click();

                const screen = document.getElementById("screen");
                expect(screen?.textContent).toBe("1.0000000e-8");
            });
        });
    });
});
