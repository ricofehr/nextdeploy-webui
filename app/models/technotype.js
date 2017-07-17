import DS from 'ember-data';

/**
 *  Define the technotype object model
 *
 *  @author Eric Fehr (ricofehr@nextdeploy.io, github: ricofehr)
 *  @class Technotype
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
   *  @attribute technos
   *  @type {Techno[]}
   */
  technos: DS.hasMany('techno')
});
