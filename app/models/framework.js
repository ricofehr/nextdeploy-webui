import DS from 'ember-data';

/**
 *  Define the framework object model
 *
 *  @author Eric Fehr (ricofehr@nextdeploy.io, github: ricofehr)
 *  @class Framework
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
   *  @attribute publicfolder
   *  @type {String}
   */
  publicfolder: DS.attr('string'),

  /**
   *  @attribute rewrites
   *  @type {String}
   */
  rewrites: DS.attr('string'),

  /**
   *  @attribute endpoints
   *  @type {Endpoint[]}
   */
  endpoints: DS.hasMany('endpoint', {async: false}),

  /**
   *  @attribute uris
   *  @type {Uri[]}
   */
  uris: DS.hasMany('uri', {async: false})
});
