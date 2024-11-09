<?php

//  check for file parameter
if (!isset($_REQUEST['file']) || empty($_REQUEST['file'])) {
    header("HTTP/1.0 400 Bad Request");
    exit;
}

$file_name = basename($_REQUEST['file']);
$file_path = '/home/scgrn/files/' . $file_name;

$allowed_files = [
    'Peterman.zip',
    'AlphaQuadrant.apk'
];

if (!in_array($file_name, $allowed_files)) {
    header("HTTP/1.0 400 Bad Request");
    exit;
}

if (!is_file($file_path)) {
    header("HTTP/1.0 404 Not Found");
    exit;
}

//  log download
$log = date('Y-m-d H:i:s') . " - " . $file_name . "\n";
file_put_contents('downloads.log', $log, FILE_APPEND);

//  set headers to trigger download
header('Content-Description: File Transfer');
header('Content-Type: application/octet-stream');
header('Content-Disposition: attachment; filename="' . $file_name . '"');
header('Expires: 0');
header('Cache-Control: must-revalidate');
header('Pragma: public');
header('Content-Length: ' . filesize($file_path));

//  clear output buffer
ob_clean();
flush();

//  output the file
readfile($file_path);

?>
