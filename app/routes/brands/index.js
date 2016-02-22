import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  // default brand page is brands.list
  redirect: function() {
    this.transitionTo('brands.list');
  }
});