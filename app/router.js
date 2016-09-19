import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('brands', function() {
    this.route('new');
    this.route('list');
    this.route('edit', { path:'/edit/:brand_id' });
  });
  this.route('projects', function() {
    this.route('new');
    this.route('edit', { path:'/edit/:project_id' });
    this.route('list');
    this.route('byuser', { path:'/byuser/:user_id' });
    this.route('bybrand', { path:'/bybrand/:brand_id' });
  });
  this.route('users', function() {
    this.route('new');
    this.route('list');
    this.route('edit', { path:'/edit/:user_id' });
    this.route('bygroup', { path:'/bygroup/:group_id' });
    this.route('byproject', { path:'/byproject/:project_id' });
  });
  this.route('sshkeys', function() {
    this.route('new', { path:'/new/:user_id' });
    this.route('list');
  });
  this.route('vms', function() {
    this.route('list');
    this.route('new');
    this.route('byuser', { path:'/byuser/:user_id' });
    this.route('byproject', { path:'/byproject/:project_id' });
  });

  this.route('dashboard');
  this.route('login');
  this.route('error');
});

export default Router;
