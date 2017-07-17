import DS from 'ember-data';

/**
 *  Define the uri object model
 *
 *  @author Eric Fehr (ricofehr@nextdeploy.io, github: ricofehr)
 *  @class Uri
 *  @namespace model
 *  @module nextdeploy
 *  @augments DS/Model
 */
export default DS.Model.extend({
  /**
   *  @attribute absolute
   *  @type {String}
   */
  absolute: DS.attr('string'),

  /**
   *  @attribute path
   *  @type {String}
   */
  path: DS.attr('string'),

  /**
   *  @attribute envvars
   *  @type {String}
   */
  envvars: DS.attr('string'),

  /**
   *  @attribute aliases
   *  @type {String}
   */
  aliases: DS.attr('string'),

  /**
   *  @attribute ipfilter
   *  @type {String}
   */
  ipfilter: DS.attr('string'),

  /**
   *  @attribute port
   *  @type {String}
   */
  port: DS.attr('string'),

  /**
   *  @attribute customvhost
   *  @type {String}
   */
  customvhost: DS.attr('string'),

  /**
   *  @attribute is_sh
   *  @type {Boolean}
   */
  is_sh: DS.attr('boolean'),

  /**
   *  @attribute is_import
   *  @type {Boolean}
   */
  is_import: DS.attr('boolean'),

  /**
   *  @attribute is_redir_alias
   *  @type {Boolean}
   */
  is_redir_alias: DS.attr('boolean'),

  /**
   *  @attribute is_main
   *  @type {Boolean}
   */
  is_main: DS.attr('boolean'),

  /**
   *  @attribute is_ssl
   *  @type {Boolean}
   */
  is_ssl: DS.attr('boolean'),

  /**
   *  @attribute vm
   *  @type {Vm}
   */
  vm: DS.belongsTo('vm'),

  /**
   *  @attribute framework
   *  @type {Framework}
   */
  framework: DS.belongsTo('framework')
});
