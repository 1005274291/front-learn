import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { MapLocation, Report } from 'types/types';
import Icon from 'react-native-vector-icons/FontAwesome';
import { get } from 'utils/request';
import { MapView } from 'react-native-amap3d';
import actions from 'reduxState/actions';
import qs from 'qs';
import ReportMarker from './ReportMarker';
import { screenWidth } from 'utils/constants';
import { selectLocation } from 'reduxState/selectors';

interface ReportsMap {
  [id: string]: Report;
}

interface Props {}
export default function MapScreen({}: Props) {
  const dispatch = useDispatch();
  const location = useSelector(selectLocation);
  const [reportsMap, setReportsMap] = useState<ReportsMap>({});
  async function checkReportsByLocation(mapLocation: MapLocation) {
    const { data: reports } = await get(
      `/location/?${qs.stringify({ ...mapLocation, type: 'reports' })}`,
    );

    if (reports && reports.length) {//将获取到的数据填充到对象中缓存
      const newReportsMap = { ...reportsMap };
      for (const report of reports) {
        newReportsMap[report.id] = report;
      }
      setReportsMap(newReportsMap);
    }
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.container}
        // showsCompass={false}
        center={location && { latitude: location.lat, longitude: location.lon }}//由地理定位作为中心点获取视图
        showsLocationButton
        locationEnabled//启动地理定位
        locationInterval={5000}//每5秒触发一次地理定位
        onLocation={(e) => {//设置地理定位到redux
          dispatch(actions.setLocation({ lat: e.latitude, lon: e.longitude }));
        }}
        onStatusChangeComplete={({ region }) => {//地图状态改变（拖放结束）由中心点坐标和长宽来确定显示多大的视图的信息
          checkReportsByLocation({
            lon: region.longitude,
            lat: region.latitude,
            lonDelta: region.longitudeDelta,
            latDelta: region.latitudeDelta,
          });
        }}
      >
        {Object.keys(reportsMap).map((reportId) => (
          <ReportMarker key={reportId} report={reportsMap[reportId]} />//将要展示的数据来传给mark展示
        ))}
      </MapView>
      <TouchableOpacity
        style={styles.postButton}
        onPress={() => dispatch(actions.showCameraOptions())}
      >
        <Icon name="camera" size={24} />
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  postButton: {
    position: 'absolute',
    left: screenWidth / 2 - 30,
    bottom: '5%',
    zIndex: 10,
    backgroundColor: '#fffa',
    height: 60,
    width: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
