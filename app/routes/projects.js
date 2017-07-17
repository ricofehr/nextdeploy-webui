import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

/**
 *  Define (authenticated) parent Route of projects Routes
 *
 *  @author Eric Fehr (ricofehr@nextdeploy.io, github: ricofehr)
 *  @class Projects
 *  @namespace route
 *  @module nextdeploy
 *  @augments Ember/Route
 */
export default Ember.Route.extend(AuthenticatedRouteMixin, {
});
