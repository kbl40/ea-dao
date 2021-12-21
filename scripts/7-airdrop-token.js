import { ethers } from "ethers";
import sdk from "./1-initialize-sdk.js";

// This is the address for our ERC-1155 membership NFT contract.
const bundleDropModule = sdk.getBundleDropModule("0x8dFdb1c3aA8E4CcedF9012c87C37788072e27abd",);

// This is the address for our ERC-20 token contract
const tokenModule = sdk.getTokenModule("0x2f25EB55afcBA83813b261526B0D225e38eCd38f", );

(async () => {
    try {
        // Grab all addresses of people who own membership NFT, which has tokenId of 0.
        const walletAddresses = await bundleDropModule.getAllClaimerAddresses("0");

        if (walletAddresses.length === 0) {
            console.log("No NFTs have been claimed yet, maybe get some frineds to claim your free NFTs!",);
            process.exit(0);
        }

        // Loop through the array of addresses.
        const airdropTargets = walletAddresses.map((address) => {
            // Pick a random # between 1000 and 10000.
            const randomAmount = Math.floor(Math.random() * (10000 - 1000 + 1) + 1000);
            console.log("✅ Going to airdrop", randomAmount, "tokens to", address);

            // Set up the target.
            const airdropTarget = {
                address,
                // Remember, we need 18 decimal places
                amount: ethers.utils.parseUnits(randomAmount.toString(), 18),
            };

            return airdropTarget;
        });

        // Call transferBatch on all our airdrop targets.
        console.log("🌈 Starting airdrop...")
        await tokenModule.transferBatch(airdropTargets);
        console.log("✅  Successfully airdropped tokens to all the holders of the NFT!");
    } catch (err) {
        console.error("failed to airdrop tokens", err);
    }
})();