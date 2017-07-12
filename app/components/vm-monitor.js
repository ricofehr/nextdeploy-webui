import Ember from 'ember';

/**
 *  This component manages monitor graphs modal on vm
 *
 *  @module components/vm-monitor
 *  @augments ember/Component
 */
export default Ember.Component.extend({
  actions: {
    /**
     *  Toggle collapse a type of graphs
     *
     *  @function
     *  @param {String} property
     */
    toggleCollapse: function(property) {
      this.toggleProperty(property);
    },

    /**
     *  Change time lapse of all graphs
     *
     *  @function
     *  @param {String} time the new time lapse
     */
    changeTime: function(time) {
      var self = this;

      this.set('nc', 0);
      this.set('timeGraph', time);
      this.resetTimeFlags();
      this.set('is'+time, true);

      self.set('loadingModal', true);
      Ember.run.later(function(){
        self.set('loadingModal', false);
      }, 5000);
    },

    /**
     *  Close the modal, reset component variables
     *
     *  @function
     */
    closedMonitor: function() {
      this.set('isBusy', false);
      this.set('systemCollapsed', false);
      this.set('mysqlCollapsed', true);
      this.set('diskCollapsed', true);
      this.set('apacheCollapsed', true);
      this.set('mysqlCollapsed', true);
      this.set('memcacheCollapsed', true);
      this.set('redisCollapsed', true);
      this.set('elasticCollapsed', true);
      this.set('timeGraph', '8h');
      this.resetTimeFlags();
      this.set('is8h', true);
      this.set('nc', 0);
      this.set('nc2', 0);
      this.set('vm', null);
      this.set('isShowingMonitor', false);
    }
  },

  /**
   *  Flag to collapse system graphs
   *
   *  @type {Boolean}
   */
  systemCollapsed: false,

  /**
   *  Flag to collapse disk graphs
   *
   *  @type {Boolean}
   */
  diskCollapsed: true,

  /**
   *  Flag to collapse apache graphs
   *
   *  @type {Boolean}
   */
  apacheCollapsed: true,

  /**
   *  Flag to collapse mysql graphs
   *
   *  @type {Boolean}
   */
  mysqlCollapsed: true,

  /**
   *  Flag to collapse memcache graphs
   *
   *  @type {Boolean}
   */
  memcacheCollapsed: true,

  /**
   *  Flag to collapse redis graphs
   *
   *  @type {Boolean}
   */
  redisCollapsed: true,

  /**
   *  Flag to collapse elastic graphs
   *
   *  @type {Boolean}
   */
  elasticCollapsed: true,

  /**
   *  Flag to refresh graphs
   *
   *  @type {Boolean}
   */
  isRefresh: false,

  /**
   *  Flag to display the loading modal
   *
   *  @type {Boolean}
   */
  loadingModal: false,

  /**
   *  The no-cache attribute for graphs
   *
   *  @type {Integer}
   */
  nc: 0,

  /**
   *  Current time lapse for graphs
   *
   *  @type {String}
   */
  timeGraph: '8h',

  /**
   *  Flag to set 10m timelapse
   *
   *  @type {Boolean}
   */
  is10m: false,

  /**
   *  Flag to set 1h timelapse
   *
   *  @type {Boolean}
   */
  is1h: false,

  /**
   *  Flag to set 8h timelapse
   *
   *  @type {Boolean}
   */
  is8h: true,

  /**
   *  Flag to set 1d timelapse
   *
   *  @type {Boolean}
   */
  is1d: false,

  /**
   *  Flag to set 7d timelapse
   *
   *  @type {Boolean}
   */
  is7d: false,

  /**
   *  Flag to set 30d timelapse
   *
   *  @type {Boolean}
   */
  is30d: false,

  /**
   *  Flag to set 90d timelapse
   *
   *  @type {Boolean}
   */
  is90d: false,

  /**
   *  Flag to set 365d timelapse
   *
   *  @type {Boolean}
   */
  is365d: false,

  /**
   *  Generates grafana host URI
   *
   *  @function
   *  @returns {String}
   */
  getGrafanaHost: function() {
    // HACK generates grafana URI from the WebUI one
    return window.location.hostname.replace(/^ui\./,'grafana.');
  }.property('isShowingMonitor'),

  /**
   *  Generates grafana script URI
   *
   *  @function
   *  @returns {String}
   */
  getGrafanaUrl: function() {
    // HACK generates grafana URI from the WebUI one
    if (window.location.hostname.match(/^ui\./)) {
      return window.location.protocol + "//" +
             window.location.hostname.replace(/^ui\./,'grafana.') +
             "/render/dashboard-solo/script/getdash.js";
    } else {
      // if local install
      return "/images/grafana.png";
    }

  }.property('isShowingMonitor'),

  /**
   *  Return true if vm includes a mysql techno
   *
   *  @function
   *  @returns {Boolean}
   */
  isMysql: function() {
    if (!this.get('vm')) {
      return false;
    }

    var technos = this.get('vm.project.technos');
    var ret = false;

    technos.forEach(function (techno) {
      // HACK techno name test (a dynamic value from api)
      if (techno.get('name').match(/mysql/)) {
        ret = true;
      }
    });

    return ret;
  }.property('isShowingMonitor'),

  /**
   *  Return true if vm includes an apache techno
   *
   *  @function
   *  @returns {Boolean}
   */
  isApache: function() {
    if (!this.get('vm')) {
      return false;
    }

    var technos = this.get('vm.project.technos');
    var ret = false;

    technos.forEach(function (techno) {
      // HACK techno name test (a dynamic value from api)
      if (techno.get('name').match(/apache/)) {
        ret = true;
      }
    });

    return ret;
  }.property('isShowingMonitor'),

  /**
   *  Return true if vm includes a redis techno
   *
   *  @function
   *  @returns {Boolean}
   */
  isRedis: function() {
    if (!this.get('vm')) {
      return false;
    }

    var technos = this.get('vm.project.technos');
    var ret = false;

    technos.forEach(function (techno) {
      // HACK techno name test (a dynamic value from api)
      if (techno.get('name').match(/redis/)) {
        ret = true;
      }
    });

    return ret;
  }.property('isShowingMonitor'),

  /**
   *  Return true if vm includes a memcache techno
   *
   *  @function
   *  @returns {Boolean}
   */
  isMemcache: function() {
    if (!this.get('vm')) {
      return false;
    }

    var technos = this.get('vm.project.technos');
    var ret = false;

    technos.forEach(function (techno) {
      // HACK techno name test (a dynamic value from api)
      if (techno.get('name').match(/memcache/)) {
        ret = true;
      }
    });

    // graphs not yet implemented
    ret = false;
    return ret;
  }.property('isShowingMonitor'),

  /**
   *  Return true if vm includes an elastic techno
   *
   *  @function
   *  @returns {Boolean}
   */
  isElastic: function() {
    if (!this.get('vm')) {
      return false;
    }

    var technos = this.get('vm.project.technos');
    var ret = false;

    technos.forEach(function (techno) {
      // HACK techno name test (a dynamic value from api)
      if (techno.get('name').match(/elastic/)) {
        ret = true;
      }
    });

    // graphs not yet implemented
    ret = false;
    return ret;
  }.property('isShowingMonitor'),

  /**
   *  Return vm name
   *
   *  @function
   *  @returns {String}
   */
  vmName: function() {
    if (!this.get('vm')) {
      return false;
    }

    return this.get('vm.name').substring(0,63);
  }.property('vm.name'),

  /**
   *  Return true if vm is on running state
   *
   *  @function
   *  @returns {Boolean}
   */
  isRunning: function() {
    if (!this.get('vm')) {
      return false;
    }

    if (parseInt(this.get('vm.status'), 10) > 0) { return true; }
    return false;
  }.property('vm.status'),

  /**
   *  Loading during graphs generation
   *
   *  @function
   */
  waiting: function() {
    var self = this;

    if (this.get('isShowingMonitor')) {
      this.refreshGraphs();

      self.set('loadingModal', true);
      Ember.run.later(function(){
        self.set('loadingModal', false);
      }, 3500);
    }
  }.observes('isShowingMonitor'),

  /**
   *  Reset to fall all time flags
   *
   *  @function
   */
  resetTimeFlags: function() {
    this.set('is10m', false);
    this.set('is1h', false);
    this.set('is8h', false);
    this.set('is1d', false);
    this.set('is7d', false);
    this.set('is30d', false);
    this.set('is90d', false);
    this.set('is365d', false);
  },

  /**
   *  Refresh graphs
   *
   *  @function
   */
  refreshGraphs: function() {
    var self = this;
    var nc = parseInt(this.get('nc'));

    if (!this.get('isShowingMonitor')) {
      return;
    }

    // change nc2 each minut to refresh graph images
    if (nc !== 0 && nc % 600 === 0) {
      this.set('nc2', nc/600);
    }

    // increment nc each 100ms
    this.set('nc', nc + 1);

    Ember.run.later(function(){
      self.refreshGraphs();
    }, 100);
  }
});
