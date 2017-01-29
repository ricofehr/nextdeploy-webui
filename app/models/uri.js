import DS from 'ember-data';

export default DS.Model.extend({
  absolute: DS.attr('string'),
  path: DS.attr('string'),
  envvars: DS.attr('string'),
  aliases: DS.attr('string'),
  port: DS.attr('string'),
  ipfilter: DS.attr('string'),
  customvhost: DS.attr('string'),
  is_sh: DS.attr('boolean'),
  is_import: DS.attr('boolean'),
  is_redir_alias: DS.attr('boolean'),
  vm: DS.belongsTo('vm', {async: true}),
  framework: DS.belongsTo('framework', {async: true})
});
