function generateResult(result) {
  return new Promise(function (resolve) {
    setTimeout(() => {
      resolve(result)
    }, 300);
  });
}

export const APICall = {
  getUseRandomrCode: async (address) => {
    return generateResult({
      "id": 4,
      "randomCode": "1b29611a-178d-4a71-b045-d88ce0e6c209"
    });
  },
  fetchALlCollection: async () => {
    return generateResult(
      [
        {
          "id": 1,
          "address": "6c6rcff170b5bff774-QCDDS",
          "name": "Simple Collection",
          "description": "Simple Collection Description",
          "image": "https://placehold.it/300x300?text=Simple+Collection",
          "network": "kusama",
          "networkType": "substrate",
          "networkName": "Kusama",
          "createdAt": "2023-07-12T12:06:27.774Z",
          "updatedAt": "2023-07-12T12:06:27.774Z",
          "campaigns": [
            {
              "id": 1,
              "collectionId": 1,
              "name": "Campaign 01",
              "description": "Campaign 01",
              "image": "https://placehold.it/300x300?text=Campaign+01",
              "startTime": "2023-01-01T00:00:00.000Z",
              "endTime": "2023-12-31T00:00:00.000Z",
              "type": "free",
              "createdAt": "2023-07-12T12:06:27.781Z",
              "updatedAt": "2023-07-12T12:06:27.781Z"
            }
          ]
        }
      ]
    );
  },
  fetchMintedNft: async (address) => {
    return generateResult(
      [
        {
          "id": 2,
          "campaignId": 1,
          "collectionId": 1,
          "userId": 4,
          "address": "5ENp8Z2pquNyiPpRa59ihAeb5a871G3REMhn27Rzwp4P84SL",
          "status": "success",
          "balanceData": null,
          "mintDate": null,
          "nftId": "0x0000000",
          "nftName": "NFT Name",
          "nftImage": "https://placehold.it/300x300?text=NFT+Image",
          "receiver": "5ENp8Z2pquNyiPpRa59ihAeb5a871G3REMhn27Rzwp4P84SL",
          "createdAt": "2023-07-12T12:38:31.144Z",
          "updatedAt": "2023-07-12T13:26:53.727Z"
        }
      ]
    );
  },
  mintCheck: async ({address, userId, signature, campaignId}) => {
    return generateResult(
      {
        "requestId": null,
        "validUser": false,
        "validCampaign": false,
        "isOwner": true,
        "hasBalance": true,
        "notDuplicated": false
      }
    );
  },
  mintSubmit: async ({receiver, requestId}) => {
    return generateResult(
      {
        "id": 2,
        "campaignId": 1,
        "collectionId": 1,
        "userId": 4,
        "address": "5ENp8Z2pquNyiPpRa59ihAeb5a871G3REMhn27Rzwp4P84SL",
        "status": "success",
        "balanceData": null,
        "mintDate": null,
        "nftId": "0x0000000",
        "nftName": "NFT Name",
        "nftImage": "https://placehold.it/300x300?text=NFT+Image",
        "receiver": "5ENp8Z2pquNyiPpRa59ihAeb5a871G3REMhn27Rzwp4P84SL",
        "createdAt": "2023-07-12T12:38:31.144Z",
        "updatedAt": "2023-07-12T13:26:53.727Z"
      }
    );
  },
};
