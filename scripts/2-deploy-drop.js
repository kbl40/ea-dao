import { ethers } from "ethers";
import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";


const app = sdk.getAppModule("0x58E3496368f559705BE7095b3B711DfD484c8934");

(async () => {
    try {
        const bundleDropModule = await app.deployBundleDropModule({
            // The collection name, e.g. CryptoPunks
            name: "EffectiveAltruists",
            // A description for the collection.
            description: "A DAO for effective altruists",
            // The immage for the collection that will show up on OpenSea.
            image: readFileSync("scripts/assets/EA.png"),
            // We need to pass in the address of the person who will be receiving the proceeds
            // from sales of the nft.  We're planning on not charging people for the drop, so we'll
            // pass in the 0x0 address.  You can set this to your own wallet address if you want to 
            // charge for the drop
            primarySaleRecipientAddress: ethers.constants.AddressZero,
        });

        console.log("✅ Successfully deployed bundleDrop module, address:", bundleDropModule.address,);
        console.log("✅ bundleDrop metadata:", await bundleDropModule.getMetadata(),);
    } catch (error) {
        console.log("Failed to deploy bundleDrop module", error)
    }
})()
