import DS from 'ember-data';

/**
 *  Define the commit object model
 *
 *  @author Eric Fehr (ricofehr@nextdeploy.io, github: ricofehr)
 *  @class Commit
 *  @namespace model
 *  @module nextdeploy
 *  @augments DS/Model
 */
export default DS.Model.extend({
  /**
   *  @attribute commit_hash
   *  @type {String}
   */
  commit_hash: DS.attr('string'),

  /**
   *  @attribute short_id
   *  @type {String}
   */
  short_id: DS.attr('string'),

  /**
   *  @attribute title
   *  @type {String}
   */
  title: DS.attr('string'),

  /**
   *  @attribute author_name
   *  @type {String}
   */
  author_name: DS.attr('string'),

  /**
   *  @attribute author_email
   *  @type {String}
   */
  author_email: DS.attr('string'),

  /**
   *  @attribute message
   *  @type {String}
   */
  message: DS.attr('string'),

  /**
   *  @attribute date
   *  @type {Date}
   */
  created_at: DS.attr('date'),

  /**
   *  @attribute branche
   *  @type {Branche}
   */
  branche: DS.belongsTo('branche'),

  /**
   *  @attribute vms
   *  @type {Vm[]}
   */
  vms: DS.hasMany('vm')
});
