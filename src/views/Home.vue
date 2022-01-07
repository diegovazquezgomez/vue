<template>
 
</template>

<script>
  import axios from 'axios'
  import Chart from 'chart.js'

  export default {
    data(){
      return {
        valores:[],
        meses:[],
        totales:[]
      }
    },
    created(){
      this.listar()
    },
    mounted(){
      this.listar()
    },
    methods: {
      listar() {
      //hace peticion a la url indicada
      let me = this;
      let header = {
        Token: this.$store.state.token,
      }
      let configuracion = { headers: header };
      axios
        .get("venta/grafico12meses", configuracion)
        .then(function (response) {
          me.categorias = response.data;
          me.loading = false
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    }
  }
</script>
