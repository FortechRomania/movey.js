# movey.js
Pan and zoom SVG (or anything really)

## Install
Download and include movey.js in your scripts.

## Usage
#### Grab a target
Hook up movey to a target you want to interact with by using `data-movey-target` attribute.
#### Use reset
Use `data-movey-reset` attribute on a button which you want to use for reseting your target back to the initial position.
#### Custom settings
Movey exposes 2 methods for setting and getting settings.
##### `getSettings()`
Straight forward, returns the _settings_ object.
##### `useSettings()`
You can override the default settings by calling `useSettings()` and passing in an object with your settings.
The default settings object looks like this:
```javascript
{
  zoomMin: 0.5, // minimum zoom out 
  zoomMax: 3, // maxium zoom in
  zoomStep: 0.2, // how much one step zooms
  transitionAllowed: true, // is transition allowed ?
  transitionString: 'transform .3s linear' // the transition string which is used if transitionAllowed is true
}
```
