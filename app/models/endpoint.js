import DS from 'ember-data';

export default DS.Model.extend({
  prefix: DS.attr('string'),
  path: DS.attr('string'),
  envvars: DS.attr('string'),
  aliases: DS.attr('string'),
  is_install: DS.attr('boolean'),
  port: DS.attr('string'),
  ipfilter: DS.attr('string'),
  project: DS.belongsTo('project', {async: true}),
  framework: DS.belongsTo('framework', {async: true})
});
