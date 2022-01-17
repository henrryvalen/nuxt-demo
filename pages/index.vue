<template>
  <v-container>
    <!--     <v-btn class="primary">primary</v-btn>
    <v-btn class="secondary">secondary</v-btn> 
    <v-btn class="accent">accent</v-btn>
    
    
    <div class="mt-2">
      <v-btn class="warning">warning</v-btn>
      <v-btn class="error">error</v-btn>
      <v-btn class="success">success</v-btn>
      <v-btn class="info">info</v-btn>
    </div>
 -->
    <!-- {{cat}} -->
    <!-- <v-divider class="my-5"></v-divider> -->
    <!-- {{categories}} -->
    <!-- {{ $fetchState }} -->
   <!--  <p v-if="$fetchState.pending">Cargando los datos</p>
    <p  v-else-if="$fetchState.error">Error al cargar los datos</p>-->

    <!-- <div v-else> -->

      <!-- <app-ui-nav-card></app-ui-nav-card>
      <app-forms-login></app-forms-login>
      <div v-for="categoria in categories.data" :key="categoria.id">
        <v-btn
          :to="{
            name: 'category',
            params: { category: categoria.attributes.slug },
            //query: { id: categoria.id },
          }"
          class="my-1"
          >{{ categoria.attributes.name }}</v-btn
        >
      </div> -->



    <!-- </div> -->

    <!--  <ApolloQuery :query="query">
      <template slot-scope="{ result: { data, loading, error } }">
        <div v-if="loading">Cargando datos...</div>
        <div v-else-if="error">{{ error }}</div>
        <div v-else>
          <div  v-for="categoria in data.categories.data" :key="categoria.id">-->
    <!-- nombre: {{ categoria.attributes.name }} -->
    <!--  <v-btn :to="{
            name:'category', 
            params:{ category:categoria.attributes.slug},
            query:{id:categoria.id}
            }
            " class="my-1">{{ categoria.attributes.name }}</v-btn>
          </div>
        </div>
      </template>
    </ApolloQuery> -->



    <v-row>
      <v-col cols="3" v-for="category in categories.data" :key="category.id"> 
      <app-ui-nav-card :category="category">

      </app-ui-nav-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
//import { categories } from "../graphql/querys";

export default {
  middleware: "initData",
  data() {
    return {
    //  categories: [],
      // query: categories,
    };
  },
  computed:{
    categories(){
     return this.$store.getters.readCategories
    }
  }
  /* async fetch() {
    //const client = this.$apollo.getClient();

    const query = {
      query: require("../graphql/categories.gql"),
    };
    //let categories = []
    await this.$apollo.query(query).then((data) => {
      //console.log(data.data.categories);
      this.categories = data.data.categories;
    });
  }, */
  /* async asyncData(context) {
    const client = context.app.apolloProvider.defaultClient

    const query = {
        query:require("../graphql/categories.gql")
    }
    let categories = [] 
    await client.query (query).then(data => {
      console.log(data.data.categories)
      categories = data.data.categories
    })
    
    return  {categories}
  }, */
  /* apollo: {
    cat: {
      query: categories, 
      update:data => data.categories
    }, 
  }*/
};
</script>
