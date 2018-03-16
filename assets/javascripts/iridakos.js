/*
 *  jquery.docout - v1.0.0
 *  jQuery plugin for producing document outline
 *  https://github.com/iridakos/jquery.docout#readme
 *
 *  Made by Lazarus Lazaridis
 *  Under MIT License
 */

!function(t,n,e,i){"use strict";function r(n,e){this.element=n,this.$element=t(n),this.settings=t.extend({},a,e),this._defaults=a,this._name=s,this.$target=t(this.settings.target),this.init()}var s="docout",a={target:"body",immediate:!0,rootClass:"docout-root-wrap",childClass:"docout-child-wrap",elements:["h1","h2","h3","h4","h5","h6","h7","h8"],replace:!1,gntLink:function(n){return t('<a href="#'+n.attr("id")+'">'+n.text()+"</a>")},gntLinkWrap:function(){return t("<li></li>")},gntRootWrap:function(n){return t('<ul class="'+n+'"></ul>')},gntChildWrap:function(n,e){return t('<ul class="'+n+" "+n+"-"+e+'"></ul>')},gntId:function(t,n){return"docout-"+n}};t.extend(r.prototype,{init:function(){this.settings.immediate&&this.generate()},generate:function(){var n,e,i,r=this,s=r.settings,a=r.$element.find(s.elements.join(",")),o=s.gntRootWrap(s.rootClass),u=-1,l=o,h=t.each(a,function(a,o){if(e=t(o),n=s.elements.findIndex(function(t){return e.is(t)}),-1===u||n===u);else if(n>u){var h=s.gntChildWrap(s.childClass,n);i.append(h),l=h}else if(l.parents("ul").length>0){var c=l.parents("ul").length-n;l=l.parents().eq(c)}i=r._gntEntryFor(e,a),l.append(i),u=n});return r.settings.replace?r.$target.html(o):r.$target.prepend(o),h},_gntEntryFor:function(t,n){var e=this.settings;return t.attr("id")===i&&t.attr("id",this.settings.gntId(t,n)),e.gntLinkWrap(t).append(e.gntLink(t))}}),t.fn[s]=function(n){var e=arguments;if(n===i||"object"==typeof n)return this.each(function(){t.data(this,"plugin_"+s)||t.data(this,"plugin_"+s,new r(this,n))});if("string"==typeof n&&"_"!==n[0]&&"init"!==n){var a;return this.each(function(){var i=t.data(this,"plugin_"+s);i instanceof r&&"function"==typeof i[n]&&(a=i[n].apply(i,Array.prototype.slice.call(e,1))),"destroy"===n&&t.data(this,"plugin_"+s,null)}),a!==i?a:this}}}(jQuery,window,document);

// Sticky Plugin v1.0.4 for jQuery
// =============
// Author: Anthony Garand
// Improvements by German M. Bravo (Kronuz) and Ruud Kamphuis (ruudk)
// Improvements by Leonardo C. Daronco (daronco)
// Created: 02/14/2011
// Date: 07/20/2015
// Website: http://stickyjs.com/
// Description: Makes an element on the page stick on the screen as you scroll
//              It will only set the 'top' and 'position' of your element, you
//              might need to adjust the width in some cases.

