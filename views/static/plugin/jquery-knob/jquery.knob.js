// /*!jQuery Knob*/
// /**
//  * Downward compatible, touchable dial
//  *
//  * Version: 1.2.11
//  * Requires: jQuery v1.7+
//  *
//  * Copyright (c) 2012 Anthony Terrien
//  * Under MIT License (http://www.opensource.org/licenses/mit-license.php)
//  *
//  * Thanks to vor, eskimoblood, spiffistan, FabrizioC
//  */
// (function (factory) {
//     if (typeof exports === 'object') {
//         // CommonJS
//         module.exports = factory(require('jquery'));
//     } else if (typeof define === 'function' && define.amd) {
//         // AMD. Register as an anonymous module.
//         define(['jquery'], factory);
//     } else {
//         // Browser globals
//         factory(jQuery);
//     }
// }(function ($) {
//
//     /**
//      * Kontrol library
//      */
//     "use strict";
//
//     /**
//      * Definition of globals and core
//      */
//     var k = {}, // kontrol
//         max = Math.max,
//         min = Math.min;
//
//     k.c = {};
//     k.c.d = $(document);
//     k.c.t = function (e) {
//         return e.originalEvent.touches.length - 1;
//     };
//
//     /**
//      * Kontrol Object
//      *
//      * Definition of an abstract UI control
//      *
//      * Each concrete component must call this one.
//      * <code>
//      * k.o.call(this);
//      * </code>
//      */
//     k.o = function () {
//         var s = this;
//
//         this.o = null; // array of options
//         this.$ = null; // jQuery wrapped element
//         this.i = null; // mixed HTMLInputElement or array of HTMLInputElement
//         this.g = null; // deprecated 2D graphics context for 'pre-rendering'
//         this.v = null; // value ; mixed array or integer
//         this.cv = null; // change value ; not commited value
//         this.x = 0; // canvas x position
//         this.y = 0; // canvas y position
//         this.w = 0; // canvas width
//         this.h = 0; // canvas height
//         this.$c = null; // jQuery canvas element
//         this.c = null; // rendered canvas context
//         this.t = 0; // touches index
//         this.isInit = false;
//         this.fgColor = null; // main color
//         this.pColor = null; // previous color
//         this.dH = null; // draw hook
//         this.cH = null; // change hook
//         this.eH = null; // cancel hook
//         this.rH = null; // release hook
//         this.scale = 1; // scale factor
//         this.relative = false;
//         this.relativeWidth = false;
//         this.relativeHeight = false;
//         this.$div = null; // component div
//
//         this.run = function () {
//             var cf = function (e, conf) {
//                 var k;
//                 for (k in conf) {
//                     s.o[k] = conf[k];
//                 }
//                 s._carve().init();
//                 s._configure()
//                  ._draw();
//             };
//
//             if (this.$.data('kontroled')) return;
//             this.$.data('kontroled', true);
//
//             this.extend();
//             this.o = $.extend({
//                     // Config
//                     min: this.$.data('min') !== undefined ? this.$.data('min') : 0,
//                     max: this.$.data('max') !== undefined ? this.$.data('max') : 100,
//                     stopper: true,
//                     readOnly: this.$.data('readonly') || (this.$.attr('readonly') === 'readonly'),
//
//                     // UI
//                     cursor: this.$.data('cursor') === true && 30
//                             || this.$.data('cursor') || 0,
//                     thickness: this.$.data('thickness')
//                                && Math.max(Math.min(this.$.data('thickness'), 1), 0.01)
//                                || 0.35,
//                     lineCap: this.$.data('linecap') || 'butt',
//                     width: this.$.data('width') || 200,
//                     height: this.$.data('height') || 200,
//                     displayInput: this.$.data('displayinput') == null || this.$.data('displayinput'),
//                     displayPrevious: this.$.data('displayprevious'),
//                     fgColor: this.$.data('fgcolor') || '#87CEEB',
//                     inputColor: this.$.data('inputcolor'),
//                     font: this.$.data('font') || 'Arial',
//                     fontWeight: this.$.data('font-weight') || 'bold',
//                     inline: false,
//                     step: this.$.data('step') || 1,
//                     rotation: this.$.data('rotation'),
//
//                     // Hooks
//                     draw: null, // function () {}
//                     change: null, // function (value) {}
//                     cancel: null, // function () {}
//                     release: null, // function (value) {}
//
//                     // Output formatting, allows to add unit: %, ms ...
//                     format: function(v) {
//                         return v;
//                     },
//                     parse: function (v) {
//                         return parseFloat(v);
//                     }
//                 }, this.o
//             );
//
//             // finalize options
//             this.o.flip = this.o.rotation === 'anticlockwise' || this.o.rotation === 'acw';
//             if (!this.o.inputColor) {
//                 this.o.inputColor = this.o.fgColor;
//             }
//
//             // routing value
//             if (this.$.is('fieldset')) {
//
//                 // fieldset = array of integer
//                 this.v = {};
//                 this.i = this.$.find('input');
//                 this.i.each(function(k) {
//                     var $this = $(this);
//                     s.i[k] = $this;
//                     s.v[k] = s.o.parse($this.val());
//
//                     $this.bind(
//                         'change blur',
//                         function () {
//                             var val = {};
//                             val[k] = $this.val();
//                             s.val(s._validate(val));
//                         }
//                     );
//                 });
//                 this.$.find('legend').remove();
//             } else {
//
//                 // input = integer
//                 this.i = this.$;
//                 this.v = this.o.parse(this.$.val());
//                 this.v === '' && (this.v = this.o.min);
//                 this.$.bind(
//                     'change blur',
//                     function () {
//                         s.val(s._validate(s.o.parse(s.$.val())));
//                     }
//                 );
//
//             }
//
//             !this.o.displayInput && this.$.hide();
//
//             // adds needed DOM elements (canvas, div)
//             this.$c = $(document.createElement('canvas')).attr({
//                 width: this.o.width,
//                 height: this.o.height
//             });
//
//             // wraps all elements in a div
//             // add to DOM before Canvas init is triggered
//             this.$div = $('<div style="'
//                 + (this.o.inline ? 'display:inline;' : '')
//                 + 'width:' + this.o.width + 'px;height:' + this.o.height + 'px;'
//                 + '"></div>');
//
//             this.$.wrap(this.$div).before(this.$c);
//             this.$div = this.$.parent();
//
//             if (typeof G_vmlCanvasManager !== 'undefined') {
//                 G_vmlCanvasManager.initElement(this.$c[0]);
//             }
//
//             this.c = this.$c[0].getContext ? this.$c[0].getContext('2d') : null;
//
//             if (!this.c) {
//                 throw {
//                     name:        "CanvasNotSupportedException",
//                     message:     "Canvas not supported. Please use excanvas on IE8.0.",
//                     toString:    function(){return this.name + ": " + this.message}
//                 }
//             }
//
//             // hdpi support
//             this.scale = (window.devicePixelRatio || 1) / (
//                             this.c.webkitBackingStorePixelRatio ||
//                             this.c.mozBackingStorePixelRatio ||
//                             this.c.msBackingStorePixelRatio ||
//                             this.c.oBackingStorePixelRatio ||
//                             this.c.backingStorePixelRatio || 1
//                          );
//
//             // detects relative width / height
//             this.relativeWidth =  this.o.width % 1 !== 0
//                                   && this.o.width.indexOf('%');
//             this.relativeHeight = this.o.height % 1 !== 0
//                                   && this.o.height.indexOf('%');
//             this.relative = this.relativeWidth || this.relativeHeight;
//
//             // computes size and carves the component
//             this._carve();
//
//             // prepares props for transaction
//             if (this.v instanceof Object) {
//                 this.cv = {};
//                 this.copy(this.v, this.cv);
//             } else {
//                 this.cv = this.v;
//             }
//
//             // binds configure event
//             this.$
//                 .bind("configure", cf)
//                 .parent()
//                 .bind("configure", cf);
//
//             // finalize init
//             this._listen()
//                 ._configure()
//                 ._xy()
//                 .init();
//
//             this.isInit = true;
//
//             this.$.val(this.o.format(this.v));
//             this._draw();
//
//             return this;
//         };
//
//         this._carve = function() {
//             if (this.relative) {
//                 var w = this.relativeWidth ?
//                         this.$div.parent().width() *
//                         parseInt(this.o.width) / 100
//                         : this.$div.parent().width(),
//                     h = this.relativeHeight ?
//                         this.$div.parent().height() *
//                         parseInt(this.o.height) / 100
//                         : this.$div.parent().height();
//
//                 // apply relative
//                 this.w = this.h = Math.min(w, h);
//             } else {
//                 this.w = this.o.width;
//                 this.h = this.o.height;
//             }
//
//             // finalize div
//             this.$div.css({
//                 'width': this.w + 'px',
//                 'height': this.h + 'px'
//             });
//
//             // finalize canvas with computed width
//             this.$c.attr({
//                 width: this.w,
//                 height: this.h
//             });
//
//             // scaling
//             if (this.scale !== 1) {
//                 this.$c[0].width = this.$c[0].width * this.scale;
//                 this.$c[0].height = this.$c[0].height * this.scale;
//                 this.$c.width(this.w);
//                 this.$c.height(this.h);
//             }
//
//             return this;
//         };
//
//         this._draw = function () {
//
//             // canvas pre-rendering
//             var d = true;
//
//             s.g = s.c;
//
//             s.clear();
//
//             s.dH && (d = s.dH());
//
//             d !== false && s.draw();
//         };
//
//         this._touch = function (e) {
//             var touchMove = function (e) {
//                 var v = s.xy2val(
//                             e.originalEvent.touches[s.t].pageX,
//                             e.originalEvent.touches[s.t].pageY
//                         );
//
//                 if (v == s.cv) return;
//
//                 if (s.cH && s.cH(v) === false) return;
//
//                 s.change(s._validate(v));
//                 s._draw();
//             };
//
//             // get touches index
//             this.t = k.c.t(e);
//
//             // First touch
//             touchMove(e);
//
//             // Touch events listeners
//             k.c.d
//                 .bind("touchmove.k", touchMove)
//                 .bind(
//                     "touchend.k",
//                     function () {
//                         k.c.d.unbind('touchmove.k touchend.k');
//                         s.val(s.cv);
//                     }
//                 );
//
//             return this;
//         };
//
//         this._mouse = function (e) {
//             var mouseMove = function (e) {
//                 var v = s.xy2val(e.pageX, e.pageY);
//
//                 if (v == s.cv) return;
//
//                 if (s.cH && (s.cH(v) === false)) return;
//
//                 s.change(s._validate(v));
//                 s._draw();
//             };
//
//             // First click
//             mouseMove(e);
//
//             // Mouse events listeners
//             k.c.d
//                 .bind("mousemove.k", mouseMove)
//                 .bind(
//                     // Escape key cancel current change
//                     "keyup.k",
//                     function (e) {
//                         if (e.keyCode === 27) {
//                             k.c.d.unbind("mouseup.k mousemove.k keyup.k");
//
//                             if (s.eH && s.eH() === false)
//                                 return;
//
//                             s.cancel();
//                         }
//                     }
//                 )
//                 .bind(
//                     "mouseup.k",
//                     function (e) {
//                         k.c.d.unbind('mousemove.k mouseup.k keyup.k');
//                         s.val(s.cv);
//                     }
//                 );
//
//             return this;
//         };
//
//         this._xy = function () {
//             var o = this.$c.offset();
//             this.x = o.left;
//             this.y = o.top;
//
//             return this;
//         };
//
//         this._listen = function () {
//             if (!this.o.readOnly) {
//                 this.$c
//                     .bind(
//                         "mousedown",
//                         function (e) {
//                             e.preventDefault();
//                             s._xy()._mouse(e);
//                         }
//                     )
//                     .bind(
//                         "touchstart",
//                         function (e) {
//                             e.preventDefault();
//                             s._xy()._touch(e);
//                         }
//                     );
//
//                 this.listen();
//             } else {
//                 this.$.attr('readonly', 'readonly');
//             }
//
//             if (this.relative) {
//                 $(window).resize(function() {
//                     s._carve().init();
//                     s._draw();
//                 });
//             }
//
//             return this;
//         };
//
//         this._configure = function () {
//
//             // Hooks
//             if (this.o.draw) this.dH = this.o.draw;
//             if (this.o.change) this.cH = this.o.change;
//             if (this.o.cancel) this.eH = this.o.cancel;
//             if (this.o.release) this.rH = this.o.release;
//
//             if (this.o.displayPrevious) {
//                 this.pColor = this.h2rgba(this.o.fgColor, "0.4");
//                 this.fgColor = this.h2rgba(this.o.fgColor, "0.6");
//             } else {
//                 this.fgColor = this.o.fgColor;
//             }
//
//             return this;
//         };
//
//         this._clear = function () {
//             this.$c[0].width = this.$c[0].width;
//         };
//
//         this._validate = function (v) {
//             var val = (~~ (((v < 0) ? -0.5 : 0.5) + (v/this.o.step))) * this.o.step;
//             return Math.round(val * 100) / 100;
//         };
//
//         // Abstract methods
//         this.listen = function () {}; // on start, one time
//         this.extend = function () {}; // each time configure triggered
//         this.init = function () {}; // each time configure triggered
//         this.change = function (v) {}; // on change
//         this.val = function (v) {}; // on release
//         this.xy2val = function (x, y) {}; //
//         this.draw = function () {}; // on change / on release
//         this.clear = function () { this._clear(); };
//
//         // Utils
//         this.h2rgba = function (h, a) {
//             var rgb;
//             h = h.substring(1,7);
//             rgb = [
//                 parseInt(h.substring(0,2), 16),
//                 parseInt(h.substring(2,4), 16),
//                 parseInt(h.substring(4,6), 16)
//             ];
//
//             return "rgba(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + "," + a + ")";
//         };
//
//         this.copy = function (f, t) {
//             for (var i in f) {
//                 t[i] = f[i];
//             }
//         };
//     };
//
//
//     /**
//      * k.Dial
//      */
//     k.Dial = function () {
//         k.o.call(this);
//
//         this.startAngle = null;
//         this.xy = null;
//         this.radius = null;
//         this.lineWidth = null;
//         this.cursorExt = null;
//         this.w2 = null;
//         this.PI2 = 2*Math.PI;
//
//         this.extend = function () {
//             this.o = $.extend({
//                 bgColor: this.$.data('bgcolor') || '#EEEEEE',
//                 angleOffset: this.$.data('angleoffset') || 0,
//                 angleArc: this.$.data('anglearc') || 360,
//                 inline: true
//             }, this.o);
//         };
//
//         this.val = function (v, triggerRelease) {
//             if (null != v) {
//
//                 // reverse format
//                 v = this.o.parse(v);
//
//                 if (triggerRelease !== false
//                     && v != this.v
//                     && this.rH
//                     && this.rH(v) === false) { return; }
//
//                 this.cv = this.o.stopper ? max(min(v, this.o.max), this.o.min) : v;
//                 this.v = this.cv;
//                 this.$.val(this.o.format(this.v));
//                 this._draw();
//             } else {
//                 return this.v;
//             }
//         };
//
//         this.xy2val = function (x, y) {
//             var a, ret;
//
//             a = Math.atan2(
//                         x - (this.x + this.w2),
//                         - (y - this.y - this.w2)
//                     ) - this.angleOffset;
//
//             if (this.o.flip) {
//                 a = this.angleArc - a - this.PI2;
//             }
//
//             if (this.angleArc != this.PI2 && (a < 0) && (a > -0.5)) {
//
//                 // if isset angleArc option, set to min if .5 under min
//                 a = 0;
//             } else if (a < 0) {
//                 a += this.PI2;
//             }
//
//             ret = (a * (this.o.max - this.o.min) / this.angleArc) + this.o.min;
//
//             this.o.stopper && (ret = max(min(ret, this.o.max), this.o.min));
//
//             return ret;
//         };
//
//         this.listen = function () {
//
//             // bind MouseWheel
//             var s = this, mwTimerStop,
//                 mwTimerRelease,
//                 mw = function (e) {
//                     e.preventDefault();
//
//                     var ori = e.originalEvent,
//                         deltaX = ori.detail || ori.wheelDeltaX,
//                         deltaY = ori.detail || ori.wheelDeltaY,
//                         v = s._validate(s.o.parse(s.$.val()))
//                             + (
//                                 deltaX > 0 || deltaY > 0
//                                 ? s.o.step
//                                 : deltaX < 0 || deltaY < 0 ? -s.o.step : 0
//                               );
//
//                     v = max(min(v, s.o.max), s.o.min);
//
//                     s.val(v, false);
//
//                     if (s.rH) {
//                         // Handle mousewheel stop
//                         clearTimeout(mwTimerStop);
//                         mwTimerStop = setTimeout(function () {
//                             s.rH(v);
//                             mwTimerStop = null;
//                         }, 100);
//
//                         // Handle mousewheel releases
//                         if (!mwTimerRelease) {
//                             mwTimerRelease = setTimeout(function () {
//                                 if (mwTimerStop)
//                                     s.rH(v);
//                                 mwTimerRelease = null;
//                             }, 200);
//                         }
//                     }
//                 },
//                 kval,
//                 to,
//                 m = 1,
//                 kv = {
//                     37: -s.o.step,
//                     38: s.o.step,
//                     39: s.o.step,
//                     40: -s.o.step
//                 };
//
//             this.$
//                 .bind(
//                     "keydown",
//                     function (e) {
//                         var kc = e.keyCode;
//
//                         // numpad support
//                         if (kc >= 96 && kc <= 105) {
//                             kc = e.keyCode = kc - 48;
//                         }
//
//                         kval = parseInt(String.fromCharCode(kc));
//
//                         if (isNaN(kval)) {
//                             (kc !== 13)                     // enter
//                             && kc !== 8                     // bs
//                             && kc !== 9                     // tab
//                             && kc !== 189                   // -
//                             && (kc !== 190
//                                 || s.$.val().match(/\./))   // . allowed once
//                             && e.preventDefault();
//
//                             // arrows
//                             if ($.inArray(kc,[37,38,39,40]) > -1) {
//                                 e.preventDefault();
//
//                                 var v = s.o.parse(s.$.val()) + kv[kc] * m;
//                                 s.o.stopper && (v = max(min(v, s.o.max), s.o.min));
//
//                                 s.change(s._validate(v));
//                                 s._draw();
//
//                                 // long time keydown speed-up
//                                 to = window.setTimeout(function () {
//                                     m *= 2;
//                                 }, 30);
//                             }
//                         }
//                     }
//                 )
//                 .bind(
//                     "keyup",
//                     function (e) {
//                         if (isNaN(kval)) {
//                             if (to) {
//                                 window.clearTimeout(to);
//                                 to = null;
//                                 m = 1;
//                                 s.val(s.$.val());
//                             }
//                         } else {
//                             // kval postcond
//                             (s.$.val() > s.o.max && s.$.val(s.o.max))
//                             || (s.$.val() < s.o.min && s.$.val(s.o.min));
//                         }
//                     }
//                 );
//
//             this.$c.bind("mousewheel DOMMouseScroll", mw);
//             this.$.bind("mousewheel DOMMouseScroll", mw);
//         };
//
//         this.init = function () {
//             if (this.v < this.o.min
//                 || this.v > this.o.max) { this.v = this.o.min; }
//
//             this.$.val(this.v);
//             this.w2 = this.w / 2;
//             this.cursorExt = this.o.cursor / 100;
//             this.xy = this.w2 * this.scale;
//             this.lineWidth = this.xy * this.o.thickness;
//             this.lineCap = this.o.lineCap;
//             this.radius = this.xy - this.lineWidth / 2;
//
//             this.o.angleOffset
//             && (this.o.angleOffset = isNaN(this.o.angleOffset) ? 0 : this.o.angleOffset);
//
//             this.o.angleArc
//             && (this.o.angleArc = isNaN(this.o.angleArc) ? this.PI2 : this.o.angleArc);
//
//             // deg to rad
//             this.angleOffset = this.o.angleOffset * Math.PI / 180;
//             this.angleArc = this.o.angleArc * Math.PI / 180;
//
//             // compute start and end angles
//             this.startAngle = 1.5 * Math.PI + this.angleOffset;
//             this.endAngle = 1.5 * Math.PI + this.angleOffset + this.angleArc;
//
//             var s = max(
//                 String(Math.abs(this.o.max)).length,
//                 String(Math.abs(this.o.min)).length,
//                 2
//             ) + 2;
//
//             this.o.displayInput
//                 && this.i.css({
//                         'width' : ((this.w / 2 + 4) >> 0) + 'px',
//                         'height' : ((this.w / 3) >> 0) + 'px',
//                         'position' : 'absolute',
//                         'vertical-align' : 'middle',
//                         'margin-top' : ((this.w / 3) >> 0) + 'px',
//                         'margin-left' : '-' + ((this.w * 3 / 4 + 2) >> 0) + 'px',
//                         'border' : 0,
//                         'background' : 'none',
//                         'font' : this.o.fontWeight + ' ' + ((this.w / s) >> 0) + 'px ' + this.o.font,
//                         'text-align' : 'center',
//                         'color' : this.o.inputColor || this.o.fgColor,
//                         'padding' : '0px',
//                         '-webkit-appearance': 'none'
//                         }) || this.i.css({
//                             'width': '0px',
//                             'visibility': 'hidden'
//                         });
//         };
//
//         this.change = function (v) {
//             this.cv = v;
//             this.$.val(this.o.format(v));
//         };
//
//         this.angle = function (v) {
//             return (v - this.o.min) * this.angleArc / (this.o.max - this.o.min);
//         };
//
//         this.arc = function (v) {
//           var sa, ea;
//           v = this.angle(v);
//           if (this.o.flip) {
//               sa = this.endAngle + 0.00001;
//               ea = sa - v - 0.00001;
//           } else {
//               sa = this.startAngle - 0.00001;
//               ea = sa + v + 0.00001;
//           }
//           this.o.cursor
//               && (sa = ea - this.cursorExt)
//               && (ea = ea + this.cursorExt);
//
//           return {
//               s: sa,
//               e: ea,
//               d: this.o.flip && !this.o.cursor
//           };
//         };
//
//         this.draw = function () {
//             var c = this.g,                 // context
//                 a = this.arc(this.cv),      // Arc
//                 pa,                         // Previous arc
//                 r = 1;
//
//             c.lineWidth = this.lineWidth;
//             c.lineCap = this.lineCap;
//
//             if (this.o.bgColor !== "none") {
//                 c.beginPath();
//                     c.strokeStyle = this.o.bgColor;
//                     c.arc(this.xy, this.xy, this.radius, this.endAngle - 0.00001, this.startAngle + 0.00001, true);
//                 c.stroke();
//             }
//
//             if (this.o.displayPrevious) {
//                 pa = this.arc(this.v);
//                 c.beginPath();
//                 c.strokeStyle = this.pColor;
//                 c.arc(this.xy, this.xy, this.radius, pa.s, pa.e, pa.d);
//                 c.stroke();
//                 r = this.cv == this.v;
//             }
//
//             c.beginPath();
//             c.strokeStyle = r ? this.o.fgColor : this.fgColor ;
//             c.arc(this.xy, this.xy, this.radius, a.s, a.e, a.d);
//             c.stroke();
//         };
//
//         this.cancel = function () {
//             this.val(this.v);
//         };
//     };
//
//     $.fn.dial = $.fn.knob = function (o) {
//         return this.each(
//             function () {
//                 var d = new k.Dial();
//                 d.o = o;
//                 d.$ = $(this);
//                 d.run();
//             }
//         ).parent();
//     };
//
// }));


