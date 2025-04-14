<?php

//  check for file parameter
if (!isset($_REQUEST['file']) || empty($_REQUEST['file'])) {
    header("Location: error404.html");
    exit;
}

$file_name = basename($_REQUEST['file']);
$file_path = '/home/scgrn/files/' . $file_name;

$allowed_files = [
    'Galaxa.gb',
    'Peterman.zip',
    'AlphaQuadrant.apk'
];

if (!in_array($file_name, $allowed_files)) {
    header("Location: error404.html");
    exit;
}

if (!is_file($file_path)) {
    header("Location: error404.html");
    exit;
}

//  log download
$log = date('Y-m-d H:i:s') . " - " . $file_name . "\n";
file_put_contents('/home/scgrn/files/downloads.log', $log, FILE_APPEND);

//  set MIME type
$content_types = [
    'zip' => 'application/zip',
    'gzip' => 'application/gzip',
    '7z' => 'application/x-7z-compressed',
    'tar' => 'application/x-tar',
    'rar' => 'application/vnd.rar',
    'exe' => 'application/vnd.microsoft.portable-executable',
    'apk' => 'application/vnd.android.package-archive',
    'jar' => 'application/java-archive',
];
$file_ext = pathinfo($file_name, PATHINFO_EXTENSION);
$ctype = isset($content_types[$file_ext]) ? $content_types[$file_ext] : 'application/octet-stream';

//  set headers to trigger download
header('Content-Description: File Transfer');
header('Content-Type: ' . $ctype);
header('Content-Disposition: attachment; filename="' . $file_name . '"');
header('Expires: 0');
header('Cache-Control: must-revalidate');
header('Pragma: public');
header('Content-Length: ' . filesize($file_path));

//  clear output buffer
if (ob_get_length()) {
    ob_clean();
}
flush();

//  output the file
readfile($file_path);

?>
