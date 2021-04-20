import Vue from 'vue'
import Router from 'vue-router'
import Form from '@/components/Form'
import FormEditor from '@/components/FormEditor'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Form',
      component: Form
    },
    {
      path: '/editor',
      name: 'FormEditor',
      component: FormEditor
    }
  ]
})
