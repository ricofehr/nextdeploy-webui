// Ember model for user object
var User = DS.Model.extend({
  email:    DS.attr('string'),
  firstname: DS.attr('string'),
  lastname: DS.attr('string'),
  authentication_token: DS.attr('string'),
  is_project_create: DS.attr('boolean'),
  company: DS.attr('string'),
  quotavm: DS.attr('number'),
  password: DS.attr('string'),
  password_confirmation: DS.attr('string'),
  created_at: DS.attr('date'),
  group: DS.belongsTo('group', {async: true}),
  vms: DS.hasMany('vm', {async: true}),
  projects: DS.hasMany('project', {async: true, inverse: 'users'}),
  own_projects: DS.hasMany('project', {async: true, inverse: 'owner'}),
  sshkeys: DS.hasMany('sshkey', {async: true})
});

module.exports = User;