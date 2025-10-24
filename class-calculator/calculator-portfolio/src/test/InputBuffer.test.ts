import { InputBuffer } from "../InputBuffer";
import { Config } from "../Config";

// InputBufferクラスのテスト
describe("InputBufferクラスのテスト", () => {
    let inputBuffer: InputBuffer;

    // 各テスト前にインスタンス生成
    beforeEach(() => {
        inputBuffer = new InputBuffer(Config.MAX_DIGITS);
    });

    // pushDigit();のテスト
    describe("pushDigit();のテスト", () => {
        test("valueが空のとき、数値が入力される", () => {
            inputBuffer.setValue("");
            inputBuffer.pushDigit(9);
            expect(inputBuffer.getValue()).toBe("9");
        });

        test("valueが1桁以上8桁未満のとき、数値が入力される", () => {
            inputBuffer.setValue("123456");
            inputBuffer.pushDigit(9);
            expect(inputBuffer.getValue()).toBe("1234569");
        });

        test("valueが8桁であるとき数値は入力されない", () => {
            inputBuffer.setValue("12345678");
            inputBuffer.pushDigit(9);
            expect(inputBuffer.getValue()).toBe("12345678");
        });

        test("valueには小数点やマイナスを除いて8桁入力可能か", () => {
            inputBuffer.setValue("-1.234567");
            inputBuffer.pushDigit(9);
            expect(inputBuffer.getValue()).toBe("-1.2345679");
        });

        test("先頭に0が入力されている状態で新たに数値を入れると置き換えられるか", () => {
            inputBuffer.setValue("0");
            inputBuffer.pushDigit(5);
            expect(inputBuffer.getValue()).toBe("5");
        });

        test("先頭に-0が入力されている状態で新たに数値を入れると置き換えられるか", () => {
            inputBuffer.setValue("-0");
            inputBuffer.pushDigit(5);
            expect(inputBuffer.getValue()).toBe("-5");
        });
    });

    // pushDecimal();のテスト
    describe("pushDecimal();のテスト", () => {
        test("valueが空のとき、小数点が入力されると0.になるか", () => {
            inputBuffer.setValue("");
            inputBuffer.pushDecimal();
            expect(inputBuffer.getValue()).toBe("0.");
        });

        test("valueに8桁未満の整数が入力されているとき、小数点を入力できるか", () => {
            inputBuffer.setValue("123456");
            inputBuffer.pushDecimal();
            expect(inputBuffer.getValue()).toBe("123456.");
        });

        test("valueが8桁であるとき小数点は入力されない", () => {
            inputBuffer.setValue("12345678");
            inputBuffer.pushDecimal();
            expect(inputBuffer.getValue()).toBe("12345678");
        });

        test("小数点が入力されていると無視するか", () => {
            inputBuffer.setValue("5.6");
            inputBuffer.pushDecimal();
            expect(inputBuffer.getValue()).toBe("5.6");
        });

        test("valueにマイナスが入力されているとき、小数点が入力されると-0.になるか", () => {
            inputBuffer.setValue("-");
            inputBuffer.pushDecimal();
            expect(inputBuffer.getValue()).toBe("-0.");
        });
    });

    // setNegative();のテスト
    describe("setNegative();のテスト", () => {
        test("valueが空のとき、マイナスが入力される", () => {
            inputBuffer.setValue("");
            inputBuffer.setNegative();
            expect(inputBuffer.getValue()).toBe("-");
        });

        test("valueにマイナスが入力されているとき、マイナスは無視されるか", () => {
            inputBuffer.setValue("");
            inputBuffer.setNegative();
            expect(inputBuffer.getValue()).toBe("-");
            inputBuffer.setNegative();
            expect(inputBuffer.getValue()).toBe("-");
        });
    });

    test("clear();のテスト", () => {
        inputBuffer.setValue("12345678");
        expect(inputBuffer.getValue()).toBe("12345678");
        inputBuffer.clear();
        expect(inputBuffer.getValue()).toBe("");
    });

    // toNumber();のテスト
    describe("toNumber();のテスト", () => {
        test("valueが空のときは0を返す", () => {
            inputBuffer.setValue("");
            expect(inputBuffer.toNumber()).toBe(0);
        });

        test("valueの数値がnumber化するか", () => {
            inputBuffer.setValue("513");
            expect(inputBuffer.toNumber()).toBe(513);
        });

        test("マイナスを含むvalueの数値がnumber化するか", () => {
            inputBuffer.setValue("-513");
            expect(inputBuffer.toNumber()).toBe(-513);
        });

        test("valueがマイナスのみのときは0を返すか", () => {
            inputBuffer.setValue("-");
            expect(inputBuffer.toNumber()).toBe(0);
        });

        test("valueが小数点で終わっているときは取り除かれるか", () => {
            inputBuffer.setValue("123435.");
            expect(inputBuffer.toNumber()).toBe(123435);
        });
    });

    // hasDecimal();のテスト
    describe("hasDecimal();のテスト", () => {
        test("小数点を含んでいる場合trueが返されるか", () => {
            inputBuffer.setValue("1.2345678");
            expect(inputBuffer.getValue()).toBe("1.2345678");
            expect(inputBuffer.hasDecimal()).toBe(true);
        });
        test("小数点を含んでいない場合falseが返されるか", () => {
            inputBuffer.setValue("12345678");
            expect(inputBuffer.getValue()).toBe("12345678");
            expect(inputBuffer.hasDecimal()).toBe(false);
        });
    });
});