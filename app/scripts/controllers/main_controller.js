(function (global, $) {
  'use strict';

  var App = function(idb){
      return new App.init(idb);
  };

  App.prototype = {

      _openDB: function(){
        // If the browser doesn't support service worker,
        // we don't care about having a database
        if (!navigator.serviceWorker) {
          return Promise.resolve();
        }

        return idb.open('journeys', 1, function(upgradeDb) {
          var store = upgradeDb.createObjectStore('jroutes', {
            autoIncrement : true
          });
          store.createIndex('by-date', 'time');
        });
      },

      _defaultJourney: function(){
          var tr = $Transport();
          tr.fetchConnections('Lausanne','Zurich', function(data){
              this._cacheNewJourney(data);
          }.bind(this));
      },

      _cacheNewJourney: function(data) {
        if (data.connections === null || data.connections.length === 0){
          toastr.options = {
            "progressBar": true,
            "positionClass": "toast-bottom-full-width"
          };
          toastr["info"]('Please try again with valid entries!','No connections found!');
          return;
        };
        var journey = JSON.parse(JSON.stringify(data));
        var time = {};
        time['time'] = moment().toString();
        global.$.extend(true, journey, time);

        this._dbPromise.then(function(db) {
          if (!db) return;

          var tx = db.transaction('jroutes', 'readwrite');
          var store = tx.objectStore('jroutes');

          store.put(journey);

          // limit store to 30 items
          store.index('by-date').openCursor(null, "prev").then(function(cursor) {
            return cursor.advance(30);
          }).then(function deleteRest(cursor) {
            if (!cursor) return;
            cursor.delete();
            return cursor.continue().then(deleteRest);
          });
         });
         this._showJourney(journey);
      },

      _showCachedJourneys: function(callback) {
        var controller = this;

        return this._dbPromise.then(function(db) {
          if (!db || controller._showingData()) return;

          var index = db.transaction('jroutes')
            .objectStore('jroutes').index('by-date');

          return index.getAll().then(function(journeys) {
            if (journeys.length > 0){
                controller._showJourney(journeys.reverse()[0]);
            }
          });
        });
      },

      _showingData:function(){
          // console.log("in showing data");
      },

      _showJourney:function(journey){
        var prepJourney = $Util()._preprocessData(journey)
        var model = new travellapp.Models.Jroute(prepJourney);
        var view = new travellapp.Views.Jroute({model:model});
        global.$('#jroute').append(view.render().el);
      },

      _registerServiceWorker:function(){
          if (!navigator.serviceWorker) return;

          var controller = this;

          navigator.serviceWorker.register('/sw.js').then(function(reg) {
            if (!navigator.serviceWorker.controller) {
              controller._defaultJourney();
              return;
            }

            if (reg.waiting) {
              controller._updateReady(reg.waiting);
              return;
            }

            if (reg.installing) {
              controller._trackInstalling(reg.installing);
              return;
            }

            reg.addEventListener('updatefound', function() {
              controller._trackInstalling(reg.installing);
            });
          });

          // Ensure refresh is only called once.
          // This works around a bug in "force update on reload".
          var refreshing;
          navigator.serviceWorker.addEventListener('controllerchange', function() {
            if (refreshing) return;
            global.location.reload();
            refreshing = true;
          });
      },


      _trackInstalling: function(worker) {
        var controller = this;
        worker.addEventListener('statechange', function() {
          if (worker.state == 'installed') {
            controller._defaultJourney();

            controller._updateReady(worker);
          }
        });
      },

      _updateReady: function(worker) {
          toastr.options = {
            "closeButton": false,
            "debug": false,
            "newestOnTop": false,
            "progressBar": true,
            "positionClass": "toast-bottom-full-width",
            "preventDuplicates": true,
            "onclick": null,
            "showDuration": "300",
            "hideDuration": "1000",
            "timeOut": "5000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
          };
          var $toast = toastr["info"]('<div><button type="button" id="okToastBtn" class="btn btn-primary btn-md">Install update</button></div>', "New update!");
          if ($toast.find('#okToastBtn').length) {
              var controllerWorker = worker;
              $toast.delegate('#okToastBtn', 'click', function () {
                   controllerWorker.postMessage({action: 'skipWaiting'});
                   $toast.remove();
               });
          };
      }
  };

  App.init = function(idb){
      var self = this;
      this.idb = idb;
      this._dbPromise = this._openDB();
      this._registerServiceWorker();

      this._showCachedJourneys().then(function() {
        // console.log("finished - showing cached journeys!");
      });
  };

  App.init.prototype = App.prototype;

  global.App = global.$App = App;
})(window, window.jquery);
