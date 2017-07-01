import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  gitpath: DS.attr('string'),
  enabled: DS.attr('boolean'),
  login: DS.attr('string'),
  password: DS.attr('string'),
  created_at: DS.attr('date'),
  is_ht: DS.attr('boolean'),
  users: DS.hasMany('user'),
  endpoints: DS.hasMany('endpoint'),
  technos: DS.hasMany('techno'),
  vmsizes: DS.hasMany('vmsize'),
  systemimages: DS.hasMany('systemimage'),
  branches: DS.hasMany('branche'),
  owner: DS.belongsTo('user', {inverse: 'own_projects'}),
  brand: DS.belongsTo('brand'),
  vms: DS.hasMany('vm')
});
