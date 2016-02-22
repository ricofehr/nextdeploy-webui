import DeviseAuthenticator from 'ember-simple-auth/authenticators/devise';
import config from '../config/environment';

export default DeviseAuthenticator.extend({
  serverTokenEndpoint: config.APP.APIHost + '/api/v1/users/sign_in'
});