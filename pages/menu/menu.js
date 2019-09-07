// pages/menu/menu.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    grids: [
      {
        "id": "WXRATINGLIST",
        "label": "Deal Rating{CN}项目评分",
        "iconPath": "dealrating.png",
        "type": 10
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var newGrids=[];
    this.data.grids.map(function (item) {
      let allString = item.label;
      let pos = allString.indexOf("{CN}");
      let enString = allString.substring(0, pos);
      let cnString = allString.substring(pos + 4, allString.length);
      console.log(`en:${enString} cn:${cnString}`);
      item.enLabel = enString;
      item.cnLabel = cnString;
      newGrids.push(item);
    });
    this.setData({
      grids: newGrids
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

  //用户点击gird item
  tapGridItem(event){
    let index = parseInt(event.currentTarget.dataset.index);
    console.log(`tapGridItem:${index}`)
  }
})