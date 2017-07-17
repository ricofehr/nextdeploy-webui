import DS from 'ember-data';

/**
 *  Define the supervise object model
 *
 *  @author Eric Fehr (ricofehr@nextdeploy.io, github: ricofehr)
 *  @class Supervise
 *  @namespace model
 *  @module nextdeploy
 *  @augments DS/Model
 */
export default DS.Model.extend({
  /**
   *  @attribute status
   *  @type {Boolean}
   */
  status: DS.attr('boolean'),

  /**
   *  @attribute techno
   *  @type {Techno}
   */
  techno: DS.belongsTo('techno', {async: false}),

  /**
   *  @attribute vm
   *  @type {Vm}
   */
  vm: DS.belongsTo('vm', {async: false})
});
