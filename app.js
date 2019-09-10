//app.js
import locales from './utils/locales.js';
import T from './utils/i18n.js';
import event from './utils/event.js';

//用 /utils/locales 注册了 locale
T.registerLocale(locales);
//当前语言设置为用户上一次选择的语言，如果是第一次使用，则调用 T.setLocaleByIndex(0) 将语言设置成中文
T.setLocaleByIndex(wx.getStorageSync('langIndex') || 1);
//将 T 注册到 wx 之下，这样在任何地方都可以调用 wx.T.getLanguage() 来得到当前的语言对象了。
wx.T = T;

wx.event = event;

App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        this.globalData.jscode=res.code;
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },

  //从字符串中分离EN和CN
  //从多语言字符串中获取CN/EN到数组中
  getCNAndEn: function (questionStr) {
    var results = [];
    let pos = questionStr.indexOf("{CN}");
    //如果没有,则en和cn都一样
    if (pos < 0) {
      results.push(questionStr);
      results.push(questionStr);
    }
    let enString = questionStr.substring(0, pos);
    let cnString = questionStr.substring(pos + 4, questionStr.length);
    results.push(enString);
    results.push(cnString);
    return results;
  },

  globalData: {
    userInfo: null,
    restUrl: "https://test123.saikul.com",//"https://wxapp-test.cdhfund.com",
    jscode:"",
    languageNow:1
  }
})