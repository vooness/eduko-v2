function ExecuteScript(strId)
{
  switch (strId)
  {
      case "6PhipkuRUyR":
        Script1();
        break;
      case "5mjHQt9xmnO":
        Script2();
        break;
      case "6OKhFS3AOsV":
        Script3();
        break;
      case "5jSXZVGsGrf":
        Script4();
        break;
      case "5hi5CYrOHvY":
        Script5();
        break;
      case "6dAVG3MVoyc":
        Script6();
        break;
      case "6EbHtfJz0ZH":
        Script7();
        break;
      case "6Xu9I0ejQGq":
        Script8();
        break;
      case "6KMNMRlS7Aa":
        Script9();
        break;
      case "5WFVr389KwD":
        Script10();
        break;
      case "5sHkKbu6URc":
        Script11();
        break;
      case "5tL3V1fvNvE":
        Script12();
        break;
      case "5o9NLNWcsrg":
        Script13();
        break;
      case "6SLMOVIqUY4":
        Script14();
        break;
      case "6gitD95Ktil":
        Script15();
        break;
      case "5vry0exnjgP":
        Script16();
        break;
      case "6klLdy0MFZ7":
        Script17();
        break;
      case "6nQZGJmYkN8":
        Script18();
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
target.animate([
{ scale: '1' }, { scale: `${1 + pulseAmount}` },
{ scale: '1' }, { scale: `${1 + pulseAmount}` },
{ scale: '1' }
],
  { fill: 'forwards', delay, duration, easing }
), id
);
});
}

window.Script2 = function()
{
  const target = object('67WULISHzKv');
const duration = 10000;
const easing = 'ease-out';
const id = '6SZfMMQJjJG';
const pulseAmount = 0.07;
player.addForTriggers(
id,
target.animate([
{ scale: '1' }, { scale: `${1 + pulseAmount}` },
{ scale: '1' }, { scale: `${1 + pulseAmount}` },
{ scale: '1' }
],
  { fill: 'forwards', duration, easing }
)
);
}

window.Script3 = function()
{
  const target = object('6oeJCJZrb4B');
const duration = 10000;
const easing = 'ease-out';
const id = '6g5kQr3M40H';
const pulseAmount = 0.07;
player.addForTriggers(
id,
target.animate([
{ scale: '1' }, { scale: `${1 + pulseAmount}` },
{ scale: '1' }, { scale: `${1 + pulseAmount}` },
{ scale: '1' }
],
  { fill: 'forwards', duration, easing }
)
);
}

window.Script4 = function()
{
  const target = object('62iTsRfg7my');
const duration = 10000;
const easing = 'ease-out';
const id = '6QO3EMEyBHo';
const pulseAmount = 0.07;
player.addForTriggers(
id,
target.animate([
{ scale: '1' }, { scale: `${1 + pulseAmount}` },
{ scale: '1' }, { scale: `${1 + pulseAmount}` },
{ scale: '1' }
],
  { fill: 'forwards', duration, easing }
)
);
}

};
