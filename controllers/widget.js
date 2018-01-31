var args = _.extend({
	navbar: false,
}, arguments[0] || {});

function toUpperCamelCase(str) {
	return str.substr(0,1).toUpperCase() + str.substr(1).toLowerCase().replace(/-([a-z])/g, function() {
		return arguments[1].toUpperCase();
	});
}

function getHandlerName(eventName) {
	return 'on' + toUpperCamelCase(eventName);
}

function getListenedEvents(cArgs, events) {
	return _.filter(events, function(event) {
		return _.isFunction(cArgs[getHandlerName(event)]);
	});
}

// Create a unique global events tag for this module
var EVENTS_TAG = 'pano360_' + Ti.Platform.createUUID();

// The Photo Sphere View events we can handle.
// You can listen to them passing methods to the widget in the arguments, using the notation "onEventName".
// Example: "panorama-loaded" -> "onPanoramaLoaded"
// It's VERY IMPORTANT that you call this controller's cleanup method if you use one of these handlers.
// DO NOT change these listeners after passing them to the controller.
// DEVELOPER'S NOTE: We do not listen for all the events for performance and stability reason, since App (global) events use is discouraged.
var PSV_EVENTS = [
'panorama-cached',
'panorama-load-progress',
'panorama-loaded',
];

var appEvents = [];

PSV_EVENTS.forEach(function(eventName) {
	handlerName = getHandlerName(eventName);

	if (_.isFunction(args[handlerName])) {
		appEvents.push({
			eventName: eventName,
			appEventName: EVENTS_TAG + ':' + eventName,
			handlerName: handlerName,
			handler: args[handlerName],
		});
	}
});

// A list of attributes to apply directly to the parent WevView
var VIEW_ATTRS = [
'width',
'height',
'top',
'left',
'right',
'bottom',
];

// Get all the Photo Sphere Viewer arguments
var panoArgs = _.omit(args, VIEW_ATTRS.concat(_.map(appEvents, function(event) {
	return event.handlerName;
})));

if (panoArgs.panorama == null) {
	Ti.API.warn('You should pass a panorama key to set the initial image');
}

// Proxy all original Pano360 methods setter
[
'destroy',
'load',
'setPanorama',
'rotate',
'animate',
'zoomIn', 'zoomOut',
'showPanel',
'showTooltip', 'hideTooltip',
'toggleFullscreen',
'startAutorotate', 'stopAutorotate', 'toggleAutorotate',
'startGyroscopeControl', 'stopGyroscopeControl', 'toggleGyroscopeControl',
'startKeyboardControl', 'stopKeyboardControl',
'hideNavbar', 'showNavbar', 'toggleNavbar',
'preloadPanorama',
'clearPanoramaCache',
'setCaption'
].forEach(function(method) {
	exports[method] = function() {
		var call_args = [].slice.call(arguments, 0);
		call_args.unshift(method);
		$.mainView.evalJS('callPSVMethod(' + JSON.stringify(call_args) + ')');
	};
});

// Use getFile to make sure that Ti.Shadow works too.
// Because Ti.Shadow changes files path, but proxies Ti.Filesystem too
$.mainView.url = Ti.Shadow ? Ti.Filesystem.getFile(WPATH('/pano360html/index.html')).resolve() : WPATH('/pano360html/index.html');

// Set all the attributes of the parent WebView, if defined
VIEW_ATTRS.forEach(function(prop) {
	if (args[prop] != null) {
		$.mainView[prop] = args[prop];
	}
});

// Set all the PSV app events, if defined
appEvents.forEach(function(event) {
	Ti.App.addEventListener(event.appEventName, event.handler);
});

// Set up the cleanup public method
$.cleanup = function() {
	appEvents.forEach(function(event) {
		Ti.App.removeEventListener(event.appEventName, event.handler);
	});
};

$.mainView.addEventListener('load', function() {
	var eventEmitters = _.map(appEvents, function(event) {
		return _.pick(event, ['eventName','appEventName']);
	});

	// Init all the things by passing the initial widget arguments
	$.mainView.evalJS('__init(' + JSON.stringify(panoArgs) + ',' + JSON.stringify(eventEmitters) + ')');
});
