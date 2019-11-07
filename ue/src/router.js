import Login from './components/Login'
import Finder from './components/Finder'

const routes = [
  {
    path: '/',
    component: Login,
    name: '',
    hidden: true
  },
  {
    path: '/login',
    component: Login,
    name: '',
    hidden: true
  },
  {
    path: '/finder',
    component: Finder,
    name: '',
    hidden: true
  },
];

export default routes;