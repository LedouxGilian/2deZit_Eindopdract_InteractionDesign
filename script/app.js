let html_app, html_toggle, canvas, ctx, radius;
let mode;

const showTimeInformation = async () => {
    html_app = document.querySelector(".js-app");

    url = "http://worldtimeapi.org/api/timezone/Europe/Brussels";
    const data = await fetch(url).then(response => response.json()).catch(error => console.error("An error occured: ", error));

    console.log(data);
    updateTime(data);
};

function updateTime(data) {
    const display = document.getElementById('clock');
    const date = new Date(data.datetime);

    const hour = formatTime(date.getHours());
    const minutes = formatTime(date.getMinutes());
    const seconds = formatTime(date.getSeconds());

    if(mode) {
        display.innerHTML=`<canvas id="canvas" width="400" height="400"></canvas>`

        canvas = document.getElementById("canvas");
        ctx = canvas.getContext("2d");
        radius = canvas.height / 2;
        ctx.translate(radius, radius);
        radius = radius * 0.90

        drawClock(date);
    } else {
        display.innerText=`${hour} : ${minutes} : ${seconds}`
    } 
}

function formatTime(time) {
    if ( time < 10 ) {
        return '0' + time;
    }
    return time;
}

const changeMode = () => {
    if(mode) {
        mode = false;
    } else {
        mode = true;
    }

    showTimeInformation();
};

function drawClock(date) {
    drawFace(ctx, radius);
    drawNumbers(ctx, radius);
    drawTime(ctx, radius, date);
  }
  
  function drawFace(ctx, radius) {
    var grad;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2*Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();
    grad = ctx.createRadialGradient(0,0,radius*0.95, 0,0,radius*1.05);
    grad.addColorStop(0, '#333');
    grad.addColorStop(0.5, 'white');
    grad.addColorStop(1, '#333');
    ctx.strokeStyle = grad;
    ctx.lineWidth = radius*0.1;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, radius*0.1, 0, 2*Math.PI);
    ctx.fillStyle = '#333';
    ctx.fill();
  }
  
  function drawNumbers(ctx, radius) {
    let ang;
    let num;
    ctx.font = radius*0.15 + "px arial";
    ctx.textBaseline="middle";
    ctx.textAlign="center";
    for(num = 1; num < 13; num++){
      ang = num * Math.PI / 6;
      ctx.rotate(ang);
      ctx.translate(0, -radius*0.85);
      ctx.rotate(-ang);
      ctx.fillText(num.toString(), 0, 0);
      ctx.rotate(ang);
      ctx.translate(0, radius*0.85);
      ctx.rotate(-ang);
    }
  }
  
  function drawTime(ctx, radius, date){
      let hour = date.getHours();
      let minute = date.getMinutes();
      let second = date.getSeconds();
      //hour
      hour=hour%12;
      hour=(hour*Math.PI/6)+
      (minute*Math.PI/(6*60))+
      (second*Math.PI/(360*60));
      drawHand(ctx, hour, radius*0.5, radius*0.07);
      //minute
      minute=(minute*Math.PI/30)+(second*Math.PI/(30*60));
      drawHand(ctx, minute, radius*0.8, radius*0.07);
      // second
      second=(second*Math.PI/30);
      drawHand(ctx, second, radius*0.9, radius*0.02);
  }
  
  function drawHand(ctx, pos, length, width) {
      ctx.beginPath();
      ctx.lineWidth = width;
      ctx.lineCap = "round";
      ctx.moveTo(0,0);
      ctx.rotate(pos);
      ctx.lineTo(0, -length);
      ctx.stroke();
      ctx.rotate(-pos);
  }

const init = () => {
    html_toggle = document.querySelector(".js-analog");

    mode = false;
    html_toggle.addEventListener("click", changeMode);
    setInterval(showTimeInformation, 1000);
};

document.addEventListener("DOMContentLoaded", init);
