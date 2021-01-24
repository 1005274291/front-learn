// Reference: Navigating without the navigation prop https://reactnavigation.org/docs/en/navigating-without-navigation-prop.html
import { NavigationContainerRef } from '@react-navigation/core';
import * as React from 'react';
import { ScreensParamList } from 'types/types';//所有页面的参数类型

export const navigationRef = React.createRef<NavigationContainerRef>();

export function navigate<T extends keyof ScreensParamList>(name: T, params?: ScreensParamList[T]) {//保证导航到的是存在的页面，并且传递的参数类型也是对应页面需要的参数类型
  navigationRef.current && navigationRef.current.navigate(name, params);
}

export function goBack() {
  navigationRef.current && navigationRef.current.goBack();
}

export function navDispatch(params: any = {}) {
  navigationRef.current && navigationRef.current.dispatch(params);
}
