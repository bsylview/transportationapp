(function (global, $) {
  'use strict';

  var TransportController = function(){
      return new TransportController.init();
  };

  TransportController.prototype = {
      fetchConnections:function(from, to, callback){
        var url = "https://transport.opendata.ch/v1/connections?from=" + from  + "&to=" + to;
        fetch(url).then(function(response){return  response.json()})
            .then(callback)
            .catch(function(error){
                toastr.options = {
                  "progressBar": true,
                  "positionClass": "toast-bottom-full-width"
                };
                toastr["error"]('', "Error fetching route! Check your internet connection!");

            });
      }

  };

  TransportController.init = function(){
      var self = this;
  };

  TransportController.init.prototype = TransportController.prototype;

  global.TransportController = global.$Transport = TransportController;
})(window, window.jquery);
