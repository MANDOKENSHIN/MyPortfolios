/**
 * 画面表示用のインターフェース
 */
export interface IDisplay {
    /**
     * テキストの表示
     * @param text - 表示用テキスト
     */
    render(text: string): void;

    /**
     * エラーメッセージの表示
     * @param message - エラーメッセージ
     */
    renderError(message: string): void;
}
