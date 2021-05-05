import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import vehiclesRoutes from '@/modules/vehicles/routes';

function load(component: string) {
  return () => import(`@/modules/core/${component}.vue`);
}

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/vehicles'
  },
  ...vehiclesRoutes,
  {
    path: '/:catchAll(.*)',
    component: load('NotFound')
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
