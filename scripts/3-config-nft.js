import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

const bundleDrop = sdk.getBundleDropModule(
    "0x8dFdb1c3aA8E4CcedF9012c87C37788072e27abd",
);

(async () => {
    try {
        await bundleDrop.createBatch([
            {
                name: "Umbrella",
                description: "This NFT will give you access to EffectiveAltruistsDAO",
                image: readFileSync("scripts/assets/Umbrella.png"),
            },
        ]);
        console.log("✅ Successfully created a new NFT in the drop!");
    } catch (error) {
        console.log("failed to create the new NFT", error);
    }
})()