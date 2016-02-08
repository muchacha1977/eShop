define([
    "app",
    "bundle/catalog/model/catalog",
    "text!bundle/movingbox/view/movingbox.html"
], function (App, Data, movingboxTpl) {
    "use strict";
    return App.module("Movingbox", function (Movingbox, App, Backbone, Marionette, $, _) {


        this.View = Marionette.LayoutView.extend({
            template: _.template(movingboxTpl),
            regions: {
                topslider: '#carousel_inner'
            },
            events: {
                'click #next': '_next',
                'click #prev': '_prev'
            },
            initialize: function(){
                this.listenTo(Data.Branches, 'sync', this.render);
            },
            _next: function(){
                var self = this;
                var item_width = this.$('#carousel_ul div').outerWidth() + 30;
                var left_indent = parseInt(this.$('#carousel_ul').css('left')) - item_width;
                this.$('#carousel_ul:not(:animated)').animate({
                    'left': left_indent
                }, 500, function () {
                    self.$('#carousel_ul div:last').after(self.$('#carousel_ul div:first'));
                    self.$('#carousel_ul').css({
                        'left': '-130px'
                    });
                });
                return false;
            },
            _prev: function(){
                var self = this;
                var item_width = this.$('#carousel_ul div').outerWidth() + 30;
                var left_indent = parseInt(this.$('#carousel_ul').css('left')) + item_width;
                this.$('#carousel_ul:not(:animated)').animate({
                    'left': left_indent
                }, 500, function () {
                    self.$('#carousel_ul div:first').before(self.$('#carousel_ul div:last'));
                    self.$('#carousel_ul').css({
                        'left': '-130px'
                    });
                });
                return false;
            },
            onRender: function(){
                this.topslider.show( new Movingbox.Items({ collection: Data.Branches }) );
            }
        });

        this.Item = Marionette.ItemView.extend({
            template: _.template('<a href="#catalog/<%- name %>"><i class="<%- icon %>"></i><p><%- name %></p></a>'),
            className: 'col-md-1 col-sm-6 col-xs-12 col-lg-1'
        });

        this.Items = Marionette.CollectionView.extend({
            childView: Movingbox.Item,
            tagName: 'div id="carousel_ul"'
        });


    });
});