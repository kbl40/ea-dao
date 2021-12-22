import { ethers } from "ethers";
import sdk from "./1-initialize-sdk.js";

// Our voting contract.
const voteModule = sdk.getVoteModule("0x87DB5A16eD6966Ff0A2C55a75DBE9F596ab4968B");

// Our ERC-20 contract.
const tokenModule = sdk.getTokenModule("0x2f25EB55afcBA83813b261526B0D225e38eCd38f",);

(async () => {
    try {
        const amount = 420_000;
        // Create a proposal to mint 420,000 new token to the treasury.
        await voteModule.propose(
            "Should the DAO mint an additional " + amount + " tokens to the treasury?",
            [
                {
                    /** 
                     * Our nativeToken is ETH. nativeTokenValue is the amount of ETH we want 
                     * to send in this proposal.  In this case, we're sending 0 ETH.  We're 
                     * just minting new tokens to the treasury.  So, set to 0.
                     * **/
                    nativeTokenValue: 0,
                    transactionData: tokenModule.contract.interface.encodeFunctionData(
                        // Doing a mint!  And minting to the voteModule which is the actual treasury
                        "mint",
                        [
                            voteModule.address,
                            ethers.utils.parseUnits(amount.toString(), 18),
                        ]
                    ),
                    // Our token module that actually executes the mint.
                    toAddress: tokenModule.address,
                },
            ]
        );

        console.log("✅ Successfully created proposal to mint tokens");
    } catch (error) {
        console.error("failed to create first proposal", error);
        process.exit(1);
    }

    try {
        const amount = 6_900;
        // Create proposal to transfer ourselves 6,900 token for being awesome.
        await voteModule.propose(
            `Should the DAO transfer ${amount} tokens from the treasury to ${process.env.WALLET_ADDRESS} for being awesome?`,
            [
                {
                    // Again, we're sending ourselves 0 ETH - just sending our own token.
                    nativeTokenValue: 0,
                    transactionData: tokenModule.contract.interface.encodeFunctionData(
                        // We're doing a transfer from the treasury to our wallet.
                        "transfer",
                        [
                            process.env.WALLET_ADDRESS,
                            ethers.utils.parseUnits(amount.toString(), 18),
                        ]
                    ),

                    toAddress: tokenModule.address,
                },
            ]
        );

        console.log("Successfuly created a proposal to reward ourselves from the treasury, let's hope people vote for it!");
    } catch (error) {
        console.log("failed to create first proposal", error);
    }
})();