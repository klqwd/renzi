import Layout from '@/layout'

export default {
  path: '/social.js', 
  component: Layout, 
  children: [{
      path: '', 
      name: 'social.js', 

    component: () => import('@/views/social'),
    meta: {
      title: '社保' ,icon:'table'
    }
  }]
}