# Ti.Pano360 (com.caffeina.titanium.pano360)

This is a pure wrapper of the great project [Photo Sphere Viewer](http://photo-sphere-viewer.js.org).

## Installation

#### Via Gittio

```
gittio install com.caffeina.titanium.pano360
```

#### Via Github

Download the latest release and add in your *config.json*, under `dependencies`:

```json
"dependencies": {
    "com.caffeina.titanium.pano360": "*"
}
```

## Usage

In your view XML file:

```xml
<Widget id="my360Widget" src="com.caffeina.titanium.pano360" gyroscope="true" panorama="example.jpg" height="320" />
```

## Initial properties

You can pass the properties as described [here](http://photo-sphere-viewer.js.org/#options) in the Alloy initialization.

At least the `panorama` key is required.

* The `container` key is added automatically.
* The `navbar` key is `false` by default.
* The `gyroscope` key is `false` by default.

## Methods

All methods described in the [original documentation](original documentation) are supported: 

You have just to call (example):

```js
$.my360Widget.zoomIn();
```

## License

MIT
