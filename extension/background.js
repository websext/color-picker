var contextId="color-picker" + 1 * Date.now();
chrome.contextMenus.create({
	id: contextId,
	title: "Color Picker",
	contexts: ["page"]
});
chrome.contextMenus.onClicked.addListener(function(info, tab) {
	if (info.menuItemId===contextId) {
		chrome.tabs.sendMessage(tab.id, {action: "interactWithElements"});
	}
});