// pages/grade/grade.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    questionIndex:0,//当前题目的index
    gradeInstance: {},
    userAnswers:[],
    currentCommentChange:"", //如果不change 则要一直为空,只有change了才有值
    language: {},
    langIndex: 0,
    submited:false,
    submitButtonDisabled:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that=this;
    //翻译
    this.setData({ 'langIndex': wx.getStorageSync('langIndex') || 0 });
    wx.event.on('changeLanguage', this, this.setData({ 'language': wx.T.getLanguage() }));
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
          var newUserAnswers=[];
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
          for (var key in newGrades.userAnswers) {
            newUserAnswers.push(newGrades.userAnswers[key]);
          }
          console.log("newGrades:"+JSON.stringify(newGrades));
          that.setData({
            gradeInstance: newGrades,
            userAnswers: newUserAnswers,
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
    //构造提交参数
    var userAnswers = {};
    //向服务器提交答题情况
    var answerDetail = {};
    answerDetail.userAnswers = this.data.gradeInstance.userAnswers;
    answerDetail.instanceId = this.data.gradeInstance.instanceId;
    var ctoken = wx.getStorageSync('ctoken')
    if (ctoken) {
      wx.request({
        url: getApp().globalData.restUrl + '/rating/save',
        data: answerDetail,
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
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {  
    //存储comment
    this.saveComment();
    //向服务器提交答题情况
    var answerDetail={};
    answerDetail.userAnswers = this.data.gradeInstance.userAnswers;
    answerDetail.instanceId=this.data.gradeInstance.instanceId;
    var ctoken = wx.getStorageSync('ctoken')    
    if (ctoken) {
      wx.request({
        url: getApp().globalData.restUrl + '/rating/save',
        data: answerDetail,
        header: {
          CTOKEN: ctoken
        },
        method: 'POST',
        success: function (res) {          
          if (res.statusCode == 500) {
            wx.showToast({
              title: JSON.stringify(res.errorMsg),
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
    //存储comment
    let save_result = this.saveComment();
    this.checkCommentRequired();
    if (!save_result && this.checkCommentRequired()) {
      wx.showToast({
        title: '请填写说明',
        icon: 'none',
        duration: 2000
      })
      return;
    }

    var commentRequired = event.currentTarget.dataset.cr
    if (this.data.questionIndex+1 == this.data.gradeInstance.ratingInstance.form.questions.length) {
      wx.showToast({
        title: '已到最后',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    //重置状态
    this.data.currentCommentChange="";
    this.setData({
      questionIndex: this.data.questionIndex + 1
    })
    if (commentRequired == 1) {
      alert("请填写comments！");
      return false;
    }
  },

  bindButtonTapPrev: function (event) {
    //存储comment
    this.saveComment();

    var commentRequired = event.currentTarget.dataset.cr
    if (this.data.questionIndex == 0) {
      wx.showToast({
        title: '已经是第一题',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    //重置状态
    this.data.currentCommentChange = "";
    this.setData({
      questionIndex: this.data.questionIndex - 1
    })
    if (commentRequired == 1) {
      alert("请填写comments！");
      return;
    }
  },

  checkCommentRequired:function(){
    this.data.gradeInstance.ratingInstance.form.questions[this.data.questionIndex].options.map(function (optionItem) {
      if(optionItem.commentRequired==1){
        return true;
      }
    })

    return false;
  },

  bindButtonTapSubmit: function (event) {
    var that=this;
    //存储comment
    //存储comment
    let save_result = this.saveComment();
    this.checkCommentRequired();
    if (!save_result && this.checkCommentRequired()) {
      wx.showToast({
        title: '请填写说明',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    //构造提交参数
    var userAnswers = {};
    //先判断题目是否完全答完,如果没有则提示请答完再提交
    let finished=true;
    this.data.userAnswers.map(function (item) {
      if(item.optionId==undefined){
        finished=false;
      }
    });
    //先简单判断一下
    if (!finished) {
      wx.showToast({
        title: '请完成所有题目再提交!',
        icon: 'none',
        duration: 4000
      })
      return;
    }
    //向服务器提交答题情况
    var answerDetail = {};
    answerDetail.userAnswers = this.data.gradeInstance.userAnswers;
    answerDetail.instanceId = this.data.gradeInstance.instanceId;
    var ctoken = wx.getStorageSync('ctoken')
    if (ctoken) {
      wx.request({
        url: getApp().globalData.restUrl + '/rating/submit',
        data: answerDetail,
        header: {
          CTOKEN: ctoken
        },
        method: 'POST',
        success: function (res) {
          console.log("submit result:"+JSON.stringify(res));
          if (res.statusCode == 500) {
            wx.showToast({
              title: JSON.stringify(res.errorMsg),
              icon: 'none',
              duration: 2000
            })
          } else if (res.statusCode == 200) {
            wx.showToast({
              title: '恭喜您完成打分',
              icon: 'none',
              duration: 5000
            })
            that.setData({
              submited:true,
              submitButtonDisabled:true
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
    this.saveComment();
    var optionId = e.detail.value;
    
    var answerObj = this.data.gradeInstance.userAnswers;
    var value = answerObj['' + (this.data.questionIndex + 1) + ''];
    value.optionId = optionId;
    value.userInstanceId = this.data.gradeInstance.instanceId;

    this.data.userAnswers[this.data.questionIndex].optionId = optionId;
    var newUserAnswers=[];
    this.data.userAnswers.map(function (item) {
      newUserAnswers.push(item);
    });

    this.setData({
      userAnswers: newUserAnswers
    })

  },

  //bind comment textarea when focus leave
  bindTextAreaInput:function(e){
    console.log("bindTextAreaInput:"+e.detail.value+"questionIndex:"+this.data.questionIndex)
    this.data.currentCommentChange=e.detail.value;   
  },
  
  //for the reason of questionIndex change when next or previous
  //we should call this func before next or previous for the right questionId
  saveComment:function(){
    if (this.data.currentCommentChange == ""){
      return 0;
    }
    var answerObj = this.data.gradeInstance.userAnswers;
    var value = answerObj['' + (this.data.questionIndex + 1) + ''];
    value.comment = this.data.currentCommentChange;
    console.log(JSON.stringify(answerObj));
    //将comment存入数据结构中，并且要触发渲染？
    this.data.userAnswers[this.data.questionIndex].comment = this.data.currentCommentChange;
    console.log(JSON.stringify(this.data.userAnswers));
    var newUserAnswers = [];
    this.data.userAnswers.map(function (item) {
      newUserAnswers.push(item);
    });

    this.setData({
      userAnswers: newUserAnswers
    })

    return 1;
  }


})