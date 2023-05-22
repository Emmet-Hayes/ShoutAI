var canvas;
var ctx;
var difficulty = "m";  // medium is default
var x = 51;            // player position
var y = 0;
var img = new Image(); // image of current level
var collision = 0;
var mins = 2;
var secs = mins * 60;
var startTime;

const NUMLEVELS = 20;
const dx = 2;
const dy = 2;
const INITX = {"s":51, "m":82, "l":114};
const INITY = {"s":0, "m":0, "l":0};
const WINX = {"s":67, "m": 98, "l":130};
const WINY = {"s":86, "m": 132, "l":192};
const WIDTH = {"s":130, "m": 194, "l": 258};
const HEIGHT = {"s":98, "m": 147, "l": 194};
const PWIDTH = 12;
const PHEIGHT = 12;

///////////////////////////////////////////////////////
// Fills the player's rectangle position on canvas
///////////////////////////////////////////////////////
function rect(x, y, w, h, color) {
	ctx.fillStyle = color;
	ctx.beginPath();
	ctx.rect(x, y, w, h);
	ctx.closePath();
	ctx.fill();
}

///////////////////////////////////////////////////////
// Fills the lava's rectangle position on canvas
///////////////////////////////////////////////////////
function lava(color) {
	ctx.globalCompositeOperation = "darken";
	const fillRatio = (100. - secs) / 100.;
	ctx.fillStyle = color;
	ctx.beginPath();
	ctx.fillRect(0,0,WIDTH[difficulty],fillRatio*HEIGHT[difficulty]);
	ctx.closePath();
	ctx.fill();
	checkcollision();
}

///////////////////////////////////////////////////////
// Clear the previous canvas maze state
///////////////////////////////////////////////////////
function clear() {
	//ctx.globalCompositeOperation = "source-over";
	ctx.clearRect(0, 0, WIDTH["l"], HEIGHT["l"]);
	ctx.drawImage(img, 0, 0);
}

///////////////////////////////////////////////////////
// Clear and redraw the maze and player on canvas
///////////////////////////////////////////////////////
function redraw() {
	clear();
	lava("red");
	rect(x, y, PWIDTH, PHEIGHT, "purple");

}

///////////////////////////////////////////////////////
// Initialize the canvas with the maze image
///////////////////////////////////////////////////////
function init() {
	checkDifficulty();
	const filename = getRandomLevelName();
	startTime = Date.now(); // page initialized, starting timer..
	x = INITX[difficulty];
	y = INITY[difficulty];
	mins = 2;
	secs = mins * 60;
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d", {willReadFrequently: true});
	img.src = "./js/mazes/" + filename;
	startTime = Date.now();
	return setInterval(redraw, 10);
}
//////////////////////////////////////////////////////
//
//////////////////////////////////////////////////////
function getRandomLevelName() {
	const filename = difficulty + "maze" + (Math.floor(Math.random() * 20) + 1)+ ".png";
	return filename;
}
//////////////////////////////////////////////////////
//
//////////////////////////////////////////////////////
function checkDifficulty() {
	const difficultyOptions = document.querySelectorAll('input[name=mazedifficulty');
	window.addEventListener("click", () => {
		for (const option of difficultyOptions) {
			if (option.checked) {
				if (difficulty != option.value) {
					difficulty = option.value;
					init();
				}
				break;
			}
		}
	});
}

///////////////////////////////////////////////////////
// Respond to a keydown event and update player position
///////////////////////////////////////////////////////
function doKeyDown(evt){
	// Prevent the default browser action to scroll up and down the page
	if([37, 38, 39, 40].indexOf(evt.keyCode) > -1) {
        evt.preventDefault();
    }

	switch (evt.keyCode) {
		case 38:  // Up arrow was pressed
		if (y - dy > 0) {
			y -= dy;
			checkcollision();
			checkwincondition();
			if (collision == 1){
				y += dy;
				collision = 0;
			}
		}
		break;
		case 40:  // Down arrow was pressed
		if (y + dy < HEIGHT[difficulty]) {
			y += dy;
			checkcollision();
			checkwincondition();
			if (collision == 1){
				y -= dy;
				collision = 0;
			}
		}
		break;
		case 37:  // Left arrow was pressed
		if (x - dx > 0) {
			x -= dx;
			checkcollision();
			checkwincondition();
			if (collision == 1){
				x += dx;
				collision = 0;
			}
		}
		break;
		case 39:  // Right arrow was pressed
		if (x + dx < WIDTH[difficulty]) {
			x += dx;
			checkcollision();
			checkwincondition();
			if (collision == 1){
				x -= dx;
				collision = 0;
			}
		}
		break;
	}
}

