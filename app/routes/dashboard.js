import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';


export default Ember.Route.extend(AuthenticatedRouteMixin, {
  model() {
    this.store.unloadAll('hpmessage');
    return Ember.RSVP.hash({
      posts: this.store.findAll('hpmessage', { backgroundReload: false, reload: true }),
    });
  }
});