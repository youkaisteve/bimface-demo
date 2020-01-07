/**
 * 在class的method执行前注入处理逻辑
 * @param {object} options
 * @param {String} options.methodPattern - 过滤方法的正则表达式,default \.*
 * @param {Function(metadata} options.handle - handle方法接收一个metadata参数，有以下属性className、methodName、args
 * @returns {Function}
 */
export default function beforeMethodOnClass(options) {
  options = Object.assign(
    {},
    {
      methodPattern: /\.*/
    },
    options
  );

  return function(target) {
    Reflect.ownKeys(target.prototype).forEach(key => {
      if (key !== 'constructor' && target.prototype[key] && typeof target.prototype[key] === 'function') {
        if (!options.methodPattern || !options.methodPattern.test(key)) {
          return;
        }
        let oldOne = target.prototype[key];
        let newOne = function() {
          let metaData = {
            target: this,
            className: target.name,
            methodName: key,
            args: arguments
          };
          if (options.handle && typeof options.handle === 'function') options.handle(metaData);
          return oldOne.apply(this, metaData.args);
        };
        Reflect.defineProperty(target.prototype, key, {
          value: newOne
        });
      }
    });
  };
}
