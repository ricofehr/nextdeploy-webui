import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  projects: DS.hasMany('project', {async: false}),
  supervises: DS.hasMany('supervise', {async: false}),
  technotype: DS.belongsTo('technotype', {async: true})
});
