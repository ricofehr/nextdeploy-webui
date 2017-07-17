import DS from 'ember-data';

/**
 *  Define the group object model
 *
 *  @author Eric Fehr (ricofehr@nextdeploy.io, github: ricofehr)
 *  @class Group
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
   *  @attribute access_level
   *  @type {Integer}
   */
  access_level: DS.attr('number'),

  /**
   *  @attribute users
   *  @type {User[]}
   */
  users: DS.hasMany('user', {async: false})
});
