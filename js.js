$(document).ready(function() {
    var getButton = $('.getButton');
    var result;
    var id;
    var finalresult  = [];

    Number.prototype.mod = function(n) {
        return ((this%n)+n)%n;
    };

	getButton.click(function(event){  
        result = "";
        finalresult = [];
        $(".server").val("...");
		$.ajax({
            url: "https://www.eliftech.com/school-task",
            method: "GET",
            async: false
        }).then(function(data) {
            id = data.id;
            var str = JSON.stringify(data.expressions);
            $(".getInput").val(data.expressions);            
        	var mass = str.replace(/[\[\]\"]/g, "").split(',');
            for(var i = 0; i < mass.length; i++){  
                finalresult.push(firstMath(mass[i]));
            }
            $(".answer").val(finalresult);
        });

        var results = {id:id, results:finalresult}
        var jsonResults = JSON.stringify(results);

        $.ajax({
            url: "https://www.eliftech.com/school-task",
            method: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: jsonResults
        }).then(function(res) {
            $(".server").val(res.passed);
        }); 
	});


   function firstMath(data){
        var formath = data.split(' ');
        result = "";
        for(var i = 0; i < formath.length; i++){
            if(formath[i]=="+"||formath[i]=="-"||formath[i]=="*"||formath[i]=="/"){
                result = secondtMath(result,formath[i]);
                continue;
            }
            else if(result === ""){
                result = result + formath[i];
            }
            else{
                result = result + ", " + formath[i];
            }
        }
         return result;
    }

    function secondtMath(data, operation){    
        var mass = data.split(','); 
        var formath; 
        var forresult; 
        switch (operation){
            case "+":
            formath = parseInt(mass[mass.length-2], 10) - parseInt(mass[mass.length-1], 10);
            break;
            case "-":
            formath =  parseInt(mass[mass.length-2], 10) + parseInt(mass[mass.length-1], 10) + 8;
            break;
            case "*":
            if(mass[mass.length-1]==0){
                formath = 42
            }
            else{
               formath = parseInt(mass[mass.length-2], 10).mod(parseInt(mass[mass.length-1], 10)); 
            }
            break;
            case "/":
            if(mass[mass.length-1]==0){
                formath = 42
            }
            else{
                formath = Math.floor(parseInt(mass[mass.length-2], 10) / parseInt(mass[mass.length-1], 10));
            }
            break;
        }
        if(mass.length > 2){
            forresult = mass[0];
            for(var i = 1; i < mass.length - 2; i++){
                forresult = forresult + "," + mass[i];
            }
            result = forresult + "," + formath;
        }
        else{ 
            result = formath;
        }
        return result;
    }
});
