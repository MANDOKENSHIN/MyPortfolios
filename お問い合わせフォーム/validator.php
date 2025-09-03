<?php
class Validator
{
    private $errors = [];

    /**
     * 名前の未入力・全角以外の入力を返答する
     * @param mixed $name - ユーザー名
     * @return static
     */
    public function validateName($name)
    {
        if ($name === '') {
            $this->errors[] = 'お名前が入力されていません。';
        } elseif (!preg_match('/^(?:[^\x01-\x7E\xA1-\xDF]|[ \x{3000}])+$/u', $name)) {
            $this->errors[] = 'お名前は全角文字で入力してください（スペース可）。';
        }
        return $this;
    }

    /**
     * メールアドレスの未入力・不正入力を返答する
     * @param mixed $email - ユーザーのメールアドレス
     * @return static
     */
    public function validateEmail($email)
    {
        if ($email === '') {
            $this->errors[] = 'メールアドレスが入力されていません。';
        } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $this->errors[] = '正しい形式のメールアドレスを入力してください。';
        }
        return $this;
    }

    /**
     * 性別の未選択・不正入力を返答する
     * @param mixed $sex - ユーザーの性別
     * @return static
     */
    public function validateSex($sex)
    {
        if ($sex === '') {
            $this->errors[] = '性別が選択されていません。';
        } elseif (!in_array($sex, VALID_SEX_OPTIONS, true)) {
            $this->errors[] = '性別の入力値が不正です。';
        }
        return $this;
    }

    /**
     * 問い合わせ内容の未入力・300文字以上の入力を返答する
     * @param mixed $message - ユーザーのお問い合わせ内容
     * @param mixed $maxLength - 300文字
     * @return static
     */
    public function validateMessage($message, $maxLength = MESSAGE_MAX_LENGTH)
    {
        if ($message === '') {
            $this->errors[] = 'メッセージを入力してください。';
        } elseif (mb_strlen($message, 'UTF-8') > $maxLength) {
            $this->errors[] = $maxLength . '文字まで入力可能です。';
        }
        return $this;
    }

    /**
     * エラー有無を判定する
     * @return bool
     */
    public function hasErrors(): bool
    {
        return !empty($this->errors);
    }

    /**
     * エラー内容を返す
     * @return string[]
     */
    public function getErrors(): array
    {
        return $this->errors;
    }
}

?>