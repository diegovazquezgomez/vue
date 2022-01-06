<template>
  <v-layout align-start>
    <v-flex>
      <v-toolbar flat>
        <v-toolbar-title>Ingresos</v-toolbar-title>
        <v-divider class="mx-2" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-text-field
          v-if="verNuevo == 0"
          class="text-xs-center"
          v-model="search"
          append-icon="search"
          label="Búsqueda"
          single-line
          hide-details
        ></v-text-field>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          v-if="verNuevo == 0"
          @click="mostrarNuevo()"
          dark
          class="mb-2"
          >Nuevo</v-btn
        >
        <v-dialog v-model="dialog" max-width="1000px">
          <v-card>
            <v-card-title>
              <span class="headline">Seleccione un artículo</span>
            </v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm12 md12 lg12 xl12>
                    <v-text-field
                      v-model="texto"
                      @keyup.enter="listarArticulos()"
                      class="text-xs-center"
                      @click:append="listarArticulos"
                      append-icon="search"
                      label="Búsqueda"
                    ></v-text-field>
                    <!----------------------------------------------- MODAL ARTICULOS --------------------------------------------------------->
                    <template>
                      <v-data-table
                        :headers="cabeceraArticulos"
                        :items="articulos"
                        class="elevation-1"
                      >
                        <template v-slot:[`item.seleccionar`]="{ item }">
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                              <v-btn
                                small
                                icon
                                v-bind="attrs"
                                v-on="on"
                                color="green"
                                justify-center
                              >
                                <v-icon
                                  small
                                  class="mr-2"
                                  @click="agregarDetalle(item)"
                                >
                                  mdi-plus
                                </v-icon>
                              </v-btn>
                            </template>
                            <span>Añadir producto</span>
                          </v-tooltip>
                        </template>
                        <template v-slot:items="props">
                          <td>{{ props.item.codigo }}</td>
                          <td>{{ props.item.nombre }}</td>
                          <td>{{ props.item.categoria.nombre }}</td>
                          <td>{{ props.item.stock }}</td>
                          <td>{{ props.item.precio_venta }}</td>
                          <td>{{ props.item.descripcion }}</td>
                          <td>
                            <div v-if="props.item.estado">
                              <span class="blue--text">Activo</span>
                            </div>
                            <div v-else>
                              <span class="red--text">Inactivo</span>
                            </div>
                          </td>
                        </template>
                      </v-data-table>
                    </template>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">Cancelar</v-btn>
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
              Estás a punto de <span v-if="adAccion == 1">activar </span>
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
      <v-data-table
        :headers="headers"
        :items="ingresos"
        :search="search"
        class="elevation-1"
        v-if="verNuevo == 0"
      >
        <template v-slot:[`item.opciones`]="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn small icon v-bind="attrs" v-on="on" color="orange">
                <v-icon small class="mr-2" @click="verIngreso(item)">
                  mdi-tab
                </v-icon>
              </v-btn>
            </template>
            <span>Ver Ingreso</span>
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
            <span v-if="item.estado">Desactivar Ingreso</span>
            <span v-else>Activar Ingreso</span>
          </v-tooltip>
        </template>
        <template v-slot:items="props">
          <td class="justify-center layout px-0">
            <v-icon small class="mr-2" @click="verIngreso(props.item)">
              tab
            </v-icon>
            <template v-if="props.item.estado">
              <v-icon small @click="activarDesactivarMostrar(2, props.item)">
                block
              </v-icon>
            </template>
            <template v-else>
              <v-icon small @click="activarDesactivarMostrar(1, props.item)">
                check
              </v-icon>
            </template>
          </td>
          <td>{{ props.item.usuario.nombre }}</td>
          <td>{{ props.item.persona.nombre }}</td>
          <td>{{ props.item.tipo_comprobante }}</td>
          <td>{{ props.item.serie_comprobante }}</td>
          <td>{{ props.item.num_comprobante }}</td>
          <td>{{ props.item.createdAt }}</td>
          <td>{{ props.item.impuesto }}</td>
          <td>{{ props.item.total }}</td>
          <td>
            <div v-if="props.item.estado">
              <span class="blue--text">Aceptado</span>
            </div>
            <div v-else>
              <span class="red--text">Anulado</span>
            </div>
          </td>
        </template>
        <template v-slot:no-data>
          <v-btn color="primary" @click="listar()">Resetear</v-btn>
        </template>
      </v-data-table>
      <v-container grid-list-sm class="pa-4 white" v-if="verNuevo">
        <v-layout row wrap>
          <v-flex xs12 sm4 md4 lg4 xl4>
            <v-select
              v-model="tipo_comprobante"
              :items="comprobantes"
              label="Tipo Comprobante"
            >
            </v-select>
          </v-flex>
          <v-flex xs12 sm4 md4 lg4 xl4>
            <v-text-field v-model="serie_comprobante" label="Serie Comprobante">
            </v-text-field>
          </v-flex>
          <v-flex xs12 sm4 md4 lg4 xl4>
            <v-text-field v-model="num_comprobante" label="Número Comprobante">
            </v-text-field>
          </v-flex>
          <v-flex xs12 sm8 md8 lg8 xl8>
            <v-autocomplete
              :items="personas"
              v-model="persona"
              label="Proveedor"
            >
            </v-autocomplete>
          </v-flex>
          <v-flex xs12 sm4 md4 lg4 xl4>
            <v-text-field type="number" v-model="impuesto" label="Impuesto">
            </v-text-field>
          </v-flex>
          <v-flex xs12 sm8 md8 lg8 x8>
            <v-text-field
              v-model="codigo"
              label="Código"
              @keyup.enter="buscarCodigo()"
            >
            </v-text-field>
          </v-flex>
          <v-flex xs12 sm2 md2 lg2 xl2>
            <v-btn small fab dark color="teal" @click="mostrarModalArticulos()">
              <v-icon dark>list</v-icon>
            </v-btn>
          </v-flex>
          <v-flex xs12 sm2 md2 lg2 xl2 v-show="errorArticulo">
            <div class="red--text" v-text="errorArticulo"></div>
          </v-flex>
          <v-flex xs12 sm12 md12 lg12 xl12>
            <template>
              <v-data-table
                :headers="cabeceraDetalles"
                :items="detalles"
                hide-default-footer
                class="elevation-1"
              >
                <template slot="item" slot-scope="props">
                  <tr>
                    <td class="text-center">{{ props.item.articulo }}</td>
                    <td class="text-center" width="30">
                      <v-text-field
                        v-model="props.item.cantidad"
                        type="number"
                      ></v-text-field>
                    </td>
                    <td class="text-center" width="30">
                      <v-text-field
                        v-model="props.item.precio"
                        type="number"
                      ></v-text-field>
                    </td>
                    <td class="text-center">
                      <v-chip color="info" dark>
                        {{ props.item.cantidad * props.item.precio }}€
                      </v-chip>
                    </td>
                    <td class="text-center">
                      <v-icon
                        small
                        class="mr-2"
                        @click="eliminarDetalle(detalles, props.item)"
                      >
                        delete
                      </v-icon>
                    </td>
                  </tr>
                </template>
                <template slot="no-data">
                  <h3>No hay artículos agregados al detalle.</h3>
                </template>
                <template slot="items" slot-scope="props">
                  <td>$ {{ props.cantidad * props_.precio }}</td>
                </template>
              </v-data-table>

              <v-col class="text-right">
                <strong>Total Parcial:</strong> €
                {{ (totalParcial = (total - totalImpuesto).toFixed(2)) }}
              </v-col>
              <v-col class="text-right">
                <strong>Total Impuesto:</strong> €
                {{
                  (totalImpuesto = (
                    (total * impuesto) /
                    (1 + impuesto)
                  ).toFixed(2))
                }}
              </v-col>
              <v-col class="text-right">
                <strong>Total Neto:</strong> € {{ (total = calcularTotal) }}
              </v-col>
            </template>
          </v-flex>
          <v-flex xs12 sm12 md12 v-show="valida">
            <div
              class="red--text"
              v-for="v in validaMensaje"
              :key="v"
              v-text="v"
            ></div>
          </v-flex>
          <v-col xs12 sm12 md12 lg12 xl12 class="text-right">
            <v-btn color="blue darken-1" text @click.native="ocultarNuevo()"
              >Cancelar</v-btn
            >
            <v-btn
              color="success"
              v-if="verDetalle == 0"
              @click.native="guardar()"
              >Guardar</v-btn
            >
          </v-col>
        </v-layout>
      </v-container>
    </v-flex>
  </v-layout>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      dialog: false,
      search: "",
      ingresos: [],
      headers: [
        { text: "Opciones", value: "opciones", sortable: false },
        { text: "Usuario", value: "usuario.nombre", sortable: true },
        { text: "Proveedor", value: "persona.nombre", sortable: true },
        { text: "Tipo Comprobante", value: "tipo_comprobante", sortable: true },
        {
          text: "Serie comprobante",
          value: "serie_comprobante",
          sortable: false,
        },
        {
          text: "Número comprobante",
          value: "num_comprobante",
          sortable: false,
        },
        { text: "Fecha", value: "createdAt", sortable: false },
        { text: "Impuesto", value: "impuesto", sortable: false },
        { text: "Total", value: "total", sortable: false },
        { text: "Estado", value: "estado", sortable: false },
      ],
      _id: "",
      persona: "",
      personas: [],
      tipo_comprobante: "",
      comprobantes: ["FACTURA", "TICKET"],
      serie_comprobante: "",
      num_comprobante: "",
      impuesto: 0.18,
      codigo: "",
      cabeceraDetalles: [
        {
          text: "Artículo",
          value: "articulo",
          sortable: false,
          width: "60%",
          align: "center",
        },
        {
          text: "Cantidad",
          value: "cantidad",
          sortable: false,
          width: "10%",
          align: "center",
        },
        {
          text: "Precio",
          value: "precio",
          sortable: false,
          width: "10%",
          align: "center",
        },
        {
          text: "Sub Total",
          value: "subtotal",
          sortable: false,
          width: "10%",
          align: "center",
        },
        {
          text: "Borrar",
          value: "borrar",
          sortable: false,
          width: "10%",
          align: "center",
        },
      ],
      detalles: [],
      verNuevo: 0,
      errorArticulo: null,
      total: 0,
      totalParcial: 0,
      totalImpuesto: 0,
      articulos: [],
      texto: "",
      cabeceraArticulos: [
        { text: "Código", value: "codigo", sortable: false },
        { text: "Nombre", value: "nombre", sortable: true },
        { text: "Categoría", value: "categoria.nombre", sortable: true },
        { text: "Stock", value: "stock", sortable: false },
        { text: "Precio Venta", value: "precio_venta", sortable: false },
        { text: "Descripción", value: "descripcion", sortable: false },
        { text: "Estado", value: "estado", sortable: false },
        { text: "Seleccionar", value: "seleccionar", sortable: false },
      ],
      verDetalle: 0,
      valida: 0,
      validaMensaje: [],
      adModal: 0,
      adAccion: 0,
      adNombre: "",
      adId: "",
    };
  },
  computed: {
    calcularTotal: function () {
      let resultado = 0.0;
      for (var i = 0; i < this.detalles.length; i++) {
        resultado =
          resultado + this.detalles[i].cantidad * this.detalles[i].precio;
      }
      return resultado;
    },
    calcularSubTotal: function () {
      let resultado = 0.0;
      for (var i = 0; i < this.detalles.length; i++) {
        resultado =
          resultado + this.detalles[i].cantidad * this.detalles[i].precio;
        this.subtotal = resultado;
      }
      return resultado;
    },
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
  },
  created() {
    this.listar();
    this.selectPersona();
  },
  methods: {
    selectPersona() {
      let me = this;
      let personaArray = [];
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .get("persona/listProveedores", configuracion)
        .then(function (response) {
          personaArray = response.data;
          personaArray.map(function (x) {
            me.personas.push({ text: x.nombre, value: x._id });
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    buscarCodigo() {
      let me = this;
      me.errorArticulo = null;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .get("articulo/queryCodigo?codigo=" + this.codigo, configuracion)
        .then(function (response) {
          me.agregarDetalle(response.data);
        })
        .catch(function (error) {
          me.errorArticulo = "No existe el artículo.";
        });
    },
    agregarDetalle(data) {
      this.errorArticulo = null;
      if (this.encuentra(data._id) == true) {
        this.errorArticulo = "El artículo ya ha sido agregado.";
      } else {
        this.detalles.push({
          _id: data._id,
          articulo: data.nombre,
          cantidad: 1,
          precio: data.precio_venta,
        });
        this.codigo = "";
      }
    },
    encuentra(id) {
      let sw = 0;
      for (var i = 0; i < this.detalles.length; i++) {
        if (this.detalles[i]._id == id) {
          sw = true;
        }
      }
      return sw;
    },
    eliminarDetalle(arr, item) {
      let i = arr.indexOf(item);
      if (i != -1) {
        arr.splice(i, 1);
      }
    },
    listarArticulos() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .get("articulo/list?valor=" + this.texto, configuracion)
        .then(function (response) {
          me.articulos = response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    mostrarModalArticulos() {
      this.dialog = 1;
    },
    listarDetalles(id) {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .get("ingreso/query?_id=" + id, configuracion)
        .then(function (response) {
          me.detalles = response.data.detalles;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    verIngreso(item) {
      this.limpiar();
      this.tipo_comprobante = item.tipo_comprobante;
      this.serie_comprobante = item.serie_comprobante;
      this.num_comprobante = item.num_comprobante;
      this.persona = item.persona._id;
      this.impuesto = item.impuesto;
      this.listarDetalles(item._id);
      this.verNuevo = 1;
      this.verDetalle = 1;
    },
    listar() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .get("ingreso/list", configuracion)
        .then(function (response) {
          me.ingresos = response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    limpiar() {
      this._id = "";
      this.tipo_comprobante = "";
      this.serie_comprobante = "";
      this.num_comprobante = "";
      this.impuesto = 0.18;
      this.codigo = "";
      this.total = 0;
      this.totalParcial = 0;
      this.totalImpuesto = 0;
      this.detalles = [];
      this.verNuevo = 0;
      this.valida = 0;
      this.validaMensaje = [];
      this.verDetalle = 0;
    },
    validar() {
      this.valida = 0;
      this.validaMensaje = [];
      if (!this.persona) {
        this.validaMensaje.push("Seleccione un proveedor.");
      }
      if (!this.tipo_comprobante) {
        this.validaMensaje.push("Seleccione un tipo de comprobante.");
      }
      if (!this.num_comprobante) {
        this.validaMensaje.push("Ingrese el número del comprobante.");
      }
      if (!this.impuesto || this.impuesto < 0 || this.impuesto > 1) {
        this.validaMensaje.push("Ingrese un impuesto válido.");
      }
      if (this.detalles.length <= 0) {
        this.validaMensaje.push("Ingrese al menos un artículo al detalle");
      }
      if (this.validaMensaje.length) {
        this.valida = 1;
      }
      return this.valida;
    },
    mostrarNuevo() {
      this.verNuevo = 1;
    },
    ocultarNuevo() {
      this.verNuevo = 0;
      this.limpiar();
    },
    guardar() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      if (this.validar()) {
        return;
      }
      //Código para guardar
      axios
        .post(
          "ingreso/add",
          {
            persona: this.persona,
            usuario: this.$store.state.usuario._id,
            tipo_comprobante: this.tipo_comprobante,
            serie_comprobante: this.serie_comprobante,
            num_comprobante: this.num_comprobante,
            impuesto: this.impuesto,
            total: this.total,
            detalles: this.detalles,
          },
          configuracion
        )
        .then(function (response) {
          me.limpiar();
          me.close();
          me.listar();
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    activarDesactivarMostrar(accion, item) {
      this.adModal = 1;
      this.adNombre = item.num_comprobante;
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
    activar() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .put("ingreso/activate", { _id: this.adId }, configuracion)
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
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .put("ingreso/deactivate", { _id: this.adId }, configuracion)
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
    close() {
      this.dialog = false;
    },
  },
};
</script>
