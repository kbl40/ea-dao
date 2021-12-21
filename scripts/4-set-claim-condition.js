import sdk from "./1-initialize-sdk.js";

const bundleDrop = sdk.getBundleDropModule(
    "0x8dFdb1c3aA8E4CcedF9012c87C37788072e27abd",
);

(async () => {
    try {
        const claimConditionFactory = bundleDrop.getClaimConditionFactory();
        // Specify conditions.
        claimConditionFactory.newClaimPhase({
            startTime: new Date(),
            maxQuantity: 50_000,
            maxQuantityPerTransaction: 1,
        });

        await bundleDrop.setClaimCondition(0, claimConditionFactory);
        console.log("✅ Successfully set claim condition!");
    } catch (error) {
        console.log("Failed to set claim condition", error);
    }
})()