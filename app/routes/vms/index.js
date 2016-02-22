import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  // default vm page is vms.list
  redirect: function() {
    this.transitionTo('vms.list');
  }
});
