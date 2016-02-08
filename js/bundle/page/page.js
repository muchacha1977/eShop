/**
 * Статичные страницы
 * Created by GOODPROFY on 27.05.2015.
 * @example #page/namepage
 * namepage - должен лежать в папке view текущего бандла, при обращение к странице будет подключен нужный файл.
 * В сам #page наверное нужно вывести список всех стратичных страниц
 */
define(["app"], function(App) {
    return App.module("Page", function(Page) {
        Page.View = Marionette.View.extend({
            initialize: function(options){
                var self = this;

                require(["text!bundle/page/view/"+ options +".html"], function(viewPage) {
                    var page = new Page.Page({template: _.template(viewPage)});
                    App.getMainRegion().show(page);
                    App.loadCss('bundle/page/css/page.css');
                });

            },
            template: false
        });
        Page.Page = Marionette.ItemView.extend({

            onRender: function () {
                App.Breadcrumbs.reset();
            },

            events: {
                'click .registration': function(e){
                    var el = e.target || e.srcElement;
                    var options = {"action": $(el).data('action')};
                    require(["bundle/registration/registration"],
                        function(Registration) {
                            var dlg = new Registration.AppLayoutView(options);
                            App.getRegion("dialogRegion").show(dlg);
                        }
                    );
                }
            }
        });
        Page.All = Marionette.View.extend({
            initialize: function(options){
                var self = this;    
                require(["text!bundle/page/view/allpages.html"], function(viewAllPages) {
                    var allPages = new Marionette.ItemView({template: _.template(viewAllPages)});
                    App.getMainRegion().show(allPages);
                });

            },
            template: false
        });
  
  
    });
});