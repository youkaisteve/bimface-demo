/* eslint-disable no-console */
/**
 *  @typedef {Object} Floor
 *  @property {string} id - floor id
 *  @property {string} name - floor name
 */

import remoteLoad from './remoteLoad';
import beforeMethodOnClass from './beforeMethodOnClass';

@beforeMethodOnClass({
  handle: metadata => {
    console.log(
      `%c ======>${metadata.className}.${metadata.methodName} executing,args:${JSON.stringify(metadata.args)}`,
      'color:#f00;'
    );
  }
})
class Bimface {
  constructor() {
    this.app;
    this.viewer3D;
    this.viewer2D;
  }
  /**
   * 加载模型
   * @param {Object} options
   * @param {string} options.viewToken 访问认证token
   * @param {string} options.url js-sdk地址
   * @param {string} options.domId dom id
   */
  async loadModel(options) {
    if (options.url && !window.BimfaceSDKLoaderConfig) {
      await remoteLoad(options.url);
    }

    if (!options.domId) {
      throw new Error('domId missing');
    }

    if (!options.viewToken) {
      throw new Error('viewToken missing');
    }

    return new Promise((resolve, reject) => {
      const loaderConfig = new window.BimfaceSDKLoaderConfig();
      loaderConfig.viewToken = options.viewToken;
      window.BimfaceSDKLoader.load(
        loaderConfig,
        () => {
          console.log('begin render');
          var domShow = document.getElementById(options.domId);
          var webAppConfig = new window.Glodon.Bimface.Application.WebApplication3DConfig();
          webAppConfig.domElement = domShow;
          this.app = new window.Glodon.Bimface.Application.WebApplication3D(webAppConfig);
          this.app.addView(options.viewToken);
          this.viewer3D = this.app.getViewer();
          console.log(this.viewer3D);
          resolve();
        },
        error => {
          reject(error);
        }
      );
    });
  }

  /**
   * 获取楼层信息
   * @returns {Array<Floor>} 楼层{@link floor}列表
   */
  getFloors() {
    return new Promise(resolve => {
      this.viewer3D.getFloors(resolve);
    });
  }
  getComponentByFloorId(fileId) {
    return new Promise(resolve => {
      this.viewer3D.getElementByConditions(fileId, { floor: 'Level 7' }, resolve);
    });
  }
}

export default Bimface;
