<template>
  <v-app id="app">
    <v-navigation-drawer
      v-model="drawer"
      :clipped="$vuetify.breakpoint.lgAndUp"
      app
      v-if="logueado"
    >
      <v-list dense>
        <template
          v-if="esAdministrador || esAlmacenero || esVendedor || esComprador"
        >
          <v-list-item :to="{ name: 'home' }">
            <v-list-item-action>
              <v-icon>home</v-icon>
            </v-list-item-action>
            <v-list-item-title> Inicio </v-list-item-title>
          </v-list-item>
        </template>
        <template v-if="esAdministrador || esAlmacenero">
          <v-list-group>
            <v-list-item slot="activator">
              <v-list-item-content>
                <v-list-item-title> Almacén </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item :to="{ name: 'categoria' }">
              <v-list-item-action>
                <v-icon>mdi-warehouse</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title> Categorías </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item :to="{ name: 'articulo' }">
              <v-list-item-action>
                <v-icon>mdi-barcode-scan</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title> Artículos </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </template>
        <template v-if="esAdministrador || esAlmacenero">
          <v-list-group>
            <v-list-item slot="activator">
              <v-list-item-content>
                <v-list-item-title> Compras </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item :to="{ name: 'ingreso' }">
              <v-list-item-action>
                <v-icon>mdi-currency-usd-off</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title> Ingresos </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item :to="{ name: 'proveedor' }">
              <v-list-item-action>
                <v-icon>mdi-home-account</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title> Proveedores </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </template>
        <template v-if="esAdministrador || esVendedor">
          <v-list-group>
            <v-list-item slot="activator">
              <v-list-item-content>
                <v-list-item-title> Ventas </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item :to="{ name: 'venta' }">
              <v-list-item-action>
                <v-icon>mdi-currency-usd</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title> Ventas </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item :to="{ name: 'cliente' }">
              <v-list-item-action>
                <v-icon>mdi-table-account</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title> Clientes </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </template>
        <template v-if="esAdministrador">
          <v-list-group>
            <v-list-item slot="activator">
              <v-list-item-content>
                <v-list-item-title> Accesos </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item :to="{ name: 'usuario' }">
              <v-list-item-action>
                <v-icon>mdi-account</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title> Usuarios </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </template>
        <template v-if="esAdministrador || esAlmacenero || esVendedor">
          <v-list-group>
            <v-list-item slot="activator">
              <v-list-item-content>
                <v-list-item-title> Consultas </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item :to="{ name: '' }">
              <v-list-item-action>
                <v-icon>mdi-finance</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title> Consulta Compras </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item :to="{ name: '' }">
              <v-list-item-action>
                <v-icon>mdi-poll</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title> Consulta Ventas </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </template>
        <template v-if="esAdministrador || esComprador">
          <v-list-group>
            <v-list-item slot="activator">
              <v-list-item-content>
                <v-list-item-title> Tienda </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item :to="{ name: 'tienda' }">
              <v-list-item-action>
                <v-icon>mdi-finance</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Productos</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      app
      color="blue darken-3"
      dark
    >
      <v-toolbar-title style="width: 300px" class="ml-0 pl-3">
        <v-app-bar-nav-icon
          @click.stop="drawer = !drawer"
          v-if="logueado"
        ></v-app-bar-nav-icon>
        <span class="hidden-sm-and-down">CRM Tienda</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>

      <v-tooltip v-if="!$vuetify.theme.dark" bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on" small fab @click="modoOscuro">
            <v-icon>mdi-white-balance-sunny</v-icon>
          </v-btn>
        </template>
        <span>Cambiar a modo noche</span>
      </v-tooltip>

      <v-tooltip v-else bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on" small fab @click="modoOscuro">
            <v-icon>mdi-weather-night </v-icon>
          </v-btn>
        </template>
        <span>Cambiar a modo dia </span>
      </v-tooltip>

      <v-divider class="mx-4" inset vertical v-if="logueado"></v-divider>

      <v-menu bottom min-width="200px" rounded offset-y v-if="logueado">
        <template v-slot:activator="{ on }">
          <v-subheader v-on="on" class="mouse">{{ $store.state.usuario.email }}</v-subheader>
        </template>
        <v-card>
          <v-list-item-content class="justify-center">
            <div class="mx-auto text-center">
              <v-avatar color="purple">
                <span class="white--text text-h5"></span>
              </v-avatar>
              <h3>{{ $store.state.usuario.email }}</h3>
              <p class="text-caption mt-1">
                {{ $store.state.usuario.rol }}
              </p>
              <v-divider class="my-3"></v-divider>
              <v-btn depressed rounded text> Editar Cuenta </v-btn>
            </div>
          </v-list-item-content>
        </v-card>
      </v-menu>

      <!--<v-tooltip bottom v-if="logueado">
        <template
          v-slot:activator="{ on, attrs }"
          v-if="$store.state.usuario.rol"
        >
          <v-subheader v-bind="attrs" v-on="on">{{
            $store.state.usuario.email
          }}</v-subheader>
        </template>
        <span>Rol del usuario <br />{{ $store.state.usuario.rol }} </span>
      </v-tooltip>-->
      <span> </span>
      <v-divider class="mx-4" inset vertical v-if="logueado"></v-divider>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <span v-bind="attrs" v-on="on"
            ><v-btn icon @click="salir()" v-if="logueado">
              <v-icon>logout</v-icon>
            </v-btn>
          </span>
        </template>
        <span>Salir de la sesión</span>
      </v-tooltip>
    </v-app-bar>
    <v-main>
      <v-container fluid fill-height>
        <v-slide-y-transition mode="out-in">
          <router-view />
        </v-slide-y-transition>
      </v-container>
    </v-main>
    <v-footer height="auto">
      <v-layout justify-center>
        <v-flex text-xs-center>
          <v-card flat tile color="primary" class="white--text">
            <v-card-text class="white--text text-sm-right">
              Diego Vázquez Gómez &copy;2021
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-footer>
  </v-app>
</template>
<style scoped>
.mouse {
  cursor: pointer;
}
</style>
<script>
export default {
  name: "App",
  opts: {
    theme: {
      dark: false,
    },
  },
  //vuetify: new Vuetify(this.opts),
  data() {
    return {
      goDark: false,
      drawer: true,
      icono: "mdi-weather-night",
      notificaciones: 0,
      modoActual: 1,
    };
  },
  computed: {
    logueado() {
      return this.$store.state.usuario && this.$store.state.usuario.rol;
    },
    esAdministrador() {
      return (
        this.$store.state.usuario &&
        this.$store.state.usuario.rol == "Administrador"
      );
    },
    esAlmacenero() {
      return (
        this.$store.state.usuario &&
        this.$store.state.usuario.rol == "Almacenero"
      );
    },
    esVendedor() {
      return (
        this.$store.state.usuario && this.$store.state.usuario.rol == "Vendedor"
      );
    },
    esComprador() {
      return (
        this.$store.state.usuario &&
        this.$store.state.usuario.rol == "Comprador"
      );
    },
  },
  created() {
    this.$store.dispatch("autoLogin");
    this.$vuetify.theme.dark = false;
  },
  methods: {
    salir() {
      this.$store.dispatch("salir");
    },
    modoOscuro() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
    },
  },
};
</script>
