<template>
  <v-layout align-start>
    <v-flex>
      <div id="app">
        <v-app id="inspire">
          <v-alert
            prominent
            type="success"
            :value="alerta_edit"
            icon="mdi-pencil"
            transition="scale-transition"
            >articulo editada correctamente</v-alert
          >
          <v-alert
            prominent
            type="success"
            :value="alerta_add"
            icon="mdi-plus-circle-outline"
            transition="scale-transition"
            >articulo añadida correctamente</v-alert
          >
          <v-alert
            prominent
            type="success"
            :value="alerta_delete"
            icon="mdi-delete"
            transition="scale-transition"
            >articulo borrada correctamente</v-alert
          >
          <v-data-table
            :headers="headers"
            :items="articulos"
            :search="search"
            sort-by="nombre"
            class="elevation-1"
          >
            <template v-slot:top>
              <v-toolbar flat>
                <v-toolbar-title>articulos</v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-spacer></v-spacer>
                <v-text-field
                  class="text-xs-center"
                  v-model="search"
                  append-icon="search"
                  label="Búsqueda"
                  single-line
                  hide-details
                ></v-text-field>
                <v-spacer></v-spacer>
                <v-dialog v-model="dialog" max-width="500px">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      color="primary"
                      dark
                      class="mb-2"
                      v-bind="attrs"
                      v-on="on"
                    >
                      Nueva
                    </v-btn>
                  </template>
                  <v-card>
                    <v-card-title>
                      <span class="text-h5">{{ formTitle }}</span>
                    </v-card-title>

                    <v-card-text>
                      <v-container>
                        <v-row>
                          <v-col cols="12" sm="12" md="12">
                            <v-text-field
                              v-model="nombre"
                              label="Nombre"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="12" md="12">
                            <v-text-field
                              v-model="descripcion"
                              label="Descripcion"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="12" md="12" v-show="valida">
                            <div
                              class="red--text"
                              v-for="v in validaMensaje"
                              :key="v"
                              v-text="v"
                            ></div>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-card-text>

                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="blue darken-1" text @click="close">
                        Cancelar
                      </v-btn>
                      <v-btn color="blue darken-1" text @click="guardar">
                        Guardar
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
                <v-dialog v-model="dialogDelete" max-width="500px">
                  <v-card>
                    <v-card-title class="text-h5"
                      >¿Está seguro de borrar la categoría?</v-card-title
                    >
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="blue darken-1" text @click="closeDelete"
                        >Cancelar</v-btn
                      >
                      <v-btn
                        color="blue darken-1"
                        text
                        @click="deleteItemConfirm"
                        >OK</v-btn
                      >
                      <v-spacer></v-spacer>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
                <v-dialog v-model="adModal" max-width="290">
                  <v-card>
                    <v-card-title class="headline" v-if="adAccion == 1">
                      Activar Item
                    </v-card-title>
                    <v-card-title class="headline" v-if="adAccion == 2">
                      Desactivar Item
                    </v-card-title>
                    <v-card-text>
                      Estás a punto de
                      <span v-if="adAccion == 1">activar </span>
                      <span v-if="adAccion == 2">desactivar </span> el item
                      {{ adNombre }}
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        @click="activarDesactivarCerrar()"
                        color="green darken-1"
                        text="text"
                      >
                        Cancelar
                      </v-btn>
                      <v-btn
                        v-if="adAccion == 1"
                        @click="activar()"
                        color="orange darken-4"
                        text="text"
                      >
                        Activar
                      </v-btn>
                      <v-btn
                        v-if="adAccion == 2"
                        @click="desactivar()"
                        color="orange darken-4"
                        text="text"
                      >
                        Desactivar
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-toolbar>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn small icon v-bind="attrs" v-on="on" color="orange">
                    <v-icon small class="mr-2" @click="editItem(item)">
                      mdi-pencil
                    </v-icon>
                  </v-btn>
                </template>
                <span>Editar articulo</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn small icon v-bind="attrs" v-on="on" color="red">
                    <v-icon small @click="deleteItem(item)">
                      mdi-delete
                    </v-icon>
                  </v-btn>
                </template>
                <span>Borrar articulo</span>
              </v-tooltip>
              <v-tooltip right>
                <template v-slot:activator="{ on, attrs }">
                  <template v-if="item.estado">
                    <v-btn small icon v-bind="attrs" v-on="on" color="red">
                      <v-icon small @click="activarDesactivarMostrar(2, item)">
                        mdi-cancel
                      </v-icon>
                    </v-btn>
                  </template>

                  <template v-else>
                    <v-btn small icon v-bind="attrs" v-on="on" color="green">
                      <v-icon small @click="activarDesactivarMostrar(1, item)">
                        check
                      </v-icon>
                    </v-btn>
                  </template>
                </template>
                <span>Activar / Desactivar articulo</span>
              </v-tooltip>
            </template>
            <template v-slot:no-data>
              <v-btn color="primary" @click="listar"> Reset </v-btn>
            </template>
          </v-data-table>
          
        </v-app>
      </div>
    </v-flex>
  </v-layout>
</template>
<script>
import axios from "axios";

