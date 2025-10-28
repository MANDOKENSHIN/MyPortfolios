/**
 * @jest-environment jsdom
 */

import { KeyMapper } from "../KeyMapper";
import { Operation } from "../Operation";

// KeyMapperクラスのテスト
describe("KeyMapperクラスのテスト", () => {
    let keyMapper: KeyMapper;

    // 各テスト前にインスタンス作成
    beforeEach(() => {
        keyMapper = new KeyMapper();
    });

    // 初期状態のテスト
    describe("初期状態のテスト", () => {
        test("keyMapperインスタンスが正しく生成されているか", () => {
            expect(keyMapper).toBeInstanceOf(KeyMapper);
        });
    });

    // resolve();のテスト
    describe("resolve();のテスト", () => {
        
        // 数字キーが正しく処理されるか
        describe("数字キーが正しく処理されるか", () => {
            test("0-9の各トークンが正しく返されているか", () => {
                for (let i = 0; i <= 9; i++) {
                    const element = document.createElement("button");
                    element.setAttribute("data-key", i.toString());
                    expect(keyMapper.resolve(element)).toEqual({ kind: "digit", value: i });
                    expect(keyMapper.resolve(element)).not.toBeNull();
                };
            });
        });

        // 演算子キーが正しく処理されるか
        describe("演算子キーが正しく処理されるか", () => {
            test("+のトークンが正しく返されているか", () => {
                const element = document.createElement("button");
                element.setAttribute("data-key", "op:+");
                expect(keyMapper.resolve(element)).toEqual({ kind: "op", value: Operation.Add });
                expect(keyMapper.resolve(element)).not.toBeNull();
            });

            test("-のトークンが正しく返されているか", () => {
                const element = document.createElement("button");
                element.setAttribute("data-key", "op:-");
                expect(keyMapper.resolve(element)).toEqual({ kind: "op", value: Operation.Subtract });
                expect(keyMapper.resolve(element)).not.toBeNull();
            });

            test("×のトークンが正しく返されているか", () => {
                const element = document.createElement("button");
                element.setAttribute("data-key", "op:*");
                expect(keyMapper.resolve(element)).toEqual({ kind: "op", value: Operation.Multiply });
                expect(keyMapper.resolve(element)).not.toBeNull();
            });

            test("÷のトークンが正しく返されているか", () => {
                const element = document.createElement("button");
                element.setAttribute("data-key", "op:/");
                expect(keyMapper.resolve(element)).toEqual({ kind: "op", value: Operation.Divide });
                expect(keyMapper.resolve(element)).not.toBeNull();
            });
        });

        // 機能キーが正しく処理されるか
        describe("機能キーが正しく処理されるか", () => {
            test("イコールのトークンが正しく返されているか", () => {
                const element = document.createElement("button");
                element.setAttribute("data-key", "equal");
                expect(keyMapper.resolve(element)).toEqual({ kind: "equal" });
                expect(keyMapper.resolve(element)).not.toBeNull();
            });

            test("クリアのトークンが正しく返されているか", () => {
                const element = document.createElement("button");
                element.setAttribute("data-key", "clear");
                expect(keyMapper.resolve(element)).toEqual({ kind: "clear" });
                expect(keyMapper.resolve(element)).not.toBeNull();
            });

            test("小数点のトークンが正しく返されているか", () => {
                const element = document.createElement("button");
                element.setAttribute("data-key", "decimal");
                expect(keyMapper.resolve(element)).toEqual({ kind: "decimal" });
                expect(keyMapper.resolve(element)).not.toBeNull();
            });
        });

        // 該当するdata-keyがない場合はnullを返されているか
        describe("該当するdata-keyがない場合はnullを返されているか", () => {
            test("data-keyがセットされていない場合はnullが返されているか", () => {
                const element = document.createElement("button");
                expect(keyMapper.resolve(element)).toBe(null);
            });

            test("data-keyがセットされているが該当トークンがない場合はnullが返されているか", () => {
                const element = document.createElement("button");
                element.setAttribute("data-key", "invalid-key");
                expect(keyMapper.resolve(element)).toBe(null);
            });
        });
    });
});


