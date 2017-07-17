import DS from 'ember-data';

/**
 *  Define the vmsize object model
 *
 *  @author Eric Fehr (ricofehr@nextdeploy.io, github: ricofehr)
 *  @class Vmsize
 *  @namespace model
 *  @module nextdeploy
 *  @augments DS/Model
 */
export default DS.Model.extend({
  /**
   *  @attribute title
   *  @type {String}
   */
  title: DS.attr('string'),

  /**
   *  @attribute description
   *  @type {String}
   */
  description: DS.attr('string'),

  /**
   *  @attribute projects
   *  @type {Project[]}
   */
  projects: DS.hasMany('project', {async: false}),

  /**
   *  @attribute vms
   *  @type {Vm[]}
   */
  vms: DS.hasMany('vm', {async: false})
});
