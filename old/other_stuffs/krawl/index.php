<!DOCTYPE html>
<html>
 <head>
  <meta charset="UTF-8">
  <title>title</title>
 </head>
 <body>
  
  <?php
    
    $query="Searchme";
    $num="25";

    $ch = curl_init();

    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_URL, "https://www.google.com/search?q=butterfly&num=25");
    $contents = curl_exec ($ch);
    $dom = new DOMDocument();
    $dom->loadHTML( $contents);

		// Filter all the links
	$xPath = new DOMXPath( $dom);
	$items = $xPath->query( '//a[class=myLink]');

	print_r($contents);
	foreach( $items as $link){
		$url = $link->getAttribute('href');
		if( strncmp( $url, 'http', 4) != 0){
			// Prepend http:// or something
        }

		// Open sub request
//		curl_setopt($ch, CURLOPT_URL, "http://www.zedge.net/txts/4519");
//		$subContent = curl_exec( $ch);
    }
    
   ?>
 </body>
</html>
