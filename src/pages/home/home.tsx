import { ComponentType } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { observer, inject } from '@tarojs/mobx'
import { AtInput, AtForm, AtIcon, AtGrid } from 'taro-ui'
import { Swiper, SwiperItem, View } from '@tarojs/components'

import './home.scss'

type PageStateProps = {
  counterStore: {
    counter: number,
    increment: Function,
    decrement: Function,
    incrementAsync: Function
  }
}

interface Index {
  props: PageStateProps;
}

@inject('counterStore')
@observer
class Index extends Component {
  constructor (props) {
    super(props)
    this.state = { 
      lastItemId: 0,
      list: []
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
    enablePullDownRefresh: true,
  }

  componentWillMount () { }

  componentWillReact () {
    console.log('componentWillReact')
  }

  componentDidMount () {
    this.getList()
   }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }
  
  onReachBottom = () => {
    this.getList()
  }

  getList = () => {
    Taro.request({
      url: 'https://miniapp.you.163.com/xhr/rcmd/index.json',
      method: 'GET',
      data: {
        lastItemId: this.state.lastItemId,
        size: 20
      },
      header: {
        'content-type': 'application/json'
      }
    }).then(res => {
      let result = res.data.data.rcmdItemList
      let list = this.state.list.concat(result)
      let lastItem = result[result.length - 1]
      this.setState({list: list, lastItemId: lastItem && lastItem.id})
    })
  }

  render () {
    return (
      <View className='home'>
        <AtForm>
          <AtInput placeholder='搜索商品, 共21763款好物' />
        </AtForm>
        <Swiper
        indicatorColor='#f3e6e6'
        indicatorActiveColor='#b1151a'
        circular
        indicatorDots
        autoplay>
        <SwiperItem>
          <Image className="swiper-img" src="https://yanxuan.nosdn.127.net/02eae8d25f60873a098842e588b8cfce.jpg?type=webp&imageView&quality=75&thumbnail=750x0" />
        </SwiperItem>
        <SwiperItem>
          <Image className="swiper-img" src="https://yanxuan.nosdn.127.net/7630e8cfaa8cb9e2583a76a4f2792e35.jpg?type=webp&imageView&quality=75&thumbnail=750x0" />
        </SwiperItem>
        <SwiperItem>
          <Image className="swiper-img" src="https://yanxuan.nosdn.127.net/b81707e0546600e6180732ad71ad027b.jpg?type=webp&imageView&quality=75&thumbnail=750x0" />
        </SwiperItem>
      </Swiper>
      <View className='at-row'>
        <View className='at-col'>
          <AtIcon prefixClass='icon' value='wangyi' size='14' color='#F00'></AtIcon>
          网易自营品牌
        </View>
        <View className='at-col'>
          <AtIcon prefixClass='icon' value='anquanwancheng' size='14' color='#F00'></AtIcon>
          30天无忧退货
        </View>
        <View className='at-col'>
          <AtIcon prefixClass='icon' value='money' size='14' color='#F00'></AtIcon>
          48小时快速退款
        </View>
      </View>
      <AtGrid hasBorder={false} data={
        [
          {
            image: 'https://yanxuan.nosdn.127.net/fede8b110c502ec5799702d5ec824792.png',
            value: '居家生活'
          },
          {
            image: 'https://yanxuan.nosdn.127.net/896a3beac514ae8f40aafe028e5fec56.png',
            value: '服饰鞋包'
          },
          {
            image: 'https://yanxuan.nosdn.127.net/37520d1204a0c55474021b43dac2a69e.png',
            value: '美食酒水'
          },
          {
            image: 'https://yanxuan.nosdn.127.net/6c3bd9d885c818b1f73e497335a68b47.png',
            value: '个护清洁'
          },
          {
            image: 'https://yanxuan.nosdn.127.net/fbca8e1f2948f0c09fc7672c2c125384.png',
            value: '数码家电'
          },
          {
            image: 'https://yanxuan.nosdn.127.net/12e8efd15b9b210ab156a7ee9b340548.gif',
            value: '好货抄底'
          }
        ]
      } />
      <View className="height30"></View>
      <View>
        <View className="like-title">猜你喜欢</View>
        {this.state.list.filter(item => item.type === 1).map(item => {
          const { id, categoryItem } = item
          return <View key={item.id} className="item-card" key={id}>
             <Image className="item-img" src={categoryItem.listPicUrl} />
              <View className="item-title">{categoryItem.name}</View>
              <View>
                <Text className="item-price">¥{categoryItem.activityPrice || categoryItem.retailPrice}</Text>
                {!!categoryItem.activityPrice && <Text className="item-old-price">¥{categoryItem.retailPrice}</Text>}
              </View>
          </View>
        })}
      </View>
      </View>
    )
  }
}

export default Index  as ComponentType
