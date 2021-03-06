import React, { PureComponent } from 'react'
import {
	FlatList,
	TouchableOpacity,
	Dimensions,
	StyleSheet,
	Image,
	Text,
	View,
	Animated,
	Easing,
	ImageBackground,
	ToastAndroid
} from 'react-native'
import ajax from './fetch'
import Toast, { DURATION } from 'react-native-easy-toast'

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default class HomeFlatListView extends PureComponent {

	constructor(props) {
		super(props);

		this.state = {
			sourceData: [],
			refreshing: false,
			flatHeight: 0,
			indexText: '',
		}
	}

	//改变value而不需要重新re-render的变量，声明在construct外面
	currPage = 0;

	//加载数据
	_getNewsList = () => {
		let list =[]
		let requestCode = this.props.requestCode;
		const {sourceData} =this.state
		ajax({
			url: `http://c.m.163.com/nc/article/headline/${requestCode}/${this.currPage}-50.html?from=toutiao&passport=&devId=OPdeGFsVSojY0ILFe6009pLR%2FMsg7TLJv5TjaQQ6Hpjxd%2BaWU4dx4OOCg2vE3noj&size=10&version=5.5.3&spever=false&net=wifi&lat=&lon=&ts=1456985878&sign=oDwq9mBweKUtUuiS%2FPvB015PyTDKHSxuyuVq2076XQB48ErR02zJ6%2FKXOnxX046I&encryption=1&canal=appstore`,
			method: 'GET',
			success: (data) => {
				console.log(data)
				for(let i =0;i<data[requestCode].length;i++){
					if(data[requestCode][i].TAG ==='视频'){
						data[requestCode].splice(i,1)
					}
				}
				if(this.props.tabLabel==='推荐'){
					for (let m = 0; m < data[requestCode].length; m++) {
						if(data[requestCode][m].interestinterest === this.props.tabName) {
							sourceData.push(data[requestCode][m])
							list.push(data[requestCode][m])
							this.setState({
								sourceData: this.state.refreshing ? list : [...this.state.sourceData, ...list]
							});
						}
					}
					if (!this.props.tabName ) {
						ToastAndroid.show(`暂无推荐内容快去看新闻吧`, ToastAndroid.SHORT)
					} else {
						ToastAndroid.show(`根据您最近点击的${this.props.tabName}频道，已为您推荐如下内容`, ToastAndroid.SHORT)
					}
					}
					
				if(this.props.tabLabel==='其他'){
					this.setState({
						sourceData:this.state.refreshing?data[requestCode]:[...this.state.sourceData, ...data[requestCode]]
					})
				}
				for (let m = 0; m < data[requestCode].length; m++) {
					if(data[requestCode][m].interest === this.props.tabLabel) {
						sourceData.push(data[requestCode][m])
						list.push(data[requestCode][m])
						this.setState({
							sourceData: this.state.refreshing ? list : [...this.state.sourceData, ...list]
						});
					}
				}
			
				this.currPage += 10;
			},
			error: (err) => {
				this.refs.toast.show('网络请求异常');
			},
			complete: () => {
				this.state.refreshing && this.setState({ refreshing: false });
			}
		});
	}

	//Header视图
	/**
	 * _renderHeader = () => {

	}
	 */

	//Footer视图
	_renderFooter = () => {
		let len = this.state.sourceData.length;
		return (
			<View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: len < 1 ? 0 : 40 }}>

				<Text style={{ color: '#515151' }}>正在加载...</Text>
			</View>
		)
	}

	//分割线
	_renderItemSeparatorComponent = ({ highlighted }) => {
		return (
			<View style={{ height: 1, backgroundColor: '#e6e6e6' }}></View>
		)
	}

	//没有数据时候页面显示
	_renderEmptyView = () => {
		return (
			<View style={{ height: this.state.flatHeight, backgroundColor: '#f8f8f8', justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>

			</View>
		)
	}

	//设置item高度
	_setFlatListHeight = (e) => {
		let height = e.nativeEvent.layout.height;
		if (this.state.flatHeight < height) {
			this.setState({ flatHeight: height })
		}
	}

	/**
	 * 此函数用于为给定的item生成一个不重复的key
	 * key的作用是使React能够区分同类元素的不同个体，以便在刷新的时候能确定其变化的位置，减少重复渲染的开销
	 * 若不指定此函数，则默认抽取item.key作为key值，若key.item不存在，则使用数组下标
	 */
	_keyExtractor = (item, index) => index + '';

	//上拉加载更多
	_onEndReached = () => {
		this._getNewsList();
	}

	//下拉刷新
	_renderRefresh = () => {
		this.setState({ refreshing: true }); //开始刷新
		this.currPage = 0;
		this._getNewsList();
	}

	_renderItem = ({ item }) => {
		return (
			<HomeFlatListItem
				item={item}
				onPressItem={this._onPressItem}
				selected={this.state.selected === item.id}
			/>
		)
	}

	_onPressItem = (item) => {

		this.setState({
			selected: item.id
		})

		if (item['videoinfo']) {
			this.props.navigation.navigate('VideoDetail', { item })
			return
		}

		this.props.navigation.navigate('NewsDetail', { item })
	}

	//组件渲染后开始加载数据
	componentDidMount() {
		this._getNewsList()
	}

	render() {
		return (
			<View style={styles.container}>
				<FlatList
					ref={ref => this.flatList = ref}
					data={this.state.sourceData}
					extraData={this.state.selected}
					keyExtractor={this._keyExtractor}
					renderItem={this._renderItem}
					//初始加载的条数，不会被卸载
					initialNumToRender={10}
					//决定当距离内容最底部还有多远时候触发onEndReached回调，数值范围：0~1。例如：0.5表示可见布局的最底端距离content最底端等于可见布局一半高度的时候调用该回调
					onEndReachedThreshold={0.5}
					//当列表被滚动到距离内容最底部不足onEndReacchedThreshold设置的距离时调用此函数
					onEndReached={this._onEndReached}
					//ListHeaderComponent={this._renderHeader}
					ListFooterComponent={this._renderFooter}
					ItemSeparatorComponent={this._renderItemSeparatorComponent}
					ListEmptyComponent={this._renderEmptyView}
					onLayout={this._setFlatListHeight}
					//正在加载的时候设置为true，会在界面上显示一个正在加载的提示
					refreshing={this.state.refreshing}
					//如果设置了此选项，则会在列表头部添加一个标准的RefreshControl控件，以便实现“下拉刷新”的功能。同时你需要正确设置refreshing属性。
					onRefresh={this._renderRefresh}
				/>
				<Toast
					ref='toast'
					style={{ backgroundColor: 'black' }}
					position='center'
					opacity={0.8}
					textStyle={{ color: 'white' }}
				/>
			</View>
		)
	}

}

class HomeFlatListItem extends React.PureComponent {

	_onPress = () => {
		this.props.onPressItem(this.props.item)
	}

	render() {
		let item = this.props.item
		//判断是否是三图布局
		let isThreePic = item['imgnewextra']
		//判断是否是视频布局
		let isVideo = item['videoinfo']

		if (isThreePic) {
			return (
				<TouchableOpacity
					{...this.props}
					onPress={this._onPress}
					style={styles.picItem}
					activeOpacity={0.8}
				>
					<View style={{ justifyContent: 'space-between' }}>
						<Text style={{ fontSize: 16, lineHeight: 25, color: '#2c2c2c' }}>{item.title}</Text>

						<View style={{ flexDirection: 'row', marginVertical: 5, justifyContent: 'space-between' }}>
							<Image source={{ uri: item.imgsrc }} style={{ width: screenWidth * 0.35, height: 80 }} />
							{
								item.imgnewextra.map((imgItem, index) => (
									<Image source={{ uri: imgItem.imgsrc }} key={index + ''} style={{ width: screenWidth * .3, height: 80 }} />
								))
							}
						</View>

						<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
							<View style={{ flexDirection: 'row' }}>
								<Text style={{ marginRight: 6 }}>{item.source}</Text>
								<Text style={{ marginRight: 6 }}>{item.replyCount}跟帖</Text>
							</View>

							{/*这里应该有个X号*/}
						</View>
					</View>
				</TouchableOpacity>
			)
		}

		if (isVideo) {
			return (
				<TouchableOpacity
					{...this.props}
					onPress={this._onPress}
					style={styles.picItem}
					activeOpacity={0.8}
				>
					<View style={{ justifyContent: 'space-between' }}>
						<Text style={{ fontSize: 16, lineHeight: 25, color: '#2c2c2c' }}>{item.title}</Text>

						<ImageBackground source={{ uri: item.imgsrc }} resizeMode={'cover'} style={{ height: 180, marginVertical: 6, justifyContent: 'center', alignItems: 'center' }}>
							<View style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>

							</View>
						</ImageBackground>

						<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
							<View style={{ flexDirection: 'row' }}>
								<Text style={{ marginRight: 6 }}>{item.source}</Text>
								<Text style={{ marginRight: 6 }}>{item.replyCount}跟帖</Text>
							</View>

							{/*这里应该有个X号*/}
						</View>
					</View>
				</TouchableOpacity>
			)
		}

		return (
			<TouchableOpacity
				{...this.props}
				onPress={this._onPress}
				style={styles.item}
				activeOpacity={0.8}
			>
				<View style={{ width: screenWidth * 0.63, height: 100, justifyContent: 'space-between' }} >
					<Text style={{ fontSize: 16, lineHeight: 25, color: '#2c2c2c' }}>{item.title}</Text>

					<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
						<View style={{ flexDirection: 'row' }}>
							<Text style={{ marginRight: 6 }}>{item.source}</Text>
							<Text style={{ marginRight: 6 }}>{item.replyCount}跟帖</Text>
						</View>

						{/*这里应该有个X号*/}
					</View>
				</View>

				<Image source={{ uri: item.imgsrc }} style={{ width: screenWidth * 0.3, height: 80 }} />
			</TouchableOpacity>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#F8F8F8',
	},
	item: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: 7,
	},
	picItem: {
		padding: 7,
	}
})