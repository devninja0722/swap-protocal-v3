import { HardhatRuntimeEnvironment } from 'hardhat/types';

export default async function (hre: HardhatRuntimeEnvironment): Promise<void> {
  const { deployments, getNamedAccounts, tenderly } = hre;
  const { deploy } = deployments;

  const { deployer } = await getNamedAccounts();

  const vault = await deployments.get('Vault');

  const weightedFactory = await deploy('WeightedPoolFactory', {
    from: deployer,
    args: [vault.address],
    log: true,
  });

  const stableFactory = await deploy('StablePoolFactory', {
    from: deployer,
    args: [vault.address],
    log: true,
  });

  try {
    if (hre.network.live && weightedFactory.newlyDeployed) {
      await hre.run('verify:verify', {
        address: weightedFactory.address,
        constructorArguments: [vault.address],
      });

      await tenderly.push({
        name: 'WeightedPoolFactory',
        address: weightedFactory.address,
      });
    }

    if (hre.network.live && stableFactory.newlyDeployed) {
      await hre.run('verify:verify', {
        address: stableFactory.address,
        constructorArguments: [vault.address],
      });

      await tenderly.push({
        name: 'StablePoolFactory',
        address: stableFactory.address,
      });
    }
  } catch (e) {
    console.log(e);
  }
}
