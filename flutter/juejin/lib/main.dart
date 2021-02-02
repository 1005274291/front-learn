import 'package:flutter/material.dart';
import 'package:juejin/pages/PageIndex.dart';
import 'package:juejin/pages/PageSearch.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        visualDensity: VisualDensity.adaptivePlatformDensity,
      ),
      home: MyHomePage(title: 'Flutter Demo Home Page'),
      // initialRoute: "/", //首页
      // routes: {
      //   //配置路由
      //   "/": (context) => PageIndex(),
      //   "/search": (context) => PageSearch()
      //   //Navigator.of(context).pushNamed("/search")  进行跳转
      // },
    );
  }
}

class MyHomePage extends StatefulWidget {
  MyHomePage({Key key, this.title}) : super(key: key);
  final String title;
  @override
  _MyHomePageState createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  int bottomNavigationIndex = 0;
  //第一种  通过索引来切换BottomNavigationBar(每次切换请求页面，无法缓存)
  //第二种  通过IndexedStack来切换组件(首次加载请求所有页面，会缓存)
  //第三种  通过PageView来切换组件（点击切换才会请求页面，会缓存）
  List<Widget> pages = [PageIndex(), PageSearch()];
  PageController _controller;
  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    _controller = PageController();
    //可以给_controller添加监听来控制 实例化完control一定要dispose掉
    _controller.addListener(() {
      print(_controller);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // body: pages[bottomNavigationIndex],
      // body: IndexedStack(
      //   index: bottomNavigationIndex,
      //   children: pages,
      // ),
      body: PageView(
        //是一个swiper(缓存组件)
        children: pages,
        controller: _controller,
        physics: NeverScrollableScrollPhysics(), //给swiper设置一个不可滑动得状态
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: bottomNavigationIndex, //设置当前页
        onTap: (int value) {
          //接收点击到按钮得索引来动态得更新页面
          setState(() {
            bottomNavigationIndex = value;
            print(bottomNavigationIndex);
            _controller.jumpToPage(bottomNavigationIndex); //跳转到对应页面
          });
        },
        //底部导航栏切换页面
        //上面得导航栏放到页面组件当中处理
        items: [
          BottomNavigationBarItem(
              icon: Icon(IconData(0xe677, fontFamily: "IconFont")),
              label: "首页"),
          BottomNavigationBarItem(icon: Icon(Icons.search), label: "发现"),
        ],
      ),
    );
  }
}
