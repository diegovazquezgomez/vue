<template>
  <v-layout align-start>
    <v-flex>
      <v-snackbar
        :icon="icono_notificacion"
        transition="scale-transition"
        :value="alerta_edit"
        absolute
        top
        right
        tile
        :color="color_notificacion"
        :timeout="3000"
        elevation="24"
        >{{ mensaje }}</v-snackbar
      >
      <v-toolbar flat>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on">
              <v-icon icon large @click="crearpdf()"> mdi-file-pdf-box </v-icon>
            </v-btn>
          </template>
          <span>Descargar PDF</span>
        </v-tooltip>
        <v-toolbar-title>Ventas</v-toolbar-title>
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
        <!-- DIALOGO COMPROBANTE -->
        <v-dialog v-model="comprobanteModal" max-width="1000px">
          <v-card>
            <v-card-title class="headline">
              <v-btn icon @click="crearPDF()" color="primary"
                ><v-icon>print</v-icon></v-btn
              >
              Reporte de ventas
            </v-card-title>

            <v-card-text>
              <div id="factura">
                <header>
                  <div id="logo">
                    <img src="../../public/images/Logo.png" id="imagen" />
                  </div>
                  <div id="datos">
                    <p id="encabezado">
                      <b>Tienda WEB</b>
                      <br />Calle 8 de mayo, nº 8, San Miguel del pino,
                      Valladolid<br />Telefono:(+34) 648645576<br />Email:diego.vazquez.gomez@gmail.com
                    </p>
                  </div>
                  <div id="fact">
                    <p>
                      {{ tipo_comprobante }}<br />
                      {{ serie_comprobante }}-{{ num_comprobante }}<br />
                      {{ fecha }}
                    </p>
                  </div>
                </header>
                <br />
                <section>
                  <div>
                    <table id="facliente">
                      <tbody>
                        <tr>
                          <td id="cliente">
                            Sr(a). <strong>{{ persona.nombre }}</strong
                            ><br />
                            Documento:
                            <strong>{{ persona.num_documento }}</strong
                            ><br />
                            <strong>Dirección:</strong> {{ persona.direccion
                            }}<br />
                            <strong>Teléfono:</strong> {{ persona.telefono
                            }}<br />
                            <strong>Email:</strong> {{ persona.email }}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </section>
                <br />
                <section>
                  <div>
                    <table id="facarticulo">
                      <thead>
                        <tr id="fa">
                          <th>CANT</th>
                          <th>DESCRIPCION</th>
                          <th>PRECIO UNIT</th>
                          <th>DESC.</th>
                          <th>PRECIO TOTAL</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="det in detalles" :key="det._id">
                          <td style="text-align: center">{{ det.cantidad }}</td>
                          <td>{{ det.articulo }}</td>
                          <td style="text-align: right">{{ det.precio }}</td>
                          <td style="text-align: right">{{ det.descuento }}</td>
                          <td style="text-align: right">
                            {{ det.cantidad * det.precio - det.descuento }}
                          </td>
                        </tr>
                      </tbody>
                      <tfoot>
                        <tr>
                          <th></th>
                          <th></th>
                          <th></th>
                          <th style="text-align: right">SUBTOTAL</th>
                          <th style="text-align: right">
                            {{
                              (totalParcial = (total - totalImpuesto).toFixed(
                                2
                              ))
                            }}
                            €
                          </th>
                        </tr>
                        <tr>
                          <th></th>
                          <th></th>
                          <th></th>
                          <th style="text-align: right">
                            IVA({{ impuesto }}%)
                          </th>
                          <th style="text-align: right">
                            €
                            {{
                              (totalImpuesto = (
                                (total * impuesto) /
                                (1 + impuesto)
                              ).toFixed(2))
                            }}
                          </th>
                        </tr>
                        <tr>
                          <th></th>
                          <th></th>
                          <th></th>
                          <th style="text-align: right">TOTAL</th>
                          <th style="text-align: right">
                            {{ (total = calcularTotal) }} €
                          </th>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </section>
                <br />
                <br />
                <footer>
                  <div id="gracias">
                    <p><b>Gracias por su compra!</b></p>
                  </div>
                </footer>
              </div>
            </v-card-text>

            <v-card-actions>
              <v-btn @click="ocultarComprobante()" color="blue darken-1" text
                >Cancelar</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
      <v-data-table
        :headers="headers"
        :items="ventas"
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
            <span>Ver Venta</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn small icon v-bind="attrs" v-on="on" color="blue">
                <v-icon small class="mr-2" @click="mostrarComprobante(item)">
                  mdi-printer-outline
                </v-icon>
              </v-btn>
            </template>
            <span>Ver Venta</span>
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
            <span v-if="item.estado">Desactivar Venta</span>
            <span v-else>Activar Venta</span>
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
            <v-text-field
              v-model="impuesto"
              label="Impuesto"
              type="number"
              min="0"
              max="100"
            >
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
                    <td class="text-center" width="20">
                      <v-text-field
                        v-model="props.item.cantidad"
                        type="number"
                      ></v-text-field>
                    </td>
                    <td class="text-center" width="20">
                      <v-text-field
                        v-model="props.item.precio"
                        type="number"
                      ></v-text-field>
                    </td>
                    <td class="text-center" width="20">
                      <v-text-field
                        class="text-center"
                        v-model="props.item.descuento"
                        type="number"
                        min="0"
                        max="100"
                      ></v-text-field>
                    </td>
                    <td class="text-center">
                      <v-chip color="info" dark>
                        {{
                          props.item.cantidad * props.item.precio -
                          props.item.descuento
                        }}€
                      </v-chip>
                    </td>
                    <td class="text-center">
                      <v-icon
                        small
                        class="mr-2 text-center"
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
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default {
  data() {
    return {
      dialog: false,
      search: "",
      ventas: [],
      headers: [
        { text: "Opciones", value: "opciones", sortable: false },
        { text: "Usuario", value: "usuario.nombre", sortable: true },
        { text: "Cliente", value: "persona.nombre", sortable: true },
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
      impuesto: 0.21,
      codigo: "",
      cabeceraDetalles: [
        {
          text: "Artículo",
          value: "articulo",
          sortable: false,
          width: "50%",
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
          text: "Descuento",
          value: "descuento",
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
      descuento: 0.1,
      comprobanteModal: 0,
      fecha: null,

      //snackbar notificaciones
      color_notificacion: null,
      mensaje: null,
      icono_notificacion: null,
      alerta_edit: false,
    };
  },
  computed: {
    calcularTotal: function () {
      let resultado = 0.0;
      for (var i = 0; i < this.detalles.length; i++) {
        resultado =
          resultado +
          this.detalles[i].cantidad * this.detalles[i].precio -
          this.detalles[i].descuento;
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
    crearPDF() {
      var quotes = document.getElementById("factura");
      html2canvas(quotes).then(function (canvas) {
        var imgData = canvas.toDataURL("image/png");
        var imgWidth = 210;
        var pageHeight = 295;

        var imgHeight = (canvas.height * imgWidth) / canvas.width;
        var heightLeft = imgHeight;

        var doc = new jsPDF("p", "mm", "a4");
        var position = 0;

        doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          doc.addPage();
          doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
        doc.save("ComprobanteVenta.pdf");
      });
    },
    mostrarComprobante(item) {
      console.log(this.personaArray);
      this.limpiar();
      this.tipo_comprobante = item.tipo_comprobante;
      this.serie_comprobante = item.serie_comprobante;
      this.num_comprobante = item.num_comprobante;
      this.fecha = item.createdAt;
      this.persona = item.persona;
      this.impuesto = item.impuesto;
      this.listarDetalles(item._id);
      this.comprobanteModal = 1;
    },
    ocultarComprobante() {
      this.comprobanteModal = 0;
    },
    selectPersona() {
      let me = this;
      let personaArray = [];
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .get("persona/listClientes", configuracion)
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
          me.alerta_edit = true;
          me.mensaje = "Articulo Añadido";
          me.icono_notificacion = "mdi-check";
          me.color_notificacion = "green";
        })
        .catch(function (error) {
          me.errorArticulo = "No existe el artículo.";
          me.alerta_edit = true;
          me.mensaje = "No existe el artículo.";
          me.icono_notificacion = "mdi-alert";
          me.color_notificacion = "red";
        });
      me.alerta_edit = false;
      me.mensaje = "";
      me.icono_notificacion = "";
      me.color_notificacion = "";
    },
    agregarDetalle(data) {
      this.errorArticulo = null;
      if (this.encuentra(data._id) == true) {
        this.errorArticulo = "El artículo ya ha sido agregado.";
        this.alerta_edit = true;
        this.mensaje = "El artículo ya ha sido agregado.";
        this.icono_notificacion = "mdi-alert";
        this.color_notificacion = "orange";
      } else {
        this.detalles.push({
          _id: data._id,
          articulo: data.nombre,
          cantidad: 1,
          precio: data.precio_venta,
          descuento: 0,
        });
        this.codigo = "";
      }
      this.alerta_edit = false;
      this.mensaje = "";
      this.icono_notificacion = "";
      this.color_notificacion = "";
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
        .get("venta/query?_id=" + id, configuracion)
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
        .get("venta/list", configuracion)
        .then(function (response) {
          me.ventas = response.data;
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
      if (!this.descuento || this.descuento < 0) {
        this.validaMensaje.push("Ingrese un descuento válido.");
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
          "venta/add",
          {
            persona: this.persona,
            usuario: this.$store.state.usuario._id,
            tipo_comprobante: this.tipo_comprobante,
            serie_comprobante: this.serie_comprobante,
            num_comprobante: this.num_comprobante,
            impuesto: this.impuesto,
            //descuento: this.descuento,
            total: this.total,
            detalles: this.detalles,
          },
          configuracion
        )
        .then(function (response) {
          me.limpiar();
          me.close();
          me.listar();
          me.alerta_edit = true;
          me.mensaje = "Venta realizada";
          me.icono_notificacion = "mdi-alert";
          me.color_notificacion = "green";
        })
        .catch(function (error) {
          console.log(error);
          me.alerta_edit = true;
          me.mensaje = "Error al realizar la venta";
          me.icono_notificacion = "mdi-alert";
          me.color_notificacion = "red";
        });
      me.alerta_edit = false;
      me.mensaje = "";
      me.icono_notificacion = "";
      me.color_notificacion = "";
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
        .put("venta/activate", { _id: this.adId }, configuracion)
        .then(function (response) {
          me.adModal = 0;
          me.adAccion = 0;
          me.adNombre = "";
          me.adId = "";
          me.listar();
          me.alerta_edit = true;
          me.mensaje = "Venta activada correctamente";
          me.icono_notificacion = "mdi-alert";
          me.color_notificacion = "green";
        })
        .catch(function (error) {
          console.log(error);
          me.alerta_edit = true;
          me.mensaje = "Error al activar la venta";
          me.icono_notificacion = "mdi-alert";
          me.color_notificacion = "red";
        });
      me.alerta_edit = false;
      me.mensaje = "";
      me.icono_notificacion = "";
      me.color_notificacion = "";
    },
    desactivar() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .put("venta/deactivate", { _id: this.adId }, configuracion)
        .then(function (response) {
          me.adModal = 0;
          me.adAccion = 0;
          me.adNombre = "";
          me.adId = "";
          me.listar();
          me.alerta_edit = true;
          me.mensaje = "Venta desactivada correctamente";
          me.icono_notificacion = "mdi-alert";
          me.color_notificacion = "green";
        })
        .catch(function (error) {
          console.log(error);
          me.alerta_edit = true;
          me.mensaje = "Error al desactivar la venta";
          me.icono_notificacion = "mdi-alert";
          me.color_notificacion = "red";
        });
      me.alerta_edit = false;
      me.mensaje = "";
      me.icono_notificacion = "";
      me.color_notificacion = "";
    },
    close() {
      this.dialog = false;
    },
  },
};
</script>
<style>
#factura {
  padding: 20px;
  font-family: Arial, sans-serif;
  font-size: 16px;
}

#logo {
  float: left;
  margin-left: 2%;
  margin-right: 2%;
}
#imagen {
  width: 100px;
}

#fact {
  font-size: 18px;
  font-weight: bold;
  text-align: center;
}

#datos {
  float: left;
  margin-top: 0%;
  margin-left: 2%;
  margin-right: 2%;
  /*text-align: justify;*/
}

#encabezado {
  text-align: center;
  margin-left: 10px;
  margin-right: 10px;
  font-size: 16px;
}

section {
  clear: left;
}

#cliente {
  text-align: left;
}

#facliente {
  width: 40%;
  border-collapse: collapse;
  border-spacing: 0;
  margin-bottom: 15px;
}

#fa {
  color: #ffffff;
  font-size: 14px;
}

#facarticulo {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  padding: 20px;
  margin-bottom: 15px;
}

#facarticulo thead {
  padding: 20px;
  background: #7d6b93;
  text-align: center;
  border-bottom: 1px solid #ffffff;
}

#gracias {
  text-align: center;
}
</style>
