define([
    "app", 
    "text!bundle/app/view/home.html", 
    "text!bundle/app/view/shop-item.html", 
    "text!bundle/app/view/shop-profile.html",
    "model/shops", 
    "model/shop"
    ], function(App, homeTpl, shopTpl, profileTpl, Data) {
    App.module("Home", function(Home) {

    	var ShopView = Marionette.ItemView.extend({
    		className: 'shop-item row',

    		template: _.template(shopTpl),

            ui: {
                profile: '.js-profile',
                callBtn: '.js-call-manager',
                switchBtn: '.js-switch-active'
            },

            events: {
                'click @ui.profile': '_showProfile',
                'click @ui.callBtn': '_call',
                'click @ui.switchBtn': '_switch'
            },

            initialize: function () {
                if (this.model.get('active') == 0) {
                    this.$el.addClass('switched-off');
                } 

                _.bindAll(this, '_showProfile', '_call', '_switch', '_switchOff');
            },

            _showProfile: function (event) {
                Data.Shop.set('id', event.target.getAttribute('data-id'));
                // Data.Shop.fetch()
                Data.Shop.set({
                    shortName: "Go Go",
                    longName: "",
                    form: "",
                    itn: "",
                    trc: "",
                    psrn: "",
                    chckAccount: "",
                    corrAccount: "",
                    bic: "",
                    bank: "",
                    legalAddress: "",
                    postalAddress: "",
                    phone: "",
                    generalManager: "",
                    chiefAccountant: "",
                    contactPerson: "",
                    contactPhone: "",
                    id: "0FB60903-6217-4B49-90C6-65004A28EC1E"
                })

                App.dialogRegion.show(new ShopProfileView());    
            },

            _call: function () {
                require(["bundle/modal/modal"],
                    function(Modal) {
                        new Modal.View({
                            text: "Данный функционал находится в разработке",
                             _template: 'modal',
                             yes: 'OK',
                             no: '',
                             _centerBtn: true
                        });
                    }
                );
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
            }
    	})
        
        var ShopsListView = Marionette.CollectionView.extend({
        	tagName: 'div',

        	className: 'shops-list-wrapper',

        	collection: Data.Shops,

        	childView: ShopView
        });

        var ShopProfileView = Marionette.ItemView.extend({
            template: _.template(profileTpl),

            ui: {
                btn: '.js-ok'
            },

            events: {
                'click @ui.btn': '_close'           
            },

            model: Data.Shop,

            initialize: function (options) {
                _.bindAll(this, '_close');      
            },

            _close: function () {
                App.dialogRegion.empty();
                return false;  
            }        
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
