/*
	JS to drive the 5 quizzes.
	jQuery based
*/


/*
 *	Resource allocation quiz type.
 *	For each question you have ten points to allocate to the statements.
 *	Each statement is representative of a particular style of personality.
 *	The order of the statements is vital as it represents the personality style group
 *	On completion your totals for each personality style are summed.
 */

(function($){
	$.fn.quiz_resourceallocation = function() {
		var $this = $(this);
		if(!$this[0]) return;
		$this.addClass("quiz quiz_resourceallocation");
		//The score gets output here
		var scoreblock = $('#scoreblock');
		var resultList = $('ul.results', scoreblock);
		var resultItems = $("li", resultList);
		var resultHint = $("<p>").text("Please answer all the questions to see your results");
		var questionCount = 0;
		var answered = 0;
		var score = [];
		var scorePercent = [];
		var maxPoints = 10;
		var questions = this.find("ol.questions>li");
		var totalPoints = 0;	//Total number of points to allocate
		/*
		 * Process the results : Hiding them for now until all questions are answered
		 * Score block must be a <div>#scoreblock containing a <ul>.results with a matching number of <li>s, 
		 * one for each answer/statement type in the question in the same order.
		 */
		resultList.hide();
		scoreblock.append(resultHint);		
		//Add a bar item to the result list items
		resultItems.append($("<span/>", {"class":"value"})).wrapInner($("<span/>",{"class":"label"})).append($("<span/>", {"class":"bar"}).html("&nbsp;"));
		
		
		//Process the questions
		questions.each(function(qdx){
			var question = $(this);
			var answers = question.find("li");
			question.data({"freePoints":maxPoints, "qdx":qdx, "distribution":[] });
			//Add a remaining points element
			question.freePointsBlock = $("<p/>", {"class":"freepoints"}); 
			question.append(question.freePointsBlock);

			//radio selection handler
			question.keepTally = function(e){
				//console.log("Clicked " + e.target.value);
				var qData = question.data();
				var score = 0;
				//Get selected index for each statement in this question.
				question.find("input:radio:checked").map(function(){
					score += parseInt(this.value) || 0;
				});
				qData.freePoints = Math.max(10 - score, 0);
				//console.log(question.data());
				//Now for each statement limit the max select radio
				var answers = question.find("li");
				//console.log(answers);
				answers.each(function(adx){
					var answer = $(this);
					//Find the current selected value
					var current = parseInt(answer.find('input:radio:checked').val()) || 0;
					var limit = qData.freePoints + current;
					qData.distribution[adx] = current;
					//console.log("Q:" + qData.qdx + " A:" + adx + " current:" + current);
					//Disable inputs that would exceed freepoints limit
					//console.log("Limit to: " + limit);
					for(var idx=0 ; idx <= 10; idx++){
						var rad = $("#q" + qData.qdx + "_" + adx + "_" + idx); 
						rad.parent().removeClass("selected available taken");
						if(idx<current){
							rad.parent().addClass("taken");
						}else if(idx == current){
							rad.parent().addClass("selected");
						}else if(idx <= limit){
							rad.parent().addClass("available");
						}
						if(idx>limit){
							rad.prop("disabled", true);
						}else{
							rad.prop("disabled", false);
						}
					}
				});
				question.showFreePoints();
				keepScore();
			};
			
			/*
			 * Displays the prompt with the correct text and sets the question css class
			 */
			question.showFreePoints = function(){
				var qData = this.data();
				if(qData.freePoints){
					if(qData.freePoints == maxPoints){
						this.freePointsBlock.text("Please allocate your " + qData.freePoints + " points.");
					}else{
						this.freePointsBlock.text(qData.freePoints + " unallocated points.");
					}
					this.removeClass("answered");
				}else{
					this.freePointsBlock.text("All " + maxPoints + " points allocated.");
					this.addClass("answered");
				}
			}
			
			//Setup the radios
			if(answers.length){
				questionCount++;
				answers.each(function(adx){
					var answer = $(this);
					//Add 11 radios to each answer (Default value of zero)
					var picker = $("<div/>");
					for(idx=0; idx<=10; idx++){
						var input = $('<input type="radio" name="q'+ qdx + '_' + adx + '" value="'+idx+'" id="q'+ qdx + '_' + adx + '_' + idx + '"/>');
						
						//Handle input change
						input.change(question.keepTally);
						
						var label = $('<label title="'+idx+'"/>').addClass("available").prepend(input);
						if(idx == 0) {
							label.prepend(idx).addClass("first");
							input.prop("checked", true);
						}
						if(idx == 10){
							label.append(idx).addClass("last");
						}
						picker.append(label);
					}
					answer.append(picker);
				});
			}

			//Show free points
			question.showFreePoints();
			//Total points
			totalPoints = questionCount * maxPoints;

		});
		//console.log("Found " + questionCount + " questions");
		
		//Score keeping : If all questions are answered then it triggers a score display
		function keepScore(){
			var debug = false;
			//loop all the questions and check to see if they are all answered
			var unusedPoints = 0;
			
			questions.map(function(idx, question){
				unusedPoints += $(question).data("freePoints");
			});
			if(debug){
				//console.log("Debug");
				unusedPoints = 0;
			}
			//console.log("unusedPoints:" + unusedPoints);
			//If there are any unused points then not all questions have been answered 
			if(unusedPoints){
				resultList.hide();
				resultHint.show();
				return;
			}
			
			//ASSERT : All questions have been answered!	
			var scores = [];
			questions.map(function(idx, question){
				var qScore = $(question).data("distribution"); 
				for(idx in qScore){
					var s = qScore[idx] || 0;
					if(scores[idx]) scores[idx] += s;
					else scores[idx] = s;
				}		
			});
			//console.log(scores);
			var scoresPercent = [];
			for(idx in scores){
				scoresPercent[idx] = (100/totalPoints) * scores[idx];
			}
			if(debug){
				scoresPercent = [10,25,60,5];
			}
			
			//console.log("scores:" + scores);
			//console.log("totalPoints:" + totalPoints);
			//console.log("percentages:" + scoresPercent);
			
			resultHint.hide();
			resultList.show();
			
			resultItems.each(function(idx){
				$("span.value", this).text(" " + scoresPercent[idx] + "%");
				$("span.bar", this).css("width",scoresPercent[idx] + "%");
			});
			
			
		}
		//Run keepScore on first run in case some fields are pre-checked
		keepScore();
	}
})( jQuery );


