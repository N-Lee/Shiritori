// ===============================================================
//                          TRIE
// ===============================================================

//https://en.wikipedia.org/wiki/Trie

function trieNode(letter){
    this.letter = letter;
    this.parent = null;
    this.children = {};
    this.end = false;
}

function trie(){
    this.root = new trieNode(null);
}

trie.prototype.insert = function(word){
    var node = this.root;
    for (var i = 0; i < word.length; i++){
        if (!node.children[word[i]]){
            node.children[word[i]] = new trieNode(word[i]);
            node.children[word[i]].parent = node;
        }

        node = node.children[word[i]];

        if (word.length - 1 == i){
            node.end = true;
        }
    }
}

trie.prototype.find = function(word){
    var node = this.root;
    for (var i = 0; i < word.length; i++){
        if (node.children[word[i]]){
            node = node.children[word[i]];
        } else {
            return false;
        }
    }

    return node.end;
}

// ===============================================================
//                       EVERYTHING ELSE
// ===============================================================


var mainModal	 = $('#mainModal')[0];
var customModal = $("#customModal")[0];
var winModal = $("#winModal")[0];
var rulesModal = $("#rulesModal")[0];

var score1 = 160;
var score2 = 160;
var startsWith = "a";
var alphabet = "abcdefghijklmnopqrstuvwxyz";
var playOneTurn = true;
var time = 15;
var wordLength = 4;
var playerOne = "Player 1";
var playerTwo = "Player 2";
var playerOneWon = false;
var firstLoad = true;
var trie = new trie();
var usedWords = [];
var intervalOne;
var intervalTwo;
var paused = false;

$("#answer1").on("keypress", function(e) {
    var code = e.keyCode || e.which;
    var hasString = false;
    if(code==13){
        var input = $("#answer1").val();
        if (input.charAt(0).localeCompare(startsWith) == 0 && trie.find(input) && input.length >= wordLength && usedWords.indexOf(input) < 0){
            usedWords.push(input);
	        var points = input.length - wordLength + parseInt($("#playOneBar").html());
            var temp = score1;
	        score1 -= points;
            if (score1 < 0){
                score1 = 0;
            }

            $('#score1').each(function () {
                var $this = $(this);
                jQuery({ Counter: temp }).animate({ Counter: score1 }, {
                    duration: 1000,
                    easing: 'swing',
                    step: function () {
                      $this.text(Math.floor(this.Counter));
                    }
                });
            });

	        $("#score1").text(score1);
	        $('#tablePlay1 tr').eq(1).after("<tr><td width=80%>" + input + "</td><td>" + points + "</td></tr>");
	        switchToPlayerTwo(input);
    	} else {
    		$("#answer1").val('');
    		$("#answer1").attr("placeholder", startsWith);
	    }
    }

    if (score1 < 1){
        stopPlayerTwo();
        playerOneWon = true;
        $("#divPlay2").toggleClass("divPlayTurn divPlay");
        win(playerOne);
    }
}); 

$('#answer2').on('keypress', function(e) {
    var code = e.keyCode || e.which;
    if(code==13){
        var input = $('#answer2').val();
        if (input.charAt(0).localeCompare(startsWith) == 0 && trie.find(input) && input.length >= wordLength && usedWords.indexOf(input) < 0){
            usedWords.push(input);
	        var points = input.length - wordLength + parseInt($("#playTwoBar").html());
            var temp = score2;
	        score2 -= points;
	        if (score2 < 0){
                score2 = 0;
            }

            $('#score2').each(function () {
                var $this = $(this);
                jQuery({ Counter: temp }).animate({ Counter: score2 }, {
                    duration: 700,
                    easing: 'swing',
                    step: function () {
                      $this.text(Math.floor(this.Counter));
                    }
                });
            });

            $('#tablePlay2 tr').eq(1).after("<tr><td width=80%>" + input + "</td><td>" + points + "</td></tr>");
	        switchToPlayerOne(input);

    	} else {
    		$("#answer2").val('');
    		$("#answer2").attr("placeholder", startsWith);
    	}
    }

    if (score2 < 1){
        stopPlayerOne();
        playerOneWon = false;
        $("#divPlay1").toggleClass("divPlayTurn divPlay");
        win(playerTwo);
    }
}); 

function overlayLoad(){
	mainModal.style.display = "block";
}

function getRandomLetter(){
	startsWith = alphabet[Math.floor(Math.random() * alphabet.length)];
	$("#answer1").attr("placeholder", startsWith);
}

function customInfo(score, time, wordLen){
	score1 = score;
	score2 = score;
	$("#score1").text(score1);
	$("#score2").text(score2);
    this.time = time;
	wordLength = wordLen;
}

function win(winner){
    winModal.style.display = "block";
    mainModal.style.display = "none";
    customModal.style.display = "none";
    $("#winText").html("<h1>" + winner + " wins</h1>");
}

function switchToPlayerTwo(input){
    $("#answer1").val('');
    startsWith = input.charAt(input.length-1)
    $("#answer1").attr("placeholder", "");
    $("#answer2").attr("placeholder", startsWith);
    $("#answer1").prop("disabled", true);
    $("#answer2").prop("disabled", false);
    $("#divPlay2").toggleClass("divPlay divPlayTurn");
    $("#divPlay1").toggleClass("divPlayTurn divPlay");
    $("#answer2").select();
    stopPlayerOne();
    movePlayerTwo();
}

