import DS from 'ember-data';

export default DS.Model.extend({
  status: DS.attr('boolean'),
  vm: DS.belongsTo('vm', {async: false}),
  techno: DS.belongsTo('techno', {async: true})
});
