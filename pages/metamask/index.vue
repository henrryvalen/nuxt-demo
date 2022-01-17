<template>
  <v-container
    ><h1>Metamask {{ bnbwalletAdress }}</h1>
    <v-divider class="my-5"></v-divider>
    <v-btn color="primary" small class="my-3" @click="conectarMetamask()"
      >Conectar metamask</v-btn
    >
    <v-card>
      <v-card-title>
        <v-icon class="mr-3"> mdi-account-key </v-icon>
        Botsito
      </v-card-title>
      <v-card-text>
        <div>
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
          <div class="d-flex justify-space-between">
            <v-btn color="primary" small @click="obtenerParBNB()">
              Buscar
            </v-btn>
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
      },
      contratoLiq: "",
      precioToken: "",
    };
  },
  methods: {
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
        getPrice(wbnb, token).then((price) => {
          this.precioToken = price;
        });

        getPair(wbnb, token).then((l) => {
          this.contratoLiq = "https://bscscan.com/address/" + l;

          console.log(this.contratoLiq)
        /* if (this.contratoLiq != "") {
          var originalAmountToBuyWith =
            "0.007" + Math.random().toString().slice(2, 7);
          var bnbAmount = web3.utils.toWei(originalAmountToBuyWith, "ether");

          var res = buyOnlyone(
            this.bnbwalletAdress,
            bnbAmount,
            wbnb,
            token,
            contract.router
          );
          console.log("res -->" + res);
        } */

        });
        
      } else {
        console.log("ERROR");
      }

      async function getPrice(bnbContrato, tokenContrato) {
        let bnbToSell = web3.utils.toWei("1", "ether");
        const amounts = await router.getAmountsOut(bnbToSell, [
          bnbContrato,
          tokenContrato,
        ]);
        const amounts2 = web3.utils.fromWei(amounts[1].toString());
        return parseFloat(amounts2).toFixed(3).toString();
      }

      async function getPair(bnbContrato, tokenContrato) {
        const contratoLiquidez = await factory.getPair(
          bnbContrato,
          tokenContrato
        );
        return contratoLiquidez.toString();
      }

      //COMPRAR!

      var BSC_FORK = Common.forCustomChain(
        "mainnet",
        {
          name: "Binance Smart Chain Mainnet",
          networkId: 56,
          chainId: 56,
          url: "https://bsc-dataseed.binance.org/",
        },
        "istanbul"
      );

      async function buyOnlyone(
        targetAccount,
        amount,
        wbnToken,
        tokenAddress,
        routeAddress
      ) {
          var Web3 = require('web3')
          var web3 = new Web3(new Web3.providers.HttpProvider('https://bsc-dataseed.binance.org/'))
        var amountToBuyWith = web3.utils.toHex(amount);

        /* var tokenAddress = "0x8301f2213c0eed49a7e28ae4c3e91722919b8b47"; // ONLYONE contract address
         var WBNBAddress = "0xae13d989dac2f0debff460ac112a837c89baa7cd"; // WBNB token address
        */

        var amountOutMin = "100" + Math.random().toString().slice(2, 6);
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
            outputs: [
              { internalType: "uint256[]", name: "amounts", type: "uint256[]" },
            ],
            stateMutability: "payable",
            type: "function",
          },
        ];
        var contract = new web3.eth.Contract(routerAbi, routeAddress, {
          from: targetAccount,
        });
        var data = contract.methods.swapExactETHForTokens(
          web3.utils.toHex(amountOutMin),
          [wbnToken, tokenAddress],
          targetAccount,
          web3.utils.toHex(Math.round(Date.now() / 1000) + 60 * 20)
        );

        var count = await web3.eth.getTransactionCount(targetAccount);
        let gasPrice = await web3.eth.getGasPrice();
        const gasLimit = 500000;

        var rawTransaction = {
          from: targetAccount,
          gasPrice: web3.utils.toHex(web3.utils.toWei("5", "gwei")),
          gasLimit: 0x13551,
          to: routeAddress,
          value: web3.utils.toHex(web3.utils.toWei("10000000", "gwei")),
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