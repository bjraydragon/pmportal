// pages/menu/menu.js
import event from '../../utils/event.js';

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    grids: [],
    images: [
      "../../images/menu.png", 
      "../../images/menu2.png", 
      "../../images/menu3.png",
    ],
    language: {},
    langIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    //翻译
    this.setData({ 'langIndex': wx.getStorageSync('langIndex') || 0 });
    this.setLanguage();
    wx.event.on('languageChanged', this, this.setLanguage);
    //尝试获取menu,如果不能正常获取,则转入登录页面
    //请求menu列表
    wx.showLoading({
      title: '加载中',
    })

    let ctoken='';
    try {
      var value = wx.getStorageSync('ctoken')
      if(value){
        ctoken=value;
      }
    } catch (e) {
      // Do something when catch error
    }
    wx.request({
      url: getApp().globalData.restUrl + '/menu', //商品列表
      header:{
        CTOKEN:ctoken
      },
      data: {},
      success: function (res) {
        if (res.statusCode == 401) {
          wx.hideLoading()
          wx.redirectTo({
            url: '../login/login',
          })
        }
        else{
          //绑定菜单数据
          console.log('menu request:'+JSON.stringify(res.data));
          var newGrids = [];
          res.data.map(function (item) {
            let allString = item.label;
            let languages = app.getCNAndEn(allString);
            item.enLabel = languages[0];
            item.cnLabel = languages[1];
            newGrids.push(item);
          });
          that.setData({
            grids: newGrids
          })
          wx.hideLoading()
        }
      }
    })
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
   
    // success: (res) => {
    //   let dataList = res.data.grids.label; //获取到的数据
    //   dataList.forEach((item) => {
    //     item.submit_time = item.submit_time.substring(0, 5); //要截取字段的字符串
    //   })
    //   that.setData({
    //     array: dataList //数据源
    //   });
    // };
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  bindMenuTap(event){
    let menuId = event.currentTarget.dataset.menuid;
    console.log(menuId);
    if (menuId =="WXRATINGLIST"){
      wx.navigateTo({
        url: '../prjlist/prjlist',
      })
    }
    else{
      wx.showToast({
        title: '即将上线的消息/页面',
        icon: 'none',
        duration: 2000
      })
    }
  },

  setLanguage() {
    console.log("language:" + wx.T.getLanguage());
    this.setData({
      language: wx.T.getLanguage()
    });
  },

  //just for translation
  switchLanguageChange(e) {
    let index = e.detail.value;
    console.log(JSON.stringify(e));
    this.setData({
      langIndex: index?1:0
    });
    wx.T.setLocaleByIndex(index ? 1 : 0);
    this.setLanguage();
    event.emit('languageChanged');

    wx.setStorage({
      key: 'langIndex',
      data: index ? 1 : 0
    })
  },
})