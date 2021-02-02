import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'package:flutter/material.dart';
import 'package:transparent_image/transparent_image.dart';

class PageIndex extends StatefulWidget {
  PageIndex({Key key}) : super(key: key);

  @override
  _PageIndexState createState() => _PageIndexState();
}

class _PageIndexState extends State<PageIndex>
    with SingleTickerProviderStateMixin, AutomaticKeepAliveClientMixin {
  List<String> tabTexts = [
    "推荐",
    "热榜",
    "前端",
    "后端",
    "android",
    "ios",
    "人工智能",
    "开发工具",
  ];
  List listViews = [];
  TabController _tabController;
  List<Widget> getTabs() {
    List<Tab> result = [];
    for (int i = 0; i < tabTexts.length; i++) {
      result.add(Tab(
        text: tabTexts[i],
      ));
    }
    return result;
  }

  // getTabViews() {
  //   List<Widget> result = [];
  //   for (int i = 0; i < tabTexts.length; i++) {
  //     result.add(ListView.separated(
  //       itemCount: 100, //数据数量
  //       //适合传入大量数据 自带分割线 实现了部分加载 预加载用户可视列表附近的数据
  //       itemBuilder: (context, index) {
  //         if (index == 0) {
  //           return Container(
  //               height: 50,
  //               child: ListView.builder(
  //                 scrollDirection: Axis.horizontal,
  //                 itemCount: 50,
  //                 itemBuilder: (context, index) {
  //                   return Text("$index");
  //                 },
  //               ));
  //         }
  //         // print(index);
  //         return Text("$index");
  //       },
  //       separatorBuilder: (context, index) => Divider(), //返回分隔组件
  //     ));
  //   }
  //   return result;
  // }
  getTabViews() {
    List<Widget> result = [];
    print("$listViews 数据");
    for (int i = 0; i < tabTexts.length; i++) {
      result.add(ListView.builder(
        itemCount: listViews.length,
        itemBuilder: (context, index) {
          String coverImage =
              listViews[index]["item_info"]["article_info"]["cover_image"];
          return ListTile(
            //列表中的每一项
            title: Text(listViews[index]["item_info"]["article_info"]["title"]),
            // subtitle: Text(
            //     listViews[index]["item_info"]["article_info"]["brief_content"]),
            // trailing: Image.network(
            //   coverImage,
            //   width: 50,
            //   height: 50,
            // ), //这是在尾部 leading在头部
            trailing: coverImage.isNotEmpty
                ? FadeInImage.memoryNetwork(
                    //借用第三方库，设置一个透明图占位，呈现一个淡入淡出的效果
                    placeholder: kTransparentImage,
                    image: coverImage,
                    width: 50,
                    height: 50,
                  )
                : null,
          );
        },
      ));
    }
    return result;
  }

  //原生flutter网络请求
  getArticlesData() async {
    var url = //可以通过抓包获取app得接口 获取分类列表
        "https://api.juejin.cn/recommend_api/v1/article/recommend_all_feed";

    // var httpClient = new HttpClient();
    // var request = await httpClient.postUrl(Uri.parse(url)); //对url进行URI编码
    Map posetData = {
      "client_type": "2608",
      "cursor": "0",
      "id_type": "2",
      "limit": "20",
      "sort_type": "200"
    };
    // request.add(utf8.encode(json.encode(posetData))); //对请求参数先序列化成json再编码传送

    // var response = await request.close();
    // var responseBody =
    //     await response.transform(utf8.decoder).join(); //拿到结果先解码成json
    // var listData = jsonDecode(responseBody); //在反序列化成对象
    var response = await http.post(url, body: posetData);
    setState(() {
      //setState不会重新执行initState
      print(jsonDecode(response.body)["data"].runtimeType);
      List viewdata = jsonDecode(response.body)["data"];
      for (var i = 0; i < viewdata.length; i++) {
        if (viewdata[i]["item_type"] == 2) {
          listViews.add(viewdata[i]);
        }
      }
      print("$listViews 筛选后的数据");
    });
    // listViews = await jsonDecode(response.body)["data"];
    return response;
  }

  @override
  void initState() {
    // ignore: todo
    // TODO: implement initState
    super.initState();
    print("开始请求");
    getArticlesData();
    _tabController = new TabController(length: tabTexts.length, vsync: this);
  }

  @override
  bool get wantKeepAlive => true;
  @override
  void dispose() {
    // ignore: todo
    // TODO: implement dispose
    super.dispose();
    _tabController.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          title: Row(children: [
            Expanded(
                //子组件占满空间
                child: TextField(
              maxLength: 30,
              maxLines: 1,
              autocorrect: true,
              // autofocus: true,
              // obscureText: true,//是否是密码
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 30.0, color: Colors.blue),
              onChanged: (value) => {print("change $value")},
              onSubmitted: (text) {
                print("submit $text");
              },
              enabled: true,
              decoration: InputDecoration(
                  counterText: "", //文字计数
                  hintText: "搜索掘金",
                  prefixIcon: Icon(Icons.search),
                  border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(15),
                      borderSide: BorderSide.none),
                  fillColor: Color.fromARGB(255, 238, 241, 244),
                  filled: true),
              // child: Text("搜索"),
            )),
            FlatButton.icon(
                onPressed: () {}, icon: Icon(Icons.settings), label: Text("标签"))
          ]),
          bottom: TabBar(
            controller: _tabController,
            isScrollable: true,
            tabs: getTabs(),
          ),
        ),
        body: TabBarView(controller: _tabController, children: getTabViews()));
  }
}
