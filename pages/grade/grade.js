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

let projectid=1;
    if (options.projectid!=undefined){
      projectid = options.projectid;
    }
    console.log("projectid:"+projectid)
    
    wx.request({
      url: getApp().globalData.restUrl + `/rating/${projectid}`, //商品列表
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
    console.log("Enter onHide =====" );
    //构造提交参数
    var userAnswers = {};
    //向服务器提交答题情况
    var ctoken = wx.getStorageSync('ctoken')
    if (ctoken) {
      wx.request({
        url: getApp().globalData.restUrl + '/rating/save',
        data: { "userAnswers": this.data.gradeInstance.ratingInstance.userAnswers },
        header: {
          CTOKEN: ctoken
        },
        method: 'POST',
        success: function (res) {
          console.log("save====="+JSON.stringify(res.data));
          if (res.statusCode == 500) {
            wx.showToast({
              title: res.errorMsg,
              icon: 'none',
              duration: 2000
            })
          } else if (res.code == 200) {
            
            wx.showToast({
              title: '恭喜您完成打分',
              icon: 'none',
              duration: 2000
            })
          }
        }
      })
    } else {
      wx.navigateTo({
        url: '../login/login',
      })
    }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {    
    //构造提交参数
    var userAnswers = {};
    //向服务器提交答题情况
    var ctoken = wx.getStorageSync('ctoken')    
    if (ctoken) {
      wx.request({
        url: getApp().globalData.restUrl + '/rating/save',
        data: { "userAnswers": this.data.gradeInstance.userAnswers },
        header: {
          CTOKEN: ctoken
        },
        method: 'POST',
        success: function (res) {          
          if (res.statusCode == 500) {
            wx.showToast({
              title: res.errorMsg,
              icon: 'none',
              duration: 2000
            })
          } else if (res.code == 200) {
            wx.showToast({
              title: '恭喜您完成打分',
              icon: 'none',
              duration: 2000
            })
          }
        }
      })
    } else {
      wx.navigateTo({
        url: '../login/login',
      })
    }
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

  bindButtonTapNext: function (event) {
    var commentRequired = event.currentTarget.dataset.cr
    console.log("参数=" + commentRequired);
    if (this.data.questionIndex+1 == this.data.gradeInstance.ratingInstance.form.questions.length) {
      wx.showToast({
        title: '已到最后',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    this.setData({
      questionIndex: this.data.questionIndex + 1
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
    if (this.data.questionIndex == 0) {
      wx.showToast({
        title: '已经是第一题',
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
    //构造提交参数
    var userAnswers = {};
    //先判断题目是否完全答完,如果没有则提示请答完再提交
    //先简单判断一下
    if (this.data.questionIndex < 12) {
      wx.showToast({
        title: '请完成所有题目再提交!',
        icon: 'none',
        duration: 4000
      })
      return;
    }
    //向服务器提交答题情况
    var ctoken = wx.getStorageSync('ctoken')
    if (ctoken) {
      wx.request({
        url: getApp().globalData.restUrl + '/rating/submit',
        data: { "userAnswers": this.data.gradeInstance.ratingInstance.userAnswers },
        header: {
          CTOKEN: ctoken
        },
        method: 'POST',
        success: function (res) {
          if (res.statusCode == 500) {
            wx.showToast({
              title: res.errorMsg,
              icon: 'none',
              duration: 2000
            })
          } else if (res.code == 200) {
            wx.showToast({
              title: '恭喜您完成打分',
              icon: 'none',
              duration: 5000
            })
          }
        }
      })
    } else {
      wx.navigateTo({
        url: '../login/login',
      })
    }
  },

  radioChange: function (e) {
    var optionId = e.detail.value[0];
    var answerObj = this.data.gradeInstance.userAnswers;
    var value = answerObj['' + (this.data.questionIndex + 1) + ''];
    value.optionId = optionId;
    value.userInstanceId = this.data.gradeInstance.instanceId
  },


})