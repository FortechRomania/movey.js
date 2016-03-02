var Movey = ( function () {
	'use strict';

	//// Default Settings ////
	var settings = {
		zoomMin: 0.5,
		zoomMax: 3,
		zoomStep: 0.2,
		transitionAllowed: true,
		transitionString: 'transform .3s linear'
	};

	//// Get the target and the reset trigger ////
	var targetElement = document.querySelector( '[data-movey-target]' ),
		resetTrigger = document.querySelector( '[data-movey-reset]' );

	// Pick up user settings ////
	var useSettings = function ( newSettings ) {
		if ( typeof newSettings === 'object' ) {
			Object.keys( newSettings ).forEach( function ( option ) {
				settings[ option ] = newSettings[ option ];
			} );
		} else console.log( 'Wrong seettings type. Should be non-empty object literal.' );
	};

	var getSettings = function () {
		return settings;
	};

	//// Set transform parameters ////
	var ref = { // Reference points
		x: null,
		y: null
	};
	var transforms = { // Transforms state
		scale: 1,
		translateX: 0,
		translateY: 0
	};

	var intialTransforms = JSON.stringify( transforms ); // Making a copy of the inital state

	//// Applying transform ////
	var applyTransforms = function () {
		targetElement.style.transform = Object.keys( transforms ).map( function ( t ) {
			return t + '(' + transforms[ t ] + ')';
		} ).join( ' ' );
		targetElement.style.webkitTransform = Object.keys( transforms ).map( function ( t ) {
			return t + '(' + transforms[ t ] + ')';
		} ).join( ' ' );
	};

	//// Touch zoom ////
	var customZoom = function ( svgElement ) {
		zoom( {
			preventDefault: function () {},
			targetElement: svgElement
		}, 'click' );
	};

	//// Mouse zoom ////
	var zoom = function ( event, flag ) {
		event.preventDefault();

		if ( settings.transitionAllowed ) {
			targetElement.style.transition = settings.transitionString;
			targetElement.style.webkitTransition = settings.transitionString;
		}

		var timeOutScale;

		if ( JSON.stringify( transforms ) === intialTransforms ) {
			timeOutScale = 0;
		} else timeOutScale = 850;

		if ( ( event.deltaY < 0 || parseInt( event.scale > 0 ) ) && transforms.scale < settings.zoomMax || flag === 'click' ) {
			if ( flag === 'click' ) {
				reset();
				setTimeout( function () {
					var container = targetElement.parentElement,
						rect = container.getBoundingClientRect(),
						shape = event.target.getBoundingClientRect(),
						cx = shape.left + shape.width / 2 - rect.left,
						cy = shape.top + shape.height / 2 - rect.top;

					ref.x = rect.width / 2;
					ref.y = rect.height / 2;

					var tX = ref.x - cx,
						tY = ref.y - cy;

					transforms.scale = settings.zoomMax;
					transforms.translateX = tX + 'px';
					transforms.translateY = tY + 'px';
					applyTransforms();
				}, timeOutScale );
			} else {
				transforms.scale += settings.zoomStep;
				applyTransforms();
			}

		} else if ( ( event.deltaY > 0 || parseInt( event.scale < 0 ) ) && transforms.scale > settings.zoomMin ) {
			transforms.scale -= settings.zoomStep;
			applyTransforms();
		}
	};

	//// Moving ////
	var mouseDown = function ( event ) {
		var cx = event.pageX || event.targetTouches[ 0 ].pageX,
			cy = event.pageY || event.targetTouches[ 0 ].pageY;

		targetElement.style.transition = 'none';
		targetElement.style.webkitTransition = 'none';
		ref.x = cx - parseInt( transforms.translateX ) * transforms.scale;
		ref.y = cy - parseInt( transforms.translateY ) * transforms.scale;
		window.addEventListener( 'mousemove', move );
		targetElement.parentElement.addEventListener( 'touchmove', move );

	};
	var move = function ( event ) {
		event.preventDefault();
		var cx = event.pageX || event.targetTouches[ 0 ].pageX,
			cy = event.pageY || event.targetTouches[ 0 ].pageY;

		targetElement.style.pointerEvents = 'none';
		transforms.translateX = ( cx - ref.x ) / transforms.scale + 'px';
		transforms.translateY = ( cy - ref.y ) / transforms.scale + 'px';

		if ( event.targetTouches ) {
			transforms.scale = settings.zoomMax;
		}

		applyTransforms();
	};
	var mouseUp = function () {
		targetElement.style.pointerEvents = 'auto';
		window.removeEventListener( 'mousemove', move );
		targetElement.parentElement.removeEventListener( 'touchmove', move );
	};

	//// Reset ////
	var reset = function () {
		if ( settings.transitionAllowed ) {
			targetElement.style.transition = settings.transitionString;
			targetElement.style.webkitTransition = settings.transitionString;
		}
		transforms = JSON.parse( intialTransforms );
		applyTransforms();
	};

	//// Listening ////
	try {
		if ( targetElement ) {
			targetElement.addEventListener( 'wheel', zoom );
			targetElement.addEventListener( 'mousedown', mouseDown );
			window.addEventListener( 'mouseup', mouseUp );
			targetElement.parentElement.addEventListener( 'touchstart', mouseDown );
			window.addEventListener( 'touchend', mouseUp );
		} else {
			throw ( 'MPZ: no target provided. Use data-movey-target.' );
		}
		if ( resetTrigger ) {
			resetTrigger.addEventListener( 'click', reset );
		} else {
			throw ( 'MPZ: no reset trigger provided, reset will not work. Use data-movey-reset.' );
		}
	} catch ( e ) {
		console.log( e );
	}

	return {
		useSettings: useSettings,
		getSettings: getSettings
	};

} )();