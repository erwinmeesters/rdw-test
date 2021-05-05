/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
const vehiclesRoutes = [
  {
    path: '/vehicles',
    name: 'vehicles',
    component: () => import(/* webpackChunkName: "vehicles" */ './VehiclesList')
  },
  {
    path: '/vehicles/:id',
    name: 'vehicle',
    component: () => import(/* webpackChunkName: "vehicles" */ './VehicleDetails')
  }
];

export default vehiclesRoutes;
