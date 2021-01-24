import { defineConfig } from 'umi';

export default defineConfig({
  // layout: {},
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    { path: '/', component: '@/pages/index',redirect:"/about" },
    { path: "about", component: "@/pages/about" },
    { path: "/more", component: "@/pages/more/index" ,wrappers:[
      "@/wrappers/auth"//wrappers是高阶组件，可以做权限管理 ,可以写多个
    ]},
    // { path: '/product/:id?', component: '@/pages/product/[id]' },
    { path: '/product/:id?', component: '@/pages/product/_layout', routes: [{ path: '/product/:id', component: '@/pages/product/[id]' }], },
    //嵌套路由的形式，所有的子路由公用一个component并且命名要求为_layout.tsx
  ],
});
