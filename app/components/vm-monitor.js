import Ember from 'ember';

/**
 *  This component manages monitor graphs modal on vm
 *
 *  @author Eric Fehr (ricofehr@nextdeploy.io, github: ricofehr)
 *  @class VmMonitor
 *  @namespace component
 *  @augments Ember.Component
 *  @module nextdeploy
 */
export default Ember.Component.extend({
  actions: {
    /**
     *  Toggle collapse a type of graphs
     *
     *  @event toggleCollapse
     *  @param {String} property
     */
    toggleCollapse: function(property) {
      this.toggleProperty(property);
    },

    /**
     *  Change time lapse of all graphs
     *
     *  @event changeTime
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
     *  @event closedMonitor
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
   *  @property systemCollapsed
   *  @type {Boolean}
   */
  systemCollapsed: false,

  /**
   *  Flag to collapse disk graphs
   *
   *  @property diskCollapsed
   *  @type {Boolean}
   */
  diskCollapsed: true,

  /**
   *  Flag to collapse apache graphs
   *
   *  @property apacheCollapsed
   *  @type {Boolean}
   */
  apacheCollapsed: true,

  /**
   *  Flag to collapse mysql graphs
   *
   *  @property mysqlCollapsed
   *  @type {Boolean}
   */
  mysqlCollapsed: true,

  /**
   *  Flag to collapse memcache graphs
   *
   *  @property memcacheCollapsed
   *  @type {Boolean}
   */
  memcacheCollapsed: true,

  /**
   *  Flag to collapse redis graphs
   *
   *  @property redisCollapsed
   *  @type {Boolean}
   */
  redisCollapsed: true,

  /**
   *  Flag to collapse elastic graphs
   *
   *  @property elasticCollapsed
   *  @type {Boolean}
   */
  elasticCollapsed: true,

  /**
   *  Flag to refresh graphs
   *
   *  @property isRefresh
   *  @type {Boolean}
   */
  isRefresh: false,

  /**
   *  Flag to display the loading modal
   *
   *  @property loadingModal
   *  @type {Boolean}
   */
  loadingModal: false,

  /**
   *  The no-cache attribute for graphs
   *
   *  @property nc
   *  @type {Integer}
   */
  nc: 0,

  /**
   *  Current time lapse for graphs
   *
   *  @property timeGraph
   *  @type {String}
   */
  timeGraph: '8h',

  /**
   *  Flag to set 10m timelapse
   *
   *  @property is10m
   *  @type {Boolean}
   */
  is10m: false,

  /**
   *  Flag to set 1h timelapse
   *
   *  @property is1h
   *  @type {Boolean}
   */
  is1h: false,

  /**
   *  Flag to set 8h timelapse
   *
   *  @property is8h
   *  @type {Boolean}
   */
  is8h: true,

  /**
   *  Flag to set 1d timelapse
   *
   *  @property is1d
   *  @type {Boolean}
   */
  is1d: false,

  /**
   *  Flag to set 7d timelapse
   *
   *  @property is7d
   *  @type {Boolean}
   */
  is7d: false,

  /**
   *  Flag to set 30d timelapse
   *
   *  @property is30d
   *  @type {Boolean}
   */
  is30d: false,

  /**
   *  Flag to set 90d timelapse
   *
   *  @property is90d
   *  @type {Boolean}
   */
  is90d: false,

  /**
   *  Flag to set 365d timelapse
   *
   *  @property is365d
   *  @type {Boolean}
   */
  is365d: false,

  /**
   *  Generates grafana host URI
   *
   *  @function getGrafanaHost
   *  @returns {String}
   */
  getGrafanaHost: function() {
    // HACK generates grafana URI from the WebUI one
    return window.location.hostname.replace(/^ui\./,'grafana.');
  }.property('isShowingMonitor'),

  /**
   *  Generates grafana script URI
   *
   *  @function getGrafanaUrl
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
   *  @function isMysql
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
   *  @function isApache
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
   *  @function isRedis
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
   *  @function isMemcache
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
   *  @function isElastic
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
   *  @function vmName
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
   *  @function isRunning
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
   *  @method waiting
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
   *  @method resetTimeFlags
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
   *  @method refreshGraphs
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
