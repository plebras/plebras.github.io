<?php
	if(isset($_GET['data'])){
		$data = $_GET['data'];
		$fname = mktime() . ".json";

		$file = fopen($fname, 'w');
		fwrite($file, $data);
		fclose($file);
	}
	else
	{
		$fname = "error.txt";

		$file = fopen($fname, 'w');
		fwrite($file, 'Could not find $POST[data]');
		fclose($file);
	}
?>