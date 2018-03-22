
var closeImg = null;
var modal = null;
var inputUp = null;
var inputCenter = null;
var inputDown = null;
var leftMouseButtonPressed = false;
var modalInsideCoordinates = null;
var progress = null;
var canvas = null;
var ctx = null;
var answer = null;
var allData = null;

$(document).ready(function(){
	if(!window.jQuery){
		alert("jQuery not loaded")
	}
	//closeImg = $("#closeImage")[0]; //$("#closeImage") Возвращает не обект а массив обектов
	
	modal = $("#modal")[0];	
	
	$('#closeImage').on('click', function(e){ //А здесь [0] можно не использовать
		modal.style.display = "none";
	});
	
 	inputUp = $("#inputup")[0];
	
	inputCenter = $("#inputcenter")[0];
	
	inputDown = $("#inputdown")[0];
	
	answer = $("#answer")[0];
	
	$("#button").on('click', function(e){
		buttonSendData();
	})
	
	$('body').on('mousemove', mouseMove);
	
	$('#modal').on('mousedown', mouseDown);
	
	$('body').on('mouseup', mouseUp);
	
	canvas = $('#canvas')[0];
	ctx = canvas.getContext('2d');
	setProgressPercent(0);
})

function example(x){
	if (x == 1){
		inputUp.value = '3.14';
		inputCenter.value = "cos(x)";
		inputDown.value = '-3.14';
	}
	else if (x == 2){
		inputUp.value = 100;
		inputCenter.value = "2*x+5";
		inputDown.value = -10;
	}
	else if (x == 3){
		inputUp.value = 10;
		inputCenter.value = "pow(2, x)";
		inputDown.value = -5;
	}
	else if (x == 4){
		inputUp.value = 150;
		inputCenter.value = "log(5)*3";
		inputDown.value = 0;
	}
	else if (x == 5){
		inputUp.value = 50;
		inputCenter.value = "10*x";
		inputDown.value = 0;
	}
}

function setProgressPercent(percent, data){
	if (percent > 100) percent = 100;
	if (percent < 0) percent = 0;
	var x = (percent * 360) / 100; 
	
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.beginPath();
	ctx.lineCap = "round";
	ctx.arc(100, 100, 90, 0 , 2 * Math.PI);
	ctx.lineWidth = 20;
	ctx.strokeStyle = 'lightgrey';
	ctx.stroke();
	
	ctx.beginPath();
	ctx.lineCap = "round";
	ctx.arc(100, 100, 90, Math.PI, x / (180 / Math.PI) + Math.PI);
	ctx.lineWidth = 10;
	ctx.strokeStyle = '#96c463';
	
	ctx.textBaseline = "middle";
	ctx.textAlign = "center";
	ctx.fillStyle = "#96c463";
	ctx.font = "50px sans-serif";
	if (data != undefined){
		ctx.fillText(data, 100, 100);
	}
	else{
		ctx.fillText(percent + "%", 100, 100);
	}
	ctx.stroke();
}

function getCoordinates(e){
	// Для браузера IE
	if (document.all)  { 
		x = event.x + document.body.scrollLeft; 
		y = event.y + document.body.scrollTop; 
		// Для остальных браузеров
	} 
	else {
		x = e.pageX; // Координата X курсора
		y = e.pageY; // Координата Y курсора
	}
	var c = {x: x, y: y};
	return c;
}

function mouseMove(e){
	if (leftMouseButtonPressed == true /* && e.target.id == "modal" */){
		var coords = getCoordinates(e);		
		modal.style.margin = "0px";
		modal.style.opacity = 0.5;
		modal.style.left = coords.x - modalInsideCoordinates.x + 'px';
		modal.style.top = coords.y - modalInsideCoordinates.y + 'px';	
		return false;
	}
}

function mouseDown(e){
	if (e.button == 0 /* && e.target.id == "modal" */){
		leftMouseButtonPressed = true;
		var coords = getCoordinates(e);
		
		var computedStyleModal = getComputedStyle(modal);
		var x1 = parseInt(computedStyleModal.left, 10);
		var y1 = parseInt(computedStyleModal.top, 10);
		var x2 = parseInt(computedStyleModal.marginLeft, 10);
		var y2 = parseInt(computedStyleModal.marginTop, 10);
		if (x1 == 0 && y1 == 0){
			modalInsideCoordinates = {x: coords.x - x2, y: coords.y - y2}
		}
		else if (x2 == 0 && y2 == 0){
			modalInsideCoordinates = {x: coords.x -  x1, y: coords.y - y1}
		}
	}
}

function mouseUp(e){
	if (e.button == 0){
		leftMouseButtonPressed = false;
		modal.style.opacity = 1.0;
	}
}

function getCurCoordsInsideRect(e, element) {
	if (e.currentTarget.id != "modal"){
		return undefined;
	}
	var x = e.offsetX == undefined ? e.layerX : e.offsetX;
	var y = e.offsetY == undefined ? e.layerY : e.offsetY;
	return {x: x, y: y};
}

function getDataFromInput(){
	this.top_bound = parseFloat(inputUp.value, 10); //[0] $("#inputup") Возвращает не обект а массив обектов
	this.function_string = inputCenter.value;
	this.bottom_bound = parseFloat(inputDown.value, 10);
	//alert(this.function_string);
}

function ls_ajax_progress() {
	// Выполняем AJAX запрос к скрипту опроса результата прогресса
	try{
		$.ajax({
			type: 'POST',
			url: 'progress.php',
			success: function(data) {
				// Обновляем прогресс
				setProgressPercent(data);
				var fsfs = 0;
			},
		});	
		// На всякий случай вернем FALSE
		return false;
	}
	catch (err){
		console.log('error');
	}
}

function buttonSendData(){
	modal.style.display = "block";
	canvas.style.display = "block";
	answer.style.display = "none";
	setProgressPercent(0);
	$('#button').unbind('click');
	
	var myVar = setInterval(function() {
		try{
			ls_ajax_progress();
		}
		catch(err){
			console.log('error2');
		}
	}, 100);
	
	allData = new getDataFromInput();
	var dataForSend = {
		'top_bound': allData.top_bound,
		'function_string': allData.function_string,
		'bottom_bound': allData.bottom_bound,
	}
	
	//отправляю запрос и получаю ответ
	$.ajax({
		type:'POST',//тип запроса: get,post либо head
		url:'ajax.php',//url адрес файла обработчика
		data:dataForSend,//параметры запроса
		response:'text',//тип возвращаемого ответа text либо xml
		success: function(data) {
			//По завершению работы скрипта эмуляции останавливаем таймер опроса прогресса
			clearInterval(myVar);
			
			//Получили результат 	
			setProgressPercent(100, data);
			canvas.style.display = "none";
			answer.style.display = "flex";
			$('#top_bound').html(allData.top_bound);
			$('#center_bound').html(allData.function_string + " dx = " + data);
			$('#bottom_bound').html(allData.bottom_bound);	
			$("#button").on('click', function(e){buttonSendData();});
		}
	});	
}	







