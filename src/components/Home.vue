<template>
  <v-container>
    <v-row align="center" justify="center">
      <div class="d-flex flex-column justify-space-between align-center">
      <v-col class="text-center" cols="12">
          <v-img
        :aspect-ratio="16/9"
        width="247"
        height="114"
        src="../../public/images/Logo.png"
        align-center
      ></v-img>
      </v-col>
      </div>
      <v-col class="text-center" cols="12">
        <h1 class="text-h4 font-weight-thin mb-4">
          DAW - Sistema de gestión tienda
        </h1>
        <h4 class="subheading">Proyecto Diego Vázquez</h4>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Home",

  data: () => ({}),
};
</script>
