<?php
class ContactRepository {
    private $db;
    
    public function __construct(PDO $db) {
        $this->db = $db;
    }
    
    /**
     * フォーム送信後DBにデータを入力する
     * @param array $data - 名前・メールアドレス・性別・問い合わせ内容のデータ配列
     * @throws \Exception - 接続障害の内容を返答
     * @return int - 最後に挿入された行のid
     */
    public function save(array $contactData):int {
        try {
            $this->db->beginTransaction();
            
            $sql = 'INSERT INTO contacts (name, email, sex, message) VALUES(:name, :email, :sex, :message)';
            $stmt = $this->db->prepare($sql);
            $stmt->bindValue(':name', $contactData['name'], PDO::PARAM_STR);
            $stmt->bindValue(':email', $contactData['email'], PDO::PARAM_STR);
            $stmt->bindValue(':sex', $contactData['sex'], PDO::PARAM_STR);
            $stmt->bindValue(':message', $contactData['message'], PDO::PARAM_STR);
            $stmt->execute();
            
            $contactId = (int)$this->db->lastInsertId();
            $this->db->commit();
            
            return $contactId;
        } catch (Exception $e) {
            $this->db->rollBack();
            throw new Exception('データベースエラー: ' . $e->getMessage());
        }
    }
    
    /**
     * DB一意のidより該当する行を取得する
     * @param mixed $id - DB一意のid
     */
    public function findById($id):mixed {
        $sql = 'SELECT id,name, email, sex, message,created_at FROM contacts WHERE id = :id';
        $stmt = $this->db->prepare($sql);
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}
?>