import './App.css';
import Web3 from 'web3';
import {useState,useEffect,useCallback} from 'react'; 
import detectProvider from '@metamask/detect-provider'
import {loadContract} from './untils/load-contract'

function App() {
  const [web3Api,setweb3Api] = useState({
    provider: null,
    web3: null,
    //contract:null,
    icoToken:null,
  });

  const [account, setAccount] = useState(null)
  const [balance, setBalance] = useState(null)
  const [availableTokens, setAvailableTokens] = useState(null)
  const [lastReceiced,setLastReceiced] = useState(null)

  //const [shouldReload, reload] = useState(null)

  const [valueBuy, setValueBuy] = useState(0)
  const [totalEtherPay, setTotalEtherPay] = useState(0)
  const [totalUSDTPay, setTotalUSDTPay] = useState(0)
  const price = 1;
  const priceUSDT = 10000;

  useEffect( () =>{
    const loadProvider = async () =>{
      const provider = await detectProvider();  
      //const contract = await loadContract("KEEYToken",provider); 
      const icoToken = await loadContract("BuyKEEYTokens",provider)
      if(provider){
        setweb3Api({
          web3: new Web3(provider),
          provider,
          icoToken,
        })
      }else{
        console.error("Please, Install Metamask !!!")
      }
    }
    loadProvider();
  },[]);

  useEffect(()=>{
    const loadBalance =  async ()=>{
      const {icoToken} = web3Api;
      const account = await web3Api.web3.eth.getAccounts();
      //const admin = await icoToken.admin();
      const availableToken = await icoToken.balanceOf(icoToken.address);
      setAvailableTokens(availableToken.words[0], "KEEY")

      //const test = await icoToken.price.call();
        
      if(account !== null &&account[0] !== undefined){
        const balance = await icoToken.balanceOf(account[0]);
        setBalance(balance.words[0], "KEEY");

        const lastReceiced = await icoToken.getLastReceiced(account[0]);
        setLastReceiced(lastReceiced);
      }else{
        setBalance(0, "KEEY");
      }

      setAccount(account[0])
    }
    web3Api.icoToken && loadBalance()
  },[web3Api]);

  const buyTokenKeeyUSDT = useCallback(async ()=>{
    const {web3,icoToken} = web3Api;

    if  (valueBuy <= 0){
      alert("You need to buy at least some tokens")
      return
    }

    if ((balance + (totalUSDTPay / priceUSDT)) > 2) {
      alert("Wallet buys up to 2 KEEY")
      return
    }

    if(totalUSDTPay % priceUSDT !== 0){
      alert("Have to send a multiple of price")
      return
    }

  
    if (lastReceiced) {
      alert("Just 01 tranfer per day for this address!!!")
      return
    }


    await icoToken.buyKeeyUSDT(
      web3.utils.toWei(totalUSDTPay.toString(),'ether'),
      {
      from: account,
    });

  },[web3Api,account,totalUSDTPay,balance,valueBuy,lastReceiced,priceUSDT])

  const buyToken = useCallback(async ()=>{
    const {web3,icoToken} = web3Api;

    if  (valueBuy <= 0){
      alert("You need to buy at least some tokens")
      return
    }

    if ((balance + (totalEtherPay / price)) > 2) {
      alert("Wallet buys up to 2 KEEY")
      return
    }

    if(totalEtherPay % price !== 0){
      alert("Have to send a multiple of price")
      return
    }

  
    if (lastReceiced) {
      alert("Just 01 tranfer per day for this address!!!")
      return
    }


    await icoToken.buy({
      from: account,
      value: web3.utils.toWei(totalEtherPay.toString(),'ether')
    });

  },[web3Api,account,totalEtherPay,balance,valueBuy,lastReceiced,price])

  const total = async (e) =>{
      setValueBuy(e.currentTarget.value)
      setTotalEtherPay(e.currentTarget.value * price)
      setTotalUSDTPay(e.currentTarget.value * priceUSDT)
  }

 
  return (
    <div className="App">
      <div className="keeytoken">
        <h2 className="is-size-2">Buy Keey Token</h2>
        <div>
          <b>Total tokens on sale : </b>{availableTokens} KEEY
        </div>
        <hr/>
        <div>
          <button className="button is-link mr-3"
            onClick = {()=>{
              web3Api.provider.request({method: "eth_requestAccounts"})
            }}
          >Connect Wallet</button>
        </div>
        <div className="mt-3">
          <div>
            <input type="number" className="input is-primary" onChange={total}/>
          </div>
          
        </div>
          <div className="columns mt-1">
          <div className="column">
          <button className="button is-primary"
            onClick ={ () => {
              buyToken();
            }}
          >Buy KEEY with ETH</button>
          </div>
          <div className="column">
          <button className="button is-primary"
            onClick ={
              ()=>{
                buyTokenKeeyUSDT();
              }
            }
          >Buy KEEY with USDT</button>
          </div>
        </div>
        
        <div className="mt-2">
          <p><b>Buy:</b>{valueBuy} KEEY</p>
          <p><b>Price:</b>{price} ETH or {priceUSDT} USDT</p>
          <p><b>Total:</b>{totalEtherPay} ETH or {totalUSDTPay} USDT</p>
        </div>
        <div>
          <hr/>
          <p><strong>Accounts Address:</strong> 
          {
            account ? account : "Account not login"
          }
          </p>
          <p><strong>BalanceOf:</strong>{balance ? balance : '0'} KEEY</p>
        </div>
        
      </div>
    </div>
  );
}

export default App;
