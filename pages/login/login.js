// pages/login/login.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    disabled: false,
    no: '',
    pwd: '',
    noinput: false,
    pwdinput: false,
    translateList: {},
  },
  
  noinput: function(e) {
    this.setData({
      no: e.detail.value
    });
    this.setData({
      noinput: true
    });
    if (this.data.noinput == true && this.data.pwdinput == true) {
      this.setData({
        disabled: false
      });
    }

  },
  pwdinput: function(e) {
    this.setData({
      pwd: e.detail.value
    });
    this.setData({
      pwdinput: true
    });
    if (this.data.noinput == true && this.data.pwdinput == true) {
      this.setData({
        disabled: false
      });
    }
  },
  formSubmit: function(e) {
    //请求服务器验证
    wx.request({
      url: getApp().globalData.restUrl + '/bind', //用户登录
      header: {
        JSCODE: app.globalData.jscode,
      },
      data: {
        username: e.detail.value.no,
        password: e.detail.value.pwd
      },
      success: function(res) {
        let resObj = res.data;   
        console.log("login respond:"+JSON.stringify(resObj));
        console.log("jscode=="+app.globalData.jscode);  
        let ctoken=res.data.CTOKEN;
        
        if(!ctoken){
          if (resObj.code != 200) {
            wx.showToast({
              title: resObj.errorMsg,
              icon: 'none',
              duration: 2000
            })
            return;
          }
        }else{
          //将ctoken存入localstorage
          try {
            wx.setStorageSync('ctoken', ctoken)
          } catch (e) { }
          //跳转页面
          wx.navigateTo({
            url: '../menu/menu',
          })
        }        
      }
    })

    console.log(e);
    this.setData({
      disabled: true
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      disabled: false
    });
    this.translateLanguage();
    

    var student = wx.getStorageSync('student');
    if (typeof(student) == 'object' && student.no != '' && student.classid != '') {
      wx.switchTab({
        url: '../teacher/teacher',
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (this.data.no == '' || this.data.pwd == '') {
      this.setData({
        disabled: true
      });
    } else {
      this.setData({
        disabled: false
      });
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  //just for translation
  translateLanguage:function(){
    //buttonString: (app.getCNAndEn("Bind{CN}绑定"))[0],
    let newTranslateList={};
    newTranslateList.placeholderUsername = app.getCNAndEn("Please input your name{CN}请输入用户名")[app.globalData.languageNow];
    newTranslateList.placeholderPassWord = app.getCNAndEn("Please input your passwd{CN}请输入密码")[app.globalData.languageNow];
    newTranslateList.bindButton = app.getCNAndEn("Bind{CN}绑定")[app.globalData.languageNow];
    newTranslateList.footText = app.getCNAndEn("For internal use only, Please use your company account to bind.{CN}仅供内部员工使用，请使用公司账户进行关联")[app.globalData.languageNow];
    this.setData({
      translateList: newTranslateList
    })
  }
})