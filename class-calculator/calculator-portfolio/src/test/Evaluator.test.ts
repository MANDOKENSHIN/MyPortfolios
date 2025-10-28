import { DivisionByZeroError } from "../DivisionByZeroError";
import { Evaluator } from "../Evaluator";
import { Operation } from "../Operation";

// Evaluatorクラスのテスト
describe("Evaluatorクラスのテスト", () => {
    let evaluator: Evaluator;

    // 各テスト前にインスタンス生成
    beforeEach(() => {
        evaluator = new Evaluator();
    });

    // 初期状態のテスト
    describe("初期状態のテスト", () => {
        test("evaluatorインスタンスが正しく生成できているか", () => {
            expect(evaluator).toBeInstanceOf(Evaluator);
        });
    });

    // 加算ができるか
    describe("加算ができるか", () => {
        test("3 + 5", () => {
            expect(evaluator.compute(3, Operation.Add, 5)).toBe(8);
        });

        test("2.4 + 3.5", () => {
            expect(evaluator.compute(2.4, Operation.Add, 3.5)).toBe(5.9);
        });

        test("-5 + 4", () => {
            expect(evaluator.compute(-5, Operation.Add, 4)).toBe(-1);
        });
    });

    // 減算ができるか
    describe("減算ができるか", () => {
        test("5 - 1", () => {
            expect(evaluator.compute(5, Operation.Subtract, 1)).toBe(4);
        });

        test("564.643 - 64.32", () => {
            expect(evaluator.compute(564.643, Operation.Subtract, 64.32)).toBe(500.32300000000004);
        });

        test("33 - 5555", () => {
            expect(evaluator.compute(33, Operation.Subtract, 5555)).toBe(-5522);
        });
    });

    // 乗算ができるか
    describe("乗算ができるか", () => {
        test("4 × 5", () => {
            expect(evaluator.compute(4, Operation.Multiply, 5)).toBe(20);
        });

        test("4.6 × 74.3", () => {
            expect(evaluator.compute(4.6, Operation.Multiply, 74.3)).toBe(341.78);
        });

        test("-14.3 × 4", () => {
            expect(evaluator.compute(-14.3, Operation.Multiply, 4)).toBe(-57.2);
        });
    });

    // 除算ができるか
    describe("除算ができるか", () => {
        test("4 ÷ 2", () => {
            expect(evaluator.compute(4, Operation.Divide, 2)).toBe(2);
        });

        test("5.28 ÷ 8", () => {
            expect(evaluator.compute(5.28, Operation.Divide, 8)).toBe(0.66);
        });

        test("-645 ÷ 3", () => {
            expect(evaluator.compute(-645, Operation.Divide, 3)).toBe(-215);
        });
    });

    // 0除算の際にはDivisionByZeroErrorが投げられてるか(Calculator.tsでキャッチできるため以下は安心)
    describe("0除算の際にはDivisionByZeroErrorが投げられてるか", () => {
        test("5 ÷ 0", () => {
            expect(() => {
                evaluator.compute(5, Operation.Divide, 0);
            }).toThrow(DivisionByZeroError);
        });

        test("5 ÷ 0", () => {
            expect(() => {
                evaluator.compute(5, Operation.Divide, 0);
            }).toThrow("Divide by zero");
        });
    });

    // その他のテスト
    describe("その他のテスト", () => {
        test("丸め誤差を許容した計算ができているか", () => {
            // JavaScriptの浮動小数点誤差を考慮
            expect(evaluator.compute(0.1, Operation.Add, 0.2)).toBeCloseTo(0.3);
            expect(evaluator.compute(0.3, Operation.Subtract, 0.1)).toBeCloseTo(0.2);
        });
    });
});