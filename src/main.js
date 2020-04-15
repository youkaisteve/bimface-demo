import Vue from 'vue';
import less from 'less';
import VueRouter from 'vue-router';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';
Vue.use(ElementUI);
Vue.use(VueRouter);
Vue.use(less);

Vue.config.productionTip = false;

const routes = [
    { path: '/', component: () => import('./views/index.vue') },
    { path: '/model', component: () => import('./views/model.vue') },
    { path: '/layout', component: () => import('./views/layout.vue') }
];

const router = new VueRouter({
    routes
});

new Vue({
    router,
    render: h => h(App)
}).$mount('#app');
