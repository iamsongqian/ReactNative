/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import React, { Component } from 'react';
import { StyleSheet, Text, View, StatusBar, TouchableOpacity, Dimensions, Image } from 'react-native';
import hero1 from '../../hero/hero1.png';
import hero2 from '../../hero/hero2.png';
import hero3 from '../../hero/hero3.png';
import hero4 from '../../hero/hero4.png';
import hero5 from '../../hero/hero5.png';
import hero6 from '../../hero/hero6.png';
import hero7 from '../../hero/hero7.png';

const { height, width } = Dimensions.get('window');
const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    marginTop: 10,
    backgroundColor: '#FFFFFF',
    paddingVertical: 5,
    paddingHorizontal: 5,
  },
  text: {
    marginLeft: 20,
    fontSize: 12,
    color: 'gray',
    marginTop: 10,
  },
  control:{
    position:'absolute',
    flexDirection:'row',
    height:20,
    top:23,
    right:15,
    alignItems: 'center',
  },
  controlText:{
    width: 50,
    alignItems: 'center',
    height:20,
    justifyContent:'center'
  }
});
const ImageList = [hero1, hero2, hero3, hero4, hero5, hero6, hero7,]
export default class ShopCarItem extends Component {
  constructor(props){
    super(props)
    this.state={
      number:this.props.number,
      show:true,
      totalprice:this.props.number*this.props.price
    }
  }
  render() {
    const { imageIndex, text, price } = this.props
    const { number } = this.state
    return (
      <View>
        {
          number > 0 ?
            <View style={styles.item}>
              <Image source={ImageList[imageIndex]} style={{ width: 60, height: 60 }} />
              <View>
                <Text style={styles.text}>{text}</Text>
                <Text style={styles.text}>{price} 积分</Text>
              </View>
              <View style={styles.control}>
                
                <View style={styles.controlText}><Text style={{ fontSize: 12 }}>数量: {number}</Text></View>
                
              </View>
            </View>
            : null
        }
      </View>
    );
  }
}