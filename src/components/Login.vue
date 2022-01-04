<template>
  <v-layout align-center justify-center>
    <v-flex xs12 sm8 md6 lg5 xl4>
      <v-alert dense outlined type="error" :value="alerta">
        <strong>Error: </strong> {{ this.errorM }}
      </v-alert>
      <v-card>
        <v-toolbar dark color="blue darken-3">
          <v-toolbar-title> Acceso al Sistema </v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-text-field
            autofocus
            color="accent"
            label="Email"
            required
            v-model="email"
          >
          </v-text-field>
          <v-text-field
            type="password"
            :color="color"
            label="Password"
            required
            v-model="password"
          >
          </v-text-field>
        </v-card-text>
        <v-card-actions class="px-3 pb-3">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <span v-bind="attrs" v-on="on">
                <v-flex text-xs-right>
                  <v-btn color="primary" @click="login()">Ingresar</v-btn>
                </v-flex>
              </span>
            </template>
            <span>Ingresar en la aplicación</span>
          </v-tooltip>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      email: "",
      password: "",
      alerta: false,
      errorM: null,
      color: 'accent'
    };
  },
  methods: {
    login() {
      axios
        .post("usuario/login", { email: this.email, password: this.password })
        .then((respuesta) => {
          console.log(respuesta.data.user.nombre);
          console.log(respuesta.data.tokenReturn);
          return respuesta.data;
        })
        .then((data) => {
          this.$store.dispatch("guardarToken", data.tokenReturn);
          this.$router.push({ name: "home" }).catch(() => {});
        })
        .catch((error) => {
          console.log(error);
          if (this.email == "") {
            this.errorM = "El email no puede estar vacio";
            this.color = 'red'
          } else if (this.password == "") {
            this.errorM = "La contraseña no puede estar vacia";
            this.color = 'red'
          } else {
            if (error.response.status == 404) {
              this.errorM =
                "No existe el usuario o las credenciales son incorrectas";
            } else {
              this.errorM = "Ocurrió un error con el servidor";
            }
          }
          this.alerta = true;
        });
    },
  },
};
</script>
