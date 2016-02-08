/**
 * Created by GOODPROFY on 01.07.2015.
 */
define([
    'app',
    'text!bundle/buyer/view/bonus/referral-referrals-level.html',
    'bundle/buyer/model/bonus'
], function(
    App,
    viewLevels,
    Data
){
    return App.module("Data.Buyer.Bonus.Level.Sum", function(Controller, App, Backbone, Marionette, $, _) {
        this.ContainerView = Marionette.LayoutView.extend({
            template: _.template(viewLevels),
            templateHelpers: function(){
                var self = this;

                return {
                    title: function(){
                        var tmpl = _.template('Ваш доход от <%- level %> уровня, c <%- start %> по <%- end %>');
                        return tmpl({level: self.options.level, start: self.options.start, end: self.options.end});
                    }
                }
            },
            initialize: function(options){
                options || (options = {});
                _.extend(this.options, options || (options = {}));
                console.clear();
                console.log(this.options);
            },
            regions: {
                statistic: '#statistic',
                pagination: '#pagination'
            },
            onRender: function(){
                var self = this;
                this.collection = new Data.ReferralsLevelSum();
                this.collection.fetch({reset: true}).done(function(){
                    var columns = [
                        {
                            name: 'creation',
                            label: 'Дата',
                            cell: 'string',
                            editable: false
                        },
                        {
                            name: 'nick',
                            label: 'Имя',
                            cell: 'string',
                            editable: false
                        },
                        {
                            name: 'sum',
                            label: 'Итого',
                            cell: 'string',
                            editable: false
                        },
                        {
                            name: 'referrals',
                            label: 'Кол-во рефералов',
                            cell: 'string',
                            editable: false
                        },
                        {
                            name: 'vvp',
                            label: '%',
                            cell: 'percent',
                            editable: false
                        }
                    ];

                    var grid = new Backgrid.Grid({
                        className: "table table-hover",
                        columns : columns,
                        collection : self.collection,
                        emptyText: "Нет данных для отображения."
                    });
                    self.statistic.show( grid );
                    self.pagination.show( new App.Pagination({collection: self.collection}) );
                });

            }
        });
    });
});