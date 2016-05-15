import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  gitpath: DS.attr('string'),
  enabled: DS.attr('boolean'),
  login: DS.attr('string'),
  password: DS.attr('string'),
  created_at: DS.attr('date'),
  is_ht: DS.attr('boolean'),
  owner: DS.belongsTo('user', {async: true, inverse: 'own_projects'}),
  brand: DS.belongsTo('brand', {async: true}),
  endpoints: DS.hasMany('endpoint', {async: true}),
  systemimages: DS.hasMany('systemimage', {async: true}),
  technos: DS.hasMany('techno', {async: true}),
  vmsizes: DS.hasMany('vmsize', {async: true}),
  users: DS.hasMany('user', {async: true}),
  vms: DS.hasMany('vm', {async: true}),
  branches: DS.hasMany('branche', {async: true})
});