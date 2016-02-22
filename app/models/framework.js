import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  publicfolder: DS.attr('string'),
  rewrites: DS.attr('string'),
  projects: DS.hasMany('project', {async: false})
});