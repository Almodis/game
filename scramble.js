var curIndex = 0; //position in the array of words
var curCell = 20; //the number of seconds in the time (and number of cells in the countdown table)
var timerID; //used for the count down
var wordOrder = new Array();
var timeInterval = (maxTime/20) * 1000; //the time limit (in seconds) divided by 20 (the number of cells in the clock table) times 1000 (for milliseconds)
var curWordIndex;
var curWord;
var curWordScrambled = "";
var scrambleOK = true;
var lNum = 0;
var score = 0;
var maxTableWidth = 600;
var wDivXY = new Array();
var aDivXY = new Array();
var setTimeOK = true;

function checkFinished(layerName,bEl) {
  document.getElementById(layerName).style.display = 'none';

  if(bEl.value == "TRY AGAIN") { //the game is set to keep trying
    if(!reScramble) scrambleOK = false;
    if(maxTime > 0) { //there is a time limit
      if(curCell == 0) { //the time limit has expired
        clearInterval(timerID);
        curIndex++;
        curWordIndex = wordOrder[curIndex];
        resetTimer();
        setTimeOK = true;
      } else { setTimeOK = false; }
    }
    setWord();
    return;
  }

  curIndex++;
  curWordIndex = wordOrder[curIndex];

  if(curIndex == wordOrder.length) {
    var percent = Math.round((score/wordOrder.length) * 100);
    if(percent == 100) {
      var greeting = "EXCELLENT!";
      var message = "You can spell all of these words without any problem! Keep up the good work!";
    } else if(percent > 90) {
      var greeting = "EXCELLENT!";
      var message = "You can spell most of these words without any problem! Keep up the good work!";
    } else if(percent > 80) {
      var greeting = "WELL DONE!";
      var message = "You can spell many of these words without any problem! Keep up the good work!";
    } else if(percent > 70) {
      var greeting = "GOOD JOB!";
      var message = "You had a problem spelling some of the words! Make sure to study the words you missed!";
    } else if(percent > 60) {
      var greeting = "OKAY!";
      var message = "You need to practice spelling the words you missed! Keep studying so you can improve your score!";
    } else {
      var greeting = "SORRY!";
      var message = "You have a problem with spelling. Study the words you missed so you can improve your score. Keep practicing!";
    }

    document.getElementById("finishedGreeting").innerHTML = greeting;
    document.getElementById("finishedMessage").innerHTML = message;

    document.getElementById("finishedScore").innerHTML = score + " out of " + wordOrder.length + " (" + percent + "%)";

    if(percent < 100) {
      var missedWordStr = "";
      for(i = 0; i < wordArray.length; i++) {
        if(wordArray[i]["missed"]) {
          missedWordStr += wordArray[i]["answer"];
          missedWordStr += "\n";
        }
      }

      document.getElementById("missedWords").value = missedWordStr;
    }

    if(continuousOK) {
      document.getElementById("finishedButton").innerHTML = '<input type="button" value="PLAY AGAIN" onClick="init()" style="font-family:\'trebuchet ms\',helvetica,arial,sans-serif; font-size:12pt; font-weight:bold; color:#12327C"> <input type="button" onClick="window.close()" value="FINISHED" style="font-family:\'trebuchet ms\',helvetica,arial,sans-serif; font-size:12pt; font-weight:bold; color:#12327C">';
    } else {
      document.getElementById("finishedButton").innerHTML = '<input type="button" onClick="document.getElementById(\'finished\').style.display=\'none\'" value="FINISHED" style="font-family:\'trebuchet ms\',helvetica,arial,sans-serif; font-size:12pt; font-weight:bold; color:#12327C">';
    }

    document.getElementById("finished").style.height = document.body.clientHeight - 100;
    document.getElementById("finished").style.top = 50;
    document.getElementById("finished").style.left = document.body.clientWidth/2 - 200;
    document.getElementById("finished").style.display = '';
    if(percent < 100) { document.getElementById("missedWordsDiv").style.display = ''; }
  } else {
    scrambleOK = true;
    setTimeOK = true;
    resetTimer();
    setWord();
  }
}

function countDown() {
  document.getElementById("time" + curCell).className = "notime";
  curCell--;
  if(curCell == 0) {
    checkAnswer();
    return;
  }
}

function resetTimer() {
  if(maxTime != 0) {
    for(i = 1; i < 21; i++) {
      document.getElementById("time" + i).className = "time";
    }

    curCell = 20;
  }
}

