import DS from 'ember-data';

/**
 *  Define the hpmessage object model
 *
 *  @author Eric Fehr (ricofehr@nextdeploy.io, github: ricofehr)
 *  @class Hpmessage
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
   *  @attribute message
   *  @type {String}
   */
  message: DS.attr('string'),

  /**
   *  @attribute ordering
   *  @type {Integer}
   */
  ordering: DS.attr('number'),

  /**
   *  @attribute is_twitter
   *  @type {String}
   */
  is_twitter: DS.attr('boolean'),

  /**
   *  @attribute date
   *  @type {String}
   */
  date: DS.attr('string')
});
