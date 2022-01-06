<template>
  <v-layout align-start>
    <v-flex>
      <div id="app">
        <v-app id="inspire">
          <v-snackbar
            icon="mdi-pencil"
            transition="scale-transition"
            :value="alerta_edit"
            absolute
            top
            right
            tile
            color="success accent-2"
            :timeout="3000"
            elevation="24"
            >{{ mensaje }}</v-snackbar
          >
          <v-snackbar
            icon="mdi-pencil"
            :value="alerta_add"
            absolute
            top
            right
            tile
            color="success accent-2"
            :timeout="2000"
            >Categoria añadida correctamente</v-snackbar
          >
          <v-snackbar
            icon="mdi-pencil"
            :value="alerta_delete"
            absolute
            top
            right
            tile
            color="success accent-2"
            :timeout="2000"
            >Categoria borrada correctamente</v-snackbar
          >
          <v-data-table
            :headers="headers"
            :items="articulos"
            :search="search"
            sort-by="nombre"
            class="elevation-1"
            :loading="loading"
          >
            <template v-slot:top>
              <v-toolbar flat>
                <v-toolbar-title>Articulos</v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
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
                      Nuevo
                    </v-btn>
                  </template>
                  <v-card>
                    <v-card-title>
                      <span class="text-h5">{{ formTitle }}</span>
                    </v-card-title>

                    <v-card-text>
                      <v-container>
                        <v-row>
                          <v-col cols="12" sm="6" md="6">
                            <v-text-field
                              v-model="codigo"
                              label="Código"
                              type="number"
                            ></v-text-field>
                          </v-col>

                          <v-col cols="6" sm="6" md="6">
                            <v-select
                              v-model="categoria"
                              :items="categorias"
                              label="Categoria"
                            ></v-select>
                          </v-col>
                          <v-col cols="12" sm="12" md="12">
                            <v-text-field
                              v-model="nombre"
                              label="Nombre"
                              type="text"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="6" sm="6" md="6">
                            <v-text-field
                              v-model="stock"
                              label="Stock"
                              type="number"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="6" sm="6" md="6">
                            <v-text-field
                              v-model="precio_venta"
                              label="Precio"
                              type="number"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="12" md="12">
                            <v-text-field
                              v-model="descripcion"
                              label="Descripcion"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="12" md="12">
                            <v-text-field
                              v-model="imagen"
                              label="URL Imagen"
                              type="text"
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
              </v-toolbar>
              <v-col cols="12" sm="12" md="12">
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
              <v-spacer></v-spacer>

              <v-dialog v-model="dialogDelete" max-width="500px">
                <v-card>
                  <v-card-title class="text-h5"
                    >¿Está seguro de borrar el articulo?</v-card-title
                  >
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="closeDelete"
                      >Cancelar</v-btn
                    >
                    <v-btn color="blue darken-1" text @click="deleteItemConfirm"
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
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn small icon v-bind="attrs" v-on="on" color="orange">
                    <v-icon small @click="editItem(item)">
                      mdi-pencil
                    </v-icon>
                  </v-btn>
                </template>
                <span>Editar Articulo</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn small icon v-bind="attrs" v-on="on" color="red">
                    <v-icon small @click="deleteItem(item)">
                      mdi-delete
                    </v-icon>
                  </v-btn>
                </template>
                <span>Borrar Articulo</span>
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
                <span v-if="item.estado">Desactivar Articulo</span>
                <span v-else>Activar Articulo</span>
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
      articulos: [], // almacenará los articulos
      search: "",
      dialog: false,
      dialogDelete: false,
      headers: [
        { text: "Código", value: "codigo", sortable: true , width: '6%'},
        { text: "Nombre", value: "nombre", sortable: true , width: '10%'},
        { text: "Categoria", value: "categoria.nombre", sortable: false , width: '6%'},
        { text: "Stock", value: "stock", sortable: true , width: '6%'},
        { text: "Precio Venta", value: "precio_venta", sortable: true , width: '6%'},
        { text: "Descripcion", value: "descripcion", sortable: false , width: '50%'},
        { text: "Opciones", value: "actions", sortable: false , width: '16%'},
      ],
      editedIndex: -1, //pasa a 1 cuando se edita
      _id: "",
      categoria: "",
      categorias: [],
      codigo: "",
      nombre: "",
      stock: 0,
      precio_venta: 0,
      descripcion: "",
      imagen: "",
      valida: 0,
      validaMensaje: [],
      adModal: 0,
      adAccion: 0,
      adNombre: "",
      adId: "",
      alerta_edit: false,
      alerta_add: false,
      alerta_delete: false,
      mensaje: null,
      loading: true,
    };
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nueva Categoria" : "Nueva Categoria";
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
    }, 5000);
    setTimeout(() => {
      this.alerta_add = false;
    }, 5000);
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
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    guardar() {
      //Metodo para guardar y actualizar datos
      let me = this;
      let header = {
        Token: this.$store.state.token,
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
              categoria: this.categoria,
              codigo: this.codigo,
              nombre: this.nombre,
              stock: this.stock,
              precio_venta: this.precio_venta,
              descripcion: this.descripcion,
              imagen: this.imagen,
            },
            configuracion
          )
          .then(function (response) {
            me.limpiar();
            me.close();
            me.listar();
            me.alerta_edit = true;
            me.mensaje = "Articulo editado correctamente";
          })

          .catch(function (error) {
            console.log(error);
          });
        me.alerta_edit = false;
        me.mensaje = null;
      } else {
        //Código para guardar
        axios
          .post(
            "articulo/add",
            {
              _id: this._id,
              categoria: this.categoria,
              codigo: this.codigo,
              nombre: this.nombre,
              stock: this.stock,
              precio_venta: this.precio_venta,
              descripcion: this.descripcion,
              imagen: this.imagen,
            },
            configuracion
          )
          .then(function (response) {
            me.limpiar();
            me.close();
            me.listar();
            me.alerta_edit = true;
            me.mensaje = "Articulo añadido correctamente";
          })
          .catch(function (error) {
            console.log(error);
          });
        me.alerta_edit = false;
        me.mensaje = null;
      }
    },
    limpiar() {
      this._id = "";
      this.codigo = "";
      this.nombr = "";
      this.stock = 0;
      this.precio_venta = 0;
      this.escripcion = "";
      this.imagen = "";
      this.valida = 0;
      this.validaMensaje = [];
      this.editedIndex = -1;
    },
    validar() {
      this.valida = 0;
      this.validaMensaje = [];
      if (!this.categoria) {
        this.validaMensaje.push("Seleccione una categoría");
      }
      if (this.codigo.length > 64) {
        this.validaMensaje.push("El código no debe tener más de 64 caracteres");
      }
      if (this.nombre.length < 1 || this.nombre.length > 50) {
        this.validaMensaje.push(
          "El nombre del artículo debe tener entre 1-50 caracteres."
        );
      }
      if (this.descripcion.length > 255) {
        this.validaMensaje.push(
          "La descripción del artículo no debe tener más de 255 caracteres."
        );
      }
      if (this.stock < 0) {
        this.validaMensaje.push("Ingrese un stock valido");
      }
      if (this.precio_venta < 0) {
        this.validaMensaje.push("Ingrese un precio de venta valido");
      }
      if (this.validaMensaje.length) {
        this.valida = 1;
      }
      return this.valida;
    },
    editItem(item) {
      this._id = item._id;
      this.categoria = item.categoria._id;
      this.codigo = item.codigo;
      this.nombre = item.nombre;
      this.stock = item.stock;
      this.precio_venta = item.precio_venta;
      this.descripcion = item.descripcion;
      this.imagen = item.imagen;
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
        Token: this.$store.state.token,
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
          me.alerta_edit = true;
          me.mensaje = "Articulo activado";
        })
        .catch(function (error) {
          console.log(error);
        });
      me.alerta_edit = false;
      me.mensaje = null;
    },
    desactivar() {
      let me = this;
      let header = {
        Token: this.$store.state.token,
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
          me.alerta_edit = true;
          me.mensaje = "Articulo desactivado";
        })
        .catch(function (error) {
          console.log(error);
        });
      me.alerta_edit = false;
      me.mensaje = null;
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
};
</script>