!function(t){"function"==typeof define&&define.amd?define(["jquery"],t):"object"==typeof module&&module.exports?module.exports=t(require("jquery")):t(jQuery)}(function(t){var e=Array.prototype.slice,i=Array.prototype.splice,n={topSpacing:0,bottomSpacing:0,className:"is-sticky",wrapperClassName:"sticky-wrapper",center:!1,getWidthFrom:"",widthFromWrapper:!0,responsiveWidth:!1,zIndex:"inherit"},r=t(window),s=t(document),o=[],c=r.height(),p=function(){for(var e=r.scrollTop(),i=s.height(),n=i-c,p=e>n?n-e:0,a=0,d=o.length;a<d;a++){var l=o[a],h=l.stickyWrapper.offset().top-l.topSpacing-p;if(l.stickyWrapper.css("height",l.stickyElement.outerHeight()),e<=h)null!==l.currentTop&&(l.stickyElement.css({width:"",position:"",top:"","z-index":""}),l.stickyElement.parent().removeClass(l.className),l.stickyElement.trigger("sticky-end",[l]),l.currentTop=null);else{var u,g=i-l.stickyElement.outerHeight()-l.topSpacing-l.bottomSpacing-e-p;if(g<0?g+=l.topSpacing:g=l.topSpacing,l.currentTop!==g)l.getWidthFrom?(padding=l.stickyElement.innerWidth()-l.stickyElement.width(),u=t(l.getWidthFrom).width()-padding||null):l.widthFromWrapper&&(u=l.stickyWrapper.width()),null==u&&(u=l.stickyElement.width()),l.stickyElement.css("width",u).css("position","fixed").css("top",g).css("z-index",l.zIndex),l.stickyElement.parent().addClass(l.className),null===l.currentTop?l.stickyElement.trigger("sticky-start",[l]):l.stickyElement.trigger("sticky-update",[l]),l.currentTop===l.topSpacing&&l.currentTop>g||null===l.currentTop&&g<l.topSpacing?l.stickyElement.trigger("sticky-bottom-reached",[l]):null!==l.currentTop&&g===l.topSpacing&&l.currentTop<g&&l.stickyElement.trigger("sticky-bottom-unreached",[l]),l.currentTop=g;var m=l.stickyWrapper.parent();l.stickyElement.offset().top+l.stickyElement.outerHeight()>=m.offset().top+m.outerHeight()&&l.stickyElement.offset().top<=l.topSpacing?l.stickyElement.css("position","absolute").css("top","").css("bottom",0).css("z-index",""):l.stickyElement.css("position","fixed").css("top",g).css("bottom","").css("z-index",l.zIndex)}}},a=function(){c=r.height();for(var e=0,i=o.length;e<i;e++){var n=o[e],s=null;n.getWidthFrom?n.responsiveWidth&&(s=t(n.getWidthFrom).width()):n.widthFromWrapper&&(s=n.stickyWrapper.width()),null!=s&&n.stickyElement.css("width",s)}},d={init:function(e){return this.each(function(){var i=t.extend({},n,e),r=t(this),s=r.attr("id"),c=s?s+"-"+n.wrapperClassName:n.wrapperClassName,p=t("<div></div>").attr("id",c).addClass(i.wrapperClassName);r.wrapAll(function(){if(0==t(this).parent("#"+c).length)return p});var a=r.parent();i.center&&a.css({width:r.outerWidth(),marginLeft:"auto",marginRight:"auto"}),"right"===r.css("float")&&r.css({float:"none"}).parent().css({float:"right"}),i.stickyElement=r,i.stickyWrapper=a,i.currentTop=null,o.push(i),d.setWrapperHeight(this),d.setupChangeListeners(this)})},setWrapperHeight:function(e){var i=t(e),n=i.parent();n&&n.css("height",i.outerHeight())},setupChangeListeners:function(t){window.MutationObserver?new window.MutationObserver(function(e){(e[0].addedNodes.length||e[0].removedNodes.length)&&d.setWrapperHeight(t)}).observe(t,{subtree:!0,childList:!0}):window.addEventListener?(t.addEventListener("DOMNodeInserted",function(){d.setWrapperHeight(t)},!1),t.addEventListener("DOMNodeRemoved",function(){d.setWrapperHeight(t)},!1)):window.attachEvent&&(t.attachEvent("onDOMNodeInserted",function(){d.setWrapperHeight(t)}),t.attachEvent("onDOMNodeRemoved",function(){d.setWrapperHeight(t)}))},update:p,unstick:function(e){return this.each(function(){for(var e=t(this),n=-1,r=o.length;r-- >0;)o[r].stickyElement.get(0)===this&&(i.call(o,r,1),n=r);-1!==n&&(e.unwrap(),e.css({width:"",position:"",top:"",float:"","z-index":""}))})}};window.addEventListener?(window.addEventListener("scroll",p,!1),window.addEventListener("resize",a,!1)):window.attachEvent&&(window.attachEvent("onscroll",p),window.attachEvent("onresize",a)),t.fn.sticky=function(i){return d[i]?d[i].apply(this,e.call(arguments,1)):"object"!=typeof i&&i?void t.error("Method "+i+" does not exist on jQuery.sticky"):d.init.apply(this,arguments)},t.fn.unstick=function(i){return d[i]?d[i].apply(this,e.call(arguments,1)):"object"!=typeof i&&i?void t.error("Method "+i+" does not exist on jQuery.sticky"):d.unstick.apply(this,arguments)},t(function(){setTimeout(p,0)})});

;$(function() {
  $('.page-content img, .maximize').on('click', function() {
    $('#image-modal .image').attr('src', $(this).attr('src'));
    $('#image-modal .modal-title').html($(this).attr('alt'));
    $('#image-modal').modal('show');
  });

  $('#outline').docout({ target: '#docout' });

  $(".sticky").sticky({ topSpacing: 0,
                        bottomSpacing: 150 });

  $('.ga-event-link').on('click', function() {
    var data = $(this).data();

    ga('send', 'event', data.eventCategory, data.eventAction, data.eventLabel);
  });
});
