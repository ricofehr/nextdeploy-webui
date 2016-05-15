import Ember from 'ember';

export default Ember.Component.extend({
  systemCollapsed: false,
  diskCollapsed: true,
  apacheCollapsed: true,
  mysqlCollapsed: true,
  memcacheCollapsed: true,
  redisCollapsed: true,
  elasticCollapsed: true,
  isRefresh: false,
  nc: 0,
  timeGraph: '8h',
  is10m: false,
  is1h: false,
  is8h: true,
  is1d: false,
  is7d: false,
  is30d: false,
  is90d: false,
  is365d: false,

  // Return ftp host for current project
  getGrafanaHost: function() {
    return window.location.hostname.replace(/^ui\./,'grafana.');
  }.property('isShowingMonitor'),

  // get branch name (fix for weird bug with name property)
  branchName: function() {
    if (!this.get('vm')) {
      return null;
    }

    return this.get('vm.commit.id').replace(/^[0-9][0-9]*-/,'').replace(/-[A-Za-z0-9][A-Za-z0-9]*$/,'');
  }.property('vm.commit'),

  // Check if we have mysql into model
  isMysql: function() {
    if (!this.get('vm')) {
      return false;
    }

    var technos = this.get('vm.project.technos');
    var ret = false;

    technos.forEach(function (techno) {
      if (techno.get('name').match(/mysql/)) {
        ret = true;
      }
    });

    return ret;
  }.property('isShowingUris'),

  // Check if we have apache into model
  isApache: function() {
    if (!this.get('vm')) {
      return false;
    }

    var technos = this.get('vm.project.technos');
    var ret = false;

    technos.forEach(function (techno) {
      if (techno.get('name').match(/apache/)) {
        ret = true;
      }
    });

    return ret;
  }.property('isShowingUris'),

  // Check if we have redis into model
  isRedis: function() {
    if (!this.get('vm')) {
      return false;
    }

    var technos = this.get('vm.project.technos');
    var ret = false;

    technos.forEach(function (techno) {
      if (techno.get('name').match(/redis/)) {
        ret = true;
      }
    });

    return ret;
  }.property('isShowingUris'),

  // Check if we have redis into model
  isMemcache: function() {
    if (!this.get('vm')) {
      return false;
    }

    var technos = this.get('vm.project.technos');
    var ret = false;

    technos.forEach(function (techno) {
      if (techno.get('name').match(/memcache/)) {
        ret = true;
      }
    });

    // graphs not yet implemented
    return false;
  }.property('isShowingUris'),

  // Check if we have redis into model
  isElastic: function() {
    if (!this.get('vm')) {
      return false;
    }

    var technos = this.get('vm.project.technos');
    var ret = false;

    technos.forEach(function (techno) {
      if (techno.get('name').match(/elastic/)) {
        ret = true;
      }
    });

    // graphs not yet implemented
    return false;
  }.property('isShowingUris'),

  // short vm name
  vmName: function() {
    if (!this.get('vm')) {
      return false;
    }

    return this.get('vm.name').substring(0,63);
  }.property('vm.name'),

  // Return true if is running state
  isRunning: function() {
    if (!this.get('vm')) {
      return false;
    }

    if (parseInt(this.get('vm.status'), 10) > 0) { return true; }
    return false;
  }.property('vm.status'),

  // refresh graphs images
  refreshGraphs: function() {
    var self = this;
    var nc = parseInt(this.get('nc'));

    if (!this.get('isShowingMonitor')) {
      return;
    }

    // change nc2 each minut to refresh graph images
    if (nc !== 0 && nc%600 === 0) {
      this.set('nc2', nc/600);
    }

    // increment nc each 100ms
    this.set('nc', nc + 1);

    Ember.run.later(function(){
      self.refreshGraphs();
    }, 100);
  }.observes('isShowingUris'),

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

  actions: {
    // toggle collapse property
    toggleCollapse: function(property) {
      this.toggleProperty(property);
    },

    // change time lapse of graphs
    changeTime: function(time) {
      this.set('nc', 0);
      this.set('timeGraph', time);
      this.resetTimeFlags();
      this.set('is'+time, true);
    },

    // close the modal, reset showing variable
    closeMonitor: function() {
      var self = this;

      this.set('isShowingMonitor', false);
      this.set('isBusy', false);

      // little pause before reset vm for avoif clipping
      Ember.run.later(function(){
        self.set('systemCollapsed', false);
        self.set('mysqlCollapsed', true);
        self.set('diskCollapsed', true);
        self.set('apacheCollapsed', true);
        self.set('mysqlCollapsed', true);
        self.set('memcacheCollapsed', true);
        self.set('redisCollapsed', true);
        self.set('elasticCollapsed', true);
        self.set('timeGraph', '8h');
        self.resetTimeFlags();
        self.set('is8h', true);
        self.set('nc', 0);
        self.set('nc2', 0);
        self.set('vm', null);
      }, 500);
    }
  }
});
