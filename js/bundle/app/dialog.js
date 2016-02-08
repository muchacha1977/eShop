define(["marionette"],
    function (Marionette) {
        return  Marionette.Region.extend({

            onShow: function(view){
                var self = this;
                this.listenTo(view, "dialog:hide", this.onHide);
                this.$el.on("hidden.bs.modal", function() {
                    self.reset();
                });
                this.$el.modal({
                    backdrop: true,
                    keyboard: true,
                    show: true
                });
            },

            onHide: function() {
                this.$el.modal("hide");
            }
    });

});
