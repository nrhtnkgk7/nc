<?php
// ============================================
// NO CODE Contact Form - send.php
// さくらインターネット共有サーバー用
// /test/send.php に配置
// ============================================

// 送信先メールアドレス（変更してください）
$to_email = 'info@nocode.co.jp';

// サイト名
$site_name = 'NO CODE';

// ============================================

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');

// POSTのみ許可
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// フォームデータ取得
$name     = isset($_POST['name'])     ? trim($_POST['name'])     : '';
$company  = isset($_POST['company'])  ? trim($_POST['company'])  : '';
$phone    = isset($_POST['phone'])    ? trim($_POST['phone'])    : '';
$email    = isset($_POST['email'])    ? trim($_POST['email'])    : '';
$category = isset($_POST['category']) ? trim($_POST['category']) : '';
$message  = isset($_POST['message'])  ? trim($_POST['message'])  : '';

// バリデーション
$errors = [];

if ($name === '') {
    $errors[] = 'お名前が入力されていません';
}

if ($company === '') {
    $errors[] = '法人名 / 組織名が入力されていません';
}

if ($phone === '') {
    $errors[] = '電話番号が入力されていません';
} elseif (!preg_match('/^[0-9\-]+$/', $phone)) {
    $errors[] = '電話番号の形式が不正です';
}

if ($email === '') {
    $errors[] = 'メールアドレスが入力されていません';
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'メールアドレスの形式が不正です';
}

if ($category === '') {
    $errors[] = 'お問い合わせ概要が選択されていません';
}

if ($message === '') {
    $errors[] = 'お問い合わせ内容が入力されていません';
}

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['error' => implode(', ', $errors)]);
    exit;
}

// サニタイズ
$name     = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
$company  = htmlspecialchars($company, ENT_QUOTES, 'UTF-8');
$phone    = htmlspecialchars($phone, ENT_QUOTES, 'UTF-8');
$email    = htmlspecialchars($email, ENT_QUOTES, 'UTF-8');
$category = htmlspecialchars($category, ENT_QUOTES, 'UTF-8');
$message  = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');

// 日時
$datetime = date('Y年m月d日 H:i');

// ============================================
// 管理者宛メール
// ============================================
$admin_subject = "【{$site_name}】お問い合わせがありました";

$admin_body = <<<EOT
━━━━━━━━━━━━━━━━━━━━━━━━━
{$site_name} ウェブサイトお問い合わせ
━━━━━━━━━━━━━━━━━━━━━━━━━

受信日時：{$datetime}

■ お名前
{$name}

■ 法人名 / 組織名
{$company}

■ 電話番号
{$phone}

■ メールアドレス
{$email}

■ お問い合わせ概要
{$category}

■ お問い合わせ内容
{$message}

━━━━━━━━━━━━━━━━━━━━━━━━━
このメールは {$site_name} ウェブサイトの
お問い合わせフォームから自動送信されています。
━━━━━━━━━━━━━━━━━━━━━━━━━
EOT;

$admin_headers  = "From: {$site_name} <noreply@nocode.co.jp>\r\n";
$admin_headers .= "Reply-To: {$email}\r\n";
$admin_headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$admin_headers .= "X-Mailer: PHP/" . phpversion();

// ============================================
// 自動返信メール（送信者宛）
// ============================================
$auto_subject = "【{$site_name}】お問い合わせを受け付けました";

$auto_body = <<<EOT
{$name} 様

この度は {$site_name} にお問い合わせいただき
誠にありがとうございます。

以下の内容でお問い合わせを受け付けました。
内容を確認のうえ、折り返しご連絡いたします。

━━━━━━━━━━━━━━━━━━━━━━━━━

■ お名前
{$name}

■ 法人名 / 組織名
{$company}

■ 電話番号
{$phone}

■ メールアドレス
{$email}

■ お問い合わせ概要
{$category}

■ お問い合わせ内容
{$message}

━━━━━━━━━━━━━━━━━━━━━━━━━

{$site_name}
https://nocode.co.jp

※ このメールは自動送信されています。
※ お心当たりのない場合はお手数ですが破棄してください。
EOT;

$auto_headers  = "From: {$site_name} <noreply@nocode.co.jp>\r\n";
$auto_headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$auto_headers .= "X-Mailer: PHP/" . phpversion();

// ============================================
// メール送信
// ============================================
$admin_sent = mb_send_mail($to_email, $admin_subject, $admin_body, $admin_headers);
$auto_sent  = mb_send_mail($email, $auto_subject, $auto_body, $auto_headers);

if ($admin_sent) {
    http_response_code(200);
    echo json_encode(['success' => true, 'message' => '送信完了']);
} else {
    http_response_code(500);
    echo json_encode(['error' => '送信に失敗しました']);
}
