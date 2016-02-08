/**
 * Смена статусов в заказах
 * @version 0.0.2
 * Created by GOODPROFY on 31.07.2015.
 */
define([
    'app',
    "text!view/button-state-change.html",
    "text!view/button-state-change-full.html",
    "model/state"
], function(
    App,
    viewBtnStateChange,
    viewBtnStateChangeFull,
    Data
){
    return App.module('StateChange', function(StateChange, App, Backbone, Marionette, $, _){
        'use strict';
        this.onStart = function(options){

        };

        this.onStop = function(options){

        };

        this.View = Marionette.LayoutView.extend({
            template: _.template(viewBtnStateChange),
            collection: Data.State,
            initialize: function(options){
                var self = this;
                options || (options = {});
                this.options = options;
                if (! _.isUndefined(options.collection) ){
                    this.collection = options.collection.clone();
                }
                this.options = options;
                console.log(this.model.toJSON());
                var nextState = new Backbone.Collection();
                _.each(this.model.get('next'), function(stateId){
                    nextState.add(self.collection.findWhere({state: stateId, bulkActions: false}));
                });
                this.collection = nextState;
                if ( this.model.get('next').length == 0 ){
                    this.collection.reset();
                }
                console.log(this.options);
            },
            onRender: function(){
                var tmpl = new StateChange.ViewItems({collection: this.collection, selectedId: this.options.selectedId, execute: this.options.execute, urlRoot: this.options.urlRoot});
                tmpl.render();
                this.$('button').after(tmpl.el);
            }
        });

        this.ViewItem = Marionette.ItemView.extend({
            template: _.template('<a class="<%- className %>" id="<%- state %>" role="menuitem" tabindex="-1" href="#"><span class="<%- stateimg %>"></span> <%- statepop %></a>'),
            tagName: 'li role="presentation"',
            events: {
                'click a': '_selected'
            },
            initialize: function(options){
                options || (options = {});
                this.options = options;
                console.log(this.options);
            },
            _selected: function(){
                console.log(this.options);
                var order = Backbone.Model.extend({
                    urlRoot: App.config.rest+this.options.urlRoot
                });
                var o = new order({id: this.options.selectedId});
                var self = this;

                App.Dialog.confirm({
                    size: 'small',
                    message: self.model.get('confirm'),
                    callback: function(result){
                        if ( result ){
                            o.save({'state': self.model.get('state')},
                                {
                                    patch: true,
                                    success: function(){
                                        App.Wreqr.execute(self.options.execute);
                                    }
                                });
                        }

                    }
                });
                return false;
            }
        });

        this.ViewItems = Marionette.CollectionView.extend({
            childView: StateChange.ViewItem,
            tagName: 'ul',
            className: 'dropdown-menu',
            initialize: function(options){
                options || (options = {});
                this.options = options;
                console.log(this.options);
            },
            childViewOptions: function(model, index) {
                return {
                    selectedId: this.options.selectedId,
                    execute: this.options.execute,
                    urlRoot: this.options.urlRoot
                }
            }
        });


        /**
         * For Groups
         */


        this.Group = Marionette.LayoutView.extend({
            template: _.template(viewBtnStateChange),
            collection: Data.State,
            initialize: function(options){
                var self = this;
                options || (options = {});
                this.options = options;
                if (! _.isUndefined(options.collection) ){
                    this.collection = options.collection.clone();
                }
                this.options = options;
                console.log(this.model.toJSON());
                var nextState = new Backbone.Collection();
                _.each(this.model.get('next'), function(stateId){
                    nextState.add(self.collection.findWhere({state: stateId, bulkActions: true}));
                });
                this.collection = nextState;
                if ( this.model.get('next').length == 0 ){
                    this.collection.reset();
                }

                if (!_.isUndefined(this.options.tmpl) ){
                    this.template = _.template(viewBtnStateChangeFull);
                }
                console.log(this.options);
            },
            onRender: function(){
                var tmpl = new StateChange.GroupItems({collection: this.collection, selectedId: this.options.selectedId, execute: this.options.execute, urlRoot: this.options.urlRoot});
                tmpl.render();
                this.$('button').after(tmpl.el);
            }
        });

        this.GroupItem = Marionette.ItemView.extend({
            template: _.template('<a class="<%- className %>" id="<%- state %>" role="menuitem" tabindex="-1" href="#"><span class="<%- stateimg %>"></span> <%- statepop %></a>'),
            tagName: 'li role="presentation"',
            events: {
                'click a': '_selected'
            },
            initialize: function(options){
                options || (options = {});
                this.options = options;
                console.log(this.options);
            },
            _selected: function(){
                console.log(this.options);
                var order = Backbone.Model.extend({
                    urlRoot: App.config.rest+this.options.urlRoot
                });
                var o = new order({id: 'state'});
                var self = this;

                App.Dialog.confirm({
                    size: 'small',
                    message: self.model.get('confirm'),
                    callback: function(result){
                        if ( result ){
                            o.save(_.extend({cmd: self.model.get('state')}, {items: [self.options.selectedId]}), {
                                success: function(response){
                                    console.log(response);
                                    App.Wreqr.execute(self.options.execute);
                                },
                                error: function(response){
                                    console.log(response);
                                }
                            });
                        }

                    }
                });
                return false;
            }
        });

        this.GroupItems = Marionette.CollectionView.extend({
            childView: StateChange.GroupItem,
            tagName: 'ul',
            className: 'dropdown-menu',
            initialize: function(options){
                options || (options = {});
                this.options = options;
                console.log(this.options);
            },
            childViewOptions: function(model, index) {
                return {
                    selectedId: this.options.selectedId,
                    execute: this.options.execute,
                    urlRoot: this.options.urlRoot
                }
            }
        });


    });
});
