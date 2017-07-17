import DS from 'ember-data';

/**
 *  Define the systemimage object model
 *
 *  @author Eric Fehr (ricofehr@nextdeploy.io, github: ricofehr)
 *  @class Systemimage
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
   *  @attribute glance_id
   *  @type {String}
   */
  glance_id: DS.attr('string'),

  /**
   *  @attribute enabled
   *  @type {Boolean}
   */
  enabled: DS.attr('boolean'),

  /**
   *  @attribute vms
   *  @type {Vm[]}
   */
  vms: DS.hasMany('vm', {async: false}),

  /**
   *  @attribute projects
   *  @type {Project[]}
   */
  projects: DS.hasMany('project', {async: false}),

  /**
   *  @attribute systemimagetype
   *  @type {Systemimagetype}
   */
  systemimagetype: DS.belongsTo('systemimagetype', {async: true})
});
