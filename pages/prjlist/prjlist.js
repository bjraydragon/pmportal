// pages/prjlist/prjlist.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    projectList:[
      {
        "projectCode": "Aluminum",
        "instanceId": 1,
        "stage": "PB"
      }
    ],

    images: [
      "../../images/project.png",
      "../../images/project2.png",
      "../../images/project3.png",
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    //get rating
    let ctoken = '';
    try {
      var value = wx.getStorageSync('ctoken')
      if (value) {
        ctoken = value;
      }
    } catch (e) {
      // Do something when catch error
    }
    wx.request({
      url: getApp().globalData.restUrl + '/rating', //商品列表
      header: {
        CTOKEN: ctoken
      },
      data: {},
      success: function (res) {
        if (res.statusCode == 401) {
          wx.hideLoading()
          wx.navigateTo({
            url: '../login/login',
          })
        }
        else {
          //绑定菜单数据
          console.log('prjlist request:' + JSON.stringify(res.data));
          var newList = [];
          res.data.map(function (item) {
            newList.push(item);
          });
          that.setData({
            projectList: newList
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
   //点击列表对应项目
   bindPrjlistTap:function(event){
     let projectid = event.currentTarget.dataset.projectid;
     console.log("bindprjlisttap:" + projectid);
     wx.navigateTo({
       url: `../grade/grade?projectid=${projectid}`,
     })
   } 


})