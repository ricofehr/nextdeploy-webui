import DS from 'ember-data';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import config from '../config/environment';

/**
 *  Manages REST api endpoint setting
 *
 *  @author Eric Fehr (ricofehr@nextdeploy.io, github: ricofehr)
 *  @class Application
 *  @namespace adapter
 *  @module nextdeploy
 *  @augments DS/RESTAdapter
 */
export default DS.RESTAdapter.extend(DataAdapterMixin, {
  /**
   *  The API Hostname
   *
   *  @property host
   *  @type {String}
   */
  host: config.APP.APIHost,

  /**
   *  The API prefix namespace
   *
   *  @property namespace
   *  @type {String}
   */
  namespace: 'api/v1',

  /**
   *  The authorizer class
   *
   *  @property authorizer
   *  @type {String}
   */
  authorizer: 'authorizer:devise',

  /**
   *  The default http header for api requests
   *
   *  @property headers
   *  @type {Hash}  String => String
   */
  headers: { "Accept": "application/json" }
});
