<template>
  <v-container
    ><h1>Metamask {{ bnbwalletAdress }} </h1> 
    <p>Cantidad de intentos {{intentos}}</p>
     <p >Acepta contrato {{contador}}</p>
    <v-divider class="my-1"></v-divider>
    <v-btn color="green" small class="my-3" @click="conectarMetamask()"
      >Conectar metamask</v-btn
    >
    <v-divider class="my-1"></v-divider>
    <v-btn color="yellow" small class="my-3" @click="cambiarTestnetBSCS()"
      >Red Testnet BSCS</v-btn
    >
    <v-btn color="yellow" small class="my-3" @click="cambiarProdnetBSCS()"
      >Red Prod BSCS</v-btn
    >
    <v-card>
      <v-card-text>
        <div>
          <v-text-field
            dense
            outlined
            label="Red binance"
            v-model="buscarToken.redBinance"
          >
          </v-text-field>
          <v-text-field
            dense
            outlined
            label="Factory"
            v-model="buscarToken.factoryContrato"
          >
          </v-text-field>
          <v-text-field
            dense
            outlined
            label="Router"
            v-model="buscarToken.reouterContrato"
          >
          </v-text-field>

          <v-text-field
            dense
            outlined
            label="Contrato WBNB"
            v-model="buscarToken.wbnbContrato"
          >
          </v-text-field>
          <v-text-field
            dense
            outlined
            label="Contrato TOKEN"
            v-model="buscarToken.tokenContrato"
          >
          </v-text-field>
          <v-text-field
            dense
            outlined
            label="Cantidad Bnb"
            v-model="buscarToken.cantidadBnb"
          >
          </v-text-field>
          <v-text-field dense outlined label="Gas Price" v-model="buscarToken.gas">
          </v-text-field>
          <div class="d-flex justify-space-between">
            <v-btn color="primary" small @click="obtenerParBNB()"> Buscar </v-btn>
          </div>

          <v-divider class="my-5"></v-divider>
          <div>Liquidez: {{ contratoLiq }}</div>
          <div>Precio: {{ precioToken }}</div>
        </div>
      </v-card-text>
    </v-card></v-container
  >