function setWord() {
  if(document.getElementById("wordTable")) {
    document.getElementById("wordPara").removeChild(document.getElementById("wordTable"));
  }

  if(document.getElementById("anchorTable")) {
    document.getElementById("wordPara").removeChild(document.getElementById("anchorTable"));
  }

  if(document.getElementById("spaceTable")) {
    document.getElementById("wordPara").removeChild(document.getElementById("spaceTable"));
  }

  curWord = wordArray[curWordIndex]["answer"];
  if(scrambleOK) {
    var sWord = new Array(curWord.length);
    for(cc = 0; cc < curWord.length; cc++) {
      sWord[cc] = curWord.charAt(cc);
    }

    sWord = shuffle(sWord);
    var tempWord = sWord.join("");
    while(tempWord == curWord) {
      sWord = shuffle(sWord);
      tempWord = sWord.join("");
    }

    curWordScrambled = tempWord;
  } else {
    tempWord = curWordScrambled;
  }

  wDivXY = new Array();
  aDivXY = new Array();
  for(cc = 0; cc < curWord.length; cc++) {
    wDivXY[cc] = "";
  }

  var wTable = document.createElement("table");
  wTable.border = 0;
  wTable.id = "wordTable";
  wTable.align = "center";
  wTable.cellPadding = 0;
  wTable.cellSpacing = 0;

  var aTable = document.createElement("table");
  aTable.border = 0;
  aTable.id = "anchorTable";
  aTable.align = "center";
  aTable.cellPadding = 0;
  aTable.cellSpacing = 0;

  var wTBody = wTable.appendChild(document.createElement("tbody"));
  var wTRow = wTBody.appendChild(document.createElement("tr"));

  var aTBody = aTable.appendChild(document.createElement("tbody"));
  var aTRow = aTBody.appendChild(document.createElement("tr"));

  for(cl = 0; cl < curWord.length; cl++) {
    var wTCell = wTRow.appendChild(document.createElement("td"));
    var wDiv = wTCell.appendChild(document.createElement("div"));
    wDiv.id = "char" + cl;
    wDiv.className = "letterDiv";
    if(tempWord.charAt(cl) == " ") var charStr = "\u00A0";
    else var charStr = tempWord.charAt(cl).toUpperCase();

    wDiv.appendChild(document.createTextNode(charStr));
    wDiv.style.zIndex = 2;

    var aTCell = aTRow.appendChild(document.createElement("td"));
    var aDiv = aTCell.appendChild(document.createElement("div"));
    aDiv.id = "anchor" + cl;
    aDiv.className = "anchorDiv";
    aDiv.appendChild(document.createTextNode(tempWord.charAt(cl).toUpperCase()));
    aDiv.style.zIndex = 1;

    if(cl < (curWord.length - 1)) {
      var wSCell = wTRow.appendChild(document.createElement("td"));
      wSCell.width = 15;
      wSCell.appendChild(document.createTextNode("\u00A0"));

      var aSCell = aTRow.appendChild(document.createElement("td"));
      aSCell.width = 15;
      aSCell.appendChild(document.createTextNode("\u00A0"));
    }

    setTimeout("ADD_DHTML('" + wDiv.id + "')",10);
    setTimeout("ADD_DHTML('" + aDiv.id + "'+NO_DRAG)",10);
  }

  var sTable = document.createElement("table");
  sTable.id = "spaceTable";

  var sTBody = sTable.appendChild(document.createElement("tbody"));
  var sTRow = sTBody.appendChild(document.createElement("tr"));
  var sTCell = sTRow.appendChild(document.createElement("td"));
  sTCell.appendChild(document.createTextNode("\u00A0"));

  if(maxTime > 0 && setTimeOK) { timerID = setInterval("countDown()",timeInterval); }

  if(cluesOK) { document.getElementById("clueSpan").innerHTML = '<b>Clue: </b>' + wordArray[curWordIndex]["clue"]; }

  document.getElementById("wordNum").innerHTML = 'Word ' + (curIndex + 1) + ' of ' + wordOrder.length;

  document.getElementById("wordPara").appendChild(wTable);
  document.getElementById("wordPara").appendChild(sTable);
  document.getElementById("wordPara").appendChild(aTable);
}

function init() {
  document.getElementById("finished").style.display = 'none';

  document.getElementById("beginDiv").style.display = '';
  document.getElementById("beginDiv").style.top = document.body.clientHeight/2 - 150;
  document.getElementById("beginDiv").style.left = document.body.clientWidth/2 - 200;
  document.getElementById("beginButton").focus();
}

function gameStart() {
  document.getElementById("beginDiv").style.display = 'none';

  curIndex = 0;
  score = 0;
  document.getElementById("curScore").innerHTML = "Score: 0 (0%)";

  for(wo = 0; wo < wordArray.length; wo++) {
    wordOrder[wo] = wo;
  }

  wordOrder = shuffle(wordOrder);
  curWordIndex = wordOrder[curIndex];

  if(maxTime == 0) { document.getElementById("timeDiv").style.display = 'none'; }
  else { resetTimer(); }
  setWord();
}

function shuffle(myArray) {
  var i = myArray.length;
  if(i == 0) return false;
  while(--i) {
     var j = Math.floor(Math.random() * ( i + 1 ));
     var tempi = myArray[i];
     var tempj = myArray[j];
     myArray[i] = tempj;
     myArray[j] = tempi;
  }

  return myArray;
}