+ 小程序写一套代码可以运行在ios和Android两端
+ 页面渲染的方式主要有三种
  + 纯web渲染 phonegap（纯js）
  + 纯native原生渲染 rn weex （jscore+原生组件）
  + Hybrid渲染，使用webView（90%）和native（地图，canvas，video等）结合渲染
  + flutter为代表的自渲染引擎
+ 微信小程序
  + ios 逻辑层用jscore 渲染层wkWebView
  + Android 逻辑层用X5（腾讯内核） jscore 渲染层x5浏览器
  + 小程序开发工具 逻辑层 node WebkotJS（让js跑在桌面软件） 渲染层Chrome WebView 
+ page是页面，一个页面对应一个webView，不同页面之间通过navigate导航
  + js文件是跑在jscore中的逻辑
  + json是针对这个页面的配置
  + wxml实际就是html
  + wxss实际就是css
+ document命令拿到的是小程序跑的逻辑层
+ openInspect命令开启网页调试工具（整个微信开发者工具的调试工具）
+ document.getElementsByTagName("webview")[0].showDevTools(true,null)拿到我们写的小程序的调试工具，实际会将小程序页面标签渲染成自定义标签到html中
+ webView最多打开10页
+ $gwx("./pages/index/index.wxml")({show:true})命令可以展示页面的虚拟dom
+ 也可以在app.json中开启tabBar模式的导航栏,tabBar的页面是不可以被navigateTo添加进去的
+ 小程序开发的request请求都是需要在管理后台配置合法域名的，并且需要https的
+ 我们在云开发时wx的数据一定是在微信的缓存或内存数据库当中的，CloudID就是我们的云id，让我们可以通过这个拿到云缓存中的数据
+ 小程序/小游戏反编译
  + 下载一个安卓模拟器
  + 安装微信和re文件管理器
  + 在模拟器中打开root权限
  + 在微信中发现里的小程序中选择一个小程序进入
  + 在re文件管理器根目录-data-data-com.tencent.mm-micromsg-很长的编码(当前的用户id)-appbrand-pkg-缓存下来的代码包（wxapkg结尾的文件）
  + 长按文件选择进行复制，点击存储，进入共享文件夹，粘贴到目录下
  + 在网易木木中点击文件共享在电脑中弹出文件夹