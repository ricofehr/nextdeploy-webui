import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  dockercompose: DS.attr('string'),
  playbook: DS.attr('string'),
  technotype: DS.belongsTo('technotype'),
  projects: DS.hasMany('project', {async: false}),
  vms: DS.hasMany('vm', {async: false}),
  supervises: DS.hasMany('supervise', {async: false})
});
