/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AsyncStorage,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  DeviceEventEmitter,
  ToastAndroid
} from 'react-native';
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';


import focus from '../img/focus.png';
import guan from '../img/guanzhu.png';
import lahei from '../img/heimingdan.png';
import qian from '../img/qiandao.png';
import jifen from '../img/jifen.png';
import mima from '../img/mima.png';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5'
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#FA7298',
    alignItems: 'center',
    height: 120
  },
  registerButton: {
    width: 80,
    height: 27,
    borderRadius: 3,
    position: 'absolute',
    left: 90,
    backgroundColor: '#FB8CAC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  register: {
    color: '#FFFFFF'
  },
  loginButton: {
    width: 80,
    height: 27,
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
    position: 'absolute',
    right: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },
  login: {
    color: '#FA7298'
  },
  person: {
    marginTop: 10,
    height: 35,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center'
  },
  Text: {
    marginLeft: 15,
    color: '#242423',
    fontSize: 13,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'space-around',
    backgroundColor: '#FFFFFF',
    borderTopColor: '#F0F0F0',
    borderTopWidth: 0.5,
    height: 90
  },
  image: {
    width: 35,
    height: 35,
  },
  myButton: {
    alignItems: 'center',
    
  },
  buttonText: {
    color: '#242423',
    fontSize: 11,
    marginTop: 8,
  }
});

export default class Mine extends Component {
  constructor(props){
    super(props)
    this.state={
      hasAccount:false,
      account:''
    }
  }
  componentDidMount(){
    this.deEmitter = DeviceEventEmitter.addListener('hasAccount', (event) => {
      this.setState({ account:event.account ,hasAccount:true})
    })
  }
  register = () => {
    const { navigate } = this.props.navigation;
    navigate('Register')
  }
  login = () => {
    const { navigate } = this.props.navigation;
    navigate('Login')
  }
  goSign = () => {
    if(!this.state.hasAccount){
      ToastAndroid.show( '请先登录' ,ToastAndroid.SHORT)
      return;
    }
    const { navigate } = this.props.navigation;
    navigate('Sign')
  }
  goMima = () => {
    const {account}=this.state
    if(!this.state.hasAccount){
      ToastAndroid.show( '请先登录' ,ToastAndroid.SHORT)
      return;
    }
    const { navigate } = this.props.navigation;
    navigate('Mima',account)
  }
  special = () => {
    if(!this.state.hasAccount){
      ToastAndroid.show( '请先登录' ,ToastAndroid.SHORT)
      return;
    }
    const { navigate } = this.props.navigation;
    navigate('Special')
  }
  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        {
          this.state.hasAccount ?
            <View style={[styles.header,{height:60,justifyContent: 'center'}]}>
              <Text style={{color:'#FFFFFF'}}>欢迎 {this.state.account} !</Text>
            </View> 
          :
            <View style={styles.header}>
              <TouchableOpacity style={styles.registerButton} onPress={this.register}><Text style={styles.register}>注册</Text></TouchableOpacity>
              <TouchableOpacity style={styles.loginButton} onPress={this.login}><Text style={styles.login}>登陆</Text></TouchableOpacity>
            </View>
        }
       
        <View style={styles.person}>
          <Text style={styles.Text}>个人中心</Text>
        </View>
        <View style={styles.button}>
          <TouchableOpacity style={styles.myButton} onPress={this.special}>
            <Image source={guan} style={styles.image} />
            <Text style={styles.buttonText}>我的关注</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.myButton} onPress={this.goSign}>
            <Image source={qian} style={styles.image} tintColor='#FA7298' />
            <Text style={styles.buttonText}>签到</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.myButton} onPress={this.goMima}>
            <Image source={mima} style={styles.image} tintColor='#FA7298' />
            <Text style={styles.buttonText}>修改密码</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}