</template>
<script>
export default {
  data() {
    return {
      bnbwalletAdress: "",
      buscarToken: {
        wbnbContrato: "",
        tokenContrato: "",
        redBinance: "",
        factoryContrato: "",
        reouterContrato: "",
        cantidadBnb: "",
        gas: "",
      },
      contratoLiq: "",
      precioToken: "",
      intentos: "",
       contador: "",
    };
  },
  methods: {
    cambiarTestnetBSCS() {
      this.buscarToken.wbnbContrato = "0xae13d989dac2f0debff460ac112a837c89baa7cd";
      this.buscarToken.redBinance = "https://data-seed-prebsc-1-s1.binance.org:8545";
      this.buscarToken.factoryContrato = "0x6725F303b657a9451d8BA641348b6761A6CC7a17";
      this.buscarToken.reouterContrato = "0xD99D1c33F9fC3444f8101754aBC46c52416550D1";
    },
    cambiarProdnetBSCS() {
      this.buscarToken.wbnbContrato = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c";
      this.buscarToken.redBinance = "https://bsc-dataseed.binance.org/";
      this.buscarToken.factoryContrato = "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73";
      this.buscarToken.reouterContrato = "0x10ED43C718714eb63d5aA57B78B54704E256024E";
    },
    conectarMetamask() {
      if (typeof window.ethereum !== "undefined") {
        conectar()
          .then((x) => {
            this.$store.dispatch("snackbars/setSnack", {
              text: "Se conecto exitosamente!",
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
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });
        const account = accounts[0];
        return account;
      }
    },
    async obtenerParBNB() {
      var Tx = require("ethereumjs-tx").Transaction;

      var Common = require("ethereumjs-common").default;

      const { ethers } = require("ethers");
      const web3 = require("web3");
      let wbnb = this.buscarToken.wbnbContrato;
      let token = this.buscarToken.tokenContrato;
      let cantidadBnb = this.buscarToken.cantidadBnb;

      const provider = new ethers.providers.JsonRpcProvider(this.buscarToken.redBinance);

      const contract = {
        factory: this.buscarToken.factoryContrato, //"0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73", // PancakeSwap V2 factory
        router: this.buscarToken.reouterContrato, // PancakeSwap V2 router
      };

      const router = new ethers.Contract(
        contract.router,
        [
          "function getAmountsOut(uint amountIn, address[] calldata path) public view returns (uint[] memory amounts)",
        ],
        provider
      );

      const factory = new ethers.Contract(
        contract.factory,
        [
          "function getPair(address tokenA, address tokenB) external view returns (address pair)",
        ],
        provider
      );

      /* if (token.indexOf("0x") === -1) {
        token = tokens[token.toUpperCase()];
      } */

      if (true) {

          getPair(wbnb, token).then((l) => {
          this.contratoLiq = "https://bscscan.com/address/" + l;
        }); 

        this. contador = 0;
         this. intentos = 0;
        while (this.contador == 0) {
          let pr = await getPrice(cantidadBnb, wbnb, token)
            .then((price) => {
              this.precioToken = price;
              this.contador = this.contador + 1;
              if (this.precioToken != "") {
                buyOnlyone(
                  this.bnbwalletAdress,
                  parseFloat(cantidadBnb) * 1000000000,
                  wbnb,
                  token,
                  contract.router,
                  this.buscarToken.redBinance,
                  this.buscarToken.gas
                )
                  .then((txHash) => {
                    console.log(txHash);
                  })
                  .catch((e) => {
                    console.log(e);
                  });
              }
            })
            .catch((e) => {
              console.log("---------------------------");
              console.log(e);
              this.intentos = this.intentos + 1;
             
            });
        }

       
      } else {
        console.log("ERROR");
      }

      async function getPrice(cantidadBNB, bnbContrato, tokenContrato) {
        let bnbToSell = web3.utils.toWei(cantidadBNB, "ether");
        const amounts = await router.getAmountsOut(bnbToSell, [
          bnbContrato,
          tokenContrato,
        ]);
        const amounts2 = web3.utils.fromWei(amounts[1].toString());
        return parseFloat(amounts2).toFixed(3).toString();
      }

      async function getPair(bnbContrato, tokenContrato) {
        const contratoLiquidez = await factory.getPair(bnbContrato, tokenContrato);
        return contratoLiquidez.toString();
      }

      //COMPRAR!

      /*   var BSC_FORK = Common.forCustomChain(
        "mainnet",
        {
          name: "Binance Smart Chain Mainnet",
          networkId: 56,
          chainId: 56,
          url: "https://bsc-dataseed.binance.org/",
        },
        "istanbul"
      ); */

      async function buyOnlyone(
        targetAccount,
        amount,
        wbnToken,
        tokenAddress,
        routeAddress,
        redBinance,
        gas
      ) {
        var Web3 = require("web3");
        var web3 = new Web3(new Web3.providers.HttpProvider(redBinance));
        var amountToBuyWith = web3.utils.toHex(amount);

        /* var tokenAddress = "0x8301f2213c0eed49a7e28ae4c3e91722919b8b47"; // ONLYONE contract address
         var WBNBAddress = "0xae13d989dac2f0debff460ac112a837c89baa7cd"; // WBNB token address
        */

        //var amountOutMin = "100" + Math.random().toString().slice(2, 6);
        var amountOutMin = "0";
        /* var pancakeSwapRouterAddress =
          "0xD99D1c33F9fC3444f8101754aBC46c52416550D1"; */

        var routerAbi = [
          {
            inputs: [
              {
                internalType: "uint256",
                name: "amountOutMin",
                type: "uint256",
              },
              { internalType: "address[]", name: "path", type: "address[]" },
              { internalType: "address", name: "to", type: "address" },
              { internalType: "uint256", name: "deadline", type: "uint256" },
            ],
            name: "swapExactETHForTokens",
            outputs: [{ internalType: "uint256[]", name: "amounts", type: "uint256[]" }],
            stateMutability: "payable",
            type: "function",
          },
        ];
        var contract = new web3.eth.Contract(routerAbi, routeAddress, {
          from: targetAccount,
        });
        //console.log((Math.round(Date.now() / 1000) + 60 * 20))
        var data = contract.methods.swapExactETHForTokens(
          web3.utils.toHex(amountOutMin),
          [wbnToken, tokenAddress],
          targetAccount,
          web3.utils.toHex(Math.round(Date.now() / 1000) + 60 * 20)
        );

        var count = await web3.eth.getTransactionCount(targetAccount);
        let gasPrice = await web3.eth.getGasPrice();
        const gasLimit = 500000;
        //console.log(amount)
        var rawTransaction = {
          from: targetAccount,
          gasPrice: web3.utils.toHex(web3.utils.toWei(gas, "gwei")),
          gasLimit: 0x13551,
          to: routeAddress,
          value: web3.utils.toHex(web3.utils.toWei(amount.toString(), "gwei")),
          data: data.encodeABI(),
          nonce: web3.utils.toHex(count),
        };

        console.log(rawTransaction);

        //var transaction = new Tx(rawTransaction, { common: BSC_FORK });

        const txHash = await ethereum.request({
          method: "eth_sendTransaction",
          params: [rawTransaction],
        });

        return txHash;
      }
    },
  },
};
</script>