function switchToPlayerOne(input){
    $("#answer2").val('');
    startsWith = input.charAt(input.length-1)
    $("#answer1").attr("placeholder", startsWith);
    $("#answer2").attr("placeholder", "");
    $("#answer1").prop("disabled", false);
    $("#answer2").prop("disabled", true);
    $("#divPlay1").toggleClass("divPlay divPlayTurn");
    $("#divPlay2").toggleClass("divPlayTurn divPlay");
    $("#answer1").select();
    stopPlayerTwo();
    movePlayerOne();
}

function rules(){
    $("#rulesText").html("<h1>Rules<\/h1><br>Minimum Word Length: " + wordLength + "<br><br>Starting Points: " + score1 + "<br><br>Time: " + time);
    winModal.style.display = "none";
    mainModal.style.display = "none";
    customModal.style.display = "none";
    rulesModal.style.display = "block";
    if (firstLoad){
        loadDictionary()
        setTimeout(setup, 4000);
    } else {
        setTimeout(setup, 4000);
    }
}

function reset(){
	$("#answer1").val('');
	$("#answer2").val('');
	$("#answer1").attr("placeholder", "");
	$("#answer2").attr("placeholder", "");
	$("#tablePlay1").find("tr:gt(1)").remove();
	$("#tablePlay2").find("tr:gt(1)").remove();
	$("#answer1").prop("disabled", false);
	$("#answer2").prop("disabled", true);
    clearInterval(intervalOne);
    clearInterval(intervalTwo);
    usedWords = [];
}

function setup(){
    getRandomLetter();
    console.log("new game")
    console.log(firstLoad);
    console.log(playerOneWon);
    if (firstLoad || playerOneWon){
        $("#divPlay1").toggleClass("divPlay divPlayTurn");
    }
    $("#answer1").select();
    rulesModal.style.display = "none";
    firstLoad = false;
    movePlayerOne();
}

function loadDictionary(){
    $.get('https://raw.githubusercontent.com/N-Lee/Shiritori/master/words.txt',  function(contents){
        var start = (new Date).getTime();
        var lines = contents.split("\n");

        $.each(lines, function(n, elem){
            trie.insert(elem);
        });

        console.log("Dictionary Loaded");
        console.log( (new Date).getTime() - start );
    });
}

function movePlayerOne() {
    var elem = $("#playOneBar")[0];
    var width = 1000;
    intervalOne = setInterval(frame, time);
    function frame() {
        if (paused){
            return;
        }
        if (width <= -1) {
          switchToPlayerTwo(startsWith);
        } else {
            width--; 
            var incrementTime = width * time + 1000;
            elem.style.width = width/10 + '%';
            if (width < 1){
                incrementTime = 0;
            }
            if (incrementTime < 10000){
                elem.innerHTML = incrementTime.toString()[0];
            } else {
                elem.innerHTML = incrementTime.toString()[0] + incrementTime.toString()[1];
            }
        }
    }
}

function stopPlayerOne(){
    clearInterval(intervalOne);
}

function movePlayerTwo() {
    var elem = $("#playTwoBar")[0];
    var width = 1000;
    intervalTwo = setInterval(frame, time);
    function frame() {
        if (paused){
            return;
        }
        if (width <= -1) {
          switchToPlayerOne(startsWith);
        } else {
            width--; 
            var incrementTime = width * time + 1000;
            elem.style.width = width/10 + '%';
            if (width < 1){
                incrementTime = 0;
            }
            if (incrementTime < 10000){
                elem.innerHTML = incrementTime.toString()[0];
            } else {
                elem.innerHTML = incrementTime.toString()[0] + incrementTime.toString()[1];
            }
        }
    }
}

function stopPlayerTwo(){
    clearInterval(intervalTwo);
}

function resumeTimer(){
    paused = false;
}

function pauseTimer(){
    paused = true;
}


// When the user clicks on the button, open the modal 
$("#menu").click(function() {
    mainModal.style.display = "block";
    pauseTimer();
});

$("#easy").click(function() {
    mainModal.style.display = "none";
    reset();
    customInfo(120, 15, 3);
    rules();
});

$("#medium").click(function() {
    mainModal.style.display = "none";
    reset();
    customInfo(160, 15, 4);
    rules();
});

$("#hard").click(function() {
    mainModal.style.display = "none";
    reset();
    customInfo(160, 10, 4);
    rules();
});

$("#custom").click(function() {
    mainModal.style.display = "none";
    customModal.style.display = "block";
});

$("#instruction").click(function() {
	mainModal.style.display = "none";
    instructionModal.style.display = "block";
});

$("#close").click(function() {
    mainModal.style.display = "none";
    resumeTimer();
});

$("#submit").click(function() {
    var errors = false;
	var customLength = $("#wordLength").val();
    var customStart = $("#startingPoint").val();
    var customTime = $("#time").val();
    $("#errors").html("");
    if (isNaN(customLength) || customLength < 1){
    	$("#errors").append("The Minimum Word Length is invalid<br>");
        errors = true;
    }
    
    if (isNaN(customStart) || customStart < 1){
    	$("#errors").append("The Starting Point is invalid<br>");
        errors = true;
    } 
    
    if (isNaN(customTime) || customTime < 1){
    	$("#errors").append("The Time is invalid<br>");
        errors = true;
    }

    if (errors == false) {

    	customModal.style.display = "none";
        reset();
        customInfo(customStart, customTime, customLength);
        rules();
	}
});

$("#winButton").click(function() {
    winModal.style.display = "none";
    mainModal.style.display = "block";

});

$("#back").click(function(){
    mainModal.style.display = "block";
    customModal.style.display = "none"
});

$("#instructionButton").click(function(){
    mainModal.style.display = "block";
    instructionModal.style.display = "none"
});