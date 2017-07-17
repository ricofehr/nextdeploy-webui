import DS from 'ember-data';

/**
 *  Define the vm object model
 *
 *  @author Eric Fehr (ricofehr@nextdeploy.io, github: ricofehr)
 *  @class Vm
 *  @namespace model
 *  @module nextdeploy
 *  @augments DS/Model
 */
export default DS.Model.extend({
  /**
   *  @attribute nova_id
   *  @type {String}
   */
  nova_id: DS.attr('string'),

  /**
   *  @attribute floating_ip
   *  @type {String}
   */
  floating_ip: DS.attr('string'),

  /**
   *  @attribute vnc_url
   *  @type {String}
   */
  vnc_url: DS.attr('string'),

  /**
   *  @attribute thumb
   *  @type {String}
   */
  thumb: DS.attr('string'),

  /**
   *  @attribute created_at
   *  @type {Date}
   */
  created_at: DS.attr('date'),

  /**
   *  @attribute name
   *  @type {String}
   */
  name: DS.attr('string'),

  /**
   *  @attribute topic
   *  @type {String}
   */
  topic: DS.attr('string'),

  /**
   *  @attribute status
   *  @type {Integer}
   */
  status: DS.attr('number'),

  /**
   *  @attribute is_auth
   *  @type {Boolean}
   */
  is_auth: DS.attr('boolean'),

  /**
   *  @attribute htlogin
   *  @type {String}
   */
  htlogin: DS.attr('string'),

  /**
   *  @attribute htpassword
   *  @type {String}
   */
  htpassword: DS.attr('string'),

  /**
   *  @attribute termpassword
   *  @type {String}
   */
  termpassword: DS.attr('string'),

  /**
   *  @attribute layout
   *  @type {String}
   */
  layout: DS.attr('string'),

  /**
   *  @attribute is_prod
   *  @type {Boolean}
   */
  is_prod: DS.attr('boolean'),

  /**
   *  @attribute is_cached
   *  @type {Boolean}
   */
  is_cached: DS.attr('boolean'),

  /**
   *  @attribute is_ht
   *  @type {Boolean}
   */
  is_ht: DS.attr('boolean'),

  /**
   *  @attribute is_ci
   *  @type {Boolean}
   */
  is_ci: DS.attr('boolean'),

  /**
   *  @attribute is_backup
   *  @type {Boolean}
   */
  is_backup: DS.attr('boolean'),

  /**
   *  @attribute is_cors
   *  @type {Boolean}
   */
  is_cors: DS.attr('boolean'),

  /**
   *  @attribute is_ro
   *  @type {Boolean}
   */
  is_ro: DS.attr('boolean'),

  /**
   *  @attribute is_jenkins
   *  @type {Boolean}
   */
  is_jenkins: DS.attr('boolean'),

  /**
   *  @attribute is_offline
   *  @type {Boolean}
   */
  is_offline: DS.attr('boolean'),

  /**
   *  @attribute technos
   *  @type {Techno[]}
   */
  technos: DS.hasMany('techno'),

  /**
   *  @attribute uris
   *  @type {Uri[]}
   */
  uris: DS.hasMany('uri'),

  /**
   *  @attribute commit
   *  @type {Commit}
   */
  commit: DS.belongsTo('commit'),

  /**
   *  @attribute project
   *  @type {Project}
   */
  project: DS.belongsTo('project'),

  /**
   *  @attribute user
   *  @type {User}
   */
  user: DS.belongsTo('user'),

  /**
   *  @attribute systemimage
   *  @type {Systemimage}
   */
  systemimage: DS.belongsTo('systemimage'),

  /**
   *  @attribute vmsize
   *  @type {Vmsize}
   */
  vmsize: DS.belongsTo('vmsize'),

  /**
   *  @attribute supervises
   *  @type {Supervise[]}
   */
  supervises: DS.hasMany('supervise')
});
