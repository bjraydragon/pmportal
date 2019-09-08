// pages/grade/grade.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    questionIndex:0,//当前题目的index
    gradeInstance: {}   
  },

  bindButtonTapNext: function(event) {
    var commentRequired = event.currentTarget.dataset.cr
    console.log("参数=" + commentRequired);
    if (this.data.questionIndex == this.data.gradeInstance.ratingInstance.form.questions.length) {
      wx.showToast({
        title: '已到最后',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    this.setData({
      questionIndex:this.data.questionIndex+1
    })
    this.questionIndex
    if (commentRequired == 1) {
      alert("请填写comments！");
      return false;
    }
  },

  bindButtonTapPrev: function (event) {
    var commentRequired = event.currentTarget.dataset.cr
    console.log("参数=" + commentRequired);
    if (this.data.questionIndex==0){
      wx.showToast({
        title: '已到最前',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    this.setData({
      questionIndex: this.data.questionIndex - 1
    })
    this.questionIndex
    if (commentRequired == 1) {
      alert("请填写comments！");
      return;
    }
  },

  bindButtonTapSubmit: function (event) {
    //向服务器提交答题情况
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that=this;

    let ctoken = '';
    try {
      var value = wx.getStorageSync('ctoken')
      if (value) {
        ctoken = value;
      }
    } catch (e) {
      // Do something when catch error
    }

    wx.showLoading({
      title: '加载中',
    })
    
    wx.request({
      url: getApp().globalData.restUrl + `/rating/${1}`, //商品列表
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
          console.log('grade request:' + JSON.stringify(res.data));
          //对数据进行清洗
          var newGrades = {};
          newGrades = Object.assign({}, res.data);
          newGrades.ratingInstance.form.questions.map(function (item) {
            let languages = app.getCNAndEn(item.questionText);
            item.enText = languages[0];
            item.cnText = languages[1];
            item.options.map(function (optionItem) {
              let optionLanguages = app.getCNAndEn(optionItem.optionText);
              optionItem.enText = optionLanguages[0];
              optionItem.cnText = optionLanguages[1];
            })
          });
          that.setData({
            gradeInstance: newGrades
          })
          wx.hideLoading()
        }
      }
    })
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

})