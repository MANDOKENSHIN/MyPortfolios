import { DomDisplay } from "./DomDisplay";
import { Calculator } from "./Calculator";
import { KeyMapper } from "./KeyMapper";
import { Config } from "./Config";

// DOM要素の取得＆インスタンス生成
const display = new DomDisplay(document.getElementById("screen")!);
// DomDisplayインスタンスをCalculatorに渡す
const calculator = new Calculator(display);
const mapper = new KeyMapper();

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
