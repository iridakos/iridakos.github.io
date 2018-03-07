/*
 *  jquery.docout - v1.0.0
 *  jQuery plugin for producing document outline
 *  https://github.com/iridakos/jquery.docout#readme
 *
 *  Made by Lazarus Lazaridis
 *  Under MIT License
 */

!function(t,n,e,i){"use strict";function r(n,e){this.element=n,this.$element=t(n),this.settings=t.extend({},a,e),this._defaults=a,this._name=s,this.$target=t(this.settings.target),this.init()}var s="docout",a={target:"body",immediate:!0,rootClass:"docout-root-wrap",childClass:"docout-child-wrap",elements:["h1","h2","h3","h4","h5","h6","h7","h8"],replace:!1,gntLink:function(n){return t('<a href="#'+n.attr("id")+'">'+n.text()+"</a>")},gntLinkWrap:function(){return t("<li></li>")},gntRootWrap:function(n){return t('<ul class="'+n+'"></ul>')},gntChildWrap:function(n,e){return t('<ul class="'+n+" "+n+"-"+e+'"></ul>')},gntId:function(t,n){return"docout-"+n}};t.extend(r.prototype,{init:function(){this.settings.immediate&&this.generate()},generate:function(){var n,e,i,r=this,s=r.settings,a=r.$element.find(s.elements.join(",")),o=s.gntRootWrap(s.rootClass),u=-1,l=o,h=t.each(a,function(a,o){if(e=t(o),n=s.elements.findIndex(function(t){return e.is(t)}),-1===u||n===u);else if(n>u){var h=s.gntChildWrap(s.childClass,n);i.append(h),l=h}else if(l.parents("ul").length>0){var c=l.parents("ul").length-n;l=l.parents().eq(c)}i=r._gntEntryFor(e,a),l.append(i),u=n});return r.settings.replace?r.$target.html(o):r.$target.prepend(o),h},_gntEntryFor:function(t,n){var e=this.settings;return t.attr("id")===i&&t.attr("id",this.settings.gntId(t,n)),e.gntLinkWrap(t).append(e.gntLink(t))}}),t.fn[s]=function(n){var e=arguments;if(n===i||"object"==typeof n)return this.each(function(){t.data(this,"plugin_"+s)||t.data(this,"plugin_"+s,new r(this,n))});if("string"==typeof n&&"_"!==n[0]&&"init"!==n){var a;return this.each(function(){var i=t.data(this,"plugin_"+s);i instanceof r&&"function"==typeof i[n]&&(a=i[n].apply(i,Array.prototype.slice.call(e,1))),"destroy"===n&&t.data(this,"plugin_"+s,null)}),a!==i?a:this}}}(jQuery,window,document);

;$(function() {
  $('.page-content img, .maximize').on('click', function() {
    $('#image-modal .image').attr('src', $(this).attr('src'));
    $('#image-modal .modal-title').html($(this).attr('alt'));
    $('#image-modal').modal('show');
  });

  $('#outline').docout({ target: '#docout' });

  $('.ga-event-link').on('click', function() {
    var data = $(this).data();

    ga('send', 'event', data.eventCategory, data.eventAction, data.eventLabel);
  });
});
