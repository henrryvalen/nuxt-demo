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

    

}
</script>