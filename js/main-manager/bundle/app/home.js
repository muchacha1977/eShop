define(["app", "text!bundle/app/view/home.html", "text!bundle/app/view/shop-item.html", "model/shops"], function(App, homeTpl, shopTpl, Data) {
    App.module("Home", function(Home) {

    	var ShopView = Marionette.ItemView.extend({
    		className: 'shop-item row',

    		template: _.template(shopTpl),

            ui: {
                deleteBtn: '.js-delete-shop',
                switchBtn: '.js-switch-active',
                repairBtn: '.js-repair-shop'
            },

            events: {
                'click @ui.deleteBtn': '_delete',
                'click @ui.switchBtn': '_switch',
                'click @ui.repairBtn': '_repair'
            },

            initialize: function () {
                if (this.model.get('active') == 0) {
                    this.$el.addClass('switched-off');
                } 

                _.bindAll(this, '_delete', '_switch', '_switchOff', '_repair');
            },

            onRender: function () {
                if (this.model.get('repair')) {
                    this.$el.addClass('on-repair')
                }
            },

            _delete: function () {
                this.model.collection.remove(this.model);
            },

            _switch: function (event) {
                //TODO: Запрос по отключению/включению магазина
                var target = $(event.target);
                if (target.hasClass('js-active')) {
                    require(["bundle/modal/modal"],
                        function(Modal) {
                            App.Wreqr.setHandler("modal:yes", this._switchOff);
                            new Modal.View({
                                text: "Магазин будет выключен и перестанет продавать. Продолжить?",
                                _template: 'modal',
                                yes: 'Да',
                                no: 'Нет',
                                classYes: "btn-default",
                                classNo: "btn-default",
                            });
                        }.bind(this));                          
                } else {
                    target.addClass('glyphicon-eye-open js-active').removeClass('glyphicon-eye-close');
                    this.$el.removeClass('switched-off');
                }
            },

            _switchOff: function () {
                this.ui.switchBtn.removeClass('glyphicon-eye-open js-active').addClass('glyphicon-eye-close');
                this.$el.addClass('switched-off');
            },

            _repair: function () {
                this.model.set('repair', 1);
                this.render();
            }
    	});
        
        var ShopsListView = Marionette.CollectionView.extend({
        	tagName: 'div',

        	className: 'shops-list-wrapper',

        	collection: Data.Shops,

        	childView: ShopView
        });

        Home.View = Marionette.LayoutView.extend({
            className: 'home-page',

            template: _.template(homeTpl),

            regions: {
            	home: '.js-sellers-manager'
            },

            onRender: function () {

            	this.home.show(new ShopsListView());
            }
        });
        
    });
    return App.Home;
});
