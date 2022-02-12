// var sounds = {
//   greenBox: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound1.mp3"),
//   redBox: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound2.mp3"),
//   blueBox: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound3.mp3"),
//   yellowBox: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound4.mp3"),
// };
let sounds = [
  new Audio("https://s3.amazonaws.com/freecodecamp/simonSound2.mp3"), // red
  new Audio("https://s3.amazonaws.com/freecodecamp/simonSound3.mp3"), //blue
  new Audio("https://s3.amazonaws.com/freecodecamp/simonSound4.mp3"), //yellow
  new Audio("https://s3.amazonaws.com/freecodecamp/simonSound1.mp3"), // green
];

let endgame = new Audio("gameOver.mp3");
let score = 0;
let base = document.querySelector(".base");
const start = document.querySelector(".start-button button");
let red = document.querySelector(".red");
let blue = document.querySelector(".blue");
let yellow = document.querySelector(".yellow");
let green = document.querySelector(".green");
let elements = [red, blue, yellow, green];
let hs = document.querySelector(".high-score-value");
let cs = document.querySelector(".current-score-value");
cs.textContent = "0";
let revert = (number) => {
  if (number == 0) {
    elements[number].style.backgroundColor = "red";
  } else if (number == 1) {
    elements[number].style.backgroundColor = "blue";
  } else if (number == 2) {
    elements[number].style.backgroundColor = "yellow";
  } else {
    elements[number].style.backgroundColor = "green";
  }
};
let changeColor = (number) => {
  console.log(number, elements[number]);
  if (number == 0) {
    elements[number].style.backgroundColor = "#FF9B9B";
    //setTimeout(revert(number), 5000);
  } else if (number == 1) {
    elements[number].style.backgroundColor = "#8ab4f8";
    // setTimeout(revert(number), 3000);
    //setTimeout(revert(number), 5000);
  } else if (number == 2) {
    elements[number].style.backgroundColor = "#FFD480";
    // setTimeout(revert(number), 3000);
    //setTimeout(revert(number), 5000);
  } else {
    elements[number].style.backgroundColor = "#90EE90";
    // setTimeout(revert(number), 3000);
    //setTimeout(revert(number), 5000);
  }
  // wait(2000);
};

let highscore;
if (localStorage.getItem("high-score"))
  highscore = JSON.parse(localStorage.getItem("high-score"));
else {
  localStorage.setItem("high-score", 0);
  highscore = 0;
}
console.log("Initial highscore : ", highscore);
hs.textContent = `${highscore}`;
start.addEventListener("click", async () => {
  cs.textContent = "0";
  let gameOver = false;
  let level = 1;
  let score = 0;
  while (!gameOver) {
    let arr = new Array();
    await new Promise((resolve) => setTimeout(resolve, 750));
    for (let i = 1; i <= level; i++) {
      let picked = Math.floor(Math.random() * 4);
      arr.push(picked);
      changeColor(picked);
      sounds[picked].play();
      await new Promise((resolve) => setTimeout(resolve, 750));
      revert(picked);
      console.log("test");
      await new Promise((resolve) => setTimeout(resolve, 750));
    }
    console.log(arr);
    let inpArr;
    try {
      const controller = new AbortController();
      inpArr = await new Promise((resolve, reject) => {
        base.addEventListener(
          "click",
          async (e) => {
            e.stopPropagation();
            e.preventDefault();
            console.log(e);
            if (e.target.tagName !== "DIV") return;
            let clicked = Array.from(e.target.attributes)[1].nodeValue;
            clicked = parseInt(clicked);
            console.log("cli", clicked);
            console.log("complete arr : ", arr);
            console.log("arr[0]", arr[0]);
            changeColor(clicked);
            sounds[clicked].play();
            await new Promise((resolve) => setTimeout(resolve, 750));
            revert(clicked);
            if (arr[0] !== clicked) {
              reject(new Error("wrong"));
              controller.abort();
            }
            arr.shift();
            console.log("arr : ", arr, "arr.len", arr.length);
            if (arr.length == 0) {
              resolve(true);
            }
          },
          { signal: controller.signal }
        ); //event listenr
        //console.log(arr.length, inpArr.length);
      }); //promise
    } catch (error) {
      console.log("gameover");
      gameOver = true;
    }
    if (inpArr) {
      console.log("level up");
      score++;
      cs.textContent = `${score}`;
      if (score > highscore) {
        hs.textContent = `${score}`;
      }
      level++;
    }
    // console.log("input ", inpArr);

    // let flag = true;
    // for (let i = 0; i < arr.length; i++) {
    //   if (arr[i] !== inpArr[i]) {
    //     flag = false;
    //     console.log("game OVER!!!");
    //     gameOver = true;
    //     break;
    //   }
    // }
    // if (flag) level++;
  } //end of gameover loop
  if (score > highscore) {
    highscore = score;
    localStorage.setItem("high-score", highscore);
    hs.textContent = `${highscore}`;
  }
  console.log("Final score : ", score);
  endgame.play();
  console.log("final highscore : ", highscore);
  alert("game over");
});
