<?php
require_once 'config.php';
require_once 'CsrfProtection.php';
require_once 'View.php';

try {
    // CSRFトークンを取得（なければ生成）
    $token = CsrfProtection::getToken();
    // お問い合わせフォームを表示
    View::renderContactForm($token);
} catch (Exception $error) {
    // エラーログを記録
    error_log('お問い合わせフォーム画面でエラーが発生しました。: ' . $e->getMessage());

    // エラー画面の表示
    View::renderSystemError();
}

?>