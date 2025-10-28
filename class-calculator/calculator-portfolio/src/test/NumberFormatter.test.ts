import { Config } from "../Config";
import { NumberFormatter } from "../NumberFormatter";

// NumberFormatterクラスのテスト
describe("NumberFormatterクラスのテスト", () => {
    let numberFormatter: NumberFormatter;

    // 各テスト前にインスタンス生成
    beforeEach(() => {
        numberFormatter = new NumberFormatter(Config.MAX_DIGITS);
    });

    // 初期状態のテスト
    describe("初期状態のテスト", () => {
        test("numberFormatterインスタンスが正しく生成されているか", () => {
            expect(numberFormatter).toBeInstanceOf(NumberFormatter);
        });
    });

    // formatForDisplay();のテスト
    describe("formatForDisplay();のテスト", () => {

        // 計算結果が8桁を超える場合のテスト
        describe("計算結果が8桁を超える場合、科学記法で表されるか", () => {
            test("計算結果が正の整数で99999999を超える場合、小数点以下が7桁の科学記法で表されるか", () => {
                expect(numberFormatter.formatForDisplay(123456780)).toBe("1.2345678e+8");
            });

            test("計算結果が負の整数で-99999999を超える場合、小数点以下が7桁の科学記法で表されるか", () => {
                expect(numberFormatter.formatForDisplay(-123456780)).toBe("-1.2345678e+8");
            });

            test("計算結果が0.0000001未満の数である場合、小数点以下が7桁の科学記法で表されるか", () => {
                expect(numberFormatter.formatForDisplay(0.000000010101010)).toBe("1.0101010e-8");
            });

            test("計算結果が-0.0000001未満の数である場合、小数点以下が7桁の科学記法で表されるか", () => {
                expect(numberFormatter.formatForDisplay(-0.000000010101010)).toBe("-1.0101010e-8");
            });

            test("計算結果が少数で8桁を超える場合、小数点以下が7桁の科学記法で表されるか", () => {
                expect(numberFormatter.formatForDisplay(-12.2222221)).toBe("-1.2222222e+1");
            });
        });

        // 計算結果が8桁を超えない場合のテスト
        describe("計算結果が8桁を超えない場合、科学記法なしで表示されるか", () => {
            test("計算結果が正の整数で8桁を超えない場合、科学記法なしで表示されるか", () => {
                expect(numberFormatter.formatForDisplay(11111111)).toBe("11111111");
            });

            test("計算結果が負の整数で8桁を超えない場合、科学記法なしで表示されるか", () => {
                expect(numberFormatter.formatForDisplay(-11111111)).toBe("-11111111");
            });

            test("計算結果が少数で8桁を超えない場合、科学記法なしで表示されるか", () => {
                expect(numberFormatter.formatForDisplay(-9.9999999)).toBe("-9.9999999");
            });

            test("計算結果が0.0000001〜0.0000009には科学記法が適用されないか", () => {
                expect(numberFormatter.formatForDisplay(0.0000001)).not.toBe("1e-7");
                expect(numberFormatter.formatForDisplay(0.0000002)).not.toBe("2e-7");
                expect(numberFormatter.formatForDisplay(0.0000003)).not.toBe("3e-7");
                expect(numberFormatter.formatForDisplay(0.0000004)).not.toBe("4e-7");
                expect(numberFormatter.formatForDisplay(0.0000005)).not.toBe("5e-7");
                expect(numberFormatter.formatForDisplay(0.0000006)).not.toBe("6e-7");
                expect(numberFormatter.formatForDisplay(0.0000007)).not.toBe("7e-7");
                expect(numberFormatter.formatForDisplay(0.0000008)).not.toBe("8e-7");
                expect(numberFormatter.formatForDisplay(0.0000009)).not.toBe("9e-7");
            });

            test("計算結果が少数で末尾が0になった場合、0が取り除かれるか", () => {
                expect(numberFormatter.formatForDisplay(-3.500000)).toBe("-3.5");
            });

            test("計算結果の末尾が.になった場合、.が取り除かれるか", () => {
                expect(numberFormatter.formatForDisplay(1.)).toBe("1");
            });
        });
    });
});