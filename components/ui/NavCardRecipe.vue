<template>
  <div>
    <v-card
      :to="{
        name: 'category-recipe',
        params: {
          category: recipe.attributes.categorie.data.attributes.slug,
          recipe: recipe.id,
        },
      }"
    >
    
      <v-img :src="recipe.attributes.img" alt="170"></v-img>
      <v-card-text>
        <v-row>
          <v-col cols="7">
            {{ recipe.attributes.name }}
            {{recipe.attributes.autor.data == null ? "" : recipe.attributes.autor.data.attributes.username}}
          </v-col>
          <v-col cols="5" class="d-flex justify-end">
            <div>
              <v-icon> mdi-heart </v-icon>
              <span>{{
                recipe.attributes.likes === null ? 0 : recipe.attributes.likes
              }}</span>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  props: {
    recipe: {
      type: Object,
      required: true,
    },
  },
};
</script>