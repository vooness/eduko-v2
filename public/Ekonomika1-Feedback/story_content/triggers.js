function ExecuteScript(strId)
{
  switch (strId)
  {
      case "6jllS2BoVD7":
        Script1();
        break;
      case "5wqFwJC967R":
        Script2();
        break;
      case "6eljuc2hOWw":
        Script3();
        break;
      case "5yOjUhIbiCO":
        Script4();
        break;
      case "5tTha0uzZUq":
        Script5();
        break;
      case "5giDEQbLG6c":
        Script6();
        break;
      case "5VD5hrICUbE":
        Script7();
        break;
      case "6GnbcsoKaJO":
        Script8();
        break;
      case "5urVPCRa1OK":
        Script9();
        break;
      case "5mVSFnk6lEA":
        Script10();
        break;
      case "6ogZYWRlHYf":
        Script11();
        break;
      case "5h3hkgZkDHU":
        Script12();
        break;
      case "6XZTwYPq8ts":
        Script13();
        break;
      case "6Z1ErkihTv7":
        Script14();
        break;
      case "5qLHcA1Gmis":
        Script15();
        break;
      case "6ECSDdMHEtI":
        Script16();
        break;
      case "6QRb2F4V7Nu":
        Script17();
        break;
      case "65WzgVCy8y7":
        Script18();
        break;
      case "5ioqbTSmohR":
        Script19();
        break;
      case "6W1qVyMa4wc":
        Script20();
        break;
      case "62Ix0SNYQgk":
        Script21();
        break;
      case "5rkGmKzojCK":
        Script22();
        break;
      case "6CAaS6Cuk0S":
        Script23();
        break;
      case "5r54YyFMjfQ":
        Script24();
        break;
      case "65AFJidp9bL":
        Script25();
        break;
      case "60mxLgVYU33":
        Script26();
        break;
  }
}

window.InitExecuteScripts = function()
{
var player = GetPlayer();
var object = player.object;
var once = player.once;
var addToTimeline = player.addToTimeline;
var setVar = player.SetVar;
var getVar = player.GetVar;
var update = player.update;
var pointerX = player.pointerX;
var pointerY = player.pointerY;
var showPointer = player.showPointer;
var hidePointer = player.hidePointer;
var slideWidth = player.slideWidth;
var slideHeight = player.slideHeight;
window.Script1 = function()
{
  player.once(() => {
const target = object('6mfxhIT0OhN');
const duration = 7000;
const easing = 'ease-out';
const id = '6Cz1u3t2Mof';
const pulseAmount = 0.03;
const delay = 2000;
addToTimeline(
target.animate(
[ {scale: '1' }, 
{scale: `${1 + pulseAmount}` }, 
{scale: '1' }, 
{scale: `${1 + pulseAmount}` }, 
{scale: '1' } ]
,
  { fill: 'forwards', delay, duration, easing }
), id
);
});
}

window.Script2 = function()
{
  const target = object('5tsexK1hiuJ');
const duration = 10000;
const easing = 'ease-out';
const id = '6RP2x57RVio';
const pulseAmount = 0.07;
player.addForTriggers(
id,
target.animate(
[ {scale: '1' }, 
{scale: `${1 + pulseAmount}` }, 
{scale: '1' }, 
{scale: `${1 + pulseAmount}` }, 
{scale: '1' } ]
,
  { fill: 'forwards', duration, easing }
)
);
}

window.Script3 = function()
{
  const target = object('5tuNUCHVs9G');
const duration = 10000;
const easing = 'ease-out';
const id = '66CMoxBdiXX';
const pulseAmount = 0.07;
player.addForTriggers(
id,
target.animate(
[ {scale: '1' }, 
{scale: `${1 + pulseAmount}` }, 
{scale: '1' }, 
{scale: `${1 + pulseAmount}` }, 
{scale: '1' } ]
,
  { fill: 'forwards', duration, easing }
)
);
}

window.Script4 = function()
{
  const target = object('6eHs1cQsgBG');
const duration = 10000;
const easing = 'ease-out';
const id = '5xEBQtZy7Xe';
const pulseAmount = 0.07;
player.addForTriggers(
id,
target.animate(
[ {scale: '1' }, 
{scale: `${1 + pulseAmount}` }, 
{scale: '1' }, 
{scale: `${1 + pulseAmount}` }, 
{scale: '1' } ]
,
  { fill: 'forwards', duration, easing }
)
);
}

};
