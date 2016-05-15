import DS from 'ember-data';

export default DS.Model.extend({
  email:    DS.attr('string'),
  firstname: DS.attr('string'),
  lastname: DS.attr('string'),
  authentication_token: DS.attr('string'),
  is_project_create: DS.attr('boolean'),
  is_user_create: DS.attr('boolean'),
  layout: DS.attr('string'),
  company: DS.attr('string'),
  quotavm: DS.attr('number'),
  quotaprod: DS.attr('number'),
  password: DS.attr('string'),
  password_confirmation: DS.attr('string'),
  is_credentials_send: DS.attr('boolean'),
  created_at: DS.attr('date'),
  group: DS.belongsTo('group', {async: true}),
  vms: DS.hasMany('vm', {async: true}),
  projects: DS.hasMany('project', {async: true}),
  own_projects: DS.hasMany('project', {async: true, inverse: 'owner'}),
  sshkeys: DS.hasMany('sshkey', {async: true})
});