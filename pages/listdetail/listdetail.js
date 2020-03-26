const app = getApp()
Page({
  
    data:{
        Listdetailarr:{},
        contacts:[],
        events:[],
        fundRaising:[],
        invested:[],
        forid:null,
       
        list: [{
          "text": "对话",
         
          dot: true
      },
      {
          "text": "设置",
      
      }],
      winWidth: 0,
      winHeight: 0,
      // tab切换
      currentTab: 0,
    },
    onReady:function(){
      var that=this; 
      console.log(123);
    
      console.log(that.data.Listdetailarr)
      
    },
    
    onLoad:function(options){
    
       
        var that=this; 
        console.log(that.data.Listdetailarr)
      
        let id=options.id  
        that.forid=options.id 
        console.log("传入的新id");
        console.log(id); 
       
        wx.getSystemInfo({
          success: function (res) {
            that.setData({
              winWidth: res.windowWidth,
              winHeight: res.windowHeight

            });
          }
        });
        wx.request({
            url: 'https://test123.saikul.com/irdata/company/'+that.forid, 
            data: {
              
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function(res) {
              console.log("详细")
              console.log(res.data);
              that.setData({
                Listdetailarr:res.data,
                contacts:res.data.contacts,
                events:res.data.events,
                fundRaising:res.data.fundRaising,
                invested:res.data.invested,
                offices:res.data.offices,
               



              
            })
             wx.setNavigationBarTitle({
     title: that.data.Listdetailarr.name 
   })
            console.log(that.data.Listdetailarr)
            

             
              
              
              

            }
          })

    },
    tabChange(e) {
      console.log('tab change', e)
  },
  cateTab:function(event){
    var index=event.currentTarget.dataset.index;
    this.cateid=event.currentTarget.dataset.id;
    console.log("每一次变化的请求")
    console.log(this.cateid)
    //根据id请求相应的接口,返回对应的数据
    wx.request({
      url: ':http://xxx.com/category/'+this.cateid,
      success: function(res) {
        this.setData({
            cateData:res
        });
      }
    })
    
  },
  bindChange: function (e) {
    var that = this;
    console.log(e.detail.current);
    if(e.detail.current==0){
      wx.setNavigationBarTitle({
        title: that.data.Listdetailarr.name 
      })

    }
   
    that.setData({ currentTab: e.detail.current });

  },
  // 点击tab切换
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  calling: function (e) {
    console.log(e.currentTarget.id);
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.id, 
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        console.log("拨打电话失败！")
      }
    })
  },
 


})