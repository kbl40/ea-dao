import sdk from "./1-initialize-sdk.js";

const tokenModule = sdk.getTokenModule("0x2f25EB55afcBA83813b261526B0D225e38eCd38f",);

(async () => {
    try {
        // Log the current roles.
        console.log("👀 Roles that exist right now:", await tokenModule.getAllRoleMembers());

        // Revoke all the superpowers your wallet had over the ERC-20 contract.
        await tokenModule.revokeAllRolesFromAddress(process.env.WALLET_ADDRESS);
        console.log("🎉 Roles after revoking ourselves", await tokenModule.getAllRoleMembers());
        console.log("✅ Successfully revoked our superpowers from the ERC-20 contract");
    } catch (error) {
        console.error("failed to revoke ourselveds from the DAO treasury", error);
    }
})();