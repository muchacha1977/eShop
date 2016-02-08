define(['app',
        'bundle/modal/modal',
        'text!bundle/product/view/current.html',
        'text!bundle/product/view/current-offers.html',
        'text!bundle/product/view/product-container.html',
        'text!bundle/product/view/product-panel.html',
        'text!bundle/product/view/product-offer-item.html',
        'text!bundle/product/view/thead.html',
        'text!bundle/product/view/product-details.html',
        'text!bundle/product/view/product-detail-item.html',
		
        'text!bundle/product/view/breadcrumb-item.html',
        'text!bundle/product/view/breadcrumbs.html',
		
        'bundle/authentication/authentication',
        'text!view/product-link.html',
        'text!view/region-link.html',
        'text!view/shipment-types.html',
        'text!view/button-state.html',
        'moment',
        'bundle/product/model/product',
        'model/user',
        'model/regions',
        'model/state',
        'model/bid',
        'model/shipments',
        'model/catalog',
        'lib/bootstrap-datetimepicker',
        'jquery.tablesorter',
        'jquery.tablesorter.widgets',
        'bundle/shops/model/shops',
    ],
    function (
        App,
        Modal,
        currentBirdTpl,
        currentOffersTpl,
        containerTpl,
        panelTpl,
        offerItemTpl,
        theadTpl,
		detailsTpl,
		detailItemTpl,
        breadcrumbItemTpl,
        breadcrumbsTpl,
        Authentication,
        viewProductLink,
        viewRegionLink,
        viewShipmentTypes,
        viewBtnState,
        moment,
        Data,
        UserData,
        DataRegions
    ) {

        App.module('Product', function (Product, App, Backbone, Marionette, $, _) {


			var BreadcrumbsItem = Backbone.Marionette.ItemView.extend({

                template: _.template(breadcrumbItemTpl),

                tagName: 'li',

                model: Data.Catalog.CatNodeCollection.model,

                initialize: function() {
                    this.collection = this.model.nodes;
                }
            });

            var Breadcrumbs = Marionette.CollectionView.extend({
                childView: BreadcrumbsItem,
				template: breadcrumbsTpl,
				tagName: 'ol',
				className: 'breadcrumb',
				initialize: function() {
					this.render();
				}
            });

            // -------------------- ProductView --------------------

            var ProductView = Marionette.ItemView.extend({
                template: _.template(panelTpl),
                model: Data.Product,

                ui: {
                    mainImage: '.js-main-img',
                    images: '.js-img'
                },

                modelEvents: {
                    'sync': 'render',
                },

                events: {
                    'click @ui.images': '_swapImgSrc',
                    'click @ui.mainImage': '_openImage'
                },

                initialize: function () {
                    _.bindAll(this, '_swapImgSrc', '_openImage');
                    var self = this;
                    App.User.once('change', function () {
                        if (self.isDestroyed === true) {
                            return;
                        }
                        self.render();
                    });
                    this.render();
                },

                serializeData: function () {
					var description = this.model.get("description") || "";
					var details = this.model.get('detailCollection');
					if(typeof this.model.get('country') !== 'undefined') {
						var country = Data.Countries.Collection.findWhere({alpha2: this.model.get('country')});
					} else {
						if(typeof this.model.get('manufacturer') !== 'undefined')
							var country = Data.Countries.Collection.findWhere({alpha2: this.model.get('manufacturer').country});
					}
					return _.extend(this.model.toJSON(), {
						traderViewing		: App.User.isTrader(),
						shortDescription	: (typeof this.model.get("shortDescription") == 'undefined') ?(description.substr(0,(description.length>=150) ?150: description.length)+"...") : this.model.get('shortDescription'),
						details				: (typeof details !== "undefined") ? details.toJSON() : null,
						countryInfo			: (typeof country !== "undefined") ? country.toJSON() : null
					});
                },

                _openImage: function (event) {
                    App.getDialogRegion(new Modal.View({
                            _template: 'message',
                            text: '<img src="' + event.target.getAttribute('src') + '">'
                        }
                    ));
                },

                _swapImgSrc: function (event) {
					$(event.target).closest('.js-img').addClass('active').siblings().removeClass('active');
                    this.ui.mainImage.attr('src', event.target.getAttribute('data-src'));
                }
            });


            // -------------------- SmallViews --------------------

			var DetailView	= Marionette.ItemView.extend({
				template : _.template(detailItemTpl),
				tagName  : 'tr'
			});
            var DetailsView = Marionette.CompositeView.extend({
                template: _.template(detailsTpl),
                childView: DetailView,
                childViewContainer: "tbody",
            });

            var CommentsView = Marionette.ItemView.extend({
                template: _.template('<h3 class="text-center">Функционал в разработке</h3>')
            });

            var DescriptionView = Marionette.ItemView.extend({
                model: Data.Product,
                template: _.template('<%= description %>'),
                modelEvents: {
                    'sync': 'render'
                }/*,
                initialize: function () {
                    console.log("init DescriptionView >>");
                }*/
            });

            // -------------------- OffersView --------------------

            var OffersView = Marionette.LayoutView.extend({

                template: _.template(currentOffersTpl),
                regions: {
                    offerCurrentAskListRegion: "#offer-list",
                    offerCurrentAskPagerRegion: "#offer-pagination"
                },
                initialize: function () {
                    console.log("init OffersView >>");
                },


                onBeforeShow: function () {
                    // TODO Переделать!
                    var self = this;

                    var Offers = App.PageableCollection.extend({

                        url: function() {
                            return "rest/v0/offer/p/" + Data.Product.get('id');
                        },

                        state: {
                            pageSize: 10,
                            sortKey: "shop.name",
                            order: -1
                        }
                    });

                    console.log(Data.Product.toJSON());

                    var OffersColection = new Offers();

                    OffersColection.fetch({reset: true}).done(function () {
                        var columns = [{
                            name: "shop.name",
                            label: "Продавец",
                            cell: "html",
                            editable: false,
                            sortable: true,
                            formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
                                fromRaw: function (rawValue, model) {
                                    return '<a class="btn-link" target="_blank" href="#prodlist/-/' + model.attributes.shop.id + '/-">' + model.attributes.shop.name + '</a>';
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
                                editable: false
                            },
                            {
                                name: 'shipmentTypes',
                                label: 'Доставка',
                                cell: "html",
                                editable: false,
                                sortable: false,
                                formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
                                    fromRaw: function (rawValue, model) {
                                        if (typeof model.attributes.shipmentTypes === 'undefined') return;
                                        var shipment = new Backbone.Collection();
                                        _.each(Data.ShipmentsPrototype.toJSON(), function (value, key, list) {
                                            if (model.attributes.shipmentTypes[value.id] == true) {
                                                shipment.add(Data.ShipmentsPrototype.at(key));
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
                            },


                        ];

                        var clickByLinkAsks = Backgrid.Row.extend({
                            events: {
                                "click .btn--shop": "onClick",
                                "click .js-amount-minus": "onClickAmountMinus",
                                "click .js-amount-plus": "onClickAmountPlus",
                                "click button[data-cart]": "onCart",
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
						
						// TODO: Это метод определения, находимся ли мы в магазине при просмотре товара.
						var inShop = (Data.ShopInfo.get('id')) ? Data.ShopInfo.get('id') : false;
						

                        var backGrid = new Backgrid.Grid({
                            className: "table table-hover",
                            columns: columns,
                            collection: OffersColection,
                            emptyText: "Нет предложений данного товара.",
                            row: clickByLinkAsks
                        });

                        self.offerCurrentAskListRegion.show(backGrid);
                        self.offerCurrentAskPagerRegion.show(new App.Pagination({collection: OffersColection}));

                        App.tooltip();
                        App.tooltip('.btn--tooltip', 'top', 'Открыть');
                        App.tooltip('.sortable a', 'top', 'Сортировка');

                        //DataRegions.stop();

                    });

                }
            });


            //-------------AsksView --------------------//

            var AsksView = Marionette.LayoutView.extend({

                template: _.template(currentBirdTpl),
                regions: {
                    birdCurrentAskListRegion: "#bird-list",
                    birdCurrentAskPagerRegion: "#bird-pagination"
                },
                initialize: function () {
                    console.log("init AsksView >>");
                },
                onBeforeShow: function () {
                    if (App.User.isTrader()) {
                        DataRegions.start();
                        var self = this;
                        var Bids = new Data.Bid.ActiveCurrentBids();
                        Bids.on('change', Bids.onChange); 
                        $.when(
                            DataRegions.Collection.fetch({reset: true}),
                            Bids.fetch({reset: true}))
                            .done(function () {
                                console.log("done!"); 
                                Bids.trigger('change');          
                                var columns = [{
                                    name: "name",
                                    label: "№",
                                    cell: "html",
                                    editable: false,
                                    sortable: false,
                                    formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
                                        fromRaw: function (rawValue, model) {
                                            return '<a class="btn-link btn--tooltip btn--asks" href="#birds/asks/' + model.get('id') + '">' + rawValue + '</a>'; //todo--href="#birds/asks/?
                                        }
                                    })
                                },
                                    {
                                        name: "creationTime",
                                        label: "Размещено",
                                        editable: false,
                                        cell: 'html',
                                        direction: "descending",
                                        formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
                                            fromRaw: function (rawValue, model) {
                                                return '<span data-toggle="tooltip" data-original-title="' + moment(rawValue).format('DD.MM.YY HH:mm') + '" data-placement="top"  id="creationTime' + model.get('id') + '">' + moment(rawValue).format('DD.MM.YY') + '</span>';
                                            }
                                        })

                                    },
                                    {
                                        name: "validUntil",
                                        label: "Окончание",
                                        cell: "datetime",
                                        editable: false,
                                        formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
                                            fromRaw: function (rawValue) {
                                                return moment(rawValue).format('DD.MM.YY');
                                            }
                                        })
                                    },
                                    {
                                        name: "product.barCode",
                                        label: "Штрихкод",
                                        cell: "string",
                                        editable: false,
                                        formatter: {
                                            fromRaw: function (rawValue, model) {
                                                return model.attributes.product.barCode;
                                            }
                                        }
                                    },
                                    {
                                        name: "product.name",
                                        label: "Товар",
                                        cell: 'html',
                                        editable: false,
                                        formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
                                            fromRaw: function (rawValue, model) {
                                                var template = _.template(viewProductLink);
                                                return template(model.attributes.product);
                                            }
                                        })
                                    },
                                    {
                                        name: "quantity",
                                        label: "Кол-во",
                                        cell: "integer",
                                        sortable: false,
                                        editable: false
                                    },
                                    {
                                        name: "unitPrice",
                                        label: 'Цена',
                                        cell: "number",
                                        editable: false
                                    },
                                    {
                                        name: 'totalPrice',
                                        label: 'Стоимость',
                                        cell: "number",
                                        editable: false
                                    },
                                    {
                                        name: 'region',
                                        label: 'Регион',
                                        cell: "html",
                                        editable: false,
                                        formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
                                            fromRaw: function (rawValue, model) {
                                                var find = DataRegions.Collection.findWhere({id: rawValue});
                                                if (typeof find === 'undefined') return '';
                                                var template = _.template(viewRegionLink);
                                                return template({name: find.get('name')});
                                            }
                                        })
                                    },
                                    {
                                        name: 'shipmentTypes',
                                        label: 'Доставка',
                                        cell: "html",
                                        editable: false,
                                        sortable: false,
                                        formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
                                            fromRaw: function (rawValue, model) {
                                                if (typeof model.attributes.shipmentTypes === 'undefined') return;
                                                var shipment = new Backbone.Collection();
                                                _.each(Data.ShipmentsPrototype.toJSON(), function (value, key, list) {
                                                    if (model.attributes.shipmentTypes[value.id] == true) {
                                                        shipment.add(Data.ShipmentsPrototype.at(key));
                                                    }
                                                });
                                                var template = _.template(viewShipmentTypes);
                                                return template({shipmentsTypes: shipment.toJSON()});
                                            }
                                        })
                                    },
                                    {
                                        name: 'asks',
                                        label: 'Откликов',
                                        cell: "integer",
                                        sortable: false,
                                        editable: false
                                    },
                                    {
                                        name: "asks",
                                        label: "Откликнуться",
                                        editable: false,
                                        cell: 'html',
                                        formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
                                            fromRaw: function (rawValue, model) {
                                                return '<button typ="button" id="createAskBtn" class="btn btn-primary btn-block">' + 'Откликнуться' +
                                                '</button>';
                                            }
                                        })

                                    }
                                   
                                ];

                                var clickByLinkAsks = Backgrid.Row.extend({
                                    events: {
                                        "click .btn--asks": "onClick",
                                        'click #createAskBtn': 'onDetail'
                        
                                    },
                                    onClick: function (e) {
                                        return false;

                                    },
                                    onDetail: function(e){
                                        console.log("onDetail");

                                        var selfModel = this.model;
                                        console.log("selfModel" + JSON.stringify(selfModel));

                                        require(['bundle/trader/bids-detail'], function (BidsDetail) {
                                            App.dialogRegion.show(new BidsDetail.BidView({model: selfModel}));
                                           
                                        });
                                        return false;
                                        
                                    }
                                });

                                var backGrid = new Backgrid.Grid({
                                    className: "table table-hover",
                                    columns: columns,
                                    collection: Bids,
                                    emptyText: "У вас нет активных заявок на этот товар",
                                    row: clickByLinkAsks
                                });

                                self.birdCurrentAskListRegion.show(backGrid);
                                self.birdCurrentAskPagerRegion.show(new App.Pagination({collection: Bids}));

                                App.tooltip();
                                App.tooltip('.btn--tooltip', 'top', 'Открыть');
                                App.tooltip('.sortable a', 'top', 'Сортировка');

                                //DataRegions.stop();

                            });
                    } else {
                        console.log("Ask  dont't shown, its buyer!");
                    }

                }//
            });


            // -------------------- Container --------------------

            Product.Container = Marionette.LayoutView.extend({

                template: _.template(containerTpl),

                ui: {
                    addBid: '#add-bid',
                    addOffer: '#add-offer',
                    addToCompareBtn: "#addToCompareButton",
					detailsShow : "#detailsBtn",
					triggerDetails	: '#triggerDetailsBtn'
                },

                events: {
                    'click @ui.addOffer': '_addOffer',
                    'click @ui.addBid': '_addBid',
                    'click @ui.addToCompareBtn': '_showModal',
					'click @ui.detailsShow': '_showDetails',
					'click @ui.triggerDetails': '_triggerDetails'
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
                    options = options || {};
                    this.listenTo(UserData.user, 'change', this._toggleBidEngager);
                    App.loadCss('bundle/product/css/addtocompare.css');
                },
                serializeData: function () {
					//console.log(this.model);
					var details = this.model.get('detailCollection');
                    return _.extend(this.model.toJSON(), {
						traderViewing	: App.User.isTrader(),
						details			:  (typeof details !== "undefined") ? details.toJSON() : null
					});
                },

                onShow: function () {
                    var self = this;

                    Data.Product.fetch().done(function(){
                        self._toggleBidEngager();

                        self.regionProdPanel.show(new ProductView({
                            model: Data.Product
                        }));

                        Data.ShopStatus.currentProduct = Data.Product.get('id');
                        console.log("Data.ShopStatus.currentProduct  in prodlist" + Data.ShopStatus.currentProduct );
                        self.regionOffersGrid.show(new OffersView());

                        self.regionDetails.show(new DetailsView({
							collection: Data.Details
						}));
                        self.regionComments.show(new CommentsView());
                        self.regionDescription.show(new DescriptionView());
                        /*this.regionOffersPager.show(new Custom.Paginator({
                         collection: Data.OffersCollection
                         }));*/
                        self.regionBirdPanel.show(new AsksView());
						
						var breadcrumbsNodes = new Backbone.Model();
						breadcrumbsNodes.fetch({url: "rest/v0/product?c="+Data.Product.get('category_id')}).done(function() {
							var a = self.parseBreadcrumbs(breadcrumbsNodes.get('tree'));
							self.regionBreadCrumbs.show(new Breadcrumbs({collection: new Backbone.Collection(self.parseBreadcrumbs(breadcrumbsNodes.get('tree')))}));
						});
						
                    });
                },
				parseBreadcrumbs: function(tree) {
					var self = this;
					console.log(tree);
					var obj = {};
					if(!tree.id.trim()) {
						var a = [{ico: "yes", name: "Home", href: "#home"},{name: tree.name, href: "#categories"}];
						return a.concat(self.parseBreadcrumbs(tree.nodes[0]));
					}
					obj = {name: tree.name, href: "#prodlist/"+tree.id};
					
					if(typeof tree.nodes !== 'undefined') {
						var a = new Array(obj); 	
						return a.concat(self.parseBreadcrumbs(tree.nodes[0]));
					} else {
						return obj;
					}
				},
				_triggerDetails: function() {
					$(this.ui.detailsShow).trigger('click');
				},
				_showDetails: function() {
					var detailView = this.regionDetails.currentView
					detailView.collection.fetch({
						success: function() {
							detailView.render();
						}
					});
				},

                _toggleBidEngager: function () {
                    if (Data.user.isTrader()) {
                        $(this.regionBidEngager.el).hide();
                    } else {
                        $(this.regionBidEngager.el).show();
                    }
                },

                _addBid: function () {
                    require(['bundle/bid/bid'], function (Bid) {
                        Bid.Start();
                    });
                },
                _addOffer: function () {
                    var self = this;
                    require(['bundle/trader/offer-add'], function (Offer) {
                        App.dialogRegion.show(new Offer.offerLayout(self.model));
                    });
                },
                _showModal: function () {
                    require(["bundle/modal/modal"],
                        function (Modal) {
                            App.Wreqr.setHandler("modal:yes", function () {
                                console.log("yes");

                            });
                            App.Wreqr.setHandler("modal:no", function () {
                                console.log("No");
                            });
                            new Modal.View({text: "Функционал в разработке. ", _template: "message", _static: false});

                        }
                    );

                },
            });


            console.log('product view created');

        });
        return App.Product;
    });