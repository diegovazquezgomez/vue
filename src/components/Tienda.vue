<template>
  <v-layout align-center>
    <v-container fluid>
      <v-data-iterator
        :items="articulos"
        hide-default-footer
        :search="search"
        :categoria="categoria"
        :items-per-page.sync="itemsPerPage"
        :page.sync="page"
      >
        <template v-slot:header>
          <v-col cols="12" sm="12" md="12" justify-end>
            <v-btn icon :to="{ name: 'checkout' }">
              <v-badge
                :content="notificacion"
                :value="notificacion"
                color="green"
                overlap
              >
                <v-icon large> mdi-cart </v-icon>
              </v-badge>
            </v-btn>
          </v-col>
          <v-row>
            <v-col cols="6" sm="12" md="6">
              <v-text-field
                class="text-xs-center"
                v-model="search"
                append-icon="search"
                label="Búsqueda"
                single-line
                hide-details
              >
              </v-text-field>
            </v-col>
            <v-col cols="6" sm="6" md="6">
              <v-select
                v-model="categoria"
                :items="categorias"
                label="Categoria"
              ></v-select>
            </v-col>
          </v-row>
          <v-divider></v-divider>
          <v-row class="mt-2" align="center" justify="center">
            <span class="grey--text">Artículos por página</span>
            <v-menu offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  dark
                  text
                  color="primary"
                  class="ml-2"
                  v-bind="attrs"
                  v-on="on"
                >
                  {{ itemsPerPage }}
                  <v-icon>mdi-chevron-down</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item
                  v-for="(number, index) in itemsPerPageArray"
                  :key="index"
                  @click="updateItemsPerPage(number)"
                >
                  <v-list-item-title>{{ number }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>

            <v-spacer></v-spacer>

            <span class="mr-4 grey--text">
              Página {{ page }} de {{ numberOfPages }}
            </span>
            <v-btn
              fab
              dark
              color="blue darken-3"
              class="mr-1"
              @click="formerPage"
            >
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
            <v-btn
              fab
              dark
              color="blue darken-3"
              class="ml-1"
              @click="nextPage"
            >
              <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
          </v-row>
        </template>
        <template v-slot:default="props">
          <v-row>
            <v-col
              v-for="item in props.items"
              :key="item.nombre"
              cols="12"
              sm="6"
              md="4"
              lg="3"
            >
              <v-card :loading="loading" class="mx-auto my-12" max-width="374">
                <template slot="progress">
                  <v-progress-linear
                    color="deep-purple"
                    height="10"
                    indeterminate
                  ></v-progress-linear>
                </template>

                <v-img height="250" :src="item.imagen"></v-img>

                <v-card-title>{{ item.nombre }}</v-card-title>

                <v-card-text>
                  <div class="my-4 text-subtitle-1">
                    Categoría - {{ item.categoria.nombre }}
                  </div>
                  <v-row align="center" class="mx-0">
                    <v-rating
                      :value="4.5"
                      color="amber"
                      dense
                      half-increments
                      readonly
                      size="14"
                    ></v-rating>

                    <div class="grey--text ms-4">4.5 (413)</div>
                  </v-row>
                </v-card-text>
                <v-card-text style="height: 100px; overflow-y: auto">{{
                  item.descripcion
                }}</v-card-text>
                <v-divider class="mx-4"></v-divider>
                <v-row class="mt-2" align="center" justify="center">
                  <v-card-title>Precio: {{ item.precio_venta }} €</v-card-title>
                </v-row>
                <v-row class="mt-2" align="center" justify="center">
                  <v-card-subtitle>
                    Disponibles: {{ item.stock }}
                  </v-card-subtitle>
                </v-row>
                <v-row class="mt-2" align="center" justify="center">
                  <v-card-actions align-center>
                    <v-btn
                      color="deep-purple lighten-2"
                      text
                      @click="comprar(item._id)"
                      align="right"
                    >
                      Comprar <v-icon>mdi-cart</v-icon>
                    </v-btn>
                  </v-card-actions>
                </v-row>
              </v-card>
            </v-col>
          </v-row>
        </template>
        <template v-slot:footer>
          <v-row
            class="mt-2 d-none d-lg-flex d-xl-none"
            align="center"
            justify="center"
          >
            <span class="grey--text">Artículos por página</span>
            <v-menu offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  dark
                  text
                  color="primary"
                  class="ml-2"
                  v-bind="attrs"
                  v-on="on"
                >
                  {{ itemsPerPage }}
                  <v-icon>mdi-chevron-down</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item
                  v-for="(number, index) in itemsPerPageArray"
                  :key="index"
                  @click="updateItemsPerPage(number)"
                >
                  <v-list-item-title>{{ number }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>

            <v-spacer></v-spacer>

            <span class="mr-4 grey--text">
              Página {{ page }} de {{ numberOfPages }}
            </span>
            <v-btn
              fab
              dark
              color="blue darken-3"
              class="mr-1"
              @click="formerPage"
            >
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
            <v-btn
              fab
              dark
              color="blue darken-3"
              class="ml-1"
              @click="nextPage"
            >
              <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
          </v-row>
        </template>
        <!--<template v-slot:footer>
          <v-toolbar class="mt-2" color="indigo" dark flat>
            <v-toolbar-title class="subheading">
              
            </v-toolbar-title>
          </v-toolbar>
        </template>-->
      </v-data-iterator>
    </v-container>
  </v-layout>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      nombre: null,
      _id: "",
      imagen: null,
      articulos: [],
      loading: false,
      descripcion: null,
      precio_venta: null,
      stock: null,
      itemsPerPage: 4,
      itemsPerPageArray: [4, 8, 12],
      page: 1,
      search: "",
      notificacion: 0,
      categorias: [],
      categoria: "",
    };
  },
  created() {
    this.listar();
    this.selectCategoria();
  },
  methods: {
    listar() {
      //hace peticion a la url indicada
      let me = this;
      let header = {
        Token: this.$store.state.token,
      };

      let configuracion = { headers: header };
      axios
        .get("articulo/list", configuracion)
        .then(function (response) {
          me.articulos = response.data;
          me.loading = false;
          console.log(me.articulos);
          me.articulos.map(function (x) {
            me.nombre = x.nombre;
            me.imagen = x.imagen;
            me.descripcion = x.descripcion;
            me.precio = x.precio_venta;
            me.stock = x.stock;
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    comprar(id) {
      //hace peticion a la url indicada
      let me = this;
      let header = {
        Token: this.$store.state.token,
      };
      console.log(this._id);
      let configuracion = { headers: header };
      axios
        .put("articulo/comprar", { _id: id }, configuracion)
        .then(function (response) {
          me.adModal = 0;
          me.adAccion = 0;
          me.adNombre = "";
          me.adId = "";
          me.listar();
          me.alerta_edit = true;
          me.mensaje = "Articulo Comprado";
          me.notificacion++;
        })
        .catch(function (error) {
          console.log(error);
        });
      me.alerta_edit = false;
      me.mensaje = null;
    },
    nextPage() {
      if (this.page + 1 <= this.numberOfPages) this.page += 1;
    },
    formerPage() {
      if (this.page - 1 >= 1) this.page -= 1;
    },
    updateItemsPerPage(number) {
      this.itemsPerPage = number;
    },
    selectCategoria() {
      //hace peticion a la url indicada
      let me = this;
      var categoriaArray = [];
      let header = {
        Token: this.$store.state.token,
      };

      let configuracion = { headers: header };
      axios
        .get("categoria/list", configuracion)
        .then(function (response) {
          me.loading = false;
          categoriaArray = response.data;
          categoriaArray.map(function (x) {
            me.categorias.push({ text: x.nombre, value: x._id });
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    },
  },
  computed: {
    numberOfPages() {
      return Math.ceil(this.articulos.length / this.itemsPerPage);
    },
    filteredKeys() {
      return this.keys.filter((key) => key !== "nombre");
    },
    height() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return 220;
        case "sm":
          return 400;
        case "md":
          return 500;
        case "lg":
          return 600;
        case "xl":
          return 800;
      }
    },
  },
};
</script>
