export const strict = false;

export const state = () => ({
    counter: 0,
    categories:[],
    loadRecipes:[]
})

export const getters = {
    readCategories(state){
        return state.categories
    },
    readLoadRecipes(state){
        return state.loadRecipes;
    },
    readCounter(state){
        return state.counter
    }
}

export const mutations = {
    addCategories(state,payload){
        state.categories = payload
    },
    addLoadRecipes(state,payload){
        state.loadRecipes = payload
    },
    increment(state){
        state.counter ++
    }
}

export const actions = {
    async nuxtServerInit({commit}){
        console.log("Nuxt Serve")
        // return new Promise((resolve,reject) => {
        const client = this.app.apolloProvider.defaultClient
        const query = {
            query:require("../graphql/categories.gql")
        }
        await client.query(query).then(data => {
            //console.log(data.data.categories);
            commit('addCategories',data.data.categories)
            //commit('addLoadRecipes',data.data.recipes)
            //resolve()
        }).catch(error => {
            console.log(error)
            //reject()
        })
        //})
        
    },
    searchRecipe({commit},payload){
        let client = this.app.apolloProvider.defaultClient
        const query = {
            query:require("../graphql/searchRecipe.gql"),
            variables:{term:payload}
        }
        client.query(query).then(data => 
            //console.log(data)
            commit('addLoadRecipes',data.data.recipes.data)
            ).catch(e => console.log(e))
    },
    increment(context){
        setTimeout(()=>{
            context.commit("increment")
        },1000)
    }
}