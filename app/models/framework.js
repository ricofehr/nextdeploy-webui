import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  publicfolder: DS.attr('string'),
  rewrites: DS.attr('string'),
  endpoints: DS.hasMany('endpoint', {async: false}),
  uris: DS.hasMany('uri', {async: false})
});