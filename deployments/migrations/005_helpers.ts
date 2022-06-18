import { HardhatRuntimeEnvironment } from 'hardhat/types';

export default async function (hre: HardhatRuntimeEnvironment): Promise<void> {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;

  const { deployer } = await getNamedAccounts();

  const vault = await deployments.get('Vault');

  const balancerHelpers = await deploy('BalancerHelpers', {
    from: deployer,
    args: [vault.address],
    log: true,
  });

  try {
    if (hre.network.live && balancerHelpers.newlyDeployed) {
      await hre.run('verify:verify', {
        address: balancerHelpers.address,
        constructorArguments: [vault.address],
      });
    }
  } catch (e) {
    console.log(e);
  }
}
