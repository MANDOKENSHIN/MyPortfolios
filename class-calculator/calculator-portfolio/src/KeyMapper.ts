import type { KeyToken } from "./KeyToken";
import { Operation } from "./Operation";

/**
 * キー入力とKeyTokenのマッピングを管理するクラス
 */
export class KeyMapper {
    private keyMap = new Map<string, KeyToken>();

    constructor() {
        this.initializeKeyMap();
    }

    /**
     * キーマップを初期化
     */
    private initializeKeyMap() {
        // 数字キー
        for (let i = 0; i <= 9; i++) {
            this.keyMap.set(i.toString(), { kind: "digit", value: i });
        }

        // 演算子キー
        this.keyMap.set("op:+", { kind: "op", value: Operation.Add });
        this.keyMap.set("op:-", { kind: "op", value: Operation.Subtract });
        this.keyMap.set("op:*", { kind: "op", value: Operation.Multiply });
        this.keyMap.set("op:/", { kind: "op", value: Operation.Divide });

        // 機能キー
        this.keyMap.set("equal", { kind: "equal" });
        this.keyMap.set("clear", { kind: "clear" });
        this.keyMap.set("decimal", { kind: "decimal" });
    }

    /**
     * 
     * @param target - クリックされたHTML要素
     * @returns - 該当するkeyToken、またはnull
     */
    public resolve(target: HTMLElement): KeyToken | null {
        const dataKey = target.getAttribute('data-key');

        // dataKey属性がある場合の処理
        if (dataKey) {
            const token = this.keyMap.get(dataKey);
            if (token) {
                return token;
            }
        }
        return null;
    }
}