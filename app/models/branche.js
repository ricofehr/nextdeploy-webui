import DS from 'ember-data';

/**
 *  Define the branche object model
 *
 *  @author Eric Fehr (ricofehr@nextdeploy.io, github: ricofehr)
 *  @class Branche
 *  @namespace model
 *  @module nextdeploy
 */
export default DS.Model.extend({
  /**
   *  @attribute name
   *  @type {String}
   */
  name: DS.attr('string'),

  /**
   *  @attribute project
   *  @type {Project}
   */
  project: DS.belongsTo('project'),

  /**
   *  @attribute commits
   *  @type {Commit[]}
   */
  commits: DS.hasMany('commit')
});
