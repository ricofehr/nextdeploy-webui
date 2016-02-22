import DS from 'ember-data';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import config from '../config/environment';

// rest api setting
export default DS.RESTAdapter.extend(DataAdapterMixin, {
  host: config.APP.APIHost,
  namespace: 'api/v1',
  authorizer: 'authorizer:devise',
  headers: { "Accept": "application/json" }
});