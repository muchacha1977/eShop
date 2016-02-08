/**
 * Created by GOODPROFY on 21.07.2015.
 */
define([
    'app',
    'text!bundle/export/view/export.html',
    'moment',
    'datetimepicker'
], function(
    App,
    viewExport,
    moment
){
    return App.module('Export', function(Export){
        this.View = Marionette.LayoutView.extend({
            template: _.template(viewExport),
            events: {
                'click #download': '_download'
            },
            _download: function(){
                App.Dialog.alert({message: 'Функционал в разработке.'});
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
    })
});