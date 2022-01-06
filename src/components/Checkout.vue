<template>
  <v-layout align-center>
    <v-container fluid>
      <v-stepper v-model="e6" vertical>
        <v-stepper-step :complete="e6 > 1" step="1">
          Carrito
          <small></small>
        </v-stepper-step>

        <v-stepper-content step="1">
          <v-card color="grey lighten-1" class="mb-12" height="200px"></v-card>
          <v-btn color="primary" @click="e6 = 2"> Continuar </v-btn>
          <v-btn text :to="{ name: 'tienda' }"> Cancelar </v-btn>
        </v-stepper-content>

        <v-stepper-step :complete="e6 > 2" step="2">
          Direccion de envio
        </v-stepper-step>

        <v-stepper-content step="2">
          <v-card color="grey lighten-1" class="mb-12" height="200px"></v-card>
          <v-btn color="primary" @click="e6 = 3"> Continuar </v-btn>
          <v-btn text @click="retroceder"> Cancelar </v-btn>
        </v-stepper-content>

        <v-stepper-step :complete="e6 > 3" step="3">
          Seleccionar modo de pago
        </v-stepper-step>

        <v-stepper-content step="3">
          <v-card color="grey lighten-1" class="mb-12" height="200px"></v-card>
          <v-btn color="primary" @click="e6 = 4"> Continuar </v-btn>
          <v-btn text @click="retroceder"> Cancelar </v-btn>
        </v-stepper-content>

        <v-stepper-step step="4"> Confirmar compra </v-stepper-step>
        <v-stepper-content step="4">
          <v-card color="grey lighten-1" class="mb-12" height="200px"></v-card>
          <v-btn color="primary" @click="e6 = 1"> Continuar </v-btn>
          <v-btn text @click="retroceder"> Cancelar </v-btn>
        </v-stepper-content>
      </v-stepper>
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
      search: "",
      e6: 1,
    };
  },
  created() {
    this.listar();
  },
  methods: {
    retroceder() {
      console.log(this.e6);
      this.e6 = this.e6 - 1;
    },
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
    devolucion(id) {
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
        })
        .catch(function (error) {
          console.log(error);
        });
      me.alerta_edit = false;
      me.mensaje = null;
    },
  },
};
</script>
