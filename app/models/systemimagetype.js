import DS from 'ember-data';

/**
 *  Define the systemimagetype object model
 *
 *  @author Eric Fehr (ricofehr@nextdeploy.io, github: ricofehr)
 *  @class Systemimagetype
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
   *  @attribute systemimages
   *  @type {Systemimage[]}
   */
  systemimages: DS.hasMany('systemimage', {async: false})
});
