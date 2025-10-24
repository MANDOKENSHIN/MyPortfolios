import type { IDisplay } from "./IDisplay";

/**
 * DOM操作を管理するクラス
 */
export class DomDisplay implements IDisplay {
    /** 取得したHTML要素 */
    private el: HTMLElement;
    constructor(el: HTMLElement) {
        this.el = el;
    }

    /**
     * テキストの表示
     * @param text - 表示用テキスト
     */
    public render(text: string): void {
        //  divの場合はtextContentに設定
        if (this.el instanceof HTMLDivElement) {
            this.el.textContent = text;
        } else {
            throw new Error("div要素を取得していません。");
        }
    }

    /**
     * エラーメッセージの表示
     * @param message - エラーメッセージ
     */
    public renderError(message: string): void {
        if (this.el instanceof HTMLDivElement) {
            this.el.textContent = message;
        } else {
            throw new Error("div要素を取得していません。");
        }
    }

    /**
     * HTML要素を受け取る
     * @returns HTML要素
     */
    public getEl(): HTMLElement {
        return this.el;
    }
}
