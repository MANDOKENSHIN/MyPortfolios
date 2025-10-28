/**
 * @jest-environment jsdom
 */

import { DomDisplay } from "../DomDisplay";

// DomDisplayクラスのテスト
describe("DomDisplayクラスのテスト", () => {
    let domDisplay: DomDisplay;
    let getElementByIdScreen: HTMLElement;

    // 各テスト前に仮想DOM・インスタンスを生成
    beforeEach(() => {
        document.body.innerHTML = `<div class="output" id="screen">0</div>`;
        getElementByIdScreen = document.getElementById("screen")!;
        domDisplay = new DomDisplay(getElementByIdScreen);
    });

    // 初期状態のテスト
    describe("初期状態のテスト", () => {
        test("仮想DOMが正しく生成されているか", () => {
            expect(getElementByIdScreen).toBeTruthy();
            expect(getElementByIdScreen).not.toBeNull();
            expect(getElementByIdScreen).toBeInstanceOf(HTMLDivElement);
            expect(getElementByIdScreen.id).toBe("screen");
            expect(getElementByIdScreen.textContent).toBe("0");
        });

        test("domDisplayインスタンスが正しく生成されているか", () => {
            expect(domDisplay).toBeInstanceOf(DomDisplay);
        });
    });

    // render();のテスト
    describe("render();のテスト", () => {
        test("div要素がセットされている場合、仮想DOMのHTMLが書き換えられているか", () => {
            domDisplay.render("12345");
            expect(domDisplay.getEl().textContent).toBe("12345");
        });

        test("div要素がセットされていない場合、エラーがthrowされるか", () => {
            // <p>要素で仮想DOM・インスタンスを上書き
            document.body.innerHTML = `<p class="output" id="screen">0</p>`;
            getElementByIdScreen = document.getElementById("screen")!;
            domDisplay = new DomDisplay(getElementByIdScreen);
            expect(() => {
                domDisplay.render("12345");
            }).toThrow("div要素を取得していません。");
        });

    });

    // renderError();のテスト
    describe("renderError();のテスト", () => {
        test("div要素がセットされている場合、仮想DOMのHTMLが書き換えられているか", () => {
            domDisplay.renderError("Error");
            expect(domDisplay.getEl().textContent).toBe("Error");
        });

        test("div要素がセットされていない場合、エラーがthrowされるか", () => {
            // <p>要素で仮想DOM・インスタンスを上書き
            document.body.innerHTML = `<p class="output" id="screen">0</p>`;
            getElementByIdScreen = document.getElementById("screen")!;
            domDisplay = new DomDisplay(getElementByIdScreen);
            expect(() => {
                domDisplay.renderError("Error");
            }).toThrow("div要素を取得していません。");
        });
    });
});