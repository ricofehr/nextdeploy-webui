import DS from 'ember-data';

export default DS.Model.extend({
  status: DS.attr('boolean'),
  techno: DS.belongsTo('techno', {async: false}),
  vm: DS.belongsTo('vm', {async: false})
});
