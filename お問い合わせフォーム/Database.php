<?php
class Database
{
    private static $instance = null;
    private $pdo;

    /**
     * 以下のDBに接続しエラーハンドリングする。
     * @throws Exception　- 接続障害の内容を返答
     */
    private function __construct()
    {
        try {
            $this->pdo = new PDO(
                dsn: 'mysql:host=' . DB_HOST . ';port=' . DB_PORT . ';dbname=' . DB_NAME . ';charset=utf8mb4',
                username: DB_USER,
                password: DB_PASS,
                options: [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false,
                ]
            );
        } catch (PDOException $error) {
            throw new Exception('データベース接続に接続できませんでした。: ' . $error->getMessage());
        }
    }


    /**
     * 接続を一元化させるため、一度読んだ接続があればそれを利用
     * @return Database　-　データベースを返答
     */
    public static function getInstance(): Database
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * プライベートPDO接続オブジェクトを取得する
     * @return PDO - PDOオブジェクト
     */
    public function getConnection(): PDO
    {
        return $this->pdo;
    }
}

?>