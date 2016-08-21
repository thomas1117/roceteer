$(document).ready(function(){

	accordianShow();

});


function accordianShow() {
	var acc = document.getElementsByClassName("accordion");
	var i;

	for (i = 0; i < acc.length; i++) {
	    acc[i].onclick = function(){
	        this.classList.toggle("active");
	        this.nextElementSibling.classList.toggle("show");
	    }
	}
}

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]).replace(/\+/g," ");
        }
    }
    
    return undefined;
}

function hideAndRemove(tag1,num1,num2) {
	
	$(tag1 + "-" + num1).hide();
	$(tag1 + "-" + num2).hide();
	

}

function toggleActive(num) {
		


		if(num===1) {
			$("#content-1").show();
			$("#active-1").addClass('active');
			$("#active-2").removeClass('active');
			$("#active-3").removeClass('active');

			hideAndRemove("#content",2,3);
		

		}
		else if(num===2) {
			$("#content-2").show();
			$("#active-2").addClass('active');
			$("#active-1").removeClass('active');
			$("#active-3").removeClass('active');

			hideAndRemove("#content",1,3);
			
		}
		else {
			$("#content-3").show();
			$("#active-3").addClass('active');
			$("#active-1").removeClass('active');
			$("#active-2").removeClass('active');
			hideAndRemove("#content",1,2);
		
		}
}

function handleService() {


		var id = getQueryVariable('id');
		var current = $(".accordian-" + id);
		$(current).children('.accordian').toggleClass('active');
		$(current).children('.panel').toggleClass('show');


		if(id==1 || id===undefined) {

			$("#service-content-1").show();
			$("#active-1").addClass('active');
			$("#active-2").removeClass('active');
			$("#active-3").removeClass('active');

		}
		else if(id==2) {
			$("#service-content-2").show();

			hideAndRemove("#service-content",1,3);
			

			$("#active-2").addClass('active');
			$("#active-1").removeClass('active');
			$("#active-3").removeClass('active');
		}
		else if(id==3) {
			$("#service-content-3").show();
			
			hideAndRemove("#service-content",1,2);

			$("#active-3").addClass('active');
			$("#active-1").removeClass('active');
			$("#active-2").removeClass('active');
		}
}

function toggleServiceActive(num) {
		
		

		if(num==1) {

			$("#service-content-1").show();
			$("#active-1").addClass('active');
			$("#active-2").removeClass('active');
			$("#active-3").removeClass('active');
			hideAndRemove("#service-content",2,3);
		}
		else if(num==2) {
			$("#service-content-2").show();

			hideAndRemove("#service-content",1,3);
			

			$("#active-2").addClass('active');
			$("#active-1").removeClass('active');
			$("#active-3").removeClass('active');
		}
		else if(num==3) {
			$("#service-content-3").show();
			
			hideAndRemove("#service-content",1,2);

			$("#active-3").addClass('active');
			$("#active-1").removeClass('active');
			$("#active-2").removeClass('active');
		}
}

