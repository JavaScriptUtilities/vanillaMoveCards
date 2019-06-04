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

    /* Settings */
    settings.target = settings.target ||  el;
    settings.maxDegrees = settings.maxDegrees || 10;
    settings.attraction = settings.hasOwnProperty('attraction') ? settings.attraction : true;
    settings.functionRotate = settings.functionRotate || defaultFunctionRotate;

    /* Internal values */
    settings.elWidth = el.offsetWidth;
    settings.elHeight = el.offsetHeight;

    /* Events
    -------------------------- */

    /* Change size on resize */
    window.addEventListener('resize', function(e) {
        settings.elWidth = settings.target.offsetWidth;
        settings.elHeight = settings.target.offsetHeight;
    });

    /* Reset on mouseleave */
    el.addEventListener('mouseleave', function(e) {
        settings.functionRotate(settings, 0, 0);
    });

    /* Event on mousemove */
    el.addEventListener('mousemove', computePosition);

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
        _settings.target.style.transform = 'rotateX(' + _y + 'deg) rotateY(' + _x + 'deg) ';
        _settings.target.style.boxShadow = (_x / 10 * -1) + 'px ' + (_y / 10) + 'px 3px 0 rgba(0,0,0,0.95)';
    }

}
