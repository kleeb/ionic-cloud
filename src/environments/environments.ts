import { IonicPlatform } from '../core/core';
import { DeferredPromise, PromiseWithNotify } from '../core/promise';

var envAPIEndpoints = {
  'getEnv': function(appId, tag) {
    return '/apps/' + appId + '/env/' + tag;
  }
};

export class Environment {
  /**
   * Environment constructor
   *
   * @param {object} config Configuration object
   */

  constructor() {}

  /**
   * Load an environment, calls loadEnvFromAPI
   *
   * @param {string} tag Environment tag
   * @return {DeferredPromise} will resolve/reject with the config object or error
   */
  public load(tag) {
    var deferred = new DeferredPromise();

    this.loadEnvFromAPI(tag).then(function(env) {
      deferred.resolve(env['config']);
    }, function(err) {
      deferred.reject(err);
    });

    return deferred.promise;
  }

  /**
   * Load an environment from the API
   *
   * @param {string} tag Environment tag
   * @return {DeferredPromise} will resolve/reject with the config object or error
   */
  private loadEnvFromAPI(tag) {
    var deferred = new DeferredPromise();
    let appId = IonicPlatform.config.get('app_id');

    IonicPlatform.client.get(`/apps/${appId}/env/${tag}`)
      .end((err, res) => {
        if (err) {
          deferred.reject(err);
        } else if (res.ok) {
          deferred.resolve(res.body.data);
        }
      });

    return deferred.promise;
  }
}
