import { HardhatRuntimeEnvironment } from 'hardhat/types';

export default async function (hre: HardhatRuntimeEnvironment): Promise<void> {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;

  const { deployer, admin } = await getNamedAccounts();

  const authorizer = await deploy('Authorizer', {
    from: deployer,
    args: [admin],
    log: true,
  });

  try {
    if (hre.network.live && authorizer.newlyDeployed) {
      await hre.run('verify:verify', {
        address: authorizer.address,
        constructorArguments: [admin],
      });
    }
  } catch (e) {
    console.log(e);
  }
}
