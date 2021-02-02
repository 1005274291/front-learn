import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';

class PageIndex extends StatefulWidget {
  PageIndex({Key key}) : super(key: key);

  @override
  PageIndexState createState() => PageIndexState();
}

class PageIndexState extends State<PageIndex> {
  @override
  Widget build(BuildContext context) {
    return Container(
      child: Scaffold(
        body: Container(
            color: Colors.blue,
            child: ClipOval(
              //第三种画圆角的画法,会将图片的四周变成原型
              child: Image.asset("assets/images/liu.jpg"),
            )
            //     ClipRRect(
            //   //第二种画圆角的方法
            //   child: Image.asset(
            //     "assets/images/liu.jpg",
            //     width: 100,
            //     height: 100,
            //   ),
            //   borderRadius: BorderRadius.circular(50),
            // )

            //     Container(
            //   width: 100,
            //   height: 100,
            //   decoration: ShapeDecoration(
            //       //第一种圆角画法
            //       //形状装饰器
            //       image: DecorationImage(
            //         //设置图片
            //         image: AssetImage(
            //             "assets/images/liu.jpg"), //image.asset返回的是组件 assetImages是一个实例
            //       ),
            //       shape: RoundedRectangleBorder(
            //           //设置形状
            //           borderRadius: BorderRadiusDirectional.circular(50))),
            // )
            // Image.asset(
            //   "assets/images/liu.jpg",
            //   width: 100,
            //   height: 40,
            //   fit: BoxFit.contain, //图片填充时的裁剪方式
            // ), //从前端的资源包读取
            // Image.file(file)//从本地路径加载
            // Image.memory(bytes)//生成一张图片如canvas
            //     child: Image.network(
            //   "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1076238794,2051819414&fm=26&gp=0.jpg",
            //   width: 100,
            //   height: 60,
            // ) //从网络中获取
            ),
      ),
    );
  }
}
