import Menu from '../components/layout'

import { useState, useEffect } from 'react'

import { ethers, providers } from 'ethers'

import BuyKEEYTokens from '../public/contracts/BuyKEEYTokens.json'
//import USDT from '../public/contracts/USDT.json'

const keeyAddress = "0x1Bdef0A339cd0EF49097A714F554C495E7b3b827"
const usdtAddress = "0x77B31361a5f36deE88FFaed1C7ce134F6ec0d3bD"

export default function Home() {

    const [ethersApi, setEthersApi] = useState({
        provider: null,
        ethers: null,
        contract: null,
        signin: null,
    })
    const [account, setAccount] = useState({
        address: null,
        balance: null,
        addressCompact: null,
    })
    // const [availableTokens,setAvailableTokens] = useState(null)

    const [availableToken, setAvailableToken] = useState(null)


    //load provider, contract, signer
    useEffect(() => {
        const loadProvider = async () => {
            const provider = await new ethers.providers.Web3Provider(window.ethereum, "any")
            const signer = provider.getSigner()

            const contract = await new ethers.Contract(keeyAddress, BuyKEEYTokens.abi, signer)
            //const contractUSDT = new ether.COntract(usdtAddress, USDT.abi, signer)

            if (provider) {
                setEthersApi({
                    provider,
                    contract,
                    signin: signer,
                })
            } else {
                console.log('Need to install MetaMask')
            }

        }
        loadProvider()
    }, [])

    //get profile account
    useEffect(() => {
        const loadBalance = async () => {
            const { contract, signin } = ethersApi

            // console.log(ethers.utils.getAddress().value)
            let account = '';
            if (signin) {
                account = await signin.getAddress()
            }

            if (contract !== null) {
                const availebleToken = (await contract.balanceOf("0x041f7AA3ebdAb08850fd7FbEA8d29f3CB434C30b")).toString()
                setAvailableToken(availebleToken)

                const totalTokenUse = (await contract.balanceOf(account)).toString()
                setAccount({
                    account,
                    balance: totalTokenUse,
                    addressCompact: account.slice(0, 4) + '...' + account.slice(-4),
                })
            }
        }
        loadBalance()
    }, [ethersApi])

    // Connet to Metamask
    const connetWalletMetamask = () => {
        ethersApi.provider.send('eth_requestAccounts', [])
        setEthersApi({
            signin: ethersApi.provider.getSigner()
        })
    }

    return (
        <div>
            <Menu connetButton={connetWalletMetamask} account={account} />
            <div className='container mx-auto'>
                <div className="py-5">
                    <div className="text-left">
                        <h2 className="text-3xl py-3"> My token</h2>
                        <hr></hr>
                        <div className="py-3">
                            <p><b>My Address: </b> {account.account}</p>
                            <p><b>Balance: </b> {account.balance} KEEY</p>
                        </div>
                    </div>
                </div>
                <hr></hr>
                <div className="text-center pt-7">
                    <p className="font-medium text-1xl pb-3 underline">Total Keey Sell: {availableToken}</p>
                    <p className="font-medium text-2xl pb-4">You need buy keey token?</p>
                    <a href="buy-keey" className="text-red-500 text-3xl hover:underline hover:text-red-700">Click me!</a>
                </div>
                
            </div>
        </div>
    )
}
