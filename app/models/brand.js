import DS from 'ember-data';

/**
 *  Define the brand object model
 *
 *  @author Eric Fehr (ricofehr@nextdeploy.io, github: ricofehr)
 *  @class Brand
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
   *  @attribute logo
   *  @type {String}
   */
  logo: DS.attr('string'),

  /**
   *  @attribute projects
   *  @type {Project[]}
   */
  projects: DS.hasMany('project')
});
