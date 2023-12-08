chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.action==="interactWithElements") {
		var sRGBHex;
		const active	 = document.activeElement;
		const bgcolor  = window.getComputedStyle(active).backgroundColor;
		const rsRGBHex = /#([\w]{3,8})/;
	
		sRGBHex = bgcolor;

		function tokenize(rgba) {
			var rgbasource,
				expr = /^rgb(a*)\(((\d+),\s*(\d+),\s*(\d+)(,\s*\d+)*)\);*/,
				matched = expr.exec(rgba);
			rgbasource = {r: matched[3], g: matched[4], b: matched[5]};
			if (matched[6]) {
				rgbasource["a"]=matched[6];
			}
			return rgbasource;
		}

		if (!rsRGBHex.test(bgcolor)) {
			sRGBHex=rbgToHex(tokenize(bgcolor));
		}

		function rbgToHex(rgba) {
			var alphaHex, toHex = function(c) {
				const hex = c.toString(16);
				return hex.length === 1 ? '0' + hex : hex;
			};

			for(alphaHex in rgba) {
				rgba[alphaHex]=+rgba[alphaHex];
			}

			alphaHex = rgba['a'] ? toHex(Math.round(rgba.a * 255)) : '';
			return '#' + toHex(rgba.r) + toHex(rgba.g) + toHex(rgba.b) + alphaHex;
		}

		chrome.storage.local.set({[sRGBHex]: true});
	}
});