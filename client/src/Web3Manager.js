import getWeb3 from "./utils/getWeb3";
import Igralnica from "./contracts/Igralnica.json";

async function getCore ()
{
  // We cache core value as global variable
  // If we call getWeb3() twice without refreshing the page it hangs the app forever
  if (window.core != null)
    return window.core;

  var core = {
    web3: null,
    contract: null,
    account: null,
    error: false
  }

  try {
    // Get web3
    let web3 = await getWeb3();

    if (web3 == null)
    {
      core.error = true;
      return core;
    }
    core.web3 = web3;

    // Use web3 to get the user's accounts.
    let accounts = await web3.eth.getAccounts();

    if (accounts === null || accounts.length === 0)
    {
      core.error = true;
      return core;
    }
    // First account is the one selected in MetaMask
    core.account = accounts[0];

    // Get the contract instance.
    let networkId = await web3.eth.net.getId();
    let deployedNetwork = Igralnica.networks[networkId];

    let contract = new web3.eth.Contract(
      Igralnica.abi,
      deployedNetwork && deployedNetwork.address,
    );

    if (contract == null)
    {
      core.error = true;
      return core;
    }
    core.contract = contract;


  } catch (e) {
    core.error = true;
    console.log("Error: " + e);
  }

  window.core = core;
  return core;
}

export default getCore;