/*
 * Complex and specific solution created just for the communication quiz
 * Series of questions. Each with 4 radios to indicate disagreement to agreement with the statement
 * The questions belong to one of four categories, Aggressive, Passive etc.
 * On completion the user is told their score for the type of communicator they are. 
 * Displays a table of each type of communication.
 * Each question is an <li> with a class of [aggressive|passive|passagg|assertive]
 */
(function($){
	$.extend({ keys: function(obj){
			if (typeof Object.keys == 'function') return Object.keys(obj);
		  var a = [];
		  $.each(obj, function(k){ a.push(k) });
		  return a;
		}
	});	
	$.fn.quiz_communication = function() {
		var $this = $(this);
		if(!$this[0]) return;
		$this.addClass("quiz quiz_communication");
		//The score gets output here
		var questionCount = 0;
		var answered = 0;
		var hint = $("<p />", {"class":"hint"});
		var scoreblock = $this.find("#scoreblock");
		var labels = [
		              	"Disagree strongly"
		              ,	"Disagree somewhat"
		              ,	"Agree somewhat"
		              ,	"Agree strongly"
		              ];
		var scores = {
					aggressive:	{ label:"Aggressive", score:0}
				,	passive:		{ label:"Passive", score:0}
				,	passagg:		{ label:"Passive aggressive", score:0}
				,	assertive:	{ label:"Assertive", score:0}
		};
		var types = $($.keys(scores));
		             
		//Process the questions
		this.find("ol.questions>li").each(function(qdx){
			var question = $(this);
			//What type of question is it? Should have a class that matches one of the scores
			types.each(function(idx, value){
				if(question.hasClass(value)){
					question.data("type", value);
					return;
				}
			});
			
			if(question.data().type){
				//Add radios to each valid question
				questionCount++;
				var answers = $("<p />", {"class":"answers"});
				$.each(labels, function(idx, value){
					var input = $('<input  type="radio" name="q'+ qdx + '" value="' + (idx+1) + '"/>');
					answers.append($("<label />", {title:value}).html(idx+1).append(input));
					//Watch it for change : For radios "onchange" is synonymous with "onselect"
					input.change(function(){
						input.closest("p").find("label").removeClass("selected");
						input.closest("li").addClass("answered");
						if (input.is(':checked')) input.closest("label").addClass("selected");
						keepScore();
					}); 
				});
				question.append(answers);
			}
		});

		//Append the scorebox to under the questions
		this.find("ol.questions").after(hint);
		
		//Score keeping : If all questions are answered then it triggers a score display
		function keepScore(){
			//console.log("keepScore()");
			$.each(scores, function(idx, obj){
				obj.score = 0;
			});
			var displayResult = false;
			//Check to make sure user has answered all questions
			answered = $this.find("input[type=radio]:checked").length;
			//Calc score looking at radio selected, correct answer has a class of "correct"
			$this.find("ol.questions>li").each(function(qdx){
				//Only for valid questions : Ones with a type
				question = $(this);
				if(!question.data().type) return;
				var score = parseInt(question.find("input[type=radio]:checked").val());
				if(score) scores[question.data().type].score += score;
			});

			//console.log(answered + " out of " + questionCount + " answered.");
			//console.dir(scores);
			
			if(answered < questionCount){
				hint.html("<p>Please answer all the questions to get your score.<br/>You have answered " + answered + " out of " + questionCount + " questions.</p>");
				scoreblock.html(hint.html());
			}else{
				displayResult = true;
				hint.html("<p>You have answered all " + questionCount + " questions.<br />Please see below for your score.</p>");
			}

			//displayResult = true;
			
			if(displayResult){
				//If the user has answered all the questions then present them with their result text
				result = $("<p />", {"class":"scorebars"}).html("Your scores.");
				$.each(scores, function(key, obj){
					/*
					 * Score bars are at least 50% wide.
					 * Extra 50% width is calculated based on score
					 * Min score is 1 max is 4.
					 * There are 4 question types of equal distribution
					 * So max poss score for each type is 1/4 of the total num Q's divided by num of question types 
					 * Allow 1% padding width in css and a bit of border
					 */
					var w = 40 + (50/questionCount)*obj.score;
					result.append(
							$("<span />", {
								style:"width:" + w + "%"
								,"class":key
							})
							.html(obj.label + " " + obj.score + ". ")
							);
				});
				scoreblock.html(result);
			}
		}
		
		keepScore();
	}
})( jQuery );


