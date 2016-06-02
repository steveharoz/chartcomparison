<?php

$study = rtrim($_POST['study']);
$subjectID = rtrim($_POST['subjectID']);
$date = rtrim($_POST['date']);
$accuracy = rtrim($_POST['accuracy']);
$data = stripslashes($_POST['data']);

$dir = "../data/" . $study;

if (!file_exists($dir)) {
	mkdir($dir);
}
echo realpath($dir);

$fh = fopen($dir . "/subj_" . $subjectID . " acc_" . $accuracy . " date_" . $date . ".json", 'w') or die("Error opening file!");
fwrite($fh, $data);
fclose($fh);

echo "Success";
?>
