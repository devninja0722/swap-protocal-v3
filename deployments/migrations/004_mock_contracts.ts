import { HardhatRuntimeEnvironment } from 'hardhat/types';

export default async function (hre: HardhatRuntimeEnvironment): Promise<void> {
  const { deployments, getChainId, getNamedAccounts } = hre;
  const { deploy } = deployments;

  const { deployer } = await getNamedAccounts();

  const chainId = await getChainId();

  const vault = await deployments.get('Vault');

  if (chainId == '97' || chainId == '338') {
    const mockContract = await deploy('MockFlashLoanRecipient', {
      from: deployer,
      args: [vault.address],
      log: true,
    });

    try {
      if (hre.network.live && mockContract.newlyDeployed) {
        await hre.run('verify:verify', {
          address: mockContract.address,
          constructorArguments: [vault.address],
        });
      }
    } catch (e) {
      console.log(e);
    }
  }
}
