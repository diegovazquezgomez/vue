<template>
  <v-app id="app" :dark="setTheme">
    <v-navigation-drawer
      v-model="drawer"
      :clipped="$vuetify.breakpoint.lgAndUp"
      app
    >
      <v-list dense>
        <template>
          <v-list-item :to="{ name: 'home' }">
            <v-list-item-action>
              <v-icon>home</v-icon>
            </v-list-item-action>
            <v-list-item-title> Inicio </v-list-item-title>
          </v-list-item>
        </template>
        <template>
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
        <template>
          <v-list-group>
            <v-list-item slot="activator">
              <v-list-item-content>
                <v-list-item-title> Compras </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item :to="{ name: '' }">
              <v-list-item-action>
                <v-icon>mdi-currency-usd-off</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title> Ingresos </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item :to="{ name: '' }">
              <v-list-item-action>
                <v-icon>mdi-home-account</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title> Proveedores </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </template>
        <template>
          <v-list-group>
            <v-list-item slot="activator">
              <v-list-item-content>
                <v-list-item-title> Ventas </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item :to="{ name: '' }">
              <v-list-item-action>
                <v-icon>mdi-currency-usd</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title> Ventas </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item :to="{ name: '' }">
              <v-list-item-action>
                <v-icon>mdi-table-account</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title> Clientes </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </template>
        <template>
          <v-list-group>
            <v-list-item slot="activator">
              <v-list-item-content>
                <v-list-item-title> Accesos </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item :to="{ name: '' }">
              <v-list-item-action>
                <v-icon>mdi-account</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title> Usuarios </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </template>
        <template>
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
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      app
      color="blue darken-3"
      dark
    >
      <v-toolbar-title style="width: 300px" class="ml-0 pl-3">
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <span class="hidden-sm-and-down">CRM Tienda</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>

          <v-switch v-model="goDark"></v-switch>
          <v-icon>{{ icono }}</v-icon>

      <v-divider class="mx-4" inset vertical></v-divider>
      <v-btn icon>
        <v-icon>logout</v-icon>
      </v-btn>
    </v-app-bar>
    <v-content>
      <v-container fluid fill-height>
        <v-slide-y-transition mode="out-in">
          <router-view />
        </v-slide-y-transition>
      </v-container>
    </v-content>
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
      switchMe: false,
      icono: "mdi-weather-night",
    };
  },
  computed: {
    setTheme() {
      if (this.goDark == true) {
        this.icono = "mdi-weather-night";
        return (this.$vuetify.theme.dark = true);
      } else {
        this.icono = "mdi-white-balance-sunny";
        return (this.$vuetify.theme.dark = false);
      }
    },
  },
};
</script>
