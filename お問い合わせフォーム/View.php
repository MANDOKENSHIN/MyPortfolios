<?php
class View
{
    /**
     * contact.phpのHTML/CSSを設計する
     * @param mixed $token - CSRFトークンを代入
     */
    public static function renderContactForm(string $token): void
    {
        ?>
        <!DOCTYPE html>
        <html lang="ja">

        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>お問い合わせフォーム</title>
            <link rel="stylesheet" href="./render-contact-form.css">
        </head>

        <body>
            <div class="container">
                <!-- ヘッダー -->
                <header>
                    <h1>お問い合わせフォーム</h1>
                    <p>ご質問やご相談がございましたら、お気軽にお問い合わせください。</p>
                </header>

                <main>
                    <form id="contactForm" action="submit.php" method="POST">
                        <input type="hidden" name="csrf" value="<?php echo $token ?>">

                        <!-- 名前を取得 -->
                        <div class="form-group">
                            <label for="name">お名前 <span class="required">*</span></label>
                            <input type="text" id="name" name="name" placeholder="例）田中 太郎" required>
                            <div class="error-message" id="name-error"></div>
                        </div>

                        <!-- メールアドレスを取得 -->
                        <div class="form-group">
                            <label for="email">メールアドレス <span class="required">*</span></label>
                            <input type="email" id="email" name="email" placeholder="例）aaaaa.@example.jp" required>
                            <div class="error-message" id="email-error"></div>
                        </div>

                        <!-- 性別を取得 -->
                        <div class="form-group">
                            <label for="sex-male">性別 <span class="required">*</span></label>
                            <div class="radio-group">
                                <label for="sex-male">
                                    <input type="radio" id="sex-male" name="sex" value="男性" required>男</label>
                                <label for="sex-female">
                                    <input type="radio" id="sex-female" name="sex" value="女性">女</label>
                                <label for="sex-otehr">
                                    <input type="radio" id="sex-other" name="sex" value="その他">その他</label>
                            </div>
                            <div class="error-message" id="sex-error"></div>
                        </div>

                        <!-- お問い合わせ内容を取得 -->
                        <div class="form-group">
                            <label for="message">お問い合わせ内容 <span class="required">*</span></label>
                            <textarea id="message" name="message" rows="6" placeholder="こちらにお問い合わせ内容を記載してください。" required></textarea>
                            <div class="error-message" id="message-error"></div>
                        </div>

                        <!-- 送信ボタン -->
                        <div class="form-group">
                            <button type="submit" class="submit-btn">送信する</button>
                        </div>
                    </form>
                </main>

                <!-- フッター -->
                <footer>
                    <p>&copy; お問い合わせフォーム</p>
                </footer>
            </div>
        </body>

        </html>

        <?php
    }

    /**
     * submit.phpのHTML/CSSを設計する - ユーザーが入力した内容に対してエラーを表示
     * @param array $errors - バリテーションエラー内容
     */
    public static function renderError(array $errors): void
    {
        ?>
        <!DOCTYPE html>
        <html lang="ja">

        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>エラー</title>
            <link rel="stylesheet" href="render-error.css">
        </head>

        <body>
            <div class="form-card">
                <div class="error-summary">
                    <h2>※入力内容にエラーがあります</h2>
                    <ul>
                        <?php foreach ($errors as $error): ?>
                            <li><?php echo htmlspecialchars($error, ENT_QUOTES, 'UTF-8') ?></li>
                        <?php endforeach; ?>
                    </ul>
                    <p><a href="contact.php">戻る</a></p>
                </div>
            </div>
        </body>

        </html>
        <?php
    }

    /**
     * submit.phpのHTML/CSSを設計する - ユーザーが入力した内容に対して成功を表示
     * @param mixed $emailSent - メール送信結果のフラグ
     * @param mixed $contactId - DBから取得する該当行のid
     * @return void
     */
    public static function renderSuccess($emailSent, $contactId): void
    {
        ?>
        <!DOCTYPE html>
        <html lang="ja">

        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>送信完了画面スタイル</title>
            <link rel="stylesheet" href="render-success.css">
        </head>

        <body>
            <div class="success-container">
                <h1>送信完了</h1>

                <div class="contact-number">
                    <p>お問い合わせ番号</p>
                    <p class="number"><strong>#<?= str_pad($contactId, 6, '0', STR_PAD_LEFT) ?></strong></p>
                </div>

                <p>お問い合わせいただきありがとうございました。</p>

                <?php if ($emailSent): ?>
                    <p>入力いただいたメールアドレス宛に受付確認メールをお送りしました。</p>
                    <p>内容を確認の上、2-3営業日以内に回答させていただきます。</p>

                <?php else: ?>
                    <div class="warning">
                        ※通知メールの送信に失敗しました。<br>
                        お手数ですが、再度お問い合わせください。
                    </div>
                <?php endif; ?>
                <a href="contact.php">トップページに戻る</a>
            </div>
        </body>

        </html>
        <?php
    }

    /**
     * contact.phpおよびsubmit.phpのHTML/CSSを設計する - システムエラーを表示
     * @param mixed $message - システムエラー内容
     * @return void
     */
    public static function renderSystemError(): void
    {
        ?>
        <!DOCTYPE html>
        <html lang="ja">

        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>システムエラー</title>
            <link rel="stylesheet" href="render-system-error.css">
        </head>

        <body>
            <div class="form-card">
                <div class="error-summary">
                    <h2>システムエラー</h2>
                    <p>申し訳ございません。システムエラーが発生しました。</p>
                    <p>時間をおいて再度お試しください。</p>
                    <p><a href="contact.php">戻る</a></p>
                </div>
            </div>
        </body>

        </html>
        <?php
    }
}







