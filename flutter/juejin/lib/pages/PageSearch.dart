import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:juejin/pages/PageIndex.dart';
import 'package:webview_flutter/webview_flutter.dart';

class PageSearch extends StatefulWidget {
  PageSearch({Key key}) : super(key: key);

  @override
  _PageSearchState createState() => _PageSearchState();
}

class _PageSearchState extends State<PageSearch>
    with AutomaticKeepAliveClientMixin {
  @override
  bool get wantKeepAlive => true;
  @override
  Widget build(BuildContext context) {
    print("进入发现页");
    // return Container(
    //   child: Center(
    //     child: RaisedButton(
    //       //在组件内部动态切换路由的第一种方法
    //       //Navigator.of(context).pop()可以返回路由
    //       child: Text("去首页"),
    //       onPressed: () {
    //         // Navigator.push(context, MaterialPageRoute(builder: (context) {
    //         //   return PageIndex(); //可以给构造函数传参数
    //         // }));
    //       },
    //     ),
    //   ),
    // );
    return WebView(
      initialUrl: "https://www.baidu.com", //网页的地址
    );
  }
}
