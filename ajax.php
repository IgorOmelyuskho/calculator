<?php
	set_time_limit(20);
	
	if(isset($_POST['top_bound'])) { //isset — Определяет, была ли установлена переменная значением, отличным от NULL
		header("Content-type: text/txt; charset=UTF-8");
		$top_bound = $_POST['top_bound'];
		//echo "запрос POST успешно обработан, top_bound = $top_bound\n";
	}
	else {
		//echo 'карявый POST запрос';
	}
	
	if(isset($_POST['function_string'])) { 
		header("Content-type: text/txt; charset=UTF-8");
		$function_string = $_POST['function_string'];
		//echo "запрос POST успешно обработан, function_string = $function_string\n";
	}
	else {
		//echo 'карявый POST запрос';
	}
	
	if(isset($_POST['bottom_bound'])) { 
		header("Content-type: text/txt; charset=UTF-8");
		$bottom_bound = $_POST['bottom_bound'];
		//echo "запрос POST успешно обработан, bottom_bound = $bottom_bound\n";
	}
	else {
		//echo 'карявый POST запрос';
	}

	$res1 = 0;
	$res = '$res1='.$function_string.';'; //$res1=sin(x);
 	$sum = 0;
	$dx = 0.0001;
	$a = $bottom_bound;
	$b = $top_bound;
	$counter = 0;
	$operationCount = ($b - $a) / $dx;
	$counter1 = $operationCount / 100;
	//echo "#counter1\n";
	$counter2 = 0;
	session_start();
	$_SESSION['ls_sleep_test'] = $counter2;
	session_write_close();
	while ($a <= $b){
		$a += $dx;//0.0001
		$argument = (string) $a;//"0.0001"
		$newstring = str_replace("x", $argument, $res);//$res1=sin(0.0001);
	    eval($newstring); //Не безопасно!!!		
		$sum += $res1 * $dx;
		$counter++;
		if (($counter % $counter1) == 0){
			$counter2++;
			session_start();
			$_SESSION['ls_sleep_test'] = $counter2;
			//echo "_$counter2";
			session_write_close();
		}
	}
	echo $sum;
	exit();
?>