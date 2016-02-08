define([
	"app",
	"text!bundle/goods/view/good.html",
  "text!bundle/goods/view/goods.html",
  "text!bundle/goods/view/goods-info.html",
  "bundle/goods/model/goods"
  ], 
	function(App, goodTpl, goodsTpl, goodsInfoTpl, Data) {
    return App.module("Goods", function(Goods) {

        var GoodsInfoView = Marionette.ItemView.extend({
          template: _.template(goodsInfoTpl),
          model: Data.GoodsInfo
        });

        var GoodView = Marionette.ItemView.extend({
          template: _.template(goodTpl),

          className: 'good-item row'
        });

        var GoodsView = Marionette.CollectionView.extend({
          tagName: 'div',

          childView: GoodView,

          collection: Data.Goods
        });


        Goods.View = Marionette.LayoutView.extend({
            template: _.template(goodsTpl),

           	regions: {
              info: '.js-category-info',
              good: '.js-goods-wrapper'
            },

            onRender: function () {
              this.info.show(new GoodsInfoView());
              this.good.show(new GoodsView());
            }
        });
        
    });
});
