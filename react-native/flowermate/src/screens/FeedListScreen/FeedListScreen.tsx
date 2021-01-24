import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  View,
} from 'react-native';
import { ScreensParamList, Feed } from 'types/types';
import { get } from 'utils/request';
import qs from 'qs';
import FeedItem from './FeedItem';
import { RouteProp, useRoute, useIsFocused } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { selectUser } from 'reduxState/selectors';

const limit = 5;

type FeedListScreenRouteProp = RouteProp<ScreensParamList, 'FeedListScreen'>;
interface Props {}
function FeedListScreen({}: Props) {
  const user = useSelector(selectUser)!;
  const [listData, setListData] = useState([]);
  const [loading, setLoading] = useState<'refresh' | 'more' | null>(null);//loading的状态变量
  const isEndReached = React.useRef(false);
  const isFetching = React.useRef(false);//标志变量（判断是否已经在刷新或者在获取更多数据中防止冲突），可以用作class组件当中的this.isFetching被函数组件持久存储
  const isFocused = useIsFocused();//获得屏幕是否处于焦点状态
  const route = useRoute<FeedListScreenRouteProp>();
  const showMyself = route.params?.showMyself ?? false;
  useEffect(() => {
    if (isFocused) {
      //如果页面焦点状态改变，从无焦点变成有焦点那么从新获取数据
      getListData(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);
  async function getListData(isRefresh?: boolean) {
    if (isFetching.current) {//已经在加载数据
      return;
    }
    if (!isRefresh && isEndReached.current) {//在加载更多的数据但是所有的数据都被加载完成了
      return;
    }
    isFetching.current = true;
    setLoading(isRefresh ? 'refresh' : 'more');
    const { data } = await get(
      `/feed?${qs.stringify({
        offset: isRefresh ? 0 : listData.length, // 起始偏移
        limit, // 跨度值
        userId: showMyself ? user.id : undefined,
      })}`,
    );
    setLoading(null);
    if (data && data.rows) {
      let currentCount;
      if (isRefresh) {
        currentCount = data.rows.length;
        setListData(data.rows);
      } else {
        currentCount = data.rows.length + listData.length;
        setListData(listData.concat(data.rows));
      }
      if (currentCount >= data.count) {//判断是否所有的数据都已经加载
        isEndReached.current = true;
      } else {
        isEndReached.current = false;
      }
    }
    isFetching.current = false;
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList<Feed>//列表组件，方便复用
        data={listData}//数据源
        refreshing={loading === 'refresh'}//判断是否刷新
        onRefresh={() => getListData(true)}//刷新执行的函数
        keyExtractor={(item) => String(item.id)}//为列表中的每一项指定一个key
        renderItem={({ item }) => <FeedItem item={item} />}//渲染列表每一项用什么组件
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        onEndReached={() => getListData()}//上滑加载更多列表数据
        ListFooterComponent={() =>//列表底部组件
          loading === 'more' ? <ActivityIndicator /> : null
        }
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#efefef',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    width: '100%',
    marginVertical: 4,
    backgroundColor: '#bbb',
  },
});
export default FeedListScreen;
