/**
 * 验收环境
 */
;(function () {
  window.SITE_CONFIG = {};

  // api接口请求地址
  // window.SITE_CONFIG['baseUrl'] = 'http://demo.renren.io/renren-fast';

  window.SITE_CONFIG['baseUrl'] = 'http://222.184.237.178:9998/zkyf-web';
  // 设备请求url
  window.SITE_CONFIG['partyUrl'] = 'http://222.184.237.178:9998/zkyf-web';

  // cdn地址 = 域名 + 版本号
  window.SITE_CONFIG['domain']  = './'; // 域名
  window.SITE_CONFIG['version'] = '';   // 版本号(年月日时分)
  window.SITE_CONFIG['cdnUrl']  = window.SITE_CONFIG.domain + window.SITE_CONFIG.version;
})();