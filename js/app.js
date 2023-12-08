import contextmenu from "./contextmenu.js";
var recentColors={}, elems={};
chrome.storage ?
chrome.storage.local.get(null, set) : set(window.localStorage);
function appendColor(sRGBHex) {
	var id 			 = sRGBHex.split("");id.shift();
	var list 		 = document.createElement("li");
	var theme 	 = document.createElement("div");
	id 					 = "#_" + id.join("");
	var hexa 		 = theme.cloneNode(true);
	var hasColor = document.querySelector(id);

	if (hasColor) return;

	list.dataset["srgbhex"]=sRGBHex;
	theme.classList.add("theme");
	hexa.innerHTML=sRGBHex;
	hexa.classList.add("hexa");
	list.id=id.slice(1);
	elems[sRGBHex]=list;
	theme.style.backgroundColor=sRGBHex;
	list.append(theme, hexa);
	document.querySelector("ul").append(list);
	return true;
}
function set(data) {
	var src = {}, sRGBHex, rsRGBHex = /#([\w]{3,8})/;
	for (sRGBHex in data) {
		if (rsRGBHex.test(sRGBHex)) {
			src[sRGBHex]=true;
			recentColors[sRGBHex]=true;
		}
	}
	loadRecentColor(src);
}
function scrollVisible() {
	var scroller = document.querySelector(".colors-wrap"), clientHeight, scrollHeight;
	clientHeight = scroller.clientHeight;
	scrollHeight = scroller.scrollHeight;
	if (scrollHeight > clientHeight) {
		scroller.scrollTop=scrollHeight-clientHeight;
	}
}
document.addEventListener("visibilitychange", hideContextMenu);
document.querySelector(".year").innerHTML=new Date().getFullYear();
document.querySelector(".colors-wrap")
	.addEventListener("contextmenu", function(e) {
	e.preventDefault();
});
function executeContext() {
	document.querySelectorAll(".rcw li").forEach(function(elem) {
		elem.addEventListener("contextmenu", function(e) {
			contextmenuHandler(e);
		});
	});
}
async function copysRGBHex(sRGBHex) {
	try {
		await window.navigator.clipboard.writeText(sRGBHex);
		var copy = document.querySelector(".copied");
		copy.classList.add("active");
		setTimeout(function() {copy.classList.remove("active")}, 1000);
	} catch(e) {}
}
function hideContextMenu() {
	document.querySelector(".context") &&
	document.querySelector(".context").parentElement.remove();
}
function loadRecentColor(src) {
	var sRGBHex;
	for (sRGBHex in src) appendColor(sRGBHex);
	executeContext();
}
chrome.storage && (document.body.style.display="initial");
function contextmenuHandler(e) {
	var context = document.querySelector(".context"),
		span 			= document.createElement("span");

	span.innerHTML=contextmenu;
	!context && document.body.prepend(span);

	var copylist = document.querySelector("#copyhex"),
		dellist		 = document.querySelector("#delhex"),
		delall		 = document.querySelector("#delallhex");

	var x, y, prop, props={}, unit="px", toggleWidth,
		toggleHeight, appWidth, appHeight, sRGBHex;

	props.left=props.right=props.top=props.bottom="initial";
	x = e.clientX;
	y = e.clientY;

	context = document.querySelector(".context");

	toggleHeight = context.clientHeight;
	toggleWidth	 = context.clientWidth;

	appWidth 	= document.body.clientWidth;
	appHeight = document.body.clientHeight;

	x + toggleWidth > appWidth ? (props.right=appWidth-x) : (props.left=x);
	y + toggleHeight > appHeight ? (props.bottom=appHeight-y) : (props.top=y);

	for (prop in props) {
		context.style[prop]=props[prop] + unit;
	}

	delall.addEventListener("click", function() {
		hideContextMenu();
		for (sRGBHex in recentColors) {
			deleteRGBHex(sRGBHex, elems[sRGBHex]||document.querySelector("#_" + sRGBHex.slice(1)));
		}
	});

	copylist.addEventListener("click", function() {
		copysRGBHex(e.target.dataset["srgbhex"]);
		hideContextMenu();
	});

	dellist.addEventListener("click", function() {
		deleteRGBHex(e.target.dataset["srgbhex"], e.target);
		hideContextMenu();
	});

	document.addEventListener("pointerdown", function(e) {
		e.stopImmediatePropagation();
		e.stopPropagation();
		!e.target.dataset["context"] && hideContextMenu();
	}, {capture: false});
}
document.querySelector("#pickerButton").addEventListener("click", function() {
	const colorPicker = new EyeDropper();
	colorPicker.open().then(function(data) {
		const sRGBHex = data.sRGBHex;
		if (appendColor(sRGBHex)) {
			executeContext();
			chrome.storage ?
			chrome.storage.local.set({[sRGBHex]: sRGBHex}) :
				window.localStorage.setItem(sRGBHex, sRGBHex);
			scrollVisible();
			copysRGBHex(sRGBHex);
			recentColors[sRGBHex]=true;
		}
	});
});
function deleteRGBHex(sRGBHex, elem) {
	elem.remove();
	chrome.storage ?
	chrome.storage.local.remove(sRGBHex) : window.localStorage.removeItem(sRGBHex);
}