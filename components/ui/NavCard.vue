<template>
    <v-card :to="{
        name:'category',
        params:{category:category.attributes.slug}
        }">
        <v-img :src="category.attributes.img || ''" height="170"></v-img>
        <v-card-title class="body-1">
            {{category.attributes.name}}
            <v-icon class="ml-2" color="primary">{{category.attributes.icon}}</v-icon>
        </v-card-title>
        
    </v-card>
</template>

<script>
export default {
    props:{
        category:{
            type:Object,
            required:true
        } 
    }
}
</script>