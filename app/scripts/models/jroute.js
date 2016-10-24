/*global travellapp, Backbone*/

travellapp.Models = travellapp.Models || {};

(function () {
  'use strict';

  travellapp.Models.Jroute = Backbone.Model.extend({

    url: '',

    initialize: function() {
    },

    defaults: {
    },

    validate: function(attrs, options) {
    },

    parse: function(response, options)  {
      return response;
    }
  });

})();
