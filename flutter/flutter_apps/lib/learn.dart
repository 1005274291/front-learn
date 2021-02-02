class Person {
  String _name = ""; //加_表示类属性是私有的不能在别的文件访问，但是需要将他抽离到单独的文件中
  int age = 0;
  int gender = 0;

  // Person(String name, int age, int gender) {
  //   //构造函数和类同名
  //   this._name = name;
  //   this.age = age;
  //   this.gender = gender;
  // }
  //构造函数简单写法
  Person()
      : _name = "",
        age = 12,
        gender = 1 {}

  static String city = "北京"; //静态属性
  outputInfo() {
    //非静态方法可以访问静态属性
    print("$_name: 年龄$age 性别$gender $city");
  }

  static info() {
    //静态方法只能访问静态属性
    print(city);
  }
}

class MixTest {
  void drink() {
    print("喝水");
  }
}

abstract class Animals {
  String name = "动物世界";
  //加上abstract是不可以被实例化的抽象类
  //抽象类中不实现抽象体的方法叫抽象方法
  //如果我们继承一个抽象类，则必须实现抽象类中的抽象方法
  void eat() {
    print("动物都要吃");
  }

  void ead();
}

class Dog with MixTest implements Animals {
  String name = "球球";
  //with 是混入 一起实现这个接口
  //如果implements的话必须重新实现父类中的方法，无论父类的方法有没有方法体,也可以同时实现多个接口用,分割开接口名
  @override //实现父类中的抽象方法
  void ead() {
    print("狗吃骨头");
  }

  void eat() {
    print("覆盖父组件的同名方法");
  }
}

main() async {
  // var str = "大家好"; //var 是类型推断，赋值完成不可以再改变类型
  //const 是常量必须定义就赋值 final也是定义常量的但可以不用定义时赋值
  // const str1 = "这是常量";
  // final int nums = 123;
  // double mydounle = 5.4;

  // print("真的不错$nums${nums + mydounle}");
  // print(nums % mydounle); //取余
  // print(nums ~/ mydounle); //除数取整
  // print(nums / mydounle); //除数不取整

  //定义多行字符串
  // String str = """
  //   awdawdhawiodaw
  //   wafoawikhfoiwa
  //   dawoidjhawoid

  //   dwadawd
  // """;
  // print(str is String); //类型判断
  // print(str.runtimeType); //运行时的类型
  // print(int.parse(str));// 将字符串转换成int double.parse将字符串转换成浮点
  // var list = [1, 2, 3]; //直接推断为数组
  // var list = new List<int>();//用构造函数的方式构建
  // List<int> mylist = [1, 2, 3]; //规定数组中每一项的类型
  // mylist.add(4); //添加一项
  // mylist.addAll([5, 6]); //添加多项
  // mylist.remove(2); //在数组中删除这个值
  // mylist.removeAt(0); //在数组中删除指定位置
  // mylist.removeRange(0, 1); //按照位置删除
  // mylist.removeWhere((element) => element > 5); //删除大于5的项
  // mylist.fillRange(0, 2, 100);
  // mylist.shuffle(); //乱序
  // mylist.take(3).toList(); //取前三项
  // mylist.takeWhile((value) => value < 3); //从头开始截断直到找到不符合要求的
  // mylist.contains(100); //是否包含100
  // mylist.where((element) => element > 3); //筛选数组的值
  // mylist.retainWhere((element) => element > 3); //改变数组的值
  // mylist.firstWhere((element) => element > 3); //第一个大于3的值
  // mylist.toSet().toList(); //转成集合再转成数组去重
  // mylist.asMap(); //转换成map{index:value}
  // print(mylist.indexWhere((element) => element > 3)); //第一个大于3的下标
  // print(mylist.reversed.toList()); //reversed是转换成元组了

  // var map1 = {
  //   "name": "jun",
  //   "age": 18,
  // }; //字典
  // // Map map2 = {};
  // map1.addAll({"address": "qiqihaer"}); //添加一项
  // map1.containsKey("name"); //key是否存在，value是否存在
  // map1.removeWhere((key, value) => value == 18); //删除值为18的一项
  // print(map1.isEmpty); //字典是否为空
  // print(map1.keys); //所有的键
  // print(map1.values); //所有的值
  // print(map1["name"]); //取出的值

  // String myfunction() {
  //   //void 没有返回值的函数
  //   return "这是一个返回字符串的函数";
  // }
  // void myfunction(String name, [int gender = 1, int age = 12]) {
  //   //[]中表示可以不传参数，=是不传的时候的默认值 但是要按照3顺序接收参数
  //   print("$name:${gender == 1 ? "男" : "女"} 年龄$age");
  // }
  // void myfunction(String name, {int gender = 1, int age = 12}) {
  //   //{}表示命名参数，可以不按照顺序接收参数
  //   print("$name:${gender == 1 ? "男" : "女"} 年龄$age");
  // }
  //dart的箭头函数只能写一个表达式
  //自执行方法和js一样((){})()

  // myfunction("军少", age: 18);
  // bar() async {
  //   print("start bar");
  //   return "hello";
  // }

  // foo() async {
  //   print("start foo");
  //   String value =
  //       await bar(); //async函数的返回值只能从未来才拿到 await是让async函数顺序执行，但返回值延后拿到
  //   print("Foo X $value");
  //   // Future(bar).then((value) => print("Foo X $value"));
  // }

  // print("main");
  // await foo();
  // print("main end");

  Person p = new Person();
  Person.info();
  p //dart的连缀操作
    .._name = "jiangjun"
    ..age = 100
    ..gender = 50
    ..outputInfo();

  Dog d = new Dog();
  d.eat();
  d.drink();
  print(d.name);
}

//Dart的基本数据类型
int a = 123; //整型
double b = 1.25; //浮点型
String c = "好的"; //字符串
bool d = true; //布尔
List e = [1, 2, 5, 4]; //数组
Map f = {"name": "jun"}; //字典
