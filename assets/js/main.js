$(document).ready(function(){

})

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

function toggleActive(num) {
		
		if(num==1) {
			$("#content-1").show();
			$("#content-2").hide();
			$("#content-3").hide();
		}
		else if(num==2) {
			$("#content-2").show();
			$("#content-1").hide();
			$("#content-3").hide();
		}
		else {
			$("#content-3").show();
			$("#content-1").hide();
			$("#content-2").hide();
		}
}

function handleService() {
		
		var id = getQueryVariable('id');

		if(id==1) {
			$("#service-content-1").show();
			$("#service-content-2").hide();
			$("#service-content-3").hide();
		}
		else if(id==2) {
			$("#service-content-2").show();
			$("#service-content-1").hide();
			$("#service-content-3").hide();
		}
		else {
			$("#service-content-3").show();
			$("#service-content-1").hide();
			$("#service-content-2").hide();
		}
}

function toggleServiceActive(num) {
		
		

		if(num==1) {
			$("#service-content-1").show();
			$("#service-content-2").hide();
			$("#service-content-3").hide();
		}
		else if(num==2) {
			$("#service-content-2").show();
			$("#service-content-1").hide();
			$("#service-content-3").hide();
		}
		else {
			$("#service-content-3").show();
			$("#service-content-1").hide();
			$("#service-content-2").hide();
		}
}