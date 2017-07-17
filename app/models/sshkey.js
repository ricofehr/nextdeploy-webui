import DS from 'ember-data';

/**
 *  Define the sshkey object model
 *
 *  @author Eric Fehr (ricofehr@nextdeploy.io, github: ricofehr)
 *  @class Sshkey
 *  @namespace model
 *  @module nextdeploy
 *  @augments DS/Model
 */
export default DS.Model.extend({
  /**
   *  @attribute key
   *  @type {String}
   */
  key: DS.attr('string'),

  /**
   *  @attribute name
   *  @type {String}
   */
  name: DS.attr('string'),

  /**
   *  @attribute gitlab_id
   *  @type {Integer}
   */
  gitlab_id: DS.attr('number'),

  /**
   *  @attribute user
   *  @type {User}
   */
  user: DS.belongsTo('user')
});
