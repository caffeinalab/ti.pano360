var args = _.extend({
	navbar: false,
}, arguments[0] || {});

if (args.panorama == null) {
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

// Special properties related to Titanium
[ 'width', 'height', 'top', 'left', 'right', 'bottom' ].forEach(function(prop) {
	if (args[prop] != null) {
		$.mainView[prop] = args[prop];
		delete args[prop];
	}
});

$.mainView.addEventListener('load', function() {
	// Init all the things by passing the initial widget arguments
	$.mainView.evalJS('__init(' + JSON.stringify(args) + ')');
});
