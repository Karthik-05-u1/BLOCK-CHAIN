const { Client, TokenCreateTransaction, TokenTransferTransaction, TokenMintTransaction, Hbar, AccountId, PrivateKey } = require("@hashgraph/sdk");
async function main() {
    const client = Client.forTestnet();
    const operatorId = AccountId.fromString("<Your-Account-ID>");
    const operatorKey = PrivateKey.fromString("<Your-Private-Key>");
    client.setOperator(operatorId, operatorKey);
    console.log("Creating token...");
    const createTokenTransaction = await new TokenCreateTransaction()
        .setTokenName("MyToken")
        .setTokenSymbol("MTK")
        .setDecimals(2)
        .setInitialSupply(1000000)
        .setTreasuryAccountId(operatorId)
        .setAdminKey(operatorKey)
        .setFreezeKey(operatorKey)
        .setKycKey(operatorKey)
        .setSupplyKey(operatorKey)
        .setAutoRenewAccountId(operatorId)
        .setAutoRenewPeriod(7776000)
        .execute(client);
    const receipt = await createTokenTransaction.getReceipt(client);
    const tokenId = receipt.tokenId;
    console.log(Token created: ${tokenId.toString()});
    const recipientAccountId = AccountId.fromString("<Recipient-Account-ID>");
    const transferAmount = 100;
    console.log(Transferring ${transferAmount} tokens to recipient...);
    const transferTransaction = await new TokenTransferTransaction()
        .addTokenTransfer(tokenId, operatorId, -transferAmount)
        .addTokenTransfer(tokenId, recipientAccountId, transferAmount)
        .execute(client);
    const transferReceipt = await transferTransaction.getReceipt(client);
    console.log(Transaction status: ${transferReceipt.status.toString()});
    const mintAmount = 500000;
    console.log(Minting ${mintAmount} tokens...);
    const mintTransaction = await new TokenMintTransaction()
        .setTokenId(tokenId)
        .setAmount(mintAmount)
        .execute(client);
    const mintReceipt = await mintTransaction.getReceipt(client);
    console.log(Minted ${mintAmount} tokens, status: ${mintReceipt.status});
    const recipients = [
        AccountId.fromString("<Recipient-1-Account-ID>"),
        AccountId.fromString("<Recipient-2-Account-ID>"),
        AccountId.fromString("<Recipient-3-Account-ID>")
    ];
    const distributeAmount = 100000;
    for (const recipient of recipients) {
        console.log(Distributing ${distributeAmount} tokens to ${recipient.toString()}...);
        const distributeTransaction = await new TokenTransferTransaction()
            .addTokenTransfer(tokenId, operatorId, -distributeAmount)
            .addTokenTransfer(tokenId, recipient, distributeAmount)
            .execute(client);
        const distributeReceipt = await distributeTransaction.getReceipt(client);
        console.log(Transferred ${distributeAmount} tokens to ${recipient.toString()}, status: ${distributeReceipt.status});
    }
    console.log("All operations completed successfully!");
}
main().catch((error) => {
    console.error("Error occurred:", error);
});