///////////////////////////////////////////////////////
// Check for collisions between player and maze
///////////////////////////////////////////////////////
function checkcollision() {
	var imgd = ctx.getImageData(x, y, PWIDTH, PHEIGHT);
	var pix = imgd.data;

	for (var i = 0; i < pix.length; i += 4) {
		// Collide strictly with any black pixel
		if (pix[i] == 0 && pix[i+1] == 0 && pix[i+2] == 0) {
			collision = 1;
		}
		// If we hit lava, game over.
		if (pix[i] == 255 && pix[i+1] == 0 && pix[i+2] == 0) {
			alert("Game Over! Press ok to try again.");
			init();
			break;
		}
	}
}

//post score and username
async function saveScore(data){
	let player = JSON.stringify({
		username: data.username,
		score: data.score,
	}) 

   let resp = await fetch("/api/saveScore", {
				method: "POST",
				headers: {
					"Content-type": "application/json; charset=UTF-8"
				},   
				body: player
			});
	if(!resp.ok){
		alert("something went wrong, while trying to save your score.");
		console.log(resp);
	}

}

function saveGame(playerScore){
	let uname = document.getElementById("username").value ;
	console.log("uname "+ uname);
	const randomNameList = ["notMing", "Morty","Rick","sponge of the Bog","user666"];
	if(!uname){
		let rdmNum = Math.floor(Math.random()*randomNameList.length);
		uname = randomNameList[rdmNum];
		console.log(uname)
	}
	let res = {
		username:uname,
		score:playerScore,
	 }
	saveScore(res);
}

///////////////////////////////////////////////////////
// Check if player's position is at end of maze
///////////////////////////////////////////////////////
function checkwincondition() {
	if ((difficulty == "s" && (x >= 65 && x <=68) && (y >= 82 && y <= 87)) || 
		(difficulty == "m" && (x >= 96 && x <=100) && (y >= 128 && y <= 134)) ||
		(difficulty == "l" && (x >= 128 && x <=131) && (y >= 178 && y <= 181))) { //end of maze (level 1)
		const timeElapsed = (Date.now() - startTime) / 1000;
		if (timeElapsed < 0) {
			alert("Somehow, you finished the maze in negative time... Did you cheat? :(");
			init(); // skip sending to database, since we don't want to let those nasty cheaters win..
		}

		const score = Math.round(1000000 / Math.round(timeElapsed)); // completing more quickly gives a higher score..
		alert("Congratulations, you completed the maze in " + timeElapsed + " sec! Your total score was " + score + "! Press ok to try a new one.");
		saveGame(score);
		init();
	}
}

///////////////////////////////////////////////////////
// Timer to compute high score and pressure player
///////////////////////////////////////////////////////

//countdown function is evoked when page is (re)loaded
function countdown() {
    setTimeout('decrement()', 60);
}

function decrement() {
    if (document.getElementById) {
        minutes = document.getElementById("minutes");
        seconds = document.getElementById("seconds");

        //if less than a minute remaining, display seconds only.
        if (seconds < 59) {
            seconds.value = secs;
        }
        //else display both minutes and seconds
        else {
        	var s = getseconds();
        	if (s >= 0 && s <= 9) s = "0" + s;
        	if (s < 0) s += 60;
            minutes.value = getminutes();
            seconds.value = s;
        }
        //when less than a minute remaining, color changes to red
        if (mins < 1) {
            minutes.style.color = "red";
            seconds.style.color = "red";
        }
        //if seconds becomes less than zero, then page alert time up
        if (mins < 0) {
            alert('time is up!');
            minutes.value = 0;
            seconds.value = 0;
            init();
        }
        //otherwise decrement the timer
        else {
            secs--;
            setTimeout('decrement()', 1000);
        }
    }
}

function getminutes() {
    //display minutes rounded down
    mins = Math.floor(secs / 60);
    return mins;
}

function getseconds() {
    //take minutes remaining (as seconds) away 
    //from total seconds remaining
    return secs - Math.round(mins * 60);
}

init();
window.addEventListener('keydown', doKeyDown, true);