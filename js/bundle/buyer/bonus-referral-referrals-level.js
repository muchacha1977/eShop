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
    return App.module("Data.Buyer.Bonus.Level", function (Level, App, Backbone, Marionette, $, _) {
        this.ContainerView = Marionette.LayoutView.extend({
            options: {},
            templateHelpers: function(){
                var self = this;

                return {
                    title: function(){
                        var tmpl = _.template('Ваш доход от <%- level %> уровня, за <%- date %>');
                        return tmpl({level: self.options.level, date: self.options.srart});
                    }
                }
            },
            template: _.template(viewLevels),
            regions: {
                statistic: '#statistic',
                pagination: '#pagination'
            },
            initialize: function(options){
                _.extend(this.options, options || (options = {}));
                console.clear();
                console.log(this.options);
            },
            onRender: function(){
                var self = this;
                var collection = new Data.ReferralsLevel();
                collection.fetch({reset:true}).done(function(){
                    console.log(this.collection);
                    var columns = [];
                    columns.push({
                        name: 'nick',
                        label: 'Ник',
                        cell: 'string',
                        editable: false,
                        direction: "descending",
                    });

                    columns.push({
                        name: 'total',
                        label: 'Итого',
                        editable: false,
                        cell: Backgrid.NumberCell.extend({
                            orderSeparator: ' ',
                            decimalSeparator: ','
                        }),
                    });

                    for (var j = 1; j<=self.options.totalLevels-self.options.level; j++){

                        columns.push({
                            name: 'l'+j,
                            label: j+' уровень',
                            editable: false,
                            cell: Backgrid.NumberCell.extend({
                                orderSeparator: ' ',
                                decimalSeparator: ','
                            }),
                        });
                    };

                    var grid = new Backgrid.Grid({
                        className: "table table-hover",
                        columns : columns,
                        collection : collection,
                        emptyText: "Нет данных для отображения.",
                        //footer: _gridFooter,
                        //row: backGridVent
                    });
                    self.statistic.destroy();
                    self.pagination.destroy();
                    self.statistic.show( grid );
                    self.pagination.show( new App.Pagination({collection: collection}) );
                });
            }
        });

        this.ContainerIn = Marionette.LayoutView.extend({

        });
    });
});