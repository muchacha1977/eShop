/**
 * Created by GOODPROFY on 30.06.2015.
 */
define([
    'app',
    'text!bundle/buyer/view/bonus/referral-stat-referrals.html',
    'moment',
    'lib/bootstrap-datetimepicker',
    'GoogleChart'
], function(
    App,
    viewStatReferrals,
    moment
){
    return App.module("Buyer.Bonus.Referral.Referrals", function (Referrals, App, Backbone, Marionette, $, _) {
        'use strict;'
        Referrals.ContainerView = Marionette.LayoutView.extend({
            template: _.template(viewStatReferrals),
            regions: {
                chart: '#chart',
                statistic: '#statistic',
                pagination: '#pagination'
            },
            events: {
                'click #vent-period': '_setPeriod'
            },
            _setPeriod: function(){
                var period_start = this.$("#period_start input").val();
                var period_end = this.$("#period_end input").val();

                require(["bundle/modal/modal"],
                    function (Modal) {
                        new Modal.View({text: "Функционал в разработке.", yes: "Закрыть", no: "", _template: "message", _static: false});
                    }
                );
            },
            _Columns: [

            ],
            _Grid: null,

            _Chart: null,
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
                var compile = this;
                var level = compile.model.get('levelReferrals');
                compile._Columns = [];

                compile._Columns.push(
                    {
                        name: 'creation',
                        label: 'Дата',
                        cell: 'string',
                        editable: false,
                        direction: "descending",
                    }
                );

                compile._Columns.push(
                    {
                        name: 'totalSum',
                        label: 'Итого',
                        cell: 'string',
                        editable: false,
                        formatter: _.extend({count: j}, Backgrid.CellFormatter.prototype, {
                            fromRaw: function (rawValue, model) {

                                var sum = _.values(model.toJSON());
                                sum = _.rest(sum);
                                var sumTotal = 0;

                                _.each(sum, function(arrEl){
                                    sumTotal+=arrEl;
                                });
                                return App.decimal(sumTotal);
                            }
                        })
                    }
                );
                for (var j = 1; j<=level; j++){

                    compile._Columns.push({
                        name: 'l'+j,
                        label: j+' уровень',
                        cell: 'html',
                        editable: false,
                        sortable: true,
                        formatter: _.extend({count: j}, Backgrid.CellFormatter.prototype, {
                            fromRaw: function (rawValue, model) {
                                if ( !rawValue ) return '';
                                var telega = _.template('<a class="url-detail" data-level="<%- count %>" data-srart="<%- creation %>" href="#buyer/bonus/referral/<%- count %>/<%- creation %>"><%- value %></a>');
                                return telega({count: this.count, value: App.decimal(rawValue), creation: model.get('creation')});
                            }
                        })
                    });
                }

                var _gridFooter = Backgrid.Footer.extend({

                    render: function () {
                        var _gridFooter = this;
                        var sum = 0;
                        var innerHTML = '';
                        var levels = [];
                        var chartLevel = [];
                        var chartSum = [];

                        chartLevel.push('Уровень');
                        chartSum.push('Сумма');
                        for (j = 1; j<=level; j++){
                            chartLevel.push('Уровень '+j);
                            levels.push(compile.collection.fullCollection.pluck('l'+j));
                        }
                        var template  = null;
                        _.each(levels, function(el,k){
                            var s = _gridFooter._sumArr(el);
                            template = _.template('<td class=""><a class="url-detail" href="<%- urlDetail %>"><%- sum %></a></td>');
                            innerHTML+=template({urlDetail: '#buyer/bonus/referral/'+(k+1)+'/'+ compile.$('#period_start input').val()+'/'+compile.$('#period_end input').val(), sum: App.decimal(s)});
                            chartSum.push(s);
                            sum+=s;
                        });
                        template = _.template('<tr class="active"><td><b>Итого</b></td><td><b><%- sum %></b></td><%= html %></tr>');
                        this.el.innerHTML = template({sum: App.decimal(sum), html: innerHTML});
                        console.log(chartLevel);
                        console.log(chartSum);

                        compile._Chart = new Backbone.GoogleChart({
                            chartType: 'ColumnChart',
                            dataTable: [chartLevel, chartSum],
                            options: {
                                title: 'Итого'
                            }
                        });

                        return this;
                    },
                    _sumArr: function(arr){
                        var sum = 0;
                        _.each(arr, function(value){
                            sum += value;
                        });
                        return sum;
                    }

                });



                var backGridVent = Backgrid.Row.extend({
                    events: {
                        "click .url-detail": "showDetail"
                    },
                    showDetail: function (e) {
                        var el = e.target || e.srcElement;
                        var data = $(el).data();
                        data.totalLevels = compile.model.get('levelReferrals');
                        console.clear();
                        console.log(data);

                        require(['bundle/buyer/bonus-referral-referrals-level'], function(Buyer){
                            compile.statistic.destroy();
                            compile.$('#pagination').hide();
                            compile.statistic.show( new Buyer.ContainerView(data) );
                        });

                        return false;

                    }
                });

                compile._Grid = new Backgrid.Grid({
                    className: "table table-hover",
                    columns : compile._Columns,
                    collection : compile.collection,
                    emptyText: "Нет данных для отображения.",
                    footer: _gridFooter,
                    row: backGridVent
                });

                compile.statistic.show( compile._Grid );
                compile.chart.show(compile._Chart);
                compile.pagination.show( new App.Pagination({collection: compile.collection}) );


            }
        });
    });
});