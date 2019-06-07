// pages/detail/detail.js
import * as store from '../../utils/store.js';
import { getCdb, bindCustomer } from '../../utils/api.js';
Page({

  /**
   * Page initial data
   */
  data: {
    isChecked:false,
    user:'',
    cdbNumber: '',
    cdbInfo:'',
    loadModal:false,
    modalName:''


  },
  getCdb(cdbNumber, externalUserId){
    this.setData({
      loadModal: true
    })
    getCdb({ cdbNumber: this.data.cdbNumber, externalUserId: this.data.user.externalUserId }).then(res=>{
      this.setData({
        cdbInfo:res.data.data,
        loadModal: false
      })
      console.log(this.data.cdbInfo,'=================')
    })
  },
  bindCustomer(params){
    this.setData({
      loadModal: true
    })
    console.log(params,'params--')
    bindCustomer(params).then(res=>{
      console.log(res,'===========bind')
      this.setData({

        loadModal: false
      })
      if(res.statusCode==200){
        let saName = res.data.data.saName
        
        wx.navigateTo({
          url: "/pages/binded/binded?saName=" + saName
        })
      }
      
    })
  },
  check: function (e) {
    this.getCdb()
    this.setData({
      isChecked: true
    });
  },
  confirm(){
    if(!this.data.cdbInfo){
     this.showModal()
     return
    }
    this.bindCustomer({
      externalUserId: this.data.user.externalUserId,
      cdbUserDto:this.data.cdbInfo
    })
   
  },
  showModal(e) {
    console.log('test---------')
    this.setData({
      modalName: 'Modal'
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  recheck(){
    this.setData({
      cdbInfo:'',
      isChecked: false
    });
  },
  inputCdb(e){
    this.setData({
      cdbNumber: e.detail.value
    })
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
   let user = store.get('currentCustomer')
    this.setData({
      user: user
    });
   console.log(user,'user---')
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  }
})