/*
 *	Quiz consists of series of statements that the user indicates
 *	agreement/disagreement using radios.
 *	Default is high to low in that agree is worth most, disagree is worth 1
 *	Give <ul> containing the answers a class of lowtohigh to reverse the scoring order.
 *	High end score is value of number of options. So if there are 5 options high end is 5.
 *	Optionally can have result blocks that are displayed/hidden dependent on the score.
 *	These must be in a <ul class="results"> with <li>'s with class name of "score_X" where X is the
 *	minimum score needed to display this result.
 */

(function($){
	$.fn.quiz_agreeordisagree = function() {
		var $this = $(this);
		if(!$this[0]) return;
		$this.addClass("quiz quiz_agreeordisagree");
		//The score gets output here
		var result = $("<li />", {"class":"result"});
		var questionCount = 0;
		var maxScore = 0;
		var answered = 0;
		var score = 0;
		var scorePercent = 0;
		
		//Process the questions
		this.find("ol.questions>li").each(function(qdx){
			var question = $(this);
			var answers = question.find("li");
			var scoreDir = "dn";
			if(question.find("ul").hasClass("lowtohigh"))
				scoreDir = "up";
			if(answers.length){
				maxScore += answers.length;
				questionCount++;
				answers.each(function(adx){
					var answer = $(this);
					//Add a radio to each answer (Default value of zero)
					var input = $('<input type="radio" name="q'+ qdx + '" value="0"/>');
					if(scoreDir == "up"){
						//increasing score
						input.attr("value", 1+adx);
					}else{
						//decreasing
						input.attr("value", 5-adx);
					}
					
					//Watch it for change : For radios "onchange" is synonymous with "onselect"
					input.change(function(){
						keepScore();
						input.closest("ul").find("li").removeClass("selected");
						input.closest("ol>li").addClass("answered");
						if (input.is(':checked'))
							input.closest("li").addClass("selected");
					});
					answer.prepend(input);
					answer.wrapInner("<label title=\""+ answer.text() +"\"/>")
					if(adx == 0) answer.addClass("first");
					if(adx == answers.length -1) answer.addClass("last");
				});
			}
		});
		//console.log("Found " + questionCount + " maxScore:" +maxScore);
			
		/*
		 * Process the results : Hiding them for now until all questions are answered
		 * I'm assuming that each result will have a className of "percent_X" where X
		 * is the minimum percentage score required to show this result. 
		 */
		
		this.find('ul.results>li[class^="percent"]').each(function(rdx){
			var result = $(this);
			result.hide();
			result.attr("minscore", parseInt(result.attr("class").replace("percent_", "")));
		});
		
		//Append the scorebox to under the questions
		this.find("ul.results").prepend(result);

		//
		
		//Score keeping : If all questions are answered then it triggers a score display
		function keepScore(){
			var displayResult = false;
			//Check to make sure user has answered all questions
			answered = $this.find("input[type=radio]:checked").length;
			//Calc score looking at radio selected, correct answer has a class of "correct"
			score = 0;
			var scores = $this.find("li input[type=radio]:checked").map(function(){
				score += parseInt(this.value);
			});
			scorePercent = (100/maxScore) * score;
			
			//Finish
			
			if(answered < questionCount){
				result.html("<p>Please answer all the questions to get your score.<br/>You have answered " + answered + " out of " + questionCount + " questions.</p>");
			}else{
				displayResult = true;
				result.html("<h3>You have scored " + score + " out of " + maxScore + "</h3>");
			}
			//console.log(answered + " out of " + questionCount + " answered. Score = " + score);
			
			//displayResult = true; //Set true for debugging
			
			if(displayResult){
				//If the user has answered all the questions then present them with their result text
				resultToShow = 0;
				$this.find('ul.results>li[class^="percent"]').each(function(rdx){
					var result = $(this);
					result.hide();
					if(scorePercent >= result.attr("minscore"))
						resultToShow = Math.max(resultToShow, result.attr("minscore"));
				});
				$("ul.results>li.percent_" + resultToShow, $this).show();
			}
		}
		//Run keepScore on first run in case some fields are pre-checked
		keepScore();
	}
})( jQuery );



