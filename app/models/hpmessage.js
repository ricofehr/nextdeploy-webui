import DS from 'ember-data';

export default DS.Model.extend({
  title: DS.attr('string'),
  message: DS.attr('string'),
  ordering: DS.attr('number'),
  is_twitter: DS.attr('boolean'),
  date: DS.attr('string')
});
