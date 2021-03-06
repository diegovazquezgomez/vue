import Vue from 'vue'
import Router from 'vue-router'
//import Home from '../views/Home.vue'
import Categoria from '../components/Categoria.vue'
import Articulo from '../components/Articulos.vue'
import Home from '../components/Home.vue'
import Login from '../components/Login.vue'
import Tienda from '../components/Tienda.vue'
import Usuario from '../components/Usuario.vue'
import Cliente from '../components/Cliente.vue'
import Proveedor from '../components/Proveedor.vue'
import Ingreso from '../components/Ingreso.vue'
import Venta from '../components/Venta.vue'
import Grafico_v from '../components/Grafico_v.vue'
import Checkout from '../components/Checkout.vue'

import store from '../store/index'


Vue.use(Router)

var router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        administrador: true,
        almacenero: true,
        vendedor: true
      }
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        libre: true
      }
    },
    {
      path: '/categoria',
      name: 'categoria',
      component: Categoria,
      meta: {
        administrador: true,
        almacenero: true
      }
    },
    {
      path: '/articulo',
      name: 'articulo',
      component: Articulo,
      meta: {
        administrador: true,
        vendedor: true
      }
    },
    {
      path: '/tienda',
      name: 'tienda',
      component: Tienda,
      meta: {
        administrador: true,
        vendedor: true
      }
    },
    {
      path: '/usuario',
      name: 'usuario',
      component: Usuario,
      meta: {
        administrador: true
      }
    },
    {
      path: '/cliente',
      name: 'cliente',
      component: Cliente,
      meta: {
        administrador: true,
        vendedor: true
      }
    },
    {
      path: '/proveedor',
      name: 'proveedor',
      component: Proveedor,
      meta: {
        administrador: true,
        vendedor: true
      }
    },
    {
      path: '/ingreso',
      name: 'ingreso',
      component: Ingreso,
      meta: {
        administrador: true,
        vendedor: true
      }
    },
    {
      path: '/venta',
      name: 'venta',
      component: Venta,
      meta: {
        administrador: true,
        vendedor: true
      }
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: Checkout,
      meta: {
        administrador: true,
        vendedor: true
      }
    },
    {
      path: '/grafico_v',
      name: 'grafico_v',
      component: Grafico_v,
      meta: {
        administrador: true,
        vendedor: true
      }
    },
    /*{
      path: '/proveedor',
      name: 'proveedor',
      component: Proveedor,
      meta: {
        administrador: true,
        almacenero: true
      }
    },
    {
      path: '/usuario',
      name: 'usuario',
      component: Usuario,
      meta: {
        administrador: true
      }
    }*/
  ]
})
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.libre)) {
    next();
  } else if (store.state.usuario && store.state.usuario.rol == 'Administrador') {
    if (to.matched.some(record => record.meta.administrador)) {
      next();
    }
  } else if (store.state.usuario && store.state.usuario.rol == 'Vendedor') {
    if (to.matched.some(record => record.meta.vendedor)) {
      next();
    }
  } else if (store.state.usuario && store.state.usuario.rol == 'Almacenero') {
    if (to.matched.some(record => record.meta.almacenero)) {
      next();
    }
  } else {
    next({ name: 'login' });
  }
})
export default router
