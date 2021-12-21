import { useEffect, useMemo, useState } from "react";
import { useWeb3 } from "@3rdweb/hooks";
import { ThirdwebSDK } from "@3rdweb/sdk";
import { ethers } from "ethers";

// Instantiate the sdk on Rinkeby.
const sdk = new ThirdwebSDK("rinkeby");

// Grab a reference to our ERC-1155 contract.
const bundleDropModule = sdk.getBundleDropModule(
  "0x8dFdb1c3aA8E4CcedF9012c87C37788072e27abd",
);

// Grab a reference to our ERC-20 contract.
const tokenModule = sdk.getTokenModule(
  "0x2f25EB55afcBA83813b261526B0D225e38eCd38f",
);

const App = () => {
  // Use the connectWallet hook thridweb gives us.
  const { connectWallet, address, error, provider } = useWeb3();
  console.log("👋 Address:", address);

  // The signer is required to sign transactions or else it is read-only
  const signer = provider ? provider.getSigner() : undefined;

  // State variable for us to know if user has our NFT.
  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);

  // isClaiming lets us easily keep a loading state while the NFT is minting.
  const [isClaiming, setIsClaiming] = useState(false);

  // Holds the amount of token each member has in state.
  const [memberTokenAmounts, setMemberTokenAmounts] = useState({});

  // The array holding all of our member addresses.
  const [memberAddresses, setMemberAddresses] = useState([]);

  // Function to shorten someones wallet address.
  const shortenAddress = (str) => {
    return str.substring(0, 6) + "..." + str.substring(str.length - 4);
  };

  // useEffect gras all of the addresses of our members holding our NFT.
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    // Grab users who hold our NFT with tokenId 0.
    bundleDropModule
      .getAllClaimerAddresses("0")
      .then((addresses) => {
        console.log("🚀 Members addresses", addresses)
        setMemberAddresses(addresses);
      })
      .catch((err) => {
        console.log("failed to get member list", err);
      });
  }, [hasClaimedNFT]);

  // useEffect grabs the number of tokens each member holds.
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    // Grab all the balances.
    tokenModule
      .getAllHolderBalances()
      .then((amounts) => {
        console.log("👜 Amounts", amounts)
        setMemberTokenAmounts(amounts);
      })
      .catch((err) => {
        console.log("failed to get token amounts", err);
      });
  }, [hasClaimedNFT]);

  // Combine the memberAddresses and memberTokenAmounts into a single array.
  const memberList = useMemo(() => {
    return memberAddresses.map((address) => {
      return {
        address,
        tokenAmount: ethers.utils.formatUnits(memberTokenAmounts[address] || 0, 18,),
      };
    });
  }, [memberAddresses, memberTokenAmounts]);

  useEffect(() => {
    // We pass the signer to the sdk, which enables us to interact with the deployed contract.
    sdk.setProviderOrSigner(signer);
  }, [signer]);

  useEffect(() => {
    // If they don't have a connected wallet, exit!
    if (!address) {
      return;
    }

    // Check if the user has the NFT by using bundleDropModule.balanceOf
    return bundleDropModule
      .balanceOf(address, "0")
      .then((balance) => {
        // If balance > 0 then they have our NFT!
        if (balance.gt(0)) {
          setHasClaimedNFT(true);
          console.log("🌟 this user has a membership NFT")
        } else {
          setHasClaimedNFT(false);
          console.log("😭 this user does not have a membership NFT")
        }
      })
      .catch((error) => {
        setHasClaimedNFT(false);
        console.error("failed to nft balance", error);
      });
  }, [address]);

  // Case where the user hasn't connected their wallet yet.
  if (!address) {
    return (
      <div className="landing">
        <h1>Welcome to EffectiveAlruistsDAO</h1>
        <button onClick={() => connectWallet("injected")} className="btn-hero">
          Connect your wallet
        </button>
      </div>
    );
  }

  // If the user has already claimed their NFT we want to display the internal DAO page to them
  // Only DAO members will see this.  Render all the members + token amounts.
  if (hasClaimedNFT) {
    return (
      <div className="member-page">
        <h1>DAO Member Page</h1>
        <p>Congratulations on being a member of EffectiveAltruistsDAO</p>
        <div>
          <div>
            <h2>Member List</h2>
            <table className="card">
              <thead>
                <tr>
                  <th>Address</th>
                  <th>Token Amount</th>
                </tr>
              </thead>
              <tbody>
                {memberList.map((member) => {
                  return (
                    <tr key={member.address}>
                      <td>{shortenAddress(member.address)}</td>
                      <td>{member.tokenAmount}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const mintNft = () => {
    setIsClaiming(true);
    // Call bundleDropModule.claim("0", 1) to mint nft to user's wallet.
    bundleDropModule
      .claim("0", 1)
      .catch((err) => {
        console.log("failed to claim", err);
        setIsClaiming(false);
      })
      .finally(() => {
        // Stop loading state.
        setIsClaiming(false);
        // Set claim state.
        setHasClaimedNFT(true);
        // Show the user their new NFT.
        console.log(`Successfully minted! Check it out on OpenSea: https://testnets.opensea.io.assets/${bundleDropModule.address}/0`);
      });
  }

  // Render mint nft screen.
  return(
    <div className="mint-nft">
      <h1>Mint your free DAO Membership NFT</h1>
      <button disabled={isClaiming} onClick={() => mintNft()}>{isClaiming ? "Minting..." : "Mint your nft (FREE)"}</button>
    </div>
  );
};

export default App;
