<?php
// タイムゾーン
date_default_timezone_set('Asia/Tokyo');

// 定数を定義
define('DB_HOST', '127.0.0.1');
define('DB_NAME', 'contact-form');
define('DB_PORT', '8889');
define('DB_USER', 'root');
define('DB_PASS', 'root');
define('ADMIN_NAME','skyApple萬藤');
define('ADMIN_EMAIL','k_mando@skyapple.co.jp');
define('SERVER_EMAIL', 'team.test.1.41@gmail.com');
define('SERVER_NAME','ポートフォリオ「問い合わせフォーム」');
define('SERVER_PASS','xyfg hena bsuj pwyc');
define('SESSION_NAME','csrf');
define('TOKEN_LENGTH',32);
define('VALID_SEX_OPTIONS', ['男性', '女性', 'その他']);
define('MESSAGE_MAX_LENGTH', 300);
