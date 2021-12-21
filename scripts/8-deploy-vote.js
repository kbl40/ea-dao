import sdk from "./1-initialize-sdk.js";

// Grab the app module address.
const appModule = sdk.getAppModule("0x58E3496368f559705BE7095b3B711DfD484c8934",);

(async () => {
    try {
        const voteModule = await appModule.deployVoteModule({
            // Give your governance contract a name.
            name: "EffectiveAltruistsDAO Proposals",

            // This is the location of our governance token, the ERC-20 contract.
            votingTokenAddress: "0x2f25EB55afcBA83813b261526B0D225e38eCd38f",

            // After a proposal is created, when can members start voting?
            proposalStartWaitTimeInSeconds: 0,

            // How long do members have t ovote on a proposal (in seconds)?
            proposalVotingTimeInSeconds: 24 * 60 * 60,

            // 
            votingQuorumFraction: 0,

            // What's the minimum # of tokens a user needs to be allowed to create a proposal?
            minimumNumberOfTokensNeededToPropose: "0",
        });

        console.log("✅  Successfully deployed vote module, address:", voteModule.address,);

    } catch (err) {
        console.log("failed to deploy vote module", err);
    }
})();