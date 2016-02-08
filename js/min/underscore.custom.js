(function(){var C="object"===typeof self&&self.self===self&&self||"object"===typeof global&&global.global===global&&global,Q=C._,y=Array.prototype,D=Object.prototype,R=y.push,v=y.slice,w=D.toString,S=D.hasOwnProperty,z=Array.isArray,I=Object.keys,E=Function.prototype.bind,J=Object.create,F=function(){},b=function(a){if(a instanceof b)return a;if(!(this instanceof b))return new b(a);this._wrapped=a};"undefined"!==typeof exports?("undefined"!==typeof module&&module.exports&&(exports=module.exports=
b),exports._=b):C._=b;b.VERSION="1.8.3";var x=function(a,c,b){if(void 0===c)return a;switch(null==b?3:b){case 1:return function(b){return a.call(c,b)};case 2:return function(b,d){return a.call(c,b,d)};case 3:return function(b,d,g){return a.call(c,b,d,g)};case 4:return function(b,d,g,h){return a.call(c,b,d,g,h)}}return function(){return a.apply(c,arguments)}},m=function(a,c,d){return null==a?b.identity:b.isFunction(a)?x(a,c,d):b.isObject(a)?b.matcher(a):b.property(a)};b.iteratee=function(a,c){return m(a,
c,Infinity)};var r=function(a,c){c=null==c?a.length-1:+c;return function(){var b=Math.max(arguments.length-c,0),e=Array(b),f;for(f=0;f<b;f++)e[f]=arguments[f+c];switch(c){case 0:return a.call(this,e);case 1:return a.call(this,arguments[0],e);case 2:return a.call(this,arguments[0],arguments[1],e)}b=Array(c+1);for(f=0;f<c;f++)b[f]=arguments[f];b[c]=e;return a.apply(this,b)}},K=function(a){if(!b.isObject(a))return{};if(J)return J(a);F.prototype=a;a=new F;F.prototype=null;return a},A=function(a){return function(c){return null==
c?void 0:c[a]}},T=Math.pow(2,53)-1,s=A("length"),p=function(a){a=s(a);return"number"==typeof a&&0<=a&&a<=T};b.each=b.forEach=function(a,c,d){c=x(c,d);var e;if(p(a))for(d=0,e=a.length;d<e;d++)c(a[d],d,a);else{var f=b.keys(a);d=0;for(e=f.length;d<e;d++)c(a[f[d]],f[d],a)}return a};b.map=b.collect=function(a,c,d){c=m(c,d);d=!p(a)&&b.keys(a);for(var e=(d||a).length,f=Array(e),g=0;g<e;g++){var h=d?d[g]:g;f[g]=c(a[h],h,a)}return f};var l=function(a){return function(c,d,e,f){var g=3<=arguments.length,h=x(d,
f,4),k=e,n=!p(c)&&b.keys(c),q=(n||c).length,t=0<a?0:q-1;g||(k=c[n?n[t]:t],t+=a);for(;0<=t&&t<q;t+=a)g=n?n[t]:t,k=h(k,c[g],g,c);return k}};b.reduce=b.foldl=b.inject=l(1);b.reduceRight=b.foldr=l(-1);b.find=b.detect=function(a,c,d){c=p(a)?b.findIndex(a,c,d):b.findKey(a,c,d);if(void 0!==c&&-1!==c)return a[c]};b.filter=b.select=function(a,c,d){var e=[];c=m(c,d);b.each(a,function(a,b,d){c(a,b,d)&&e.push(a)});return e};b.reject=function(a,c,d){return b.filter(a,b.negate(m(c)),d)};b.every=b.all=function(a,
c,d){c=m(c,d);d=!p(a)&&b.keys(a);for(var e=(d||a).length,f=0;f<e;f++){var g=d?d[f]:f;if(!c(a[g],g,a))return!1}return!0};b.some=b.any=function(a,c,d){c=m(c,d);d=!p(a)&&b.keys(a);for(var e=(d||a).length,f=0;f<e;f++){var g=d?d[f]:f;if(c(a[g],g,a))return!0}return!1};b.contains=b.includes=b.include=function(a,c,d,e){p(a)||(a=b.values(a));if("number"!=typeof d||e)d=0;return 0<=b.indexOf(a,c,d)};b.invoke=r(function(a,c,d){var e=b.isFunction(c);return b.map(a,function(a){var b=e?c:a[c];return null==b?b:b.apply(a,
d)})});b.pluck=function(a,c){return b.map(a,b.property(c))};b.where=function(a,c){return b.filter(a,b.matcher(c))};b.findWhere=function(a,c){return b.find(a,b.matcher(c))};b.max=function(a,c,d){var e=-Infinity,f=-Infinity,g;if(null==c&&null!=a){a=p(a)?a:b.values(a);for(var h=0,k=a.length;h<k;h++)d=a[h],d>e&&(e=d)}else c=m(c,d),b.each(a,function(a,b,d){g=c(a,b,d);if(g>f||-Infinity===g&&-Infinity===e)e=a,f=g});return e};b.min=function(a,c,d){var e=Infinity,f=Infinity,g;if(null==c&&null!=a){a=p(a)?a:
b.values(a);for(var h=0,k=a.length;h<k;h++)d=a[h],d<e&&(e=d)}else c=m(c,d),b.each(a,function(a,b,d){g=c(a,b,d);if(g<f||Infinity===g&&Infinity===e)e=a,f=g});return e};b.shuffle=function(a){return b.sample(a,Infinity)};b.sample=function(a,c,d){if(null==c||d)return p(a)||(a=b.values(a)),a[b.random(a.length-1)];a=p(a)?b.clone(a):b.values(a);d=s(a);c=Math.max(Math.min(c,d),0);d-=1;for(var e=0;e<c;e++){var f=b.random(e,d),g=a[e];a[e]=a[f];a[f]=g}return a.slice(0,c)};b.sortBy=function(a,c,d){c=m(c,d);return b.pluck(b.map(a,
function(a,b,d){return{value:a,index:b,criteria:c(a,b,d)}}).sort(function(a,c){var b=a.criteria,d=c.criteria;if(b!==d){if(b>d||void 0===b)return 1;if(b<d||void 0===d)return-1}return a.index-c.index}),"value")};l=function(a,c){return function(d,e,f){var g=c?[[],[]]:{};e=m(e,f);b.each(d,function(c,b){var f=e(c,b,d);a(g,c,f)});return g}};b.groupBy=l(function(a,c,d){b.has(a,d)?a[d].push(c):a[d]=[c]});b.indexBy=l(function(a,c,b){a[b]=c});b.countBy=l(function(a,c,d){b.has(a,d)?a[d]++:a[d]=1});b.toArray=
function(a){return a?b.isArray(a)?v.call(a):p(a)?b.map(a,b.identity):b.values(a):[]};b.size=function(a){return null==a?0:p(a)?a.length:b.keys(a).length};b.partition=l(function(a,c,b){a[b?0:1].push(c)},!0);b.first=b.head=b.take=function(a,c,d){return null==a?void 0:null==c||d?a[0]:b.initial(a,a.length-c)};b.initial=function(a,c,b){return v.call(a,0,Math.max(0,a.length-(null==c||b?1:c)))};b.last=function(a,c,d){return null==a?void 0:null==c||d?a[a.length-1]:b.rest(a,Math.max(0,a.length-c))};b.rest=
b.tail=b.drop=function(a,c,b){return v.call(a,null==c||b?1:c)};b.compact=function(a){return b.filter(a,b.identity)};var u=function(a,c,d){for(var e=[],f=0,g=0,h=s(a);g<h;g++){var k=a[g];if(p(k)&&(b.isArray(k)||b.isArguments(k))){c||(k=u(k,c,d));var n=0,q=k.length;for(e.length+=q;n<q;)e[f++]=k[n++]}else d||(e[f++]=k)}return e};b.flatten=function(a,c){return u(a,c,!1)};b.without=r(function(a,c){return b.difference(a,c)});b.uniq=b.unique=function(a,c,d,e){b.isBoolean(c)||(e=d,d=c,c=!1);null!=d&&(d=m(d,
e));e=[];for(var f=[],g=0,h=s(a);g<h;g++){var k=a[g],n=d?d(k,g,a):k;c?(g&&f===n||e.push(k),f=n):d?b.contains(f,n)||(f.push(n),e.push(k)):b.contains(e,k)||e.push(k)}return e};b.union=r(function(a){return b.uniq(u(a,!0,!0))});b.intersection=function(a){for(var c=[],d=arguments.length,e=0,f=s(a);e<f;e++){var g=a[e];if(!b.contains(c,g)){var h;for(h=1;h<d&&b.contains(arguments[h],g);h++);h===d&&c.push(g)}}return c};b.difference=r(function(a,c){c=u(c,!0,!0);return b.filter(a,function(a){return!b.contains(c,
a)})});b.unzip=function(a){for(var c=a&&b.max(a,s).length||0,d=Array(c),e=0;e<c;e++)d[e]=b.pluck(a,e);return d};b.zip=r(b.unzip);b.object=function(a,c){for(var b={},e=0,f=s(a);e<f;e++)c?b[a[e]]=c[e]:b[a[e][0]]=a[e][1];return b};l=function(a){return function(c,b,e){b=m(b,e);e=s(c);for(var f=0<a?0:e-1;0<=f&&f<e;f+=a)if(b(c[f],f,c))return f;return-1}};b.findIndex=l(1);b.findLastIndex=l(-1);b.sortedIndex=function(a,c,b,e){b=m(b,e,1);c=b(c);e=0;for(var f=s(a);e<f;){var g=Math.floor((e+f)/2);b(a[g])<c?
e=g+1:f=g}return e};l=function(a,c,d){return function(e,f,g){var h=0,k=s(e);if("number"==typeof g)0<a?h=0<=g?g:Math.max(g+k,h):k=0<=g?Math.min(g+1,k):g+k+1;else if(d&&g&&k)return g=d(e,f),e[g]===f?g:-1;if(f!==f)return g=c(v.call(e,h,k),b.isNaN),0<=g?g+h:-1;for(g=0<a?h:k-1;0<=g&&g<k;g+=a)if(e[g]===f)return g;return-1}};b.indexOf=l(1,b.findIndex,b.sortedIndex);b.lastIndexOf=l(-1,b.findLastIndex);b.range=function(a,b,d){null==b&&(b=a||0,a=0);d=d||1;b=Math.max(Math.ceil((b-a)/d),0);for(var e=Array(b),
f=0;f<b;f++,a+=d)e[f]=a;return e};var L=function(a,c,d,e,f){if(!(e instanceof c))return a.apply(d,f);c=K(a.prototype);a=a.apply(c,f);return b.isObject(a)?a:c};b.bind=function(a,c){if(E&&a.bind===E)return E.apply(a,v.call(arguments,1));if(!b.isFunction(a))throw new TypeError("Bind must be called on a function");var d=v.call(arguments,2),e=r(function(b){return L(a,e,c,this,d.concat(b))});return e};b.partial=r(function(a,c){var d=b.partial.placeholder,e=function(){for(var b=0,g=c.length,h=Array(g),k=
0;k<g;k++)h[k]=c[k]===d?arguments[b++]:c[k];for(;b<arguments.length;)h.push(arguments[b++]);return L(a,e,this,this,h)};return e});b.partial.placeholder=b;b.bindAll=r(function(a,c){c=u(c,!1,!1);var d=c.length;if(1>d)throw Error("bindAll must be passed function names");for(;d--;){var e=c[d];a[e]=b.bind(a[e],a)}});b.memoize=function(a,c){var d=function(e){var f=d.cache,g=""+(c?c.apply(this,arguments):e);b.has(f,g)||(f[g]=a.apply(this,arguments));return f[g]};d.cache={};return d};b.delay=r(function(a,
b,d){return setTimeout(function(){return a.apply(null,d)},b)});b.defer=b.partial(b.delay,b,1);b.throttle=function(a,c,d){var e,f,g,h=null,k=0;d||(d={});var n=function(){k=!1===d.leading?0:b.now();h=null;g=a.apply(e,f);h||(e=f=null)};return function(){var q=b.now();k||!1!==d.leading||(k=q);var l=c-(q-k);e=this;f=arguments;0>=l||l>c?(h&&(clearTimeout(h),h=null),k=q,g=a.apply(e,f),h||(e=f=null)):h||!1===d.trailing||(h=setTimeout(n,l));return g}};b.debounce=function(a,c,d){var e,f,g,h,k,n=function(){var l=
b.now()-h;l<c&&0<=l?e=setTimeout(n,c-l):(e=null,d||(k=a.apply(g,f),e||(g=f=null)))};return function(){g=this;f=arguments;h=b.now();var l=d&&!e;e||(e=setTimeout(n,c));l&&(k=a.apply(g,f),g=f=null);return k}};b.wrap=function(a,c){return b.partial(c,a)};b.negate=function(a){return function(){return!a.apply(this,arguments)}};b.compose=function(){var a=arguments,b=a.length-1;return function(){for(var d=b,e=a[b].apply(this,arguments);d--;)e=a[d].call(this,e);return e}};b.after=function(a,b){return function(){if(1>
--a)return b.apply(this,arguments)}};b.before=function(a,b){var d;return function(){0<--a&&(d=b.apply(this,arguments));1>=a&&(b=null);return d}};b.once=b.partial(b.before,2);b.restArgs=r;var M=!{toString:null}.propertyIsEnumerable("toString"),N="valueOf isPrototypeOf toString propertyIsEnumerable hasOwnProperty toLocaleString".split(" "),O=function(a,c){var d=N.length,e=a.constructor,e=b.isFunction(e)&&e.prototype||D,f="constructor";for(b.has(a,f)&&!b.contains(c,f)&&c.push(f);d--;)f=N[d],f in a&&
a[f]!==e[f]&&!b.contains(c,f)&&c.push(f)};b.keys=function(a){if(!b.isObject(a))return[];if(I)return I(a);var c=[],d;for(d in a)b.has(a,d)&&c.push(d);M&&O(a,c);return c};b.allKeys=function(a){if(!b.isObject(a))return[];var c=[],d;for(d in a)c.push(d);M&&O(a,c);return c};b.values=function(a){for(var c=b.keys(a),d=c.length,e=Array(d),f=0;f<d;f++)e[f]=a[c[f]];return e};b.mapObject=function(a,c,d){c=m(c,d);d=b.keys(a);for(var e=d.length,f={},g=0;g<e;g++){var h=d[g];f[h]=c(a[h],h,a)}return f};b.pairs=function(a){for(var c=
b.keys(a),d=c.length,e=Array(d),f=0;f<d;f++)e[f]=[c[f],a[c[f]]];return e};b.invert=function(a){for(var c={},d=b.keys(a),e=0,f=d.length;e<f;e++)c[a[d[e]]]=d[e];return c};b.functions=b.methods=function(a){var c=[],d;for(d in a)b.isFunction(a[d])&&c.push(d);return c.sort()};l=function(a,b){return function(d){var e=arguments.length;if(2>e||null==d)return d;for(var f=1;f<e;f++)for(var g=arguments[f],h=a(g),k=h.length,l=0;l<k;l++){var q=h[l];b&&void 0!==d[q]||(d[q]=g[q])}return d}};b.extend=l(b.allKeys);
b.extendOwn=b.assign=l(b.keys);b.findKey=function(a,c,d){c=m(c,d);d=b.keys(a);for(var e,f=0,g=d.length;f<g;f++)if(e=d[f],c(a[e],e,a))return e};var U=function(a,b,d){return b in d};b.pick=r(function(a,c){var d={},e=c[0];if(null==a)return d;b.isFunction(e)?(1<c.length&&(e=x(e,c[1])),c=b.allKeys(a)):(e=U,c=u(c,!1,!1),a=Object(a));for(var f=0,g=c.length;f<g;f++){var h=c[f],k=a[h];e(k,h,a)&&(d[h]=k)}return d});b.omit=r(function(a,c){var d=c[0],e;b.isFunction(d)?(d=b.negate(d),1<c.length&&(e=c[1])):(c=
b.map(u(c,!1,!1),String),d=function(a,d){return!b.contains(c,d)});return b.pick(a,d,e)});b.defaults=l(b.allKeys,!0);b.create=function(a,c){var d=K(a);c&&b.extendOwn(d,c);return d};b.clone=function(a){return b.isObject(a)?b.isArray(a)?a.slice():b.extend({},a):a};b.tap=function(a,b){b(a);return a};b.isMatch=function(a,c){var d=b.keys(c),e=d.length;if(null==a)return!e;for(var f=Object(a),g=0;g<e;g++){var h=d[g];if(c[h]!==f[h]||!(h in f))return!1}return!0};var B,P;B=function(a,b,d,e){if(a===b)return 0!==
a||1/a===1/b;if(null==a||null==b)return a===b;if(a!==a)return b!==b;var f=typeof a;return"function"!==f&&"object"!==f&&"object"!==typeof b?!1:P(a,b,d,e)};P=function(a,c,d,e){a instanceof b&&(a=a._wrapped);c instanceof b&&(c=c._wrapped);var f=w.call(a);if(f!==w.call(c))return!1;switch(f){case "[object RegExp]":case "[object String]":return""+a===""+c;case "[object Number]":return+a!==+a?+c!==+c:0===+a?1/+a===1/c:+a===+c;case "[object Date]":case "[object Boolean]":return+a===+c}f="[object Array]"===
f;if(!f){if("object"!=typeof a||"object"!=typeof c)return!1;var g=a.constructor,h=c.constructor;if(g!==h&&!(b.isFunction(g)&&g instanceof g&&b.isFunction(h)&&h instanceof h)&&"constructor"in a&&"constructor"in c)return!1}d=d||[];e=e||[];for(g=d.length;g--;)if(d[g]===a)return e[g]===c;d.push(a);e.push(c);if(f){g=a.length;if(g!==c.length)return!1;for(;g--;)if(!B(a[g],c[g],d,e))return!1}else{f=b.keys(a);g=f.length;if(b.keys(c).length!==g)return!1;for(;g--;)if(h=f[g],!b.has(c,h)||!B(a[h],c[h],d,e))return!1}d.pop();
e.pop();return!0};b.isEqual=function(a,b){return B(a,b)};b.isEmpty=function(a){return null==a?!0:p(a)&&(b.isArray(a)||b.isString(a)||b.isArguments(a))?0===a.length:0===b.keys(a).length};b.isElement=function(a){return!(!a||1!==a.nodeType)};b.isArray=z||function(a){return"[object Array]"===w.call(a)};b.isObject=function(a){var b=typeof a;return"function"===b||"object"===b&&!!a};b.each("Arguments Function String Number Date RegExp Error".split(" "),function(a){b["is"+a]=function(b){return w.call(b)===
"[object "+a+"]"}});b.isArguments(arguments)||(b.isArguments=function(a){return b.has(a,"callee")});"function"!=typeof/./&&"object"!=typeof Int8Array&&(b.isFunction=function(a){return"function"==typeof a||!1});b.isFinite=function(a){return isFinite(a)&&!isNaN(parseFloat(a))};b.isNaN=function(a){return b.isNumber(a)&&a!==+a};b.isBoolean=function(a){return!0===a||!1===a||"[object Boolean]"===w.call(a)};b.isNull=function(a){return null===a};b.isUndefined=function(a){return void 0===a};b.has=function(a,
b){return null!=a&&S.call(a,b)};b.noConflict=function(){C._=Q;return this};b.identity=function(a){return a};b.constant=function(a){return function(){return a}};b.noop=function(){};b.property=A;b.propertyOf=function(a){return null==a?function(){}:function(b){return a[b]}};b.matcher=b.matches=function(a){a=b.extendOwn({},a);return function(c){return b.isMatch(c,a)}};b.times=function(a,b,d){var e=Array(Math.max(0,a));b=x(b,d,1);for(d=0;d<a;d++)e[d]=b(d);return e};b.random=function(a,b){null==b&&(b=a,
a=0);return a+Math.floor(Math.random()*(b-a+1))};b.now=Date.now||function(){return(new Date).getTime()};z={"\x26":"\x26amp;","\x3c":"\x26lt;","\x3e":"\x26gt;",'"':"\x26quot;","'":"\x26#x27;","`":"\x26#x60;"};A=b.invert(z);l=function(a){var c=function(b){return a[b]},d="(?:"+b.keys(a).join("|")+")",e=RegExp(d),f=RegExp(d,"g");return function(a){a=null==a?"":""+a;return e.test(a)?a.replace(f,c):a}};b.escape=l(z);b.unescape=l(A);b.result=function(a,c,d){c=null==a?void 0:a[c];void 0===c&&(c=d);return b.isFunction(c)?
c.call(a):c};var V=0;b.uniqueId=function(a){var b=++V+"";return a?a+b:b};b.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g,escape:/<%-([\s\S]+?)%>/g,tryCatch:!0};var W=/[a-zA-Z0-9][\.a-zA-Z0-9]*/g,G=/(.)^/,X={"'":"'","\\":"\\","\r":"r","\n":"n","\u2028":"u2028","\u2029":"u2029"},Y=/\\|'|\r|\n|\u2028|\u2029/g,Z=function(a){return"\\"+X[a]};b.template=function(a,c,d){!c&&d&&(c=d);c=b.defaults({},c,b.templateSettings);d=RegExp([(c.escape||G).source,(c.interpolate||G).source,
(c.evaluate||G).source].join("|")+"|$","g");var e=0,f="__p+\x3d'",g={};a.replace(d,function(d,h,k,l,m){f+=a.slice(e,m).replace(Y,Z);e=m+d.length;c.tryCatch&&(m=h||k||l)&&b.each(m.match(W),function(a){a=a.split(".");for(var b=g,c=0,d=a.length;c<d;c++)b=c==a.length-1?b[a[c]]=b[a[c]]||null:b[a[c]]=b[a[c]]||{}});h?f+="'+\n((__t\x3d("+h+"))\x3d\x3dnull?'':_.escape(__t))+\n'":k?f+="'+\n((__t\x3d("+k+"))\x3d\x3dnull?'':__t)+\n'":l&&(f+="';\n"+l+"\n__p+\x3d'");return d});f+="';\n";c.tryCatch?c.variable||
(f="with(_.defaults(obj||{}, "+JSON.stringify(g)+")){\n"+f+"}\n"):c.variable||(f="with(obj||{}){\n"+f+"}\n");var f="var __t,__p\x3d'',__j\x3dArray.prototype.join,print\x3dfunction(){__p+\x3d__j.call(arguments,'');};\n"+f+"return __p;\n",h;try{h=new Function(c.variable||"obj","_",f)}catch(k){throw k.source=f,k;}d=function(a){return h.call(this,a,b)};d.keys=b.keys(g);d.source="function("+(c.variable||"obj")+"){\n"+f+"}";return d};b.chain=function(a){a=b(a);a._chain=!0;return a};var H=function(a,c){return a._chain?
b(c).chain():c};b.mixin=function(a){b.each(b.functions(a),function(c){var d=b[c]=a[c];b.prototype[c]=function(){var a=[this._wrapped];R.apply(a,arguments);return H(this,d.apply(b,a))}})};b.mixin(b);b.each("pop push reverse shift sort splice unshift".split(" "),function(a){var c=y[a];b.prototype[a]=function(){var b=this._wrapped;c.apply(b,arguments);"shift"!==a&&"splice"!==a||0!==b.length||delete b[0];return H(this,b)}});b.each(["concat","join","slice"],function(a){var c=y[a];b.prototype[a]=function(){return H(this,
c.apply(this._wrapped,arguments))}});b.prototype.value=function(){return this._wrapped};b.prototype.valueOf=b.prototype.toJSON=b.prototype.value;b.prototype.toString=function(){return""+this._wrapped};"function"===typeof define&&define.amd&&define("underscore",[],function(){return b})})();