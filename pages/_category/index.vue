<template>
<!--   <div>
    {{ $route.params.category }}
    
    {{categorie}}
    <div>
        {{counter}}
        <v-btn @click="callMutation()">Mutation</v-btn>
        <v-btn @click="callAction()">Action</v-btn>
    </div>
  </div> -->

<v-container>
  
  <h1 class="secondary--text">{{category.attributes.name}}
    <v-icon large class="secondary--text">{{category.attributes.icon}}</v-icon>  
  </h1>
<p class="secondary--text">{{category.attributes.description}}</p> 
<v-row>
  <v-col cols="4" v-for="recipe in recipes.data" :key="recipe.id"> 
        
    <app-ui-nav-card-recipe :recipe="recipe">
      
    </app-ui-nav-card-recipe>
  </v-col>
</v-row>
<!-- <div v-for="recipe in recipes.data" :key="recipe.id">
  <nuxt-link :to="{
  name:'category-recipe',
  params:{category:$route.params.category, recipe:recipe.id}
  }">{{recipe.attributes.name}}</nuxt-link>
</div> -->

<!-- <v-divider></v-divider>
<nuxt-link to="/"> Volver </nuxt-link> -->

<div class="mt-3">
  <v-alert type="info" v-if="recipes.data.length==0">
    <p>No hay recetas disponibles vuelve más tarde</p>
  </v-alert>
</div>
<div class="mt-3">
  <app-ui-back-btn></app-ui-back-btn>
</div>
</v-container>
</template>
<script>
/* import {category} from '../../graphql/querys' */

/* export default {
  data() {
    return {
      query: category,
    };
  },
  computed:{
   counter(){
     return this.$store.getters.readCounter
   } 
  },
  methods:{
      callMutation(){
          this.$store.commit("increment")
      },
      callAction(){
          this.$store.dispatch("increment")
      }
  },
  apollo:{
      categorie:{
          query:category,
          variables(){
              return {id:this.$route.query.id}
          }
      }
  }
}; */

export default {
  data(){
    return {
      
    };
  },
  computed:{
    category(){
      const slug = this.$route.params.category
      return  this.$store.getters.readCategories.data
      .find(category => category.attributes.slug == slug)
    }
  },

  async asyncData({app, route}) {
    const slug = route.params.category;
    const client = app.apolloProvider.defaultClient
    const query = {
      query: require("../../graphql/recipes.gql"),
      variables:{slug}
    }
    let recipes = []
    
    await client.query(query).then(data => {
      recipes = data.data.recipes;
      
    }).catch(e=> console.log(e))

    return  {recipes}
  }
};
</script>