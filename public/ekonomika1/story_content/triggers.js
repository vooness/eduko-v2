function ExecuteScript(strId)
{
  switch (strId)
  {
      case "6XJOtweINPr":
        Script1();
        break;
      case "6UzpbX30lHw":
        Script2();
        break;
      case "5dsBF8Y59uv":
        Script3();
        break;
      case "5lmVIJuPVdZ":
        Script4();
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
