<?php

$query="Searchme";
$num=25;

$ch = curl_init("https://www.google.com/search?q=butterflylabs&num=25");
$fp = fopen("output.txt", "w");

curl_setopt($ch, CURLOPT_FILE, $fp);
curl_setopt($ch, CURLOPT_HEADER, 0);

curl_exec($ch);
curl_close($ch);
fclose($fp);
?>
