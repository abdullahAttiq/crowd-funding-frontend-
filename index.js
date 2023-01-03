import { ethers } from "./ethers-5.6.esm.min.js"
import { abi, contractAddress } from "./constants.js"
// import { doc } from "prettier"

const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
const balanceButton = document.getElementById("balanceButton")
const withdrawButton = document.getElementById("withdrawButton")
withdrawButton.onclick = withdraw
balanceButton.onclick = getBalance
connectButton.onclick = connect
fundButton.onclick = fund

async function connect() {
  if (typeof window.ethereum !== "undefined") {
    await window.ethereum.request({ method: "eth_requestAccounts" })
    connectButton.innerHTML = "CONNECTED TO METAMASK"
  } else {
    conslole.log("no metamask found")
    connectButton.innerHTML = "please download metamask"
  }
}

async function fund() {
  console.log("hello")

  const ethAmount = document.getElementById("eth amount").value
  console.log(`funding with ${ethAmount}`)
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer)
    try {
      const transactionResponse = await contract.fund({
        value: ethers.utils.parseEther(ethAmount),
      })
      await listenForTransactionMine(transactionResponse, provider)
      console.log("done")
      const tic = "./tic.png"
      document.getElementById("tic").src = tic
      //const tic=document.getElementById("tic")= "./tic.png"
    } catch (error) {
      console.log(error)
    }
  }
}

function listenForTransactionMine(transactionResponse, provider) {
  console.log(`mining ${transactionResponse.hash}...`)
  return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, (transactionReciept) => {
      console.log(
        `completed with ${transactionReciept.confirmations}confermations`
      )
      resolve()
    })
  })
}

async function getBalance() {
  if (typeof window.ethereum != "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const balance = await provider.getBalance(contractAddress)
    console.log(ethers.utils.formatEther(balance))
  }
}

async function withdraw() {
  if (typeof window.ethereum != "undefined") {
    console.log("withdrawing.....")
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer)
    try {
      const transactionResponse = await contract.withdraw()
      await listenForTransactionMine(transactionResponse, provider)
    } catch (error) {
      console.log(error)
    }
  }
}
