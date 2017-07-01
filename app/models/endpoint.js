import DS from 'ember-data';

export default DS.Model.extend({
  prefix: DS.attr('string'),
  path: DS.attr('string'),
  envvars: DS.attr('string'),
  aliases: DS.attr('string'),
  is_install: DS.attr('boolean'),
  ipfilter: DS.attr('string'),
  port: DS.attr('string'),
  customvhost: DS.attr('string'),
  is_sh: DS.attr('boolean'),
  is_import: DS.attr('boolean'),
  is_main: DS.attr('boolean'),
  is_ssl: DS.attr('boolean'),
  project: DS.belongsTo('project'),
  framework: DS.belongsTo('framework')
});
