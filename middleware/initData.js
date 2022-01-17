export default  function({store}){
    console.log("MIDDLEWARE");

    if(store.state.categories.length==0){
        store.dispatch('nuxtServerInit')
    }
}