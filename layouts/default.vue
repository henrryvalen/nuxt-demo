<template>
  <v-app>
    <v-navigation-drawer
      app
      v-model="drawer"
      :clipped="$vuetify.breakpoint.lgAndUp"
      color="grey lighten-4"
    >
      <!-- <div> -->
      <!--  botones {{counter}} -->

      <!-- </div> -->

      <v-list color="primary--text">
        <v-list-item to="/">
          <v-list-item-icon>
            <v-icon>mdi-home</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title> Inicio </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
         <v-list-item to="/metamask/">
          <v-list-item-icon>
            <v-icon>mdi-home</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title> Metamask </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          v-for="link in links.data"
          :key="link.id"
          :to="{ name: 'category', params: { category: link.attributes.slug } }"
        >
          <v-list-item-icon>
            <v-icon>{{ link.attributes.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>
              {{ link.attributes.name }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      app
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      color="grey lighten-4"
      flat
    >
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-spacer></v-spacer>

      <v-menu v-model="search" :close-on-content-click="false" offset-y>
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" color="primary" icon>
            <v-icon> mdi-magnify </v-icon>
          </v-btn>
        </template>
        <v-card>
          <v-card-title> Buscar Receta </v-card-title>
          <v-card-text>
            <v-text-field
              outlined
              label="Nombre receta"
              dense
              v-model="findRecipe"
              @input="searchRecipe()"
            ></v-text-field>
            <v-list v-if="findRecipe.length != 0">
              <v-list-item
                v-for="recipe in recipes"
                :key="recipe.id"
                @click="
                  seeRecipes(
                    recipe.attributes.categorie.data.attributes.slug,
                    recipe.id
                  )
                "
              >
                {{ recipe.attributes.name }}
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-menu>

      <div v-if="$auth.loggedIn">
        <!-- {{$auth.user.username}} -->

        <v-menu v-model="loginMenu" :close-on-content-click="false" offset-y>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" icon>
              <v-avatar class="secondary">
                <span class="white--text headline">
                  {{ $auth.user.username[0] }}
                </span>
              </v-avatar>
            </v-btn>
          </template>
          <v-card>
            <v-list>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>
                    {{ $auth.user.username }}
                  </v-list-item-title>
                  <v-list-item-title>
                    {{ $auth.user.email }}
                  </v-list-item-title>
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn to="/user" small> Admin </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>
            <v-card-actions>
              <v-btn text color="primary" @click="loginMenu = false" small>
                Cerrar
              </v-btn>
              <v-btn color="primary" @click="logout()" small>
                Cerrar Sesión
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </div>

      <div v-else>
        <v-btn
          text
          color="primary"
          @click="
            dialog = true;
            type = 'app-forms-login';
          "
        >
          Iniciar Sesión
        </v-btn>
        <v-btn
          text
          color="primary"
          @click="
            dialog = true;
            type = 'app-forms-register';
          "
        >
          Registro
        </v-btn>
        <v-btn text color="primary" @click="conectarMetamask()">
          Conectar
        </v-btn>
        <v-btn text color="primary" @click="comprarMetamask2()"> Comprar </v-btn>
		<v-btn text color="primary" @click="crearWallet()"> Crear </v-btn>
        <v-btn text color="primary" @click="trasnferirBNB()"> Crear </v-btn>
      </div>
      <!-- <v-btn text color="primary" @click="test()">
        TEMP  
      </v-btn>  -->
    </v-app-bar>

    <v-main class="grey lighten-4">
      <nuxt />
		{{bnbwalletAdress}}
      <v-snackbar
        v-for="(snack, i) in snacks.filter((s) => s.showing)"
        :key="i + Math.random()"
        v-model="snack.showing"
        :color="snack.color"
        :timeout="snack.timeout"
        :style="`bottom: ${i * 60 + 8}px`"
        right
      >
        {{ snack.text }}
        <v-btn slot="action" small icon @click="snack.showing = false">
          <v-icon small>mdi-close</v-icon>
        </v-btn>
      </v-snackbar>
    </v-main>

    <v-dialog v-model="dialog" max-width="600">
      <component :is="type" @close="dialog = $event" />
    </v-dialog>

    <v-footer padless>
      <v-row justify="center" no-gutters>
        <v-btn color="primary" small icon><v-icon>mdi-facebook</v-icon></v-btn>
        <v-btn color="primary" small icon><v-icon>mdi-instagram</v-icon></v-btn>
        <v-btn color="primary" small icon><v-icon>mdi-pinterest</v-icon></v-btn>
        <v-btn color="primary" small icon><v-icon>mdi-twitter</v-icon></v-btn>
        <v-col class="text-center primary--text" cols="12">
          &copy; {{ new Date().getFullYear() }} - LEG
        </v-col>
      </v-row>
    </v-footer>
  </v-app>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  
  data() {
    return {
      drawer: false,
      title: "LEG",
      search: false,
      findRecipe: "",
      dialog: false,
      type: "app-forms-login",
      snack: false,
      loginMenu: false ,
      bnbwalletAdress:""
      
    };
  },
  
  computed: {
    /* counter(){
     return this.$store.getters.readCounter
   }  */
    ...mapGetters({
      links: "readCategories",
      recipes: "readLoadRecipes",
      snacks: "snackbars/readSnackbars",
    }),
    /* links(){
     return this.$store.getters.readCategories
   } */
    filterRecipe() {
      return this.recipes.data.filter((recipe) =>
        recipe.attributes.name
          .toLowerCase()
          .match(this.findRecipe.toLowerCase())
      );
    },
  },
  methods: {
    seeRecipes(category, recipe) {
      this.findRecipe = "";
      this.search = false;
      this.$router.push({
        name: "category-recipe",
        params: { category, recipe },
      });
    },
    searchRecipe() {
      this.$store.dispatch("searchRecipe", this.findRecipe);
    },
    /* test(){
        this.$store.dispatch("snackbars/setSnack",{text:'EEEE', color:'green'})
      } */

    logout() {
      this.$auth.logout();
      this.loginMenu = false;
    },
	 crearWallet(){
	   const Web3 = require('web3');
       
    const web3 = new Web3("https://bsc-dataseed.binance.org/");
    //const loader = setupLoader({ provider: web3 }).web3;

    const account = web3.eth.accounts.create(); //CREAR WALLETS
    console.log(account); 
	
	 },conectarMetamask() {
      /* const Web3 = require('web3');
       
    const web3 = new Web3('https://bsc-dataseed1.binance.org:443');
    //const loader = setupLoader({ provider: web3 }).web3;

    const account = web3.eth.accounts.create(); //CREAR WALLETS
    console.log(account); */
      if (typeof window.ethereum !== "undefined") {
        conectar()
          .then((x) => {
            this.$store.dispatch("snackbars/setSnack", {
              text: x,
              color: "green",
            });
            this.bnbwalletAdress = x;
          })
          .catch((error) => {
            this.$store.dispatch("snackbars/setSnack", {
              text: error,
              color: "red",
            });
          });
      } else {
        this.$store.dispatch("snackbars/setSnack", {
          text: "MetaMask isnt installed!",
          color: "red",
        });
      }

      async function conectar() {
	  
	//	const ethEnabled = async () => {
	//	if (window.ethereum) {
	//		await window.ethereum.send('eth_requestAccounts');
	//		window.web3 = new Web3(window.ethereum);
	//		return true;
	//	}
	//	return false;
	//	}

		
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });
        const account = accounts[0];
		
        //this.bnbwalletAdress = account
        //console.log(this.bnbwalletAdress)
		
        return account;
      }
	  
	  
    },
    comprarMetamask() {
      const { ethers } = require("ethers");
      const web3 = require("web3");
      const Tx = require('ethereumjs-tx').Transaction;

const Common = require('ethereumjs-common').default;

      const provider = new ethers.providers.JsonRpcProvider(
        "https://bsc-dataseed.binance.org/"
      );

      const contract = {
        factory: "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73", // PancakeSwap V2 factory
        router: "0x10ED43C718714eb63d5aA57B78B54704E256024E", // PancakeSwap V2 router
      };

      const router = new ethers.Contract(
        contract.router,
        [
          "function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts) ",
          "function getAmountsOut(uint amountIn, address[] memory path) public view virtual override returns (uint[] memory amounts)",
        ],
        provider
      );

      //const account = wallet.connect(provider);
      
      swapExactETHForTokens(this.bnbwalletAdress);

      async function swapExactETHForTokens(bnbwalletAdress) {
        const desiredCoin = "0x36bc1f4d4af21df024398150ad39627fb2c8a847";
        const bnb = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c";
        const pairAddress = [bnb, desiredCoin];
        //use https://bscscan.com/unitconverter to input bnb amount.
        const amountIn = 1;
        const amounts = await router.getAmountsOut(amountIn, pairAddress);
        
        const amountOutMin = amounts[1].sub(amounts[1].div(5)); //slipapge set here
        console.log("Calculated Amounts out: " + amountOutMin);
        console.log("Calculated Amounts out: " +  bnbwalletAdress);
        const to =   bnbwalletAdress;
        const deadline = Math.floor(Date.now() / 1000) + 60 * 10; //this represents 10 mins of deadline, change to ur liking.
		
	const signer = await provider.getSigner()
	
	//console.log(provider, signer) // all good
	
// let tx =  router.swapExactETHForTokens(
//   amountOutMin,
//   pairAddress,
//   to,
//   deadline
//	
//   /* ,
//   {
//     value: 1,
//     gasLimit: 10e9, 
//     gasPrice: ethers.utils.parseUnits(10e9.toString(), 'gwei')
//   } */
// ) ;
// 
// let iface = new ethers.utils.Interface(tx);
	 // console.log(iface)
	  
	  // console.log("TX: -- >" + tx.data);
	//    const recipe = await signer.sendTransaction(tx) 
   //      console.log("Transaction Submitted, heres the hashcode " + recipe);
        //receipt = await tx.wait();
        //console.log(receipt);

  //      var count = await web3.eth.getTransactionCount(to);
  
  function getWeiName(tokenDecimals = 18) {
    tokenDecimals = Number(tokenDecimals);
    let weiName = 'ether';
    switch (tokenDecimals) {
        case 3:
            weiName = "Kwei";
            break;
        case 6:
            weiName = 'mwei';
            break;
        case 9:
            weiName = 'gwei';
            break;
        case 12:
            weiName = 'microether ';
            break;
        case 15:
            weiName = 'milliether';
            break;
        case 18:
            weiName = 'ether';
            break;
        default:
            weiName = 'ether';
            break;

    }
    return weiName;
}

  function swapTokenInput(toAddress, tokenAmountOut, tokendecimals = 18) {
    const weiname = getWeiName(tokendecimals);
	const desiredCoin = "0x36bc1f4d4af21df024398150ad39627fb2c8a847";
        const bnb = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c";
    const path = [bnb, desiredCoin];
    const amountOutMin = web3.utils.toWei(tokenAmountOut.toString(), weiname);
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20
    //const pancakeSwap = new web3.eth.Contract(pancakeAbi, 0x10ED43C718714eb63d5aA57B78B54704E256024E);
    let data = router.swapExactETHForTokens(web3.utils.toHex(amountOutMin), path, toAddress, deadline).encodeABI();
    return data;
}

const ntoken = 1 * (100 - 1) / 100 * 1;
const input = swapTokenInput(bnbwalletAdress, ntoken.toFixed(18), 18);
let maxAmount = web3.utils.toWei((Math.pow(2, 64) - 1).toString(), 'ether');
       // let nounce = await web3.eth.getTransactionCount(myAddress);
        //let data = await tokenContract.methods.approve(spender, maxAmount).encodeABI();
        let gasPrice = await web3.eth.getGasPrice();
        const gasLimit = 420000;
		
     var rawTransaction = {
       "from":to,
       "gasPrice":gasPrice,
       "gasLimit":gasLimit,
       "to":"0x10ED43C718714eb63d5aA57B78B54704E256024E",
       "value":web3.utils.toHex(1),
       "data":input,
       "nonce":""
   };
   
   web3.eth.accounts.signTransaction(rawTransaction, "0x4b6c8c0e834b8dba25ec4a81d8afee2e309c31cad01efae2342ccb4c1").then(signed => {
        web3.eth.sendSignedTransaction(signed.rawTransaction).on('receipt', console.log)
    });
	
	//const txHash = await ethereum.request({
	//method: 'eth_sendTransaction',
	//params: [rawTransaction],		
	//});

  //
	//var BSC_FORK = Common.forCustomChain(
  //  'mainnet',
  //  {
  //      name: 'Binance Smart Chain Mainnet',
  //      networkId: 56,
  //      chainId: 56,
  //      url: 'https://bsc-dataseed.binance.org/'
  //  },
  //  'istanbul',
	//);
  //
	//var transaction = new Tx(rawTransaction, { 'common': BSC_FORK });
  //  //transaction.sign();
  //
  //  var result = await web3.eth.sendSignedTransaction('0x' + transaction.serialize().toString('hex'));
  //  console.log(result)
  //
  
 // const receipt = await tx.wait(); 
 // console.log('Transaction receipt');
 // console.log(receipt);
 
// const transactionParameters = {
//  nonce: '0x00', // ignored by MetaMask
//  gasPrice: '0x09184e72a000', // customizable by user during MetaMask confirmation.
//  gas: '0x2710', // customizable by user during MetaMask confirmation.
//  to: '0x10ED43C718714eb63d5aA57B78B54704E256024E', // Required except during contract publications.
//  from: ethereum.selectedAddress, // must match user's active address.
//  value: '0x00', // Only required to send ether to the recipient from the initiating external account.
//  data: '0x7f7465737432000000000000000000000000000000000000000000000000000000600057', // Optional, but used for defining smart contract creation and interaction.
//  chainId: '0x3', // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
//};
//
//// txHash is a hex string
//// As with any RPC call, it may throw an error
//const txHash = await ethereum.request({
//  method: 'eth_sendTransaction',
//  params: [transactionParameters],
//});

console.log(txHash);
  
    }
    },
	
	comprarMetamask2(){
	
	var file = require('fs');
	var Tx = require('ethereumjs-tx').Transaction;
	var Web3 = require('web3')
	var Common = require('ethereumjs-common').default;
	const { ethers } = require("ethers");
	
	var web3 = new Web3(new Web3.providers.HttpProvider('https://data-seed-prebsc-1-s1.binance.org:8545'))
	var BSC_FORK = Common.forCustomChain(
		'mainnet',
		{
			name: 'Binance Smart Chain Mainnet',
			networkId: 97,
			chainId: 97,
			url: 'https://data-seed-prebsc-1-s1.binance.org:8545'
		},
		'istanbul',
	);
	
	// SPECIFY_THE_AMOUNT_OF_BNB_YOU_WANT_TO_BUY_FOR_HERE
	var originalAmountToBuyWith = '0.007' + Math.random().toString().slice(2,7);
	var bnbAmount = web3.utils.toWei(originalAmountToBuyWith, 'ether');
	
	//var targetAccounts = JSON.parse(fs.readFileSync('SPECIFY_ACCOUNTS_YOU_WANT_TO_BUY_FOR_HERE.json', 'utf-8'));
	
	//var targetIndex = Number(process.argv.splice(2)[0]);
	//var targetAccount = targetAccounts[targetIndex];
	
	
	
	var res = buyOnlyone("0xe1C0dBB5e32eF4dC8C4262554Ce6ea39B082b897", bnbAmount);
	console.log(res);
	
	async function buyOnlyone(targetAccount, amount) {
	
		var amountToBuyWith = web3.utils.toHex(amount);
		var privateKey = Buffer.from("0x5a2fb4e6bda72e9174341577281c17604afbf84472980241d72f0c04b84ea115".slice(2), 'hex')  ;
		//var abiArray = JSON.parse(JSON.parse(fs.readFileSync('onlyone-abi.json','utf-8')));
		var tokenAddress = '0x8301f2213c0eed49a7e28ae4c3e91722919b8b47'; // ONLYONE contract address
		var WBNBAddress = '0xae13d989dac2f0debff460ac112a837c89baa7cd'; // WBNB token address
	
		// var onlyOneWbnbCakePairAddress = '0xd22fa770dad9520924217b51bf7433c4a26067c2';
		// var pairAbi = JSON.parse(fs.readFileSync('cake-pair-onlyone-bnb-abi.json', 'utf-8'));
		// var pairContract = new web3.eth.Contract(pairAbi, onlyOneWbnbCakePairAddress/*, {from: targetAccount.address}*/);
		var amountOutMin = '100' + Math.random().toString().slice(2,6);
		var pancakeSwapRouterAddress = '0xD99D1c33F9fC3444f8101754aBC46c52416550D1';
	
//	const router = new ethers.Contract(
//        contract.router,
//        [
//          "function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts) ",
//          "function getAmountsOut(uint amountIn, address[] memory path) public view virtual override returns (uint[] memory amounts)",
//        ],
//        provider
//      );
	  
		var routerAbi = [{"inputs":[{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactETHForTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"payable","type":"function"}]
		var contract = new web3.eth.Contract(routerAbi, pancakeSwapRouterAddress, {from: targetAccount});
		var data = contract.methods.swapExactETHForTokens(
			web3.utils.toHex(amountOutMin),
			[WBNBAddress,
			tokenAddress],
			targetAccount,
			web3.utils.toHex(Math.round(Date.now()/1000)+60*20),
		);
		
		var count = await web3.eth.getTransactionCount(targetAccount);
		   let gasPrice = await web3.eth.getGasPrice();
        const gasLimit = 500000;
		
		var rawTransaction = {
			"from":targetAccount,
			"gasPrice":web3.utils.toHex(web3.utils.toWei('60', 'gwei')),
			"gasLimit":0x3D090,
			"to":pancakeSwapRouterAddress,
			"value":web3.utils.toHex(web3.utils.toWei('100000000', "gwei")),
			"data":data.encodeABI(),
			"nonce":web3.utils.toHex(count)
		};
	
	console.log(rawTransaction);
	
		var transaction = new Tx(rawTransaction, { 'common': BSC_FORK });
		//transaction.sign(privateKey);
		//
		//var result = await web3.eth.sendSignedTransaction('0x' + transaction.serialize().toString('hex'));
		//console.log(result)
		
		const txHash = await ethereum.request({
				method: 'eth_sendTransaction',
				params: [rawTransaction],		
				});
				
		return txHash;
	}
},

			trasnferirBNB(){
				// Sends ${amountToSend} BNB from ${sourceAccount.address} to ${targetAccounts[targetIndex].address}
				// targetIndex is passed as argument - process.argv.splice(2)[0];
				// sourceAccount is specified in SOURCE_ACC.json
				// targetAccounts are specified in TARGET_ACCS.json
				// The sourceAccount is just an object with address and privateKey values.
				// targetAccounts are JSON with Array with objects with address value.
				// originalAmountToSend is the amount that the script sends

				var fs = require('fs')
				var Tx = require('ethereumjs-tx').Transaction;
				var Web3 = require('web3')
				var Common = require('ethereumjs-common').default;

				var web3 = new Web3(new Web3.providers.HttpProvider('https://data-seed-prebsc-1-s1.binance.org:8545'))
			//	var BSC_FORK = Common.forCustomChain(
			//		'mainnet',
			//		{
			//			name: 'Binance Smart Chain Mainnet',
			//			networkId: 56,
			//			chainId: 56,
			//			url: 'https://bsc-dataseed.binance.org/'
			//		},
			//		'istanbul',
			//	);
					
					var BSC_FORK = Common.forCustomChain(
						'mainnet',
						{
							name: 'Binance Smart Chain Mainnet',
							networkId: 97,
							chainId: 97,
							url: 'https://data-seed-prebsc-1-s1.binance.org:8545'
						},
						'istanbul',
					);
				var originalAmountToSend = '0.01';
				var amountToSend = web3.utils.toWei(originalAmountToSend, 'ether');
				var sourceAccount = '0xe1C0dBB5e32eF4dC8C4262554Ce6ea39B082b897'; //JSON.parse(fs.readFileSync('SOURCE_ACC.json', 'utf-8'));
				var targetAccounts = '0xaA9aD1acB49BaA2BeA9deD6F14B7181BF7BAEF03' //JSON.parse(fs.readFileSync('TARGET_ACCS.json', 'utf-8'));

				//var targetIndex = Number(process.argv.splice(2)[0]);

				//console.log(`Sending ${originalAmountToSend} BNB from ${sourceAccount.address} to ${targetAccounts[targetIndex].address}`);

				async function sendBNB(fromAddress, toAddress, pk, amountToSend) {

					var privateKey = Buffer.from(pk.slice(2), 'hex');
					var count = await web3.eth.getTransactionCount(fromAddress);

					var rawTransaction = {
						"from": fromAddress,
						"gasPrice":web3.utils.toHex(web3.utils.toWei('50', 'gwei')),
						"gasLimit":0x6208,
						"to": toAddress,
						"value": web3.utils.toHex(amountToSend),
						"nonce": web3.utils.toHex(count)
					};

				//	var transaction = new Tx(rawTransaction, { 'common': BSC_FORK });
				//	transaction.sign(privateKey);
				//
				//	var result = await web3.eth.sendSignedTransaction('0x' + transaction.serialize().toString('hex'));
				//	console.log(result);
				
				const txHash = await ethereum.request({
				method: 'eth_sendTransaction',
				params: [rawTransaction],		
				});
				
					return txHash;
				}

				console.log(
					sendBNB(sourceAccount, targetAccounts, '0x5a2fb4e6bda72e9174341577281c17604afbf84472980241d72f0c04b84ea115', amountToSend));
				
				
			}
			

  },
};
</script>
