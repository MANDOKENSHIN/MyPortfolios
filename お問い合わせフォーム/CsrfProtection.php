<?php
class CsrfProtection
{
    /**
     * CSRFトークンを生成する
     * @return string - ランダムに生成されたCSRFトークン
     */
    public static function generateToken(): void
    {
        $token = bin2hex(random_bytes(TOKEN_LENGTH));
        $_SESSION[SESSION_NAME] = $token;
    }

    /**
     * CSRFトークンの有無を判定し、なければ新規生成しあればそれを利用する
     */
    public static function getToken()
    {
        // セッションが存在していなければ生成
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        //  CSRFトークンがなければ生成
        if (!isset($_SESSION[SESSION_NAME])) {
            self::generateToken();
        }
        return $_SESSION[SESSION_NAME];
    }

    /**
     * CSRFトークンを検証する
     * @param mixed $token - CSRFトークン
     * @return void
     */
    public static function validateToken($token)
    {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        // サーバー側トークン or 送信されるCSRFトークンのどちらかがない場合の処理
        if (!isset($_SESSION[SESSION_NAME]) || !isset($token)) {
            http_response_code(400);
            exit('不正なリクエストです。');
        }

        // CSRFトークンがサーバー側と一致しない場合は処理終了
        if (!hash_equals($_SESSION[SESSION_NAME], $token)) {
            http_response_code(400);
            error_log('SESSIONID:' . $_SESSION[SESSION_NAME]);
            error_log('token:' . $token);
            exit('不正なリクエストです。');
        }
    }


    /**
     * CSRFトークンをリセットする
     */
    public static function resetToken()
    {
        unset($_SESSION[SESSION_NAME]);
    }
}

?>