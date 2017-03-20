var args = _.extend({
	navbar: false,
}, arguments[0] || {});

if (args.panorama == null) {
	Ti.API.warn('You should pass a panorama key to set the initial image');
}

// Name of the proxy events
var WNAME = 'com.caffeina.titanium.pano360';

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
		Ti.App.fireEvent(WNAME, {
			method: method,
			args: arguments // JS arguments property
		});
	};
});

// Use getFile to make sure that Ti.Shadow works too.
// Because Ti.Shadow changes files path, but proxies Ti.Filesystem too
$.mainView.url = Ti.Filesystem.getFile(WPATH('/pano360html/index.html')).resolve();

// Special properties related to Titanium
[ 'width', 'height', 'top', 'left', 'right', 'bottom' ].forEach(function(prop) {
	if (args[prop] != null) {
		$.mainView[prop] = args[prop];
		delete args[prop];
	}
});

$.mainView.addEventListener('load', function() {
	// Init all the things by passing the initial widget arguments
	Ti.App.fireEvent(WNAME, {
		method: '__init__',
		args: args
	});
});