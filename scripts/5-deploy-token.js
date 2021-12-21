import sdk from "./1-initialize-sdk.js";

// In order to deploy the new contract we need our app module again.
const app = sdk.getAppModule("0x58E3496368f559705BE7095b3B711DfD484c8934");

(async () => {
    try {
        // Deploy a standard ERC-20 contract.
        const tokenModule = await app.deployTokenModule({
            // What's your token's name? E.g. "Ethereum"
            name: "EffectiveAltruistsDAO Governance Token",
            // What's your token's symbol? E.g. "ETH"
            symbol: "DALY",
        });
        console.log("Successfully deployed token module, address:", tokenModule.address,);
    } catch (error) {
        console.error("failed to deploy token module:", error);
    }
})();