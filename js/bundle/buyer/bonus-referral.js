/**
 * Created by GOODPROFY on 26.06.2015.
 */
define([
    'app',
    'text!bundle/buyer/view/bonus/referral.html',
    'moment',
    'bundle/buyer/model/bonus',
    'lib/bootstrap-datetimepicker'
], function(
    App,
    viewReferral,
    moment,
    Data
){
    return App.module("Buyer.Bonus.Referral", function (Referral, App, Backbone, Marionette, $, _) {
        'use strict;'
        this.onStart = function () {
            console.log("Buyer.Bonus.Referral >>> started");
        };

        this.onStop = function () {
            console.log("Buyer.Bonus.Referral <<< stopped");
        };

        this.ContainerView = Marionette.LayoutView.extend({
            template: _.template(viewReferral),
            regions: {
                main: '#buyer-bonus-referral-main'
            },
            events: {
                'click #vent-url-construct': '_urlConstruct',
                'click #vent-stat-levels': '_statLevels',
                'click #vent-stat-traf': '_statTraf',
                'click #vent-stat-referrals': '_statReferrals'
            },
            _urlConstruct: function(){
                var self = this;
                self.main.destroy();
                require(['bundle/buyer/bonus-referral-url-constructor'], function(UrlConstruct){
                    self.main.show(new UrlConstruct.ContainerView({model:self.model}));
                });
            },
            _statLevels: function(){
                var self = this;
                self.main.destroy();

                require(['bundle/buyer/bonus-referral-referrals'], function(Referrals){
                    statistic = new Data.Referrals();
                    statistic.reset([]);
                    statistic.fetch({reset:true}).done(function(){
                        self.main.show( new Referrals.ContainerView({collection: statistic, model: self.model}));
                    });
                });
            },
            _statTraf: function(){
                var self = this;
                self.main.destroy();

                require(['bundle/buyer/bonus-referral-traffic'], function(StatTraf){
                    var collection = new Data.Traffic();
                    collection.fetch({reset: true}).done(function(){
                        console.log(collection.toJSON());
                        self.main.show( new StatTraf.ContainerView({collection: collection}) );
                    });
                });
            },
            _statReferrals: function(){
                var self = this;
                self.main.destroy();
                require(['text!bundle/buyer/view/bonus/referral-affiliate-levels.html'], function(viewAffLevels){

                    var compile = Marionette.LayoutView.extend({
                        template: _.template(viewAffLevels)
                    });

                    model = new Data.AffiliateLevels();

                    model.fetch().done(function(){
                        self.main.show( new compile({model:model}) );
                    });
                });
            },
            model: new Backbone.Model({
                id: 0,
                aid: 0,
                levelIncome: 0,
                levelNumberReferrals: 0,
                totalReferrs: 0,
                totalDay: 0,
                totalMonth: 0,
                totalYear: 0,
                totalTime: 0,
                statPreviusDay: {
                    "max": 0,
                    "nick": ""
                }
            }),

            initialize: function(){
                var self = this;
                model = new Data.Referral();
                model.fetch().done(function(){
                    console.log(model.toJSON());
                    self.model.set(model.toJSON());
                    self.render();
                });
            },
            onRender: function(){
                this.$('#period_start').datetimepicker({
                    format: 'DD.MM.YYYY',
                    defaultDate: moment().subtract(7, 'days')
                });
                this.$('#period_end').datetimepicker({
                    format: 'DD.MM.YYYY',
                    defaultDate: moment().format()
                });
                this.$("#period_start").on("dp.change", function (e) {
                    $('#period_end').data("DateTimePicker").minDate(e.date);
                });
                this.$("#period_end").on("dp.change", function (e) {
                    $('#period_start').data("DateTimePicker").maxDate(e.date);
                });
            }
        });
    });
});