/*
 *	Quiz is made up of multiple choice questions.
 *	Only one of each answer is correct.
 *	Has a "Score" button to calculate the result will show a result box dependant on score
 *	The radio buttons are added automatically.
 *	Expects an <ol> of questions with the possible answers being in a sub <ul><li> structure 
 *	Optionally can have result blocks that are displayed/hidden dependant on the score.
 *	These must be in a <ul class="results"> with <li>'s with class name of "score_X" where X is the
 *	minimum score needed to display this result.
 */

(function($){
	$.fn.quiz_multichoice = function() {
		var $this = $(this);
		if(!$this[0]) return;
		$this.addClass("quiz quiz_multichoice");
		//The score gets output here
		var result = $("<li />", {"class":"result"});
		var questionCount = 0;
		var answered = 0;
		var score = 0;
		
		
		//Process the questions
		this.find("ol.questions>li").each(function(qdx){
			var question = $(this);
			var answers = question.find("li");
			if(answers.length){
				questionCount++;
				answers.each(function(adx){
					var answer = $(this);
					//Add a radio to each answer
					var input = $('<input type="radio" name="q'+ qdx + '" value="0"/>');
					if(answer.hasClass("correct")) input.attr("value", 1);
					//Watch it for change : For radios "onchange" is synonymous with "onselect"
					input.change(function(){
						keepScore();
						input.closest("ul").find("li").removeClass("selected");
						input.closest("ol>li").addClass("answered");
						if (input.is(':checked'))
							input.closest("li").addClass("selected");
					});
					answer.prepend(input);
					answer.wrapInner("<label />")
				});
			}
		});
		//console.log("Found " + questionCount);
			
		/*
		 * Process the results : Hiding them for now until all questions are answered
		 * I'm assuming that each result will have a className of "score_X" where X
		 * is the minimum score required to show this result. 
		 */
		
		this.find('ul.results>li[class^="score"]').each(function(rdx){
			var result = $(this);
			result.hide();
			result.attr("minscore", parseInt(result.attr("class").replace("score_", "")));
		});
		
		//Append the scorebox to under the questions
		this.find("ul.results").prepend(result);

		//
		
		//Score keeping : If all questions are answered then it triggers a score display
		function keepScore(){
			var displayResult = false;
			//Check to make sure user has answered all questions
			answered = $this.find("input[type=radio]:checked").length;
			//Calc score looking at radio selected, correct answer has a class of "correct"
			score = $this.find("li.correct input[type=radio]:checked").length;
			if(answered < questionCount){
				result.html("<p>Please answer all the questions to get your score.<br/>You have answered " + answered + " out of " + questionCount + " questions.</p>");
			}else{
				displayResult = true;
				result.html("<h3>You have scored " + score + " out of " + questionCount + "</h3>");
			}
			//console.log(answered + " out of " + questionCount + " answered. Score = " + score);
			
			//displayResult = true;
			
			if(displayResult){
				//If the user has answered all the questions then present them with thier result text
				resultToShow = 0;
				$this.find('ul.results>li[class^="score"]').each(function(rdx){
					var result = $(this);
					result.hide();
					if(score >= result.attr("minscore"))
						resultToShow = Math.max(resultToShow, result.attr("minscore"));
				});
				$("ul.results>li.score_" + resultToShow, $this).show();
			}
		}
		//Run keepScore on first run in case some fields are pre-checked
		keepScore();
	}
})( jQuery );


