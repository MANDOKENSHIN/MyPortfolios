<?php
require_once 'config.php';
require_once 'CsrfProtection.php';
require_once 'Database.php';
require_once 'Validator.php';
require_once 'ContactRepository.php';
require_once 'MailService.php';
require_once 'View.php';

try {
    // セッション開始
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    // CSRF対策
    $token = $_POST[SESSION_NAME];
    CsrfProtection::validateToken($token);

    // 名前・メールアドレス・性別・問い合わせ内容の取得
    $name = trim(string: (string) ($_POST['name'] ?? ''));
    $email = trim(string: (string) ($_POST['email'] ?? ''));
    $sex = (string) ($_POST['sex'] ?? '');
    $message = trim(string: (string) ($_POST['message'] ?? ''));

    // 取得した内容をバリテーションし、エラーがあればユーザーに知らせる。
    $validator = new Validator();
    $validator->validateName($name)->validateEmail($email)->validateSex($sex)->validateMessage($message);

    if ($validator->hasErrors()) {
        View::renderError($validator->getErrors());
        exit();
    }

    // データベースアクセス準備
    $db = Database::getInstance()->getConnection();
    $repository = new ContactRepository($db);

    $contactData = [
        'name' => $name,
        'email' => $email,
        'sex' => $sex,
        'message' => $message
    ];

    // データベースにアクセスし、行を挿入して該当行のidを取得
    $contactId = $repository->save($contactData);

    if (!$contactId) {
        throw new Exception('お問い合わせの保存に失敗しました');
    }

    // 保存されたデータをDBから取得
    $savedContactData = $repository->findById($contactId);

    if (!$savedContactData) {
        throw new Exception('保存されたデータの取得に失敗しました');
    }

    // CSRFトークンをリセット（二重送信防止）
    CsrfProtection::resetToken();

    // メール送信フラグ
    $emailSent = true;
    try {
        $mailService = new MailService();

        // DBから取得したお問い合わせ内容を管理者にメール送信
        $mailService->toAdminNotification($savedContactData, $contactId);

        // ユーザーへ自動返信メール送信
        $mailService->toUserNotification($savedContactData, $contactId);
    } catch (Exception $e) {
        // エラーログを記録
        error_log("Mail sending failed for contact ID: {$contactId}. Error: " . $e->getMessage());
        $emailSent = false;
    }

    // 成功画面の表示（お問い合わせ番号を表示）
    View::renderSuccess($emailSent, $contactId);

} catch (Exception $e) {
    // エラーログを記録
    error_log('Contact form error:' . $e->getMessage());

    // エラー画面の表示
    View::renderSystemError();
}
