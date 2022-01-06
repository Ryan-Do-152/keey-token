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

    // Buy KEEY token with USDT
    const buyToken = async () => {
        if (typeof window.ethereum !== 'undefined') {
            const transaction = await ethersApi.contract.buyKeeyUSDT(
                Number(10000),
                {
                    gasLimit: 22000
                })
            await transaction.wait()
        }
    }
    return (
        <div>
            <Menu connetButton={connetWalletMetamask} account={account} />
            <div className='container mx-auto'>
                {ethersApi.signer}
                <div className="text-center pt-7">
                    <p className="font-medium text-1xl pb-3 underline">Total Keey Sell: {availableToken}</p>
                </div>
                <hr></hr>
                <div className="text-center scroll-pt-10 py-5">
                    <h3>Buy Token</h3>
                    <div>
                        <input type="number" className="mt-1 px-3 py-1 border  border-gray-300 items-center rounded-md  bg-white shadow-sm"></input>

                    </div>
                    <div className="my-3">
                        <button
                            className="px-4 py-2 bg-green-400 hover:bg-green-500 text-1xl font-bold border rounded-md"
                            onClick={buyToken}
                        >
                            Buy Token with USDT
                        </button>
                    </div>
                    <div className="mt-10 text-left">
                        <hr></hr>
                        <p><b>My Address: </b> {account.account}</p>
                        <p><b>Balance: </b> {account.balance} KEEY</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
