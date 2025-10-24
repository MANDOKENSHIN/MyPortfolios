/**
 * 0除算した際にスローされるカスタムエラークラス
 */
export class DivisionByZeroError extends Error{
    constructor(message:string){
        super(message);
        this.name = "DivisionByZeroError";
    }
}