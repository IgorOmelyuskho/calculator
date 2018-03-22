<?php
	/**
		* Стартуем сессию
	*/
	session_start();
	
	/**
		* Выводим значение прогресса
	*/
	echo isset($_SESSION['ls_sleep_test']) ? $_SESSION['ls_sleep_test'] : '';
	
	/**
		* Выходим из скрипта
	*/
	exit();
?>