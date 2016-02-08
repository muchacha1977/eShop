(function(e,f){"object"==typeof exports?module.exports=f(require("underscore"),require("backbone"),require("backgrid"),require("backbone.paginator")):"function"===typeof define&&define.amd?define(["underscore","backbone","backgrid","backbone.paginator"],f):f(e._,e.Backbone,e.Backgrid)})(this,function(e,f,g){var k=g.Extension.PageHandle=f.View.extend({tagName:"li",events:{"click a":"changePage"},title:function(a){return"Page "+a.label},isRewind:!1,isBack:!1,isForward:!1,isFastForward:!1,initialize:function(a){var b=
this.collection.state,c=b.currentPage,d=b.firstPage,b=b.lastPage;e.extend(this,e.pick(a,["isRewind","isBack","isForward","isFastForward"]));this.isRewind?c=d:this.isBack?c=Math.max(d,c-1):this.isForward?c=Math.min(b,c+1):this.isFastForward?c=b:(c=+a.pageIndex,c=d?c+1:c);this.pageIndex=c;this.label=(a.label||(d?c:c+1))+"";a=a.title||this.title;this.title=e.isFunction(a)?a({label:this.label}):a},render:function(){this.$el.empty();var a=document.createElement("a");a.href="#";this.title&&(a.title=this.title);
a.innerHTML=this.label;this.el.appendChild(a);var a=this.collection,b=a.state,c=b.currentPage,d=this.pageIndex;this.isRewind&&c==b.firstPage||this.isBack&&!a.hasPreviousPage()||this.isForward&&!a.hasNextPage()||this.isFastForward&&(c==b.lastPage||1>b.totalPages)?this.$el.addClass("disabled"):this.isRewind||this.isBack||this.isForward||this.isFastForward||b.currentPage!=d||this.$el.addClass("active");this.delegateEvents();return this},changePage:function(a){a.preventDefault();a=this.$el;var b=this.collection;
a.hasClass("active")||a.hasClass("disabled")||(this.isRewind?b.getFirstPage():this.isBack?b.getPreviousPage():this.isForward?b.getNextPage():this.isFastForward?b.getLastPage():b.getPage(this.pageIndex,{reset:!0}));return this}}),l=g.Extension.Paginator=f.View.extend({className:"backgrid-paginator",windowSize:10,slideScale:0.5,controls:{rewind:{label:"\u300a",title:"First"},back:{label:"\u3008",title:"Previous"},forward:{label:"\u3009",title:"Next"},fastForward:{label:"\u300b",title:"Last"}},renderIndexedPageHandles:!0,
pageHandle:k,goBackFirstOnSort:!0,initialize:function(a){var b=this;b.controls=e.defaults(a.controls||{},b.controls,l.prototype.controls);e.extend(b,e.pick(a||{},"windowSize","pageHandle","slideScale","goBackFirstOnSort","renderIndexedPageHandles"));var c=b.collection;b.listenTo(c,"add",b.render);b.listenTo(c,"remove",b.render);b.listenTo(c,"reset",b.render);b.listenTo(c,"backgrid:sorted",function(){b.goBackFirstOnSort&&c.getFirstPage({reset:!0})})},slideMaybe:function(a,b,c,d,e){return Math.round(c%
d/d)},slideThisMuch:function(a,b,c,d,e){return~~(d*e)},_calculateWindow:function(){var a=this.collection.state,b=a.firstPage,c=+a.lastPage,c=Math.max(0,b?c-1:c),d=Math.max(a.currentPage,a.firstPage),d=b?d-1:d,e=this.windowSize,h=this.slideScale,a=Math.floor(d/e)*e;d<=c-this.slideThisMuch()&&(a+=this.slideMaybe(b,c,d,e,h)*this.slideThisMuch(b,c,d,e,h));b=Math.min(c+1,a+e);return[a,b]},makeHandles:function(){var a=[],b=this.collection,c=this._calculateWindow(),d=c[0],c=c[1];if(this.renderIndexedPageHandles)for(;d<
c;d++)a.push(new this.pageHandle({collection:b,pageIndex:d}));var f=this.controls;e.each(["back","rewind","forward","fastForward"],function(c){var d=f[c];d&&(d={collection:b,title:d.title,label:d.label},d["is"+c.slice(0,1).toUpperCase()+c.slice(1)]=!0,d=new this.pageHandle(d),"rewind"==c||"back"==c?a.unshift(d):a.push(d))},this);return a},render:function(){this.$el.empty();if(this.handles)for(var a=0,b=this.handles.length;a<b;a++)this.handles[a].remove();for(var b=this.handles=this.makeHandles(),
c=document.createElement("ul"),a=0;a<b.length;a++)c.appendChild(b[a].render().el);this.el.appendChild(c);return this}})});