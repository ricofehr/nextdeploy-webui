import DS from 'ember-data';

/**
 *  Define the user object model
 *
 *  @author Eric Fehr (ricofehr@nextdeploy.io, github: ricofehr)
 *  @class User
 *  @namespace model
 *  @module nextdeploy
 *  @augments DS/Model
 */
export default DS.Model.extend({
  /**
   *  @attribute email
   *  @type {String}
   */
  email: DS.attr('string'),

  /**
   *  @attribute authentication_token
   *  @type {String}
   */
  authentication_token: DS.attr('string'),

  /**
   *  @property is_project_create
   *  @type {Boolean}
   */
  is_project_create: DS.attr('boolean'),

  /**
   *  @property is_user_create
   *  @type {Boolean}
   */
  is_user_create: DS.attr('boolean'),

  /**
   *  @property is_recv_vms
   *  @type {Boolean}
   */
  is_recv_vms: DS.attr('boolean'),

  /**
   *  @attribute company
   *  @type {String}
   */
  company: DS.attr('string'),

  /**
   *  @attribute quotavm
   *  @type {Intger}
   */
  quotavm: DS.attr('number'),

  /**
   *  @attribute quotaprod
   *  @type {Intger}
   */
  quotaprod: DS.attr('number'),

  /**
   *  @attribute nbpages
   *  @type {Intger}
   */
  nbpages: DS.attr('number'),

  /**
   *  @attribute layout
   *  @type {String}
   */
  layout: DS.attr('string'),

  /**
   *  @attribute firstname
   *  @type {String}
   */
  firstname: DS.attr('string'),

  /**
   *  @attribute lastname
   *  @type {String}
   */
  lastname: DS.attr('string'),

  /**
   *  @attribute created_at
   *  @type {Date}
   */
  created_at: DS.attr('date'),

  /**
   *  @attribute shortname
   *  @type {String}
   */
  shortname: DS.attr('string'),

  /**
   *  @attribute vms
   *  @type {Vm[]}
   */
  vms: DS.hasMany('vm'),

  /**
   *  @attribute sshkeys
   *  @type {Sshkey[]}
   */
  sshkeys: DS.hasMany('sshkey'),

  /**
   *  @attribute group
   *  @type {Group}
   */
  group: DS.belongsTo('group'),

  /**
   *  @attribute projects
   *  @type {Project[]}
   */
  projects: DS.hasMany('project'),

  /**
   *  @attribute own_projects
   *  @type {Project[]}
   */
  own_projects: DS.hasMany('project', {inverse: 'owner'}),

  /**
   *  @attribute password
   *  @type {String}
   */
  password: DS.attr('string'),

  /**
   *  @attribute password_confirmation
   *  @type {String}
   */
  password_confirmation: DS.attr('string'),

  /**
   *  @attribute is_credentials_send
   *  @type {Boolean}
   */
  is_credentials_send: DS.attr('boolean'),
});
