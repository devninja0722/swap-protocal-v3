import 'dotenv/config';
import 'solidity-coverage';
import '@tenderly/hardhat-tenderly';
import 'hardhat-deploy';
import 'hardhat-local-networks-config-plugin';
import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-etherscan';
import '@nomiclabs/hardhat-waffle';

import { task } from 'hardhat/config';
import { TASK_COMPILE } from 'hardhat/builtin-tasks/task-names';
import overrideQueryFunctions from './lib/scripts/plugins/overrideQueryFunctions';

task(TASK_COMPILE).setAction(overrideQueryFunctions);

task('seed', 'Add seed data').setAction(async (args, hre) => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const action = require('./lib/scripts/seeding/seedPools');
  await action(args, hre);
});

const CHAIN_IDS = {
  hardhat: 31337,
  kovan: 42,
  goerli: 5,
  mainnet: 1,
  rinkeby: 4,
  ropsten: 3,
  dockerParity: 17,
  bsctest: 97,
  cronos: 25,
  cronostest: 338,
};

const INFURA_KEY = process.env.INFURA_KEY || '';
const DEPLOYER_PRIVATE_KEY =
  process.env.DEPLOYER_PRIVATE_KEY || '0000000000000000000000000000000000000000000000000000000000000000';
const CONTROLLER_PRIVATE_KEY =
  process.env.CONTROLLER_PRIVATE_KEY || '0000000000000000000000000000000000000000000000000000000000000000';
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || '0000000000000000000000000000000000';
const BSCSCAN_API_KEY = process.env.BSCSCAN_API_KEY || '0000000000000000000000000000000000';
const CRONOSCAN_API_KEY = process.env.CRONOSCAN_API_KEY || '0000000000000000000000000000000000';