/*
 *	This is a very simple quiz format : No scoring as such
 *	Each Question must be in an <li> inside the selected element
 *	The check boxes are added automatically 
 */

(function($){
	$.fn.quiz_simple = function() {
		var $this = $(this);
		if(!$this[0]) return;
		$this.addClass("quiz quiz_simple");
		var score = this.find("span.score");
		this.find(".questions li").each(function(idx){
			var elm = $(this);
			var input = $("<input type=\"checkbox\" name=\"q\"" + idx + ">");
			//Handle selection behaviour
			input.change(function(){
				keepScore();
				if (input.is(':checked')) {
					input.closest("li").addClass("selected");
				}else{
					input.closest("li").removeClass("selected");
				}
			});
			elm.prepend(input);
			elm.wrapInner("<label />")
		});
		function keepScore(){
			var total = $this.find("li input:checked").length;
			if(total)
				score.html(total);
			else
				score.html("None");
		}
		//Run keepScore on first run in case some fields are pre-checked
		keepScore();
	}
})( jQuery );

//Run it
$(document).ready(function(){
	$("#quiz_timeman").quiz_simple();
	$("#quiz_motivation").quiz_simple();
	$("#quiz_customerservice").quiz_multichoice();
	$("#quiz_communication").quiz_communication();
	$("#quiz_listeningskills").quiz_agreeordisagree();
	$("#quiz_personalitystyle").quiz_resourceallocation();
});

