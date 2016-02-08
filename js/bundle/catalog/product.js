/**
 * Created by GOODPROFY on 25.08.2015.
 */
define([
    'app',
    'text!bundle/catalog/view/product/product.html',
    'text!bundle/catalog/view/product/offers.html',
    'text!view/shipment-types.html',
    'model/countries',
    'model/shipments'

], function (App,
             viewProduct,
             viewOffers,
             viewShipmentTypes,
             DataCountries,
             DataShipments
) {
    "use strict";
    return App.module("Catalog.Product", function (Product, App, Backbone, Marionette, $, _) {
        this.startWithParent = false;
        this.onStart = function (options) {
            console.log('Catalog.Product >>> Start');
            console.log(options);
            try {
                var product = new App.Catalog.Model.Product({id: options.id});

                $.when(App.Catalog.Model.Params.fetch({reset: true}), product.fetch()).done(function(){
                    console.log("--------------------------");
                    console.log(product.toJSON());
                    App.getMainRegion().show(new Product.Container({model: product}));
                });
            } catch (err) {
                console.log(err);
            }
        };

        this.onStop = function () {
            // never stop!
        };


        Product.Container = Marionette.LayoutView.extend({

            template: _.template(viewProduct),

            ui: {
                addBid: '#add-bid',
                addOffer: '#add-offer',
                addToCompareBtn: "#addToCompareButton",
                detailsShow: "#detailsBtn",
                triggerDetails: '#triggerDetailsBtn',
                mainImage: '.js-main-img',
                images: '.js-img'
            },

            events: {
                'click @ui.addOffer': '_addOffer',
                'click @ui.addBid': '_addBid',
                'click @ui.addToCompareBtn': '_showModal',
                'click @ui.triggerDetails': '_triggerDetails',
                'click @ui.images': '_swapImgSrc',
                'click @ui.mainImage': '_openImage'
            },

            regions: {
                regionProdPanel: '#prod-panel',
                regionDescription: '#prod-description',
                regionOffersGrid: '#prod-offers-grid table',
                regionOffersPager: '#prod-offers-pager',
                regionDetails: '#prod-details',
                regionComments: '#prod-comments',
                regionBidEngager: '#bidContainer',
                regionBirdPanel: '#prod-bird',
                regionBreadCrumbs: '#breadCrumbs'
            },

            initialize: function (options) {
                options || ( options = {} );
                var self = this;
                App.User.once('change', function () {
                    if (self.isDestroyed === true) {
                        return;
                    }
                    self.render();
                });
                this.listenTo(App.User, 'change', this._toggleBidEngager);
                App.loadCss('bundle/product/css/addtocompare.css');
                var paths = '';
                _.each(this.model.get('path'), function(path, idx){
                    if ( idx == 0 ) {
                        paths += 'catalog';
                        App.Breadcrumbs.add([{url: paths, title: path.name}]);
                    }else{
                        paths += '/'+path.id;
                        App.Breadcrumbs.add([{url: paths, title: path.name}]);
                    }

                });
                paths += '/'+this.model.get('id')+'.html';
                App.Breadcrumbs.add([{url: paths, title: this.model.get('name')}]);
            },
            serializeData: function () {
                var description = this.model.get("description") || "";
                var details = new Backbone.Collection();
                if ( ENV == 'dev' ){
                    details = App.Catalog.Model.Params;
                }
                var country;
                if (!_.isUndefined(this.model.get('manufacturer'))) {
                    country = DataCountries.Collection.findWhere({alpha2: this.model.get('manufacturer').country});
                }
                return _.extend(this.model.toJSON(), {
                    traderViewing: App.User.isTrader(),
                    shortDescription: (typeof this.model.get("shortDescription") == 'undefined') ? (description.substr(0, (description.length >= 150) ? 150 : description.length) + "...") : this.model.get('shortDescription'),
                    details: (typeof details !== "undefined") ? details.toJSON() : null,
                    country: (typeof country !== "undefined") ? country.toJSON() : null
                });
            },
            onRender: function () {
                var regionOffersGrid = this.regionOffersGrid;
                var regionBirdPanel = this.regionBirdPanel;
                var id = this.model.get('id');
                console.log(this.model.toJSON());

                var Offers = new App.Catalog.Model.Offers({id: this.model.get('id')});
                Offers.fetch({reset: true}).done(function () {
                    regionOffersGrid.show(new Product.Offers({collection: Offers}));
                });
                if (App.User.isTrader()) {
                    require(['bundle/catalog/product-bids'], function(){
                        regionBirdPanel.show(new App.Catalog.Product.Bids.Container({id: id}));
                    });
                }else{
                    this.$el.find('a[href="#prod-bird"]').hide();
                }


                if ( ENV == 'dev' ){
                    this.regionComments.show(new Product.Reviews());
                    this.regionDetails.show(new Product.Params({ collection: App.Catalog.Model.Params }));

                }else{
                    this.$el.find('a[href="#prod-comments"]').hide();
                }
            },
            onShow: function(){
                App.Catalog.Product.stop();
            },
            _openImage: function (event) {
                App.Dialog.dialog({
                    message: '<div class="text-center"><img src="' + event.target.getAttribute('src') + '"></div>'
                });
            },

            _swapImgSrc: function (event) {
                $(event.target).closest('.js-img').addClass('active').siblings().removeClass('active');
                this.ui.mainImage.attr('src', event.target.getAttribute('data-src'));
            },
            _toggleBidEngager: function () {
                this.render();
                if (App.User.isTrader()) {
                    $(this.regionBidEngager.el).hide();
                } else {
                    $(this.regionBidEngager.el).show();
                }
            },

            _addBid: function () {
                var id = this.model.get('id');
                require(['bundle/bid/bid', 'datetimepicker'], function (Bid) {
                    Bid.Start({id: id});
                });
            },
            _addOffer: function () {
                var self = this;
                require(['bundle/trader/offer-add'], function (Offer) {
                    App.dialogRegion.show(new Offer.offerLayout(self.model));
                });
            },
            _showModal: function () {
                App.alert({message: 'Функционал в разработке.'});
            },
            _triggerDetails: function() {
                this.$('a[href="#prod-details"]').tab('show');
                return false;
            }
        });


        this.Param	= Marionette.ItemView.extend({
            template : _.template('<td><span><%- name %></span></td><td><span><%- value %></span></td>'),
            tagName  : 'tr'
        });
        this.Params = Marionette.CompositeView.extend({
            template: _.template('<div class="product__section__row__characteristics table-responsive"><table class="table"><tbody></tbody></table></div>'),
            childView: Product.Param,
            childViewContainer: "tbody"
        });

        this.Reviews = Marionette.ItemView.extend({
            template: _.template('<h3 class="text-center">Функционал в разработке</h3>')
        });

        this.Offers = Marionette.LayoutView.extend({

            template: _.template(viewOffers),
            regions: {
                offerCurrentAskListRegion: "#offer-list",
                offerCurrentAskPagerRegion: "#offer-pagination"
            },
            initialize: function () {
                this.listenTo(this.collection, "backgrid:sort", this._setTooltip);
                this.listenTo(this.collection, "sync", this._setTooltip);
            },
            onRender: function () {

                var columns = [
                    {
                        name: "shop.name",
                        label: "Продавец",
                        cell: "html",
                        editable: false,
                        sortable: true,
                        formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
                            fromRaw: function (rawValue, model) {
                                return '<a class="btn-link" target="_blank" href="#' + model.attributes.shop.id + '">' + model.attributes.shop.name + '</a>';
                            }
                        })
                    },

                    {
                        name: "quantity",
                        label: "В наличии",
                        cell: "integer",
                        sortable: true,
                        editable: false
                    },
                    {
                        name: "unitPrice",
                        label: 'Цена',
                        cell: Backgrid.NumberCell.extend({
                            orderSeparator: ' ',
                            decimalSeparator: ','
                        }),
                        sortable: true,
                        editable: false,
                        direction: 'descending'
                    },
                    {
                        name: 'shipmentTypes',
                        label: 'Доставка',
                        cell: "htmlcenter",
                        editable: false,
                        sortable: true,
                        formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
                            fromRaw: function (rawValue, model) {
                                if (typeof model.attributes.shipmentTypes === 'undefined') return;
                                var shipment = new Backbone.Collection();
                                _.each(DataShipments.ShipmentsPrototype.toJSON(), function (value, key, list) {
                                    if (model.attributes.shipmentTypes[value.id] == true) {
                                        shipment.add(DataShipments.ShipmentsPrototype.at(key));
                                    }
                                });
                                var template = _.template(viewShipmentTypes);
                                return template({shipmentsTypes: shipment.toJSON()});
                            }
                        })
                    },
                    {
                        name: "price",
                        label: '',
                        cell: "html",
                        editable: false,
                        sortable: false,
                        formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
                            fromRaw: function (rawValue, model) {
                                if (!App.User.isTrader()) {
                                    return '<div class="input-group counter">' + '<span class="input-group-btn left-btn">' +
                                        '<button class="btn btn-default js-amount-minus" type="button" disabled>' + '-' + '</button>' +
                                        '</span>' + '<input type="text" name="input" class="form-control js-amount-input" value="1">' + '<span class="input-group-btn right-btn">'
                                        + '<button class="btn btn-default js-amount-plus" type="button">' + '+' + '</button>' + '</span>'
                                        + '</div>';
                                }
                                return;


                            }
                        })
                    },
                    {
                        name: "addtocard",
                        label: '',
                        cell: "html",
                        editable: false,
                        sortable: false,
                        formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
                            fromRaw: function (rawValue, model) {
                                if (!App.User.isTrader()) {
                                    return '<button class="btn btn-primary product-btn-cart-small glyphicon glyphicon-shopping-cart" type="button"' +
                                        'data-cart="' + model.id + '"' +
                                        'data-offer-id="' + model.id + '"' +
                                        'data-offer-amount="1">' + ' ' + '</button>'
                                        + '<button class="btn btn-primary product-btn-cart" type="button"' +
                                        'data-offer="' + model.id + '"' +
                                        'data-cart="' + model.id + '"' +
                                        'data-offer-amount="1">' + 'В корзину'
                                        + '</button>';
                                }
                                return;
                            }
                        })
                    }


                ];

                var clickByLinkAsks = Backgrid.Row.extend({
                    events: {
                        "click .btn--shop": "onClick",
                        "click .js-amount-minus": "onClickAmountMinus",
                        "click .js-amount-plus": "onClickAmountPlus",
                        "click button[data-cart]": "onCart"
                    },
                    ui: {
                        toShop: '.js-shop-href',
                        toCart: 'button[data-cart]',
                        amountInput: '.js-amount-input',
                        amountMinus: '.js-amount-minus',
                        amountPlus: '.js-amount-plus'
                    },
                    onClick: function (e) {
                        //e.preventDefault();
                        //pp.dialogRegion.show(new Product.Dialog({model: this.model}));  //TODO!
                    },
                    onClickAmountMinus: function (e) {
                        console.log("onclick _removeGood ");

                        var val = parseInt(this.$('.js-amount-input').val()) - 1;
                        this.$('.js-amount-input').val(val);
                        this.$('button[data-cart]').attr('data-offer-amount', val);

                        if (val == 1) {
                            this.$('.js-amount-minus').attr('disabled', 1);
                        }
                        return false;
                    },
                    onClickAmountPlus: function (e) {
                        console.log("onclick _addGood ");
                        this.$('.js-amount-minus').removeAttr('disabled');

                        var val = parseInt(this.$('.js-amount-input').val()) + 1;
                        this.$('.js-amount-input').val(val);
                        this.$('button[data-cart]').attr('data-offer-amount', val);
                        return false;
                    },
                    onCart: function (e) {
                        console.log("onclick to card ");
                        App.vent.trigger('cart:add', e);
                    }
                });

                var backGrid = new Backgrid.Grid({
                    className: "table table-hover",
                    columns: columns,
                    collection: this.collection,
                    emptyText: "Нет предложений данного товара.",
                    row: clickByLinkAsks
                });

                this.offerCurrentAskListRegion.show(backGrid);
                this.offerCurrentAskPagerRegion.show(new App.Pagination({collection: this.collection}));
            },
            _setTooltip: function () {
                App.tooltip();
            }
        });

    });
});