export default {
  data() {
    return {
      articulos: [], // almacenará las articulos
      search: "",
      dialog: false,
      dialogDelete: false,
      headers: [
        { text: "Nombre", value: "nombre", sortable: true },
        { text: "Descripcion", value: "descripcion", sortable: false },
        { text: "Estado", value: "estado", sortable: false },
        { text: "Opciones", value: "actions", sortable: false },
      ],
      editedIndex: -1, //pasa a 1 cuando se edita
      _id: "",
      nombre: "",
      descripcion: "",
      valida: 0,
      validaMensaje: [],
      adModal: 0,
      adAccion: 0,
      adNombre: "",
      adId: "",
      alerta_edit: false,
      alerta_add: false,
      alerta_delete: false,
      imagen: "",
    };
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nueva articulo" : "Nueva articulo";
    },
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  created() {
    this.listar();
    setTimeout(() => {
      this.alerta_edit = false;
    }, 8000);
    setTimeout(() => {
      this.alerta_add = false;
    }, 8000);
  },

  methods: {
    listar() {
      //hace peticion a la url indicada
      let me = this;
      let header = {
        Token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MWJmMjBkZTYzM2JiMTQzZjMwYzFmZGEiLCJpYXQiOjE2NDAxMDcyODgsImV4cCI6MTY0MDE5MzY4OH0.vd_1sLtzEdMLGCLeE_ym2I7zU1o6cLbu2LUQK3lLN0c" /*this.$store.state.token*/,
      };
      let configuracion = { headers: header };
      axios
        .get("articulo/list", configuracion)
        .then(function (response) {
          me.articulos = response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    guardar() {
      //Metodo para guardar y actualizar datos
      let me = this;
      let header = {
        Token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MWJmMjBkZTYzM2JiMTQzZjMwYzFmZGEiLCJpYXQiOjE2NDAxMDcyODgsImV4cCI6MTY0MDE5MzY4OH0.vd_1sLtzEdMLGCLeE_ym2I7zU1o6cLbu2LUQK3lLN0c" /*this.$store.state.token*/,
      };
      let configuracion = { headers: header };
      if (this.validar()) {
        return;
      }
      if (this.editedIndex > -1) {
        //Código para editar
        axios
          .put(
            "articulo/update",
            {
              _id: this._id,
              nombre: this.nombre,
              descripcion: this.descripcion,
            },
            configuracion
          )
          .then(function (response) {
            me.limpiar();
            me.close();
            me.listar();
            me.alerta_edit = true;
            me.tipo_alerta = "success";
          })
          .catch(function (error) {
            console.log(error);
          });
      } else {
        //Código para guardar
        axios
          .post(
            "articulo/add",
            { nombre: this.nombre, descripcion: this.descripcion },
            configuracion
          )
          .then(function (response) {
            me.limpiar();
            me.close();
            me.listar();
            me.alerta_add = true;
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    },
    limpiar() {
      this._id = "";
      this.nombre = "";
      this.descripcion = "";
      this.valida = 0;
      this.validaMensaje = [];
      this.editedIndex = -1;
    },
    validar() {
      this.valida = 0;
      this.validaMensaje = [];
      if (this.nombre.length < 1 || this.nombre.length > 50) {
        this.validaMensaje.push(
          "El nombre de la categoría debe tener entre 1-50 caracteres."
        );
      }
      if (this.descripcion.length > 255) {
        this.validaMensaje.push(
          "La descripción de la categoría no debe tener más de 255 caracteres."
        );
      }
      if (this.validaMensaje.length) {
        this.valida = 1;
      }
      return this.valida;
    },
    editItem(item) {
      this._id = item._id;
      this.nombre = item.nombre;
      this.descripcion = item.descripcion;
      this.dialog = true;
      this.editedIndex = 1;
    },

    deleteItem(item) {},

    deleteItemConfirm() {
      this.articulos.splice(this.editedIndex, 1);
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    ocultar_alerta() {
      if (this.alerta_edit) {
        console.log("Ocultar");
        setTimeout((this.alerta_edit = false), 5000);
      }
    },
    activar() {
      let me = this;
      let header = {
        Token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MWJmMjBkZTYzM2JiMTQzZjMwYzFmZGEiLCJpYXQiOjE2NDAxMDcyODgsImV4cCI6MTY0MDE5MzY4OH0.vd_1sLtzEdMLGCLeE_ym2I7zU1o6cLbu2LUQK3lLN0c" /*this.$store.state.token*/,
      };
      let configuracion = { headers: header };
      axios
        .put("articulo/activate", { _id: this.adId }, configuracion)
        .then(function (response) {
          me.adModal = 0;
          me.adAccion = 0;
          me.adNombre = "";
          me.adId = "";
          me.listar();
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    desactivar() {
      let me = this;
      let header = {
        Token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MWJmMjBkZTYzM2JiMTQzZjMwYzFmZGEiLCJpYXQiOjE2NDAxMDcyODgsImV4cCI6MTY0MDE5MzY4OH0.vd_1sLtzEdMLGCLeE_ym2I7zU1o6cLbu2LUQK3lLN0c" /*this.$store.state.token*/,
      };
      let configuracion = { headers: header };
      axios
        .put("articulo/deactivate", { _id: this.adId }, configuracion)
        .then(function (response) {
          me.adModal = 0;
          me.adAccion = 0;
          me.adNombre = "";
          me.adId = "";
          me.listar();
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    activarDesactivarMostrar(accion, item) {
      this.adModal = 1;
      this.adNombre = item.nombre;
      this.adId = item._id;
      if (accion == 1) {
        this.adAccion = 1;
      } else if (accion == 2) {
        this.adAccion = 2;
      } else {
        this.adModal = 0;
      }
    },
    activarDesactivarCerrar() {
      this.adModal = 0;
    },
  },
};
</script>
