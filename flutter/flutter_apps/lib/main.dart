import 'package:flutter/material.dart';
import 'dart:math'; //引入dart内部的库
import 'dart:ui';

import 'package:flutter_apps/pages/PageIndex.dart';

void main() {
  runApp(MyApp());
}
// void main() => runApp(MyStatelessWidget(text: "Example Stateless!"));

// class MyStatelessWidget extends StatelessWidget {
//   //静态组件
//   final String text;
//   MyStatelessWidget({Key key, this.text}) : super(key: key);

//   @override
//   Widget build(BuildContext context) {
//     return Container(
//       child: Center(
//         child: Text(
//           text,
//           textDirection: TextDirection.ltr,
//         ),
//       ),
//     );
//   }
// }

//执行组件其实是执行组件的build函数，setState会执行build函数重新构建视图
class MyApp extends StatelessWidget {
  //Stateful是有状态组件（必须要实例化state，通过setstate改变状态）,Stateless是无状态组件（初始化之后不会进行改变了）
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo！！',
      theme: ThemeData(
        primarySwatch: Colors.red, //主题色
        visualDensity: VisualDensity.adaptivePlatformDensity,
      ),
      home: MyHomePage(title: 'Flutter Demo Home Page!!'), //主页组件
    );
  }
}

class MyHomePage extends StatefulWidget {
  MyHomePage({Key key, this.title}) : super(key: key); //构造函数
  final String title;

  @override
  // _MyHomePageState createState() => _MyHomePageState();
  _HomePage createState() => _HomePage();
}

class _HomePage extends State<MyHomePage> {
  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
        //添加一个controller来控制TabBar和TabBarView的对应关系
        length: 5,
        child: Scaffold(
          appBar: AppBar(
            //页面头部
            title: Text("标题栏"), //可以放组件
            bottom: TabBar(
              isScrollable: true, //可以滚动
              labelColor: Colors.green, //被选中的颜色
              unselectedLabelColor: Colors.white, //没被选中的颜色
              indicatorSize: TabBarIndicatorSize.label, //文字多长下面的滑动条多长
              tabs: [
                Text("推荐"),
                Text("关注"),
                Text("安卓"),
                Text("ios"),
                Text("后端"),
              ],
            ),
            // leading: Text("标题左边容器"),
            // actions: [
            //   RaisedButton(
            //     onPressed: () {},
            //     child: Text("1"),
            //   ),
            //   RaisedButton(
            //     onPressed: () {},
            //     child: Text("1"),
            //   ),
            //   RaisedButton(
            //     onPressed: () {},
            //     child: Text("1"),
            //   ),
            // ], //标题右边容器
          ),
          drawer: Container(
            width: 200,
            color: Colors.white,
            child: Center(
              child: Text("左侧边栏"),
            ),
          ),
          endDrawer: Container(
            width: 200,
            color: Colors.white,
            child: Center(
              child: Text("右侧边栏"),
            ),
          ),
          floatingActionButton: RaisedButton(
            child: Text("主内容区右下角按钮"),
            onPressed: () {},
          ),
          bottomNavigationBar: BottomNavigationBar(
            items: [
              BottomNavigationBarItem(icon: Icon(Icons.home), label: "首页"),
              BottomNavigationBarItem(icon: Icon(Icons.search), label: "发现")
            ],
          ),
          body: Center(
            child: TabBarView(
              children: [
                PageIndex(),
                Center(
                  child: Text("关注"),
                ),
                Center(
                  child: Text("安卓"),
                ),
                Center(
                  child: Text("ios"),
                ),
                Center(
                  child: Text("后端"),
                ),
              ],
            ),
          ),
        ));
  }
}

// class _MyHomePageState extends State<MyHomePage> {
//   int _counter = 0; //_开头的属性表示私有变量，在别的文件不可以访问
//   List<Widget> getChildrens() {
//     return <Widget>[
//       Text(
//         'You have pushed the button this many times:',
//         style: TextStyle(backgroundColor: Colors.red, color: Colors.white),
//       ),
//       Text(
//         '$_counter',
//         style: Theme.of(context).textTheme.headline1,
//       ),
//     ];
//   }

//   // void _incrementCounter() {
//   //   setState(() {
//   //     _counter++;
//   //   });
//   // }

//   @override
//   Widget build(BuildContext context) {
//     var s = window.physicalSize /
//         window.devicePixelRatio; //用物理大小/物理像素分辨率针对css像素分辨率的比率
//     var rng = new Random();
//     double btnTop = rng.nextDouble() * (s.height - 50);
//     double btnLeft = rng.nextDouble() * (s.width - 200);
//     return Scaffold(
//         // appBar: AppBar(
//         //   title: Text(widget.title),
//         // ),
//         // body: Center(
//         //   //把内容放在组件中间的容器
//         //   child: Column(
//         //     //child是单组件容器，children是多组件容器
//         //     //子组件以列排序的方式的容器
//         //     mainAxisAlignment: MainAxisAlignment.center,
//         //     children: getChildrens(),
//         //   ),
//         // ),
//         body: Container(
//       color: Colors.blue,
//       child: Stack(
//         //可以使子元素层叠并且可以出现在屏幕任意位置的容器
//         children: [
//           AnimatedPositioned(
//             //Positioned可以设置子元素位置
//             //AnimatedPositioned可以在元素位置移动的时候触发动画
//             left: btnLeft,
//             top: btnTop,
//             duration: Duration(seconds: 1),
//             child: SizedBox(
//                 //只有有尺寸的容器才能设置宽高（SizedBox和Container）
//                 width: 200,
//                 height: 50,
//                 child: RaisedButton(
//                   child: Text(
//                     "点我啊",
//                     style: TextStyle(color: Colors.white),
//                   ),
//                   color: Colors.red,
//                   onPressed: () {
//                     setState(() {});
//                     //执行setState会重新执行build重新计算按钮的值
//                   },
//                 )),
//           )
//         ],
//       ),

//       // floatingActionButton: FloatingActionButton(
//       //   onPressed: _incrementCounter,
//       //   tooltip: 'Increment',
//       //   child: Icon(Icons.add),
//       // ),
//     ));
//   }
// }
