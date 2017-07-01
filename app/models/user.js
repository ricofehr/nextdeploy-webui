import DS from 'ember-data';

export default DS.Model.extend({
  email: DS.attr('string'),
  authentication_token: DS.attr('string'),
  is_project_create: DS.attr('boolean'),
  is_user_create: DS.attr('boolean'),
  is_recv_vms: DS.attr('boolean'),
  company: DS.attr('string'),
  quotavm: DS.attr('number'),
  quotaprod: DS.attr('number'),
  nbpages: DS.attr('number'),
  layout: DS.attr('string'),
  firstname: DS.attr('string'),
  lastname: DS.attr('string'),
  created_at: DS.attr('date'),
  shortname: DS.attr('string'),
  vms: DS.hasMany('vm'),
  sshkeys: DS.hasMany('sshkey'),
  group: DS.belongsTo('group'),
  projects: DS.hasMany('project'),
  own_projects: DS.hasMany('project', {inverse: 'owner'}),
  password: DS.attr('string'),
  password_confirmation: DS.attr('string'),
  is_credentials_send: DS.attr('boolean'),
});
