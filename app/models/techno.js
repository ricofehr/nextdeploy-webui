import DS from 'ember-data';

/**
 *  Define the techno object model
 *
 *  @author Eric Fehr (ricofehr@nextdeploy.io, github: ricofehr)
 *  @class Techno
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
   *  @attribute technotype
   *  @type {Technotype}
   */
  technotype: DS.belongsTo('technotype'),

  /**
   *  @attribute projects
   *  @type {Project[]}
   */
  projects: DS.hasMany('project', {async: false}),

  /**
   *  @attribute vms
   *  @type {Vm[]}
   */
  vms: DS.hasMany('vm', {async: false}),

  /**
   *  @attribute supervises
   *  @type {Supervise[]}
   */
  supervises: DS.hasMany('supervise', {async: false})
});
