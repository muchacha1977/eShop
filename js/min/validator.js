+function(c){function h(a){return this.each(function(){var b=c(this),g=c.extend({},d.DEFAULTS,b.data(),"object"==typeof a&&a),e=b.data("bs.validator");if(e||"destroy"!=a)if(e||b.data("bs.validator",e=new d(this,g)),"string"==typeof a)e[a]()})}var d=function(a,b){this.$element=c(a);this.options=b;this.$element.attr("novalidate",!0);this.toggleSubmit();this.$element.on("input.bs.validator change.bs.validator focusout.bs.validator",c.proxy(this.validateInput,this));this.$element.on("submit.bs.validator",
c.proxy(this.onSubmit,this));this.$element.find("[data-match]").each(function(){var a=c(this),b=a.data("match");c(b).on("input.bs.validator",function(b){a.val()&&a.trigger("input")})})};d.DEFAULTS={delay:500,html:!1,errors:{match:"Does not match",minlength:"Not long enough"}};d.VALIDATORS={native:function(a){a=a[0];return a.checkValidity?a.checkValidity():!0},match:function(a){var b=a.data("match");return!a.val()||a.val()===c(b).val()},minlength:function(a){var b=a.data("minlength");return!a.val()||
a.val().length>=b}};d.prototype.validateInput=function(a){var b=c(a.target),d=b.data("bs.validator.errors");b.is('[type\x3d"radio"]')&&(b=this.$element.find('input[name\x3d"'+b.attr("name")+'"]'));this.$element.trigger(a=c.Event("validate.bs.validator",{relatedTarget:b[0]}));if(!a.isDefaultPrevented()){var e=this;this.runValidators(b).done(function(f){b.data("bs.validator.errors",f);f.length?e.showErrors(b):e.clearErrors(b);d&&f.toString()===d.toString()||(a=f.length?c.Event("invalid.bs.validator",
{relatedTarget:b[0],detail:f}):c.Event("valid.bs.validator",{relatedTarget:b[0],detail:d}),e.$element.trigger(a));e.toggleSubmit();e.$element.trigger(c.Event("validated.bs.validator",{relatedTarget:b[0]}))})}};d.prototype.runValidators=function(a){function b(b){return a.data(b+"-error")||a.data("error")||"native"==b&&a[0].validationMessage||f.errors[b]}var g=[],e=c.Deferred(),f=this.options;a.data("bs.validator.deferred")&&a.data("bs.validator.deferred").reject();a.data("bs.validator.deferred",e);
c.each(d.VALIDATORS,c.proxy(function(c,d){if((a.data(c)||"native"==c)&&!d.call(this,a)){var e=b(c);!~g.indexOf(e)&&g.push(e)}},this));!g.length&&a.val()&&a.data("remote")?this.defer(a,function(){c.get(a.data("remote"),[a.attr("name"),a.val()].join("\x3d")).fail(function(a,c,d){g.push(b("remote")||d)}).always(function(){e.resolve(g)})}):e.resolve(g);return e.promise()};d.prototype.validate=function(){var a=this.options.delay;this.options.delay=0;this.$element.find(":input").trigger("input");this.options.delay=
a;return this};d.prototype.showErrors=function(a){var b=this.options.html?"html":"text";this.defer(a,function(){var d=a.closest(".form-group"),e=d.find(".help-block.with-errors"),f=a.data("bs.validator.errors");f.length&&(f=c("\x3cul/\x3e").addClass("list-unstyled").append(c.map(f,function(a){return c("\x3cli/\x3e")[b](a)})),void 0===e.data("bs.validator.originalContent")&&e.data("bs.validator.originalContent",e.html()),e.empty().append(f),d.addClass("has-error"))})};d.prototype.clearErrors=function(a){a=
a.closest(".form-group");var b=a.find(".help-block.with-errors");b.html(b.data("bs.validator.originalContent"));a.removeClass("has-error")};d.prototype.hasErrors=function(){return!!this.$element.find(":input:enabled").filter(function(){return!!(c(this).data("bs.validator.errors")||[]).length}).length};d.prototype.isIncomplete=function(){return!!this.$element.find(":input[required]:enabled").filter(function(){return"checkbox"===this.type?!this.checked:"radio"===this.type?!c('[name\x3d"'+this.name+
'"]:checked').length:""===c.trim(this.value)}).length};d.prototype.onSubmit=function(a){this.validate();(this.isIncomplete()||this.hasErrors())&&a.preventDefault()};d.prototype.toggleSubmit=function(){this.$element.find('input[type\x3d"submit"], button[type\x3d"submit"]').toggleClass("disabled",this.isIncomplete()||this.hasErrors()).css({"pointer-events":"all",cursor:"pointer"})};d.prototype.defer=function(a,b){if(!this.options.delay)return b();window.clearTimeout(a.data("bs.validator.timeout"));
a.data("bs.validator.timeout",window.setTimeout(b,this.options.delay))};d.prototype.destroy=function(){this.$element.removeAttr("novalidate").removeData("bs.validator").off(".bs.validator");this.$element.find(":input").removeData(["bs.validator.errors","bs.validator.deferred","bs.validator.timeout"]).off(".bs.validator");this.$element.find(".help-block.with-errors").each(function(){var a=c(this),b=a.data("bs.validator.originalContent");a.removeData("bs.validator.originalContent").html(b)});this.$element.find('input[type\x3d"submit"], button[type\x3d"submit"]').removeClass("disabled");
this.$element.find(".has-error").removeClass("has-error");return this};var k=c.fn.validator;c.fn.validator=h;c.fn.validator.Constructor=d;c.fn.validator.noConflict=function(){c.fn.validator=k;return this};c(window).on("load",function(){c('form[data-toggle\x3d"validator"]').each(function(){var a=c(this);h.call(a,a.data())})})}(jQuery);