import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import IndexPage from './routes/IndexPage';
import {UserPageDynamic} from "./dynamic/index"
function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/" exact component={IndexPage} />
        <Route path="/user" component={UserPageDynamic}></Route>
        {/* 路由匹配会执行dynamic，先加载model再加载组件 */}
      </Switch>
    </Router>
  );
}

export default RouterConfig;
