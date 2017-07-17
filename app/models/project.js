import DS from 'ember-data';

/**
 *  Define the project object model
 *
 *  @author Eric Fehr (ricofehr@nextdeploy.io, github: ricofehr)
 *  @class Project
 *  @namespace model
 *  @module nextdeploy
 *  @augments DS/Model
 */
export default DS.Model.extend({
  /**
   *  @attribute name
   *  @type {String}
   */
  name: DS.attr('string'),

  /**
   *  @attribute gitpath
   *  @type {String}
   */
  gitpath: DS.attr('string'),

  /**
   *  @attribute enabled
   *  @type {Boolean}
   */
  enabled: DS.attr('boolean'),

  /**
   *  @attribute login
   *  @type {String}
   */
  login: DS.attr('string'),

  /**
   *  @attribute password
   *  @type {String}
   */
  password: DS.attr('string'),

  /**
   *  @attribute created_at
   *  @type {Date}
   */
  created_at: DS.attr('date'),

  /**
   *  @attribute is_ht
   *  @type {Boolean}
   */
  is_ht: DS.attr('boolean'),

  /**
   *  @attribute users
   *  @type {User[]}
   */
  users: DS.hasMany('user'),

  /**
   *  @attribute endpoints
   *  @type {Endpoint[]}
   */
  endpoints: DS.hasMany('endpoint'),

  /**
   *  @attribute technos
   *  @type {Techno[]}
   */
  technos: DS.hasMany('techno'),

  /**
   *  @attribute vmsizes
   *  @type {Vmsize[]}
   */
  vmsizes: DS.hasMany('vmsize'),

  /**
   *  @attribute systemimages
   *  @type {Systemimage[]}
   */
  systemimages: DS.hasMany('systemimage'),

  /**
   *  @attribute branches
   *  @type {Branche[]}
   */
  branches: DS.hasMany('branche'),

  /**
   *  @attribute owner
   *  @type {User}
   */
  owner: DS.belongsTo('user', {inverse: 'own_projects'}),

  /**
   *  @attribute brand
   *  @type {Brand}
   */
  brand: DS.belongsTo('brand'),

  /**
   *  @attribute vms
   *  @type {Vm[]}
   */
  vms: DS.hasMany('vm')
});
