import { App } from '../core/app';
import { IonicPlatform } from '../core/core';
import { APIRequest } from '../core/request';
import { Logger } from '../core/logger';

var appsAPIBase = IonicPlatform.config.getURL('platform-api') + '/apps';
var envAPIEndpoints = {
  'getEnv': function(appId, tag) {
    return appsAPIBase + appId + '/env/' + tag;
  }
};

export class Environment {

  logger: Logger;
  app: App;
  activeEnv: any;

  loadCallback: any;

  /**
   * Environment constructor
   *
   * @param {object} config Configuration object
   */
  constructor(config) {
    this.logger = new Logger({
      'prefix': 'Ionic Environment:'
    });

    var app = new App(IonicPlatform.config.get('app_id'));

    // Check for the required values to use this service
    if (!app.id) {
      this.logger.error('no app_id found. (http://docs.ionic.io/docs/io-install)');
      return;
    } else if (!config['env']) {
      this.logger.error('no env specified. (<DOC-LINK-HERE>)');
      return;
    }

    this.app = app;
    this.activeEnv = config['env'];
    this.loadCallback = null;

    var self = this;
    IonicPlatform.onReady(function() {
      self.init(config);
    });
  }

  /**
   * Init method to setup environments
   *
   * The config supports the following properties:
   *   - env {String} The tag of an environment to load initially
   *   - onLoad {Function} Callback function that is passed the environment object when one is loaded
   *
   * @param {object} config Configuration object
   * @return {Environment} returns the called Push instantiation
   */
  init(config) {
    var self = this;
    new APIRequest({
      'uri': envAPIEndpoints.getEnv(this.app.id, this.activeEnv),
      'method': 'GET'
    }).then(function(result) {
      self.logger.info(result);
    }, function(error) {
      self.logger.info(error)
    });

    return this;
  }
}