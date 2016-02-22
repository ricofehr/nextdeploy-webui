import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  // default project page is projects.list
  redirect: function() {
    this.transitionTo('projects.list');
  }
});