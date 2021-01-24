+ ios App开发原生语言是objective-c和swift，开发ide是Xcode（只能在mac上运行）
+ Android App开发原生语言是java和Kotlin，开发工具是Android Studio
+ Hybrid App属于混合开发主要是HTML+JS+CSS来生成app
+ 其中webview就是一个裸的浏览器外壳（去掉导航栏和底部工具栏）内嵌网页代码，通过phonegap.js作为桥梁访问原生native端的能力
+ 混合开发的优势有：开发成本低，天然跨平台，无审核热更新，可扩展，可是性能一般
+ 而react-native是通过外部包了一层原生语言的壳，内部通过jscore引擎运行main.js代码来将视图通过原生的手段映射出去
+ 由于js是可以热更新的，所以调试很方便，不用随时编译，但发布时需要替换整个由metro或package打包好的js就好了
+ rn项目中的Android和ios两个文件夹是两个原生的应用，一旦更改里面的代码或者涉及到第三方库更改原生代码需要重新编译，而如果新增原生第三方库在ios中需要先执行pod install（需要配置代理）再进行编译
+ 在我们需要对第三方库进行修改时可以下载patch-package包，配置scrpt命令postinstall，创建patches文件夹，当修改完第三方库时，执行yarn patch-package package-name后会生成补丁，在下次重新安装依赖时会自动把补丁打上去
+ webpack中的打包不会把node_modules打包，他们都是压缩过的，也很少涉及会去修改第三方库，而rn的metro是最后编译的可以把node_modules转码，所以node_module是源码比较方便修改
+ yarn提供了resolutions可以设定间接依赖的版本(在package.json中设定)
+ npx jetify 会自动把Android包改成Androidx包
+ 打包 "apk": "npx jetify && cd android && ./gradlew assembleRelease"
+ ios9和Android9以后默认只支持https，而
  + ios打开https需要到ios目录下同名的项目目录下的info.plist(ios的配置文件)<key>NSAppTransportSecurity</key>里面加上		<key>NSAllowsArbitraryLoads</key>
		<true/>
  + Android打开https需要到android下app下src下debug下的AndroidManifest.xml中配置android:usesCleartextTraffic="true"
+ 配置授权时，ios在我们有使用某个特权的时候会自动帮我们询问用户获得授权，而Android需要我们自己去申请
+ Android需要我们自己去申请在配置文件中的<uses-permission android:name="android.permission.INTERNET" />表示我们需要的授权
+ ios在info.plist中的<key>NSLocationWhenInUseUsageDescription</key>
	<string>请求授权的描述</string>表示我们需要的授权
+ APP采用的是栈式导航，就是一个视图覆盖在另一个视图上造成的切换效果，并不是切换页面，而是改变页面的堆叠层级，所以如果栈中页面过多会显得卡顿
+ 抽屉导航（汉堡导航，侧边栏）
+ 标签导航（底部按钮切换）
+ 在任意函数组件中获取navigation可以使用hooks也可以使用ref
+ storage 是持久存储断电可以保存 memory是内存断电不可以保存，而rn如果想要持久存储token可以用asyncStorage调用原生存储
+ redux-persist是redux的一个中间件，可以在redux存取数据的出入口将一些需要持久化的输入存储在asyncstorage
+ 将非登录页面和登录面用两个栈导航区分开，使得登录过的不可能跳回登录页
+ rn发起网络请求也是以原生得语言发起得所以很难调试，可以用flipper调试（0.62版本以后）
+ rn中布局中使用的flex布局，如果例如9宫格这种布局可以采用获取设备宽高，，自己计算宽高的方式
+ 原生控件借助于原生平台的绘制可能会导致rn的ios和Android的UI不统一，而flutter不会，他自绘了一套画布
+ 如果我们想要实现一个底部菜单栏，可以选用react-native-action-sheet
+ 如果想要实现多图片选取，图片裁剪控制，图片的横屏支持可以选择react-native-image-crop-picker库
+ rn中base64的消耗很大，原生端将图片二进制编码成base64，原生端通过桥发送到js端，而js端又要请求回原生端
+ 扫码实际是一个叫camera的全局组件（一个全屏的相机），通过回调的方式处理扫码的结果，可能解析到一个网页的地址，通过webview导航到地址（可以通过焦点事件来控制摄像头的开启和关闭）
+ 第三方原生组件地图组件，国外使用谷歌地图，国内使用高德地图（百度地图经度纬度的坐标系不是通用的坐标系）使用react-native-amapd3d第三方库，支持最新3D SDK
  + 有些第三方库是免费的可能也需要注册一个账号
  + 通过引入MapView后指定中心坐标把视图定下来
  + 启动地图定位
  + 通过MapView.Marker添加可拖拽的地图标记和图片和信息窗体
+ webView可以给我们提供更加丰富的内容（很多不需要我们去写，和rn的js环境是完全隔离开的）
  + webview调试在ios上可以用safari，在Android中是在mainApplication.java配置后打开chrome输入地址chrome://inspect
  + 当我们用手机浏览器打开一些网页时，可能会发起一个自定义的协议（custom scheme）去掉起app，但是webview禁止了自定义协议,可以在webview中originWhitelist中配置支持什么协议
  + onShouldStartLoadWithRequest可以拦截webview导航地址控制是否加载
  + mixedContentMode混合模式（在http网站引入了https的资源）在webView中默认不允许的，如果你需要可以设置为always
  + rn向web端传数据可以通过injectedJavaScript传递一个（js脚本字符串，只能注入一次且没有办法修改），也可以injectJavaScript方法来传递（使用ref拿到webview的实例后调用injectJavaScript方法来注入js字符串，可以多次可以延时）
    + 如果传入的js代码没有取到dom可能是因为webview还没有渲染完成界面，所以可以使用轮询的逻辑去执行
  + web向rn中传递数据可以通过postMessage，webView在打开的页面放入了一个全局对象window.ReactNativeWebView,可以通过对象调用这个postMessage方法，，在WebView配置项的onMessage中接收
  + webview中react-native-guide讲到了很多webview的使用场景
+ develop.apple.com注册一个开发者账号可以在自己手机和模拟器调试，发测试版和上架需要688元一年，企业账号299美元可以不上架就下载
+ adb是安卓调试桥梁，看我们连接的设备adb install apk可以直接向手机安装app
+ adb logcat可以展示各种日志信息pid cat可以筛选进程展示你想要展示包的日志信息
+ 在模拟器访问localhost时ios指向宿主主机，Android指向自己的localhost  adb reverse tcp：8081 tcp：8081将手机的8081对接到电脑的8081
+ gradle是一个应用编译辅助工具 build.gradle是gradle针对Android的插件的版本号（maven可以把国外的源设置成国内的） gradle-wrapper是gradle的版本
+ Android在build.gradle中的splits下abi下的include中指明了打包支持的cpu架构（x86,arm64-v8a）会使打的包很大，ios在商店只上传半成品，会在服务器端访问用户的机型针对机型打包给用户下载
+ Android在build.gradle中enableProguardInReleaseBuilds=true进行js代码压缩和变量名替换（谨慎）
+ Android的js引擎可以使用jscore（原装），hermes（特性不完整，启动时间少，内存占用小，build.gradle中enableHermes启用），v8（用户体验少）
  