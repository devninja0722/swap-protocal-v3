import { HardhatRuntimeEnvironment } from 'hardhat/types';

export default async function (hre: HardhatRuntimeEnvironment): Promise<void> {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;

  const { deployer } = await getNamedAccounts();

  // Deploy on mainnet to keep nonces synced
  const factory = await deploy('TokenFactory', {
    from: deployer,
    log: true,
  });

  const weth = await deploy('WETH', {
    from: deployer,
    args: [deployer],
    log: true,
  });

  const multicall = await deploy('Multicall', {
    from: deployer,
    log: true,
  });

  try {
    if (hre.network.live && factory.newlyDeployed) {
      await hre.run('verify:verify', {
        address: factory.address,
      });
    }

    if (hre.network.live && weth.newlyDeployed) {
      await hre.run('verify:verify', {
        address: weth.address,
        constructorArguments: [deployer],
      });
    }

    if (hre.network.live && multicall.newlyDeployed) {
      await hre.run('verify:verify', {
        address: multicall.address,
      });
    }
  } catch (e) {
    console.log(e);
  }
}
