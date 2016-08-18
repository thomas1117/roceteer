$(document).ready(function(){

})

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