export default {
  networks: {
    hardhat: {
      chainId: CHAIN_IDS.hardhat,
      saveDeployments: true,
    },
    dockerParity: {
      gas: 10000000,
      live: false,
      chainId: CHAIN_IDS.dockerParity,
      url: 'http://localhost:8545',
      saveDeployments: true,
    },
    localhost: {
      saveDeployments: true,
    },
    mainnet: {
      chainId: CHAIN_IDS.mainnet,
      url: `https://mainnet.infura.io/v3/${INFURA_KEY}`,
      accounts: [`0x${DEPLOYER_PRIVATE_KEY}`, `0x${CONTROLLER_PRIVATE_KEY}`], // Using private key instead of mnemonic for vanity deploy
      saveDeployments: true,
    },
    ropsten: {
      chainId: CHAIN_IDS.ropsten,
      url: `https://ropsten.infura.io/v3/${INFURA_KEY}`,
      accounts: [`0x${DEPLOYER_PRIVATE_KEY}`, `0x${CONTROLLER_PRIVATE_KEY}`], // Using private key instead of mnemonic for vanity deploy
      saveDeployments: true,
    },
    kovan: {
      chainId: CHAIN_IDS.kovan,
      url: `https://kovan.infura.io/v3/${INFURA_KEY}`,
      accounts: [`0x${DEPLOYER_PRIVATE_KEY}`, `0x${CONTROLLER_PRIVATE_KEY}`], // Using private key instead of mnemonic for vanity deploy
      saveDeployments: true,
    },
    rinkeby: {
      chainId: CHAIN_IDS.rinkeby,
      url: `https://rinkeby.infura.io/v3/${INFURA_KEY}`,
      accounts: [`0x${DEPLOYER_PRIVATE_KEY}`, `0x${CONTROLLER_PRIVATE_KEY}`], // Using private key instead of mnemonic for vanity deploy
      saveDeployments: true,
    },
    goerli: {
      chainId: CHAIN_IDS.goerli,
      url: `https://goerli.infura.io/v3/${INFURA_KEY}`,
      accounts: [`0x${DEPLOYER_PRIVATE_KEY}`, `0x${CONTROLLER_PRIVATE_KEY}`], // Using private key instead of mnemonic for vanity deploy
      saveDeployments: true,
    },
    bsctest: {
      chainId: CHAIN_IDS.bsctest,
      gas: 20000000,
      gasPrice: 10000000000,
      url: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
      accounts: [`0x${DEPLOYER_PRIVATE_KEY}`, `0x${CONTROLLER_PRIVATE_KEY}`], // Using private key instead of mnemonic for vanity deploy
      saveDeployments: true,
    },
    cronos: {
      chainId: CHAIN_IDS.bsctest,
      gas: 20000000,
      gasPrice: 10000000000,
      url: 'https://evm.cronos.org/',
      accounts: [`0x${DEPLOYER_PRIVATE_KEY}`, `0x${CONTROLLER_PRIVATE_KEY}`], // Using private key instead of mnemonic for vanity deploy
      saveDeployments: true,
    },
    cronostest: {
      chainId: CHAIN_IDS.cronostest,
      gas: 20000000,
      gasPrice: 10000000000,
      url: 'https://evm-t3.cronos.org/',
      accounts: [`0x${DEPLOYER_PRIVATE_KEY}`, `0x${CONTROLLER_PRIVATE_KEY}`], // Using private key instead of mnemonic for vanity deploy
      saveDeployments: true,
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
      [CHAIN_IDS.mainnet]: 0,
      [CHAIN_IDS.kovan]: 0,
      [CHAIN_IDS.ropsten]: 0,
      [CHAIN_IDS.goerli]: 0,
      [CHAIN_IDS.rinkeby]: 0,
      [CHAIN_IDS.dockerParity]: 0,
      [CHAIN_IDS.bsctest]: 0,
      [CHAIN_IDS.cronos]: 0,
      [CHAIN_IDS.cronostest]: 0,
    },
    admin: {
      default: 1, // here this will by default take the first account as deployer
      // We use explicit chain IDs so that export-all works correctly: https://github.com/wighawag/hardhat-deploy#options-2
      [CHAIN_IDS.mainnet]: '0x10A19e7eE7d7F8a52822f6817de8ea18204F2e4f',
      [CHAIN_IDS.kovan]: 1,
      [CHAIN_IDS.ropsten]: 1,
      [CHAIN_IDS.goerli]: 1,
      [CHAIN_IDS.rinkeby]: '0x44DDF1D6292F36B25230a72aBdc7159D37d317Cf',
      [CHAIN_IDS.dockerParity]: 1,
      [CHAIN_IDS.bsctest]: '0x3A54802752fEFDc1aF2CD0b6DFA4F24694bDEE33',
      [CHAIN_IDS.cronos]: 1,
      [CHAIN_IDS.cronostest]: 1,
    },
  },
  solidity: {
    compilers: [
      {
        version: '0.7.1',
        settings: {
          optimizer: {
            enabled: true,
            runs: 9999,
          },
        },
      },
    ],
    overrides: {
      'contracts/vault/Vault.sol': {
        version: '0.7.1',
        settings: {
          optimizer: {
            enabled: true,
            runs: 1500,
          },
        },
      },
      'contracts/pools/weighted/WeightedPoolFactory.sol': {
        version: '0.7.1',
        settings: {
          optimizer: {
            enabled: true,
            runs: 800,
          },
        },
      },
    },
  },
  tenderly: {
    username: 'Smarty',
    project: 'cronaswap-v3',
  },
  etherscan: {
    apiKey: {
      mainnet: ETHERSCAN_API_KEY,
      ropsten: ETHERSCAN_API_KEY,
      rinkeby: ETHERSCAN_API_KEY,
      goerli: ETHERSCAN_API_KEY,
      kovan: ETHERSCAN_API_KEY,
      bsc: BSCSCAN_API_KEY,
      bscTestnet: BSCSCAN_API_KEY,
      cronos: CRONOSCAN_API_KEY,
      cronosTestnet: CRONOSCAN_API_KEY,
    },
  },
  paths: {
    deploy: 'deployments/migrations',
    deployments: 'deployments/artifacts',
  },
};
