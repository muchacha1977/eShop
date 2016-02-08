define(["app",
		"moment"], function(App, moment, DataRegions) {
	return App.module("Data", function(Data, App, Backbone, Marionette, $, _) {

        
		//var Model = Backbone.Model.extend();
		this.TraderReports = App.PageableCollection.extend({
			url: 'mock/trader/reports-sale.json',
			//model: Model,
			formFilter : {
					layer		: null,
					startDate	: null,
					endDate		: null,
					productName	: null,
					categoryName: null,
					buyerName	: null
				},
			initialize: function() {
				_.bindAll(this, 'getQ');
				
				this.state.q = this.getQ;
			},
			getQ: function() {
				var q = [];
				var i = 0;
				for(var k in this.formFilter) {
					var value = this.formFilter[k];
					if(value !== null) {
						switch(k) {
							case 'productName':
							case 'categoryName':
							case 'buyerName':
								q[i] = k+".like("+value+')';
								i++;
								break;
							case 'startDate':
							case 'endDate':
								q[i] = k+".eq("+moment(value, "DD.MM.YY").format("x")+')';
								i++;
								break;
							default:
								q[i] = k+".eq("+value+')';
								i++;
						}
					}
				}
				return (q.length>0) ? q.join('.and.') : "";

			},
			setFilters: function(set) {
				for(var k in set) {
					this.formFilter[k] = set[k];
				}
			}
		});
    });
});