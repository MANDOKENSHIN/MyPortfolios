<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/vendor/autoload.php';

class MailService
{
    private $adminEmail = ADMIN_EMAIL;

    /**
     * 問い合わせがあった旨を管理者に伝える
     * @param array $savedContactData - DBから取得したユーザー情報・お問い合わせ内容
     * @param mixed $contactId - DBから取得した該当ユーザーのid
     * @throws \Exception
     * @return bool
     */
    public function toAdminNotification(array $savedContactData, $contactId = null): bool
    {
        // メールヘッダーインジェクション対策
        $safeEmail = $this->sanitizeHeaderValue($savedContactData['email']);

        $subject = '新しいお問い合わせがあります。';
        $body = $this->toAdminEmailBody($savedContactData, $contactId);

        // GmailでSMTP設定
        $mail = new PHPMailer(true);
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = SERVER_EMAIL;
        $mail->Password = SERVER_PASS; //Googleアプリパスワード
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;

        // 文字コードの指定
        $mail->CharSet = 'UTF-8';
        $mail->Encoding = 'base64';

        // サーバーのアドレスと名前の設定
        $mail->setFrom(SERVER_EMAIL, SERVER_NAME);

        // 管理者宛のメールアドレスと送信者名
        $mail->addAddress(ADMIN_EMAIL, ADMIN_NAME);

        //ユーザーのメールアドレスが正式なものであればリプライに追加
        if (is_string($safeEmail) && $safeEmail !== '' && filter_var($safeEmail, FILTER_VALIDATE_EMAIL)) {
            $mail->addReplyTo($safeEmail, $savedContactData['name'] . " 様" ?? '');
        }

        // メールソフトとPHPのバージョンメモ
        $mail->XMailer = 'PHPMailer ' . PHPMailer::VERSION . ' (PHP ' . PHP_VERSION . ')';

        // 件名と本文をセット
        $mail->isHTML(false);
        $mail->Subject = $subject;
        $mail->Body = $body;

        // メール送信
        if (!$mail->send()) {
            throw new Exception('管理者へのメール送信に失敗しました。 (' . $mail->ErrorInfo . ')');
        }
        return true;
    }

    /**
     * 問い合わせを受け付けた旨をユーザーに伝える用のメール本文を構築する
     * @param array $savedContactData - DBから取得したユーザー情報・お問い合わせ内容
     * @param mixed $contactId - DBから取得した該当ユーザーのid
     * @return bool
     */
    public function toUserNotification(array $savedContactData, $contactId): bool
    {
        // メールヘッダーインジェクション対策
        $safeEmail = $this->sanitizeHeaderValue($savedContactData['email']);

        // ６桁のお問い合わせIDとして受信
        $contactId = str_pad($contactId, 6, '0', STR_PAD_LEFT);
        $subject = "【お問い合わせ受付完了】受付番号: #{$contactId}";
        $body = $this->toUserEmailBody($savedContactData, $contactId);

        // GmailでSMTP設定
        $mail = new PHPMailer(true);
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = SERVER_EMAIL;
        $mail->Password = SERVER_PASS; //Googleアプリパスワード
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;

        // 文字コードの指定
        $mail->CharSet = 'UTF-8';
        $mail->Encoding = 'base64';

        // 管理者のメールアドレスと名前の設定
        $mail->setFrom(SERVER_EMAIL, SERVER_NAME);

        // ユーザー宛のメールアドレスと名前
        $mail->addAddress($safeEmail, $savedContactData['name'] . " 様");

        // メールソフトとPHPのバージョンメモ
        $mail->XMailer = 'PHPMailer ' . PHPMailer::VERSION . ' (PHP ' . PHP_VERSION . ')';

        // 件名と本文をセット
        $mail->isHTML(false);
        $mail->Subject = $subject;
        $mail->Body = $body;

        // メール送信
        if (!$mail->send()) {
            throw new Exception('ユーザーへのメール送信に失敗しました。 (' . $mail->ErrorInfo . ')');
        }
        return true;
    }

    /**
     * 問い合わせがあった旨を管理者に伝える用のメール本文を構築する
     * @param array $contactData - DBから取得した問い合わせした方の情報
     * @return string 
     */
    private function toAdminEmailBody(array $savedContactData, $contactId = null)
    {
        $body = "以下の内容でお問い合わせフォームから送信がありました。\n\n";

        // ６桁のお問い合わせIDとして受信
        $contactId = str_pad($contactId, 6, '0', STR_PAD_LEFT);
        $body .= "【お問い合わせID】#" . $contactId . "\n\n";

        $body .= "----------------\n";
        $body .= "■お名前\n{$savedContactData['name']}\n\n";
        $body .= "■メールアドレス\n{$savedContactData['email']}\n\n";
        $body .= "■性別\n{$savedContactData['sex']}\n\n";
        $body .= "■メッセージ\n{$savedContactData['message']}\n";
        $body .= "----------------\n";

        // DBから取得した日時情報があれば使用、なければ現在時刻を取得する
        if (!empty($savedContactData['created_at'])) {
            $body .= "送信日時：{$savedContactData['created_at']}\n";
        } else {
            $body .= "送信日時：" . date('Y-m-d H:i:s') . "\n";
        }

        return $body;
    }

    /**
     * 問い合わせを受け付けた旨をユーザーに伝える用のメール本文を構築する
     * @param array $savedContactData - DBから取得した問い合わせした方の情報
     * @param mixed $contactId - DBから取得した該当ユーザーのid
     * @return void
     */
    private function toUserEmailBody(array $savedContactData, $contactId): string
    {
        $body = "{$savedContactData['name']} 様\n\n";
        $body .= "この度はお問い合わせいただき、誠にありがとうございます。\n";
        $body .= "以下の内容でお問い合わせを承りました。\n\n";
        $body .= "━━━━━━━━━━━━━━━━━━━━━━\n";
        $body .= "■受付番号:# " . str_pad($contactId, 6, '0', STR_PAD_LEFT) . "\n";
        $body .= "■お名前: {$savedContactData['name']}\n";
        $body .= "■メールアドレス: {$savedContactData['email']}\n";
        $body .= "■性別: {$savedContactData['sex']}\n";
        $body .= "■お問い合わせ内容:\n";
        $body .= "{$savedContactData['message']}\n";

        // DBから取得した日時情報があれば使用、なければ現在時刻を取得する
        if (!empty($savedContactData['created_at'])) {
            $body .= "■受付日時:：{$savedContactData['created_at']}\n";
        } else {
            $body .= "■受付日時：" . date('Y-m-d H:i:s') . "\n";
        }

        $body .= "━━━━━━━━━━━━━━━━━━━━━━\n\n";
        $body .= "内容を確認の上、2-3営業日以内にご連絡させていただきます。\n";
        $body .= "※このメールは自動送信されていますので、返信はできません。\n";

        return $body;
    }

    /**
     * メールヘッダーインジェクション対策をする。
     * @param mixed $value - DBから取得したメールアドレス
     * @return array|string
     */
    private function sanitizeHeaderValue($value): array|string
    {
        // 改行文字を除去してヘッダーインジェクションを防ぐ
        return str_replace(["\r", "\n", "\r\n"], '', $value);
    }

}
?>