var border_color = '#132849';//图标辅助线颜色
var text_color = '#b8b8b9';//辅助字体颜色


$(function () {
    //右侧第一个柱图
    var csv_right_bar = {
        "x": [30, 50, 90],
        "y": [0, 50, 100],
        "arr": [['星期一', '星期二', '星期三'],
            [2, 5, 9],]
    };
    var csv_big_bar = {
        "x": ["9.01", "9.02", "9.03", "9.04", "9.05", "9.06", "9.07", "9.08", "9.09", "9.10", "9.11", "9.12", "9.13", "9.14", "9.15"],
        "y": [0, 50, 100, 150, 200, 250, 300, 350],
        "arr": [30, 50, 70, 90, 110, 130, 150, 170, 190, 210, 230, 250, 270, 290, 270],
    };


    //面积图
    var line_csv = {
        "x": ["11.02", "12.02", "13.02", "14.02", "15.02", "16.02", "17.02"],
        "y": [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200],
        "arr": [
            [200, 211, 215, 313, 142, 413, 310],
            [50, 80, 120, 150, 102, 313, 210],
        ]
    };
    //柱状图
    var right_bar = {
        "x": ["1", "2", "3"],
        "y": [1, 2, 3],
        "arr": [1, 2, 3]
    };
    //这里是饼图---比例
    var pie_csv = {
        "top": "60",
        "bottom": "40",
        "top_one": "60%",
    };
     //饼图---分类
     var sort_pie={

     }


    //饼图
    pie('pie-one', pie_csv);
    pie('pie-two', pie_csv);
    pie('pie-three', pie_csv);
    pie('pie-four', pie_csv);


    // 饼图---饼图
    function pie(id, pie_csv) {
        // 基于准备好的dom，初始化echarts图表
        var myChart = echarts.init(document.getElementById(id));
        var dataStyle = {
            normal: {
                label: {show: false},
                labelLine: {show: false}
            }
        };
        //半径
        var pie_int = 55;
        var option = {
            title: {
                text: pie_csv.top_one,
                x: 'center',
                y: 'center',
                itemGap: 20,
                textStyle: {
                    // color : 'rgba(30,144,255,0.8)',
                    color: '#fff',
                    // fontFamily : '微软雅黑',
                    fontSize: 20,
                    // fontWeight : 'bolder'
                }
            },
            tooltip: {
                show: false
            },
            legend: {
                show: false,
                orient: 'vertical',
                x: 'left',
                top: '20',
                data: ['成功次数', '失败次数']
            },
            toolbox: {
                show: false,
            },
            calculable: false,//是否拖拽重算
            series: [
                {
                    name: '1',
                    type: 'pie',
                    hoverAnimation: false,
                    animation: false,
                    clockWise: false,
                    radius: [(pie_int - 15), pie_int],
                    itemStyle: dataStyle,
                    data: [
                        {
                            value: pie_csv.top,
                            name: '成功次数',
                            itemStyle: {
                                normal: {
                                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                        offset: 0,
                                        color: '#9DCC17'
                                    },
                                        {
                                            offset: 1,
                                            color: '#D9241B'
                                        },

                                    ]),

                                },
                            }
                        },

                        {
                            value: pie_csv.bottom,
                            name: 'invisible',
                            itemStyle: {
                                normal: {
                                    color: '#17253F'
                                },
                            }
                        }
                    ]
                },

            ]
        };
        // 为echarts对象加载数据
        myChart.setOption(option);
    }



    //渐变面积图
    line_line('tu-one', line_csv);

    function line_line(id, line_csv) {
        // 基于准备好的dom，初始化echarts图表
        var myChart = echarts.init(document.getElementById('tu-one'));
        var option = {
            title: {
                show: false,//是否显示标题
            },
            grid: {
                top: 40,
                bottom: 40,
                left: 55,
                right: 40,
                showAllSymbol: 20,
                borderColor: border_color
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow',
                    label: {
                        backgroundColor: '#333'
                    }
                }
            },
            legend: {//图利
                show: false,
                data: ['意向', '预购', '成交']
            },
            calculable: false,//是否拖拽重算
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    splitNumber: 5,
                    name: '(日)',
                    nameTextStyle: {color: text_color},
                    axisLine: {
                        lineStyle: {
                            color: border_color
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        textStyle: {
                            color: text_color
                        }
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: border_color
                        }
                    },
                    data: line_csv.x
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '(台)',
                    splitNumber: 5,
                    data: line_csv.y,
                    nameTextStyle: {color: text_color},
                    axisLabel: {
                        textStyle: {
                            color: text_color
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        lineStyle: {
                            color: border_color
                        }
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: border_color
                        }
                    }
                }
            ],
            series: [//图表类型
                {
                    type: 'line',
                    smooth: true,
                    symbol: 'circle',
                    symbolSize: 4,
                    showAllSymbol: true,
                    hoverAnimation: true,
                    areaStyle: { //区域填充样式
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ //填充的颜色。
                                offset: 0, // 0% 处的颜色
                                color: 'rgba(137, 189, 27, 0.3)'
                            }, {
                                offset: 0.8, // 80% 处的颜色
                                color: 'rgba(137, 189, 27, 0)'
                            }], false),
                            shadowColor: 'rgba(0, 0, 0, 0.1)', //阴影颜色。支持的格式同color
                            shadowBlur: 10 //图形阴影的模糊大小。该属性配合 shadowColor,shadowOffsetX, shadowOffsetY 一起设置图形的阴影效果
                        }
                    },
                    itemStyle: { //折线拐点标志的样式
                        normal: {
                            color: 'rgb(137,189,27)',
                            borderColor: 'rgba(137,189,2,0.27)', //图形的描边颜色。支持的格式同 color
                            borderWidth: 2 //描边线宽。为 0 时无描边。[ default: 0 ]

                        }
                    },
                    // markLine: {itemStyle:{normal:{lineStyle:{width:2,color:'#959EBB'}}}},
                    data: line_csv.arr[0]
                },
                {
                    type: 'line',
                    smooth: true,
                    symbol: 'circle',
                    symbolSize: 4,
                    showAllSymbol: true,
                    hoverAnimation: true,
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: 'rgba(0, 136, 212, 0.3)'
                            }, {
                                offset: 0.8,
                                color: 'rgba(0, 136, 212, 0)'
                            }], false),
                            shadowColor: 'rgba(0, 0, 0, 0.1)',
                            shadowBlur: 10
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: 'rgb(0,136,212)',
                            borderColor: 'rgba(0,136,212,0.2)',
                            borderWidth: 1

                        }
                    },
                    // markLine: {itemStyle:{normal:{lineStyle:{width:2,color:'#959EBB'}}}},
                    data: line_csv.arr[1]
                }
            ]
        };
        // 为echarts对象加载数据
        myChart.setOption(option);
    }

    //右侧的柱状图
    right_bar_one('tu-right-one', right_bar);
    function right_bar_one(id, right_bar) {
        // 基于准备好的dom，初始化echarts图表
        var myChart = echarts.init(document.getElementById(id));
        var option = {
            title: {
                show: false
            },
            grid: {
                top: 30,
                bottom: 45,
                showAllSymbol: 10,
                right: '11%',
                borderColor: border_color
            },
            tooltip: {
                // trigger: 'axis',
                trigger: 'item',
                axisPointer: {
                    type: 'none'
                },
                backgroundColor: 'rgba(0,193,222,0.5)',
                formatter: '{a}:{c}',
                textStyle: {
                    fontSize: 12
                }
            },
            legend: {
                show: false,
                // color:'#fff';
                top: 30,
                textStyle: {
                    color: text_color
                },
                data: ['高级', '中级', '低级']
            },
            toolbox: {
                show: false
            },
            calculable: false,
            xAxis: [
                {
                    // type: 'category',
                    type: 'value',
                    name: '(日)',
                    splitNumber: 5,
                    nameTextStyle: {color: text_color},
                    axisLine: {
                        lineStyle: {
                            color: border_color
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        textStyle: {
                            color: text_color
                        }
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: border_color
                        }
                    },
                    data: csv_right_bar.x
                }
            ],
            yAxis: [
                {
                    type: 'category',
                    // type: 'value',
                    name: '(数量)',
                    splitNumber: 5,
                    // boundaryGap:[0,1],
                    data: right_bar.y,
                    nameTextStyle: {color: text_color},
                    axisLine: {
                        lineStyle: {
                            color: border_color
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        textStyle: {
                            color: text_color
                        }
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: border_color
                        }
                    }
                }
            ],
            series: [
                {
                    name: '高级',
                    type: 'bar',
                    itemStyle: {normal: {color: "#318395"}},
                    barWidth: 18,
                    barCategoryGap: 5,

                    data: [

                        {
                            value: right_bar.y[0],
                            itemStyle: {
                                normal: {color: '#EA6F33'}
                            }
                        },
                        {
                            value: right_bar.y[1],
                            itemStyle: {
                                normal: {color: '#318395'}
                            }
                        },
                        {
                            value: right_bar.y[2],
                            itemStyle: {
                                normal: {color: '#266560'}
                            }
                        },
                    ]
                }
            ]
        };

        // 为echarts对象加载数据
        myChart.setOption(option);
    }


    //饼图----分类
    right_pie('tu-two', sort_pie);

    function right_pie(id, sort_pie) {
        // 基于准备好的dom，初始化echarts图表
        var myChart = echarts.init(document.getElementById(id));
        var dataStyle = {
            normal: {
                label: {show: false},
                labelLine: {show: false}
            }
        };
        //半径
        var pie_int = 65;
        var option = {
            title: {
                text: '',
                x: '10',
                left:'20',
                y: 'center',
                itemGap: 20,
                textStyle: {
                    color: '#e2e2e2',
                    fontSize: 20,
                }
            },
            tooltip: {
                show: true
            },
            legend: {
                show: true,
                color: '#e2e2e2',
                orient: 'vertical',
                x: '240',
                top: '20',
                textStyle: {
                    color: text_color,
                    fontSize: 14,
                },
                data: ['星期一', '星期二', '星期三', '星期四', '星期五']
            },
            toolbox: {
                show: false,
            },
            calculable: false,//是否拖拽重算
            series: [
                {
                    name: ' ',
                    center: ['35%','50%'],
                    type: 'pie',
                    hoverAnimation: false,
                    animation: false,
                    clockWise: false,
                    radius: [(pie_int - 15), pie_int],
                    itemStyle: dataStyle,
                    data: [
                        {
                            value: pie_csv.top,
                            name: '星期一',
                            itemStyle: {
                                normal: {
                                    color: '#0E8DEE'
                                },
                            }
                        },

                        {
                            value: pie_csv.bottom,
                            name: '星期二',
                            itemStyle: {
                                normal: {
                                    color: '#1DB6BE'
                                },
                            }
                        },
                        {
                            value: pie_csv.bottom,
                            name: '星期三',
                            itemStyle: {
                                normal: {
                                    color: '#78BD3C'
                                },
                            }
                        },
                        {
                            value: pie_csv.bottom,
                            name: '星期四',
                            itemStyle: {
                                normal: {
                                    color: '#DEB734'
                                },
                            }
                        },
                        {
                            value: pie_csv.bottom,
                            name: '星期五',
                            itemStyle: {
                                normal: {
                                    color: '#EA6F33'
                                },
                            }
                        },
                        {
                            value: pie_csv.bottom,
                            name: '星期六',
                            itemStyle: {
                                normal: {
                                    color: '#D34245'
                                },
                            }
                        },
                        {
                            value: pie_csv.bottom,
                            name: '星期日',
                            itemStyle: {
                                normal: {
                                    color: '#224A8F'
                                },
                            }
                        },

                    ]
                },

            ]
        };
        // 为echarts对象加载数据
        myChart.setOption(option);
    }


    big_bar('tu-three', csv_big_bar);

    function big_bar(id, csv) {
        // 基于准备好的dom，初始化echarts图表
        var myChart = echarts.init(document.getElementById(id));
        var option = {
            title: {
                show: false
            },
            grid: {
                top: 40,
                bottom: 40,
                left: 55,
                right: 40,
                showAllSymbol: 20,
                borderColor: border_color
            },
            tooltip: {
                // trigger: 'axis',
                trigger: 'item',
                axisPointer: {
                    type: 'none'
                },
                backgroundColor: 'rgba(0,193,222,0.5)',
                formatter: '{a}:{c}',
                textStyle: {
                    fontSize: 12
                }
            },
            legend: {
                show: false,
                top: 40,
                textStyle: {
                    color: text_color
                },
                data: ['问题事件', '待办事件', '已处理事件']
            },
            toolbox: {
                show: false
            },
            calculable: false,
            xAxis: [
                {
                    type: 'category',
                    name: '(日)',
                    splitNumber: 5,
                    nameTextStyle: {color: text_color},
                    axisLine: {
                        lineStyle: {
                            color: border_color
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        rotate:60,
                        textStyle: {
                            color: text_color
                        }
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: border_color
                        }
                    },
                    data: csv.x
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '(数量)',
                    splitNumber: 8,
                    // boundaryGap:[0,1],
                    data: csv.y,
                    nameTextStyle: {color: text_color},
                    axisLine: {
                        lineStyle: {
                            color: border_color
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        textStyle: {
                            color: text_color
                        }
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: border_color
                        }
                    }
                }
            ],
            series: [
                {
                    name: '已处理事件',
                    type: 'bar',
                    itemStyle: {normal: {color: "#318395"}},
                    barWidth: 20,
                    barCategoryGap: 25,
                    data: csv.arr
                }
            ]
        };

        // 为echarts对象加载数据
        myChart.setOption(option);
    }
});
