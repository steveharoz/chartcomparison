<?php

$study = rtrim($_POST['study']);
$subjectID = rtrim($_POST['subjectID']);
$date = rtrim($_POST['date']);
$data = stripslashes($_POST['data']);

$dir = "../data/" . $study;

if (!file_exists($dir)) {
	mkdir($dir);
}
echo realpath($dir);

$fh = fopen($dir . "/subj-" . $subjectID . "-" . " date-" . $date . ".json", 'w') or die("Error opening file!");
fwrite($fh, $data);
fclose($fh);

echo "Success";
?>
