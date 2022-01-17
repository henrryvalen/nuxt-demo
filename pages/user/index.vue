<template>
    <v-container>
        <h2>
            Bienvenido {{$auth.user.username}}
        </h2>    
            <v-divider class="my-5"></v-divider>
            
            <h3> Lista de recetas</h3>
            <v-btn color="primary" small class="my-3">Agregar receta</v-btn>
             <div v-if="recipes">
                 <app-ui-list-recipes :recipes="recipes"></app-ui-list-recipes>
             </div>   
             <div v-else> Cargando... </div>
             
    </v-container>
    
</template>

<script>
export default {
    middleware:'auth'

    ,async asyncData({app}) {
     let cliente = app.apolloProvider.defaultClient
     let id = app.$auth.user.id
     
     let query = {
         query: require("../../graphql/userRecipes.gql"),
         variables:{id}
     }

     let recipes = []
     await cliente.query(query).then(data => {
         recipes = data.data.recipes.data
     })
     return {recipes}
    },

}
</script>