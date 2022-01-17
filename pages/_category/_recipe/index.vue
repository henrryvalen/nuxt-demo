<template>
  <v-container>
    <h1 class="secodary--text">
        {{recipe.data.attributes.name}}
    </h1>
    <h5 class="secodary--text">
        {{recipe.data.attributes.categorie.data.attributes.name}}
    </h5>

    <v-card class="mt-3">
        <v-card-title>
            <v-icon class="mr-3">mdi-information</v-icon>
            Información</v-card-title>
        <v-card-text class="black--text">
            <v-row>
                <v-col cols="6" >
                    <v-chip color="primary" outlined>
                        <v-icon left>mdi-account-group</v-icon>
                        Servicios: {{recipe.data.attributes.servings}}
                    </v-chip>
                    

                    <v-chip color="primary" outlined>
                        <v-icon left>mdi-clock</v-icon>
                        Duración: {{formatedTime}}
                    </v-chip>

                    <v-chip color="primary" outlined>
                        <v-icon left>mdi-account-edit</v-icon>
                        Autor:  {{recipe.data.attributes.autor.data == null ? "" : recipe.data.attributes.autor.data.attributes.username}}
                    </v-chip>
                    <v-divider class="my-3"></v-divider>

                    <h4 class="body-1">Descripción</h4>
                    <div v-html="recipe.data.attributes.description"></div>
                </v-col>
                <v-col cols="6">
                    <v-img :src="recipe.data.attributes.img" max-height="500"></v-img>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>

    <div class="mt-3">
      <v-row>
          <v-col cols="5">
              <v-card-title>
                  <v-icon class="mr-3">
                      mdi-fridge
                  </v-icon>Ingredientes
              </v-card-title>
              <v-list>
                  <v-list-item v-for="(ingrediente,i) in recipe.data.attributes.ingredients"
                  :key="i">
                  {{ingrediente}}
                  </v-list-item>
              </v-list>
          </v-col>
          <v-col cols="7" >
              <v-card-title>
                  <v-icon class="mr-3">
                      mdi-sotove
                  </v-icon>Pasos
              </v-card-title>
              <v-timeline dense>
                  <v-timeline-item v-for="(step,k) in recipe.data.attributes.steps"
                  :key="k+Math.random()" color="secondary" small>

                    {{step}}
                  </v-timeline-item>
              </v-timeline>
          </v-col>
      </v-row>
    </div>
    
    <div class="mt-3">
      <app-ui-back-btn  label="Volver a recetas"></app-ui-back-btn>
    </div>
  </v-container>
</template>

<script>
export default {


  computed:{
    formatedTime(){
      let hours = Math.floor(this.recipe.data.attributes.duration/60)
      let minutes = this.recipe.data.attributes.duration%60
      let total = ("0" + hours).slice(-2) + ":" + ("0" + minutes).slice(-2);

      
      const { ethers } = require('ethers');
      const web3 = require('web3');
      const provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org/');

      const contract = {
        factory: '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73', // PancakeSwap V2 factory
        router: '0x10ED43C718714eb63d5aA57B78B54704E256024E', // PancakeSwap V2 router
      };
      const tokens = {
        BUSD: '0xe9e7cea3dedca5984780bafc599bd69add087d56',
        SCZ: '0x39f1014a88c8ec087cedf1bfc7064d24f507b894',
        DOP: '0x844fa82f1e54824655470970f7004dd90546bb28',
      };

      const router = new ethers.Contract(
        contract.router,
        ['function getAmountsOut(uint amountIn, address[] calldata path) public view returns (uint[] memory amounts)'],
        provider
      );

    const factory = new ethers.Contract(
        contract.factory,
        ['function getPair(address tokenA, address tokenB) external view returns (address pair)'],
        provider
      );


      let token = "0x36bc1f4d4af21df024398150ad39627fb2c8a847";

    if(token.indexOf('0x') === -1){
        token = tokens[token.toUpperCase()];
    }
    
    if(token) {
        getPrice(token, tokens.BUSD).then(price => {
           /*  res.json({
                success: true,
                BUSD: price
            }); */
            console.log(price)
        });

        getPair().then(price => {
           /*  res.json({
                success: true,
                BUSD: price
            }); */
            console.log("LIQUIDEZ -- >" + price)
        });

    }else{
        console.log("ERROR")
    } 

    async function getPrice(inputCurrency, outputCurrency){
     
       let bnbToSell = web3.utils.toWei("1", "ether") ;
       const BNBTokenAddress = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c" //BNB
       const BUSDTokenAddress = "0xe9e7cea3dedca5984780bafc599bd69add087d56" //busd
    const TokenAddress  = "0x36bc1f4d4af21df024398150ad39627fb2c8a847" //TOKEN CUALQUIERA

 console.log(bnbToSell)
    const amounts = await router.getAmountsOut(bnbToSell, [BNBTokenAddress, TokenAddress]);
    const amounts2 =  web3.utils.fromWei(amounts[1].toString());
    return amounts2.toString();
}


async function getPair(){
     
       /* let bnbToSell = web3.utils.toWei("1", "ether") ; */
       const BNBTokenAddress = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c" //BNB
       /* const BUSDTokenAddress = "0xe9e7cea3dedca5984780bafc599bd69add087d56" //busd */
    const TokenAddress  = "0x36bc1f4d4af21df024398150ad39627fb2c8a847" //TOKEN CUALQUIERA

 /* console.log(bnbToSell) */
    const amounts = await factory.getPair(BNBTokenAddress , TokenAddress);
    return amounts.toString();
}

      return total
    }
  },

  async asyncData({ app, route }) {
    const client = app.apolloProvider.defaultClient;
    const id = route.params.recipe;

    const query = {
      query: require("../../../graphql/recipe.gql"),
      variables: { id },
    };
    let recipe = null;
    await client
      .query(query)
      .then((data) => {
        recipe = data.data.recipe;
      })
      .catch((e) => console.log(e));

    return { recipe };
  },
};
</script>
