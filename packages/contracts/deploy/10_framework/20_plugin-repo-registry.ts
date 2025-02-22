import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';

import {getContractAddress} from '../helpers';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployments, getNamedAccounts} = hre;
  const {deploy} = deployments;
  const {deployer} = await getNamedAccounts();

  // Get managing DAO address.
  const managingDAOAddress = await getContractAddress('DAO', hre);

  // Get DAO's `ENSSubdomainRegistrar` address.
  const ensSubdomainRegistrarAddress = await getContractAddress(
    'Plugin_ENSSubdomainRegistrar',
    hre
  );

  await deploy('PluginRepoRegistry', {
    from: deployer,
    args: [],
    log: true,
    proxy: {
      owner: deployer,
      proxyContract: 'ERC1967Proxy',
      proxyArgs: ['{implementation}', '{data}'],
      execute: {
        init: {
          methodName: 'initialize',
          args: [managingDAOAddress, ensSubdomainRegistrarAddress],
        },
      },
    },
  });
};
export default func;
// func.runAtTheEnd = true;
func.tags = ['PluginRepoRegistry'];
