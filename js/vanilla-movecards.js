/*
 * Plugin Name: Vanilla-JS Move Cards
 * Version: 0.1.0
 * Plugin URL: https://github.com/Darklg/JavaScriptUtilities
 * JavaScriptUtilities Vanilla-JS may be freely distributed under the MIT license.
 */

var vanillaMoveCards = function(el, settings) {
    'use strict';

    if (!el) {
        return false;
    }

    /* Settings
    -------------------------- */

    settings = typeof settings == 'object' ? settings : {};

    /* Element */
    settings.target = settings.target ||  el;
    settings.attraction = settings.hasOwnProperty('attraction') ? settings.attraction : true;

    /* Animation */
    settings.maxDegrees = settings.maxDegrees || 10;
    settings.functionRotate = settings.functionRotate || defaultFunctionRotate;
    settings.initialDelay = settings.initialDelay || 200;
    settings.scaleLevel = settings.scaleLevel || 1.02;

    /* Shadow */
    settings.boxShadowWidth = settings.boxShadowWidth || '3px';
    settings.boxShadowDivisionFactor = settings.boxShadowDivisionFactor || 4;
    settings.boxShadowColor = settings.boxShadowColor || 'rgba(0,0,0,0.5)';
    settings.boxShadowColorDefault = settings.boxShadowColorDefault || 'rgba(0,0,0,0)';

    /* Internal values */
    settings.elWidth = el.offsetWidth;
    settings.elHeight = el.offsetHeight;
    settings.initialDelayTimeout = false;
    settings.hasDelay = false;

    /* Precompute some values */
    settings.initialDelayMs = (settings.initialDelay + 20) / 1000;

    /* Events
    -------------------------- */

    /* Change size on resize */
    window.addEventListener('resize', function(e) {
        settings.elWidth = settings.target.offsetWidth;
        settings.elHeight = settings.target.offsetHeight;
    });

    /* Reset on mouseenter */
    el.addEventListener('mouseenter', function(e) {
        setDelayMode(1);
        settings.initialDelayTimeout = setTimeout(function() {
            setDelayMode(0);
        }, settings.initialDelay);
    });

    /* Reset on mouseleave */
    el.addEventListener('mouseleave', function(e) {
        setDelayMode(1);
        clearTimeout(settings.initialDelayTimeout);
        settings.initialDelayTimeout = setTimeout(function() {
            setDelayMode(0);
        }, settings.initialDelay);
        settings.functionRotate(settings, 0, 0);
    });

    /* Event on mousemove */
    el.addEventListener('mousemove', computePosition);

    /* Initial mode */
    (function() {
        settings.target.style.willChange = 'transform';
        settings.functionRotate(settings, 0, 0);
        setDelayMode(1);
    }());

    /* Default Helpers
    -------------------------- */

    /* Compute Position */
    function computePosition(e) {
        var _percentX = -1 * (e.offsetX - settings.elWidth / 2) / settings.elWidth * 2 * settings.maxDegrees;
        var _percentY = (e.offsetY - settings.elHeight / 2) / settings.elHeight * 2 * settings.maxDegrees;

        if (!settings.attraction) {
            _percentX *= -1;
            _percentY *= -1;
        }

        settings.functionRotate(settings, _percentX, _percentY);
    }

    /* Effect */
    function defaultFunctionRotate(_settings, _x, _y) {
        var _scale = settings.scaleLevel;

        /* Do not scale if reset or push effect */
        if ((_x === 0 && _y === 0) || !settings.attraction) {
            _scale = 1;
        }

        /* Set Transition */
        var _transitionRule = 'none';
        if (settings.hasDelay) {
            var _transitionRule = 'all ' + settings.initialDelayMs + 's ease';
        }

        _settings.target.style.transition = _transitionRule;
        _settings.target.style.webkitTransition = _transitionRule;

        /* Set Transform */
        var _transformRule = 'scale(' + _scale + ') rotateX(' + _y + 'deg) rotateY(' + _x + 'deg) ';
        _settings.target.style.transform = _transformRule;
        _settings.target.style.webkitTransform = _transformRule;

        /* Set Box Shadow */
        var _boxShadowRule = (_x / settings.boxShadowDivisionFactor * -1) + 'px ' + (_y / settings.boxShadowDivisionFactor) + 'px ' + settings.boxShadowWidth + ' 0 ';
        if (_x === 0 && _y === 0) {
            _boxShadowRule += settings.boxShadowColorDefault;
        }
        else {
            _boxShadowRule += settings.boxShadowColor;
        }
        _settings.target.style.boxShadow = _boxShadowRule;

    }

    function setDelayMode(_value) {
        settings.target.setAttribute('has-delay', _value);
        settings.hasDelay = _value;
    }

}
