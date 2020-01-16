import { ComponentType } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import { observer, inject } from '@tarojs/mobx'
import { getWindowHeight } from '../../utils/style.js'

import './cateList.scss'

type PageStateProps = {
  counterStore: {
    counter: number,
    increment: Function,
    decrement: Function,
    incrementAsync: Function
  }
}

interface Catelist {
  props: PageStateProps;
}

@inject('counterStore')
@observer
class Catelist extends Component {
  constructor () {
    super(...arguments)
    this.state = {
      categoryList: [],
      menuId: '',
      activeItem: {}
    }
  }
  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    // navigationBarTitleText: '首页'
  }

  componentWillMount () { }

  componentWillReact () {
    console.log('componentWillReact')
  }

  componentDidMount () { 
    this.getCateList()
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  getCateList() {
    Taro.request({
      url: 'https://miniapp.you.163.com/xhr/list/category.json',
      method: 'GET',
      header: {
        'content-type': 'application/json'
      }
    }).then(res => {
      let result = res.data.data.categoryList
      this.setState({
        categoryList: result,
        menuId: result[0] && result[0].id,
        activeItem: result[0]
      })
    })
  }

  setMenu = (value) => {
    let item = this.state.categoryList.filter(item => item.id === value)[0]
    this.setState({
      menuId: value,
      activeItem: item
    })
  }

  render () {
    const height = getWindowHeight()
    let { categoryGroupList, focusBannerList } = this.state.activeItem
    return (
      <View className='cateList'>
        <ScrollView
          scrollY
          className='menu'
          style={{ height }}
        >
          {this.state.categoryList.map((item) => {
            const active = item.id === this.state.menuId
            return <View key={item.id} className={active ? 'menu-item-active menu-item' : 'menu-item'} onClick={() => this.setMenu(item.id)}>
              <Text>{item.name}</Text>
            </View>
          })
          }
        </ScrollView>
        <ScrollView
            scrollY
            className='cate-list'
            style={{ height }}
          >
            <View>
              <Image className="banner-img" src={focusBannerList[0].picUrl} />
              {(categoryGroupList || []).map(item => {
                return <View key={item.id}>
                  <View className="sub-title">{item.name}</View>
                  <View className='at-row'>
                  {(item.categoryList||[]).map(item1 =><View key={item.id} className='at-col at-col-4'>
                    <Image className="item1-img" src={item1.prettyBannerUrl} />
                    <View className='item1-title'>{item1.name}</View>
                    </View>
                  )}
                  </View>
                </View>
              })}
            </View>
          </ScrollView>
        {/* <ScrollView
            scrollY
            className='cate-list'
            style={{ height }}
          >
            {this.state.categoryList.filter(item => item.id == this.state.menuId).map(item => {
              <View className='cate-list-wrap'>
                123
              </View>
            })}
          </ScrollView> */}
      </View>
    )
  }
}

export default Catelist  as ComponentType
