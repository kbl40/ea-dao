import { ethers } from "ethers";
import sdk from "./1-initialize-sdk.js";

// ERC-20 contract address.
const tokenModule = sdk.getTokenModule("0x2f25EB55afcBA83813b261526B0D225e38eCd38f");

(async () => {
    try {
        // What's the max supply you want to set? 
        const amount = 1_000_000;
        // We use the util function from ethers to convert the amount to have 18 decimal places (ERC-20 standard).
        const amountWith18Decimals = ethers.utils.parseUnits(amount.toString(), 18);
        // Interact with your deployed ERC-20 contract and mint the tokens!
        await tokenModule.mint(amountWith18Decimals);
        const totalSupply = await tokenModule.totalSupply();

        // Print out how many of the tokens are in circulation.
        console.log(
            "✅  There now is",
            ethers.utils.formatUnits(totalSupply, 18),
            "$DALY in circulation",
        );
    } catch (error) {
        console.log("failed to print money", error);
    }
})();