# SubQuery - Multichain Indexing Example Project

This Multichain Indexing project is an example that you can use as a starting point for developing your SubQuery multichain project.

## Preparation

#### Environment

- [Typescript](https://www.typescriptlang.org/) are required to compile project and define types.

- Both SubQuery CLI and generated Project have dependencies and require [Node](https://nodejs.org/en/).

#### Install the SubQuery CLI

Install SubQuery CLI globally on your terminal by using NPM:

```
npm install -g @subql/cli
```

Run help to see available commands and usage provide by CLI

```
subql help
```

## Clone the project

Inside the directory in which you want to create the SubQuery project, clone the project.

```
git clone https://github.com/seandotau/multichain-indexing-example.git
```

Then you should see a folder with your project name has been created inside the directory, you can use this as the start point of your project. And the files should be identical as in the [Directory Structure](https://doc.subquery.network/directory_structure.html).

## Install the dependencies

```
yarn install
```

## Configure your project

In this package, an simple example of a project configuration has been provided. You will be mainly working on the following files:

- The Manifest in `project.yaml`
- The GraphQL Schema in `schema.graphql`
- The Mapping functions in `src/mappings/` directory

For more information on how to write the SubQuery,
check out our doc section on [Define the SubQuery](https://doc.subquery.network/define_a_subquery.html)

#### Code generation

In order to index your SubQuery project, it is mandatory to build your project first.
Run this command under the project directory.

```
yarn codegen --file ./project-polkadot.yaml
```

## Build the project

In order to deploy your SubQuery project to our hosted service, it is mandatory to pack your configuration before upload.
Run pack command from root directory of your project will automatically generate a `your-project-name.tgz` file.

```
yarn build
```

## Indexing and Query

#### Run required systems in docker

Under the project directory run following command:

```
yarn start:docker
```

#### Query the project

Open your browser and head to `http://localhost:3000`.

Finally, you should see a GraphQL playground is showing in the explorer and the schemas that ready to query.

Sample graphql query:

```graphql
query {
  transfers(first:1 orderBy:BLOCK_NUMBER_ASC filter:{network:{equalTo:"polkadot"}}){
    totalCount
    nodes{
      id
      blockNumber
      txHash
      network
      fromId
      toId
      amount
    }
  }
}
```

Expected results:
```
{
  "data": {
    "transfers": {
      "totalCount": 4582,
      "nodes": [
        {
          "id": "polkadot-29258-7",
          "blockNumber": "29258",
          "txHash": "0xf72e34b18005c3544d368ede4ed8527a42cd396e0b1868c5bd07a1e317d888c5",
          "network": "polkadot",
          "fromId": "1mndd9E8kssCxXDacCbKw3iwFQwdABiFrE8fVRKS5SeS4E4",
          "toId": "16cfqPbPeCb3EBodv7Ma7CadZj4TWHegjiHJ8m3dVdGgKJk1",
          "amount": "40998150000000000"
        }
      ]
    }
  }
}
```

For Kusama:
```
query {
  transfers(first:1 orderBy:BLOCK_NUMBER_ASC filter:{network:{equalTo:"kusama"}}){
    totalCount
    nodes{
      id
      blockNumber
      txHash
      network
      fromId
      toId
      amount
    }
  }
}
```

Expected result:

```
{
  "data": {
    "transfers": {
      "totalCount": 1950,
      "nodes": [
        {
          "id": "kusama-9288-10",
          "blockNumber": "9288",
          "txHash": "0x1617a8e164ee5ab58169c867157d0bee0e5dc726162f7a3f3f027c5aaa019009",
          "network": "kusama",
          "fromId": "DcNNc4LAwFLZwRpejQyQNZfLqggkJPLF8H37Ariwe2s3dXE",
          "toId": "CdwnRdmqJivB75M4advhMUdxMAaWgoRPhYQiwfSRigw18gc",
          "amount": "1000000000000"
        }
      ]
    }
  }
}
```
NB: Both the Polkadot and Kusama endpoint may be restricted so an API key is recommended. A free one can be obtained from https://onfinality.io/.
