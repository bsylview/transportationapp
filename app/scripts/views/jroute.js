/*global Travellapp, Backbone, JST*/

travellapp.Views = travellapp.Views || {};

(function () {
  'use strict';

  travellapp.Views.Jroute = Backbone.View.extend({

    template: JST['app/scripts/templates/jroute.ejs'],

    el: $('#jroute'),

    events: {

    },

    initialize: function () {
      this.listenTo(this.model, 'change', this.render);
    },

    render: function () {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    }

  });

})();
