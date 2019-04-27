/* eslint-disable global-require */
jest.mock('fs');
jest.mock('dockerode');
jest.mock('../src/modules/options.js');
jest.mock('../src/modules/docker.js');

beforeEach(() => jest.resetModules());

describe('backup', () => {
  it('should backup all containers if called without any', async () => {
    const options = require('../src/modules/options');
    options.containers = [];
    const docker = require('../src/modules/docker');
    const main = require('../src/main');

    await main();
    expect(docker.getContainers).toHaveBeenCalledTimes(1);
    expect(docker.backupContainer).toHaveBeenCalledTimes(3);
    expect(docker.backupContainer).toHaveBeenLastCalledWith(8);
  });

  it('should backup the given container', async () => {
    const options = require('../src/modules/options');
    options.containers = ['pear'];
    const docker = require('../src/modules/docker');
    const main = require('../src/main');

    await main();
    expect(docker.getContainers).toHaveBeenCalledTimes(0);
    expect(docker.backupContainer).toHaveBeenCalledTimes(1);
    expect(docker.backupContainer).toHaveBeenLastCalledWith('pear');
  });
});

describe('restore', () => {
  it('should restore all containers if called without any', async () => {
    const fs = require('fs');
    const options = require('../src/modules/options');
    options.operation = 'restore';
    options.containers = [];
    const docker = require('../src/modules/docker');
    const main = require('../src/main');

    await main();
    expect(fs.readdir).toHaveBeenCalledTimes(1);
    expect(fs.readdir).toHaveBeenCalledWith('/folder/containers', expect.any(Function));
    expect(docker.restoreContainer).toHaveBeenCalledTimes(3);
    expect(docker.restoreContainer).toHaveBeenLastCalledWith('c');
  });

  it('should restore the given container', async () => {
    const fs = require('fs');
    const options = require('../src/modules/options');
    options.operation = 'restore';
    options.containers = ['mango'];
    const docker = require('../src/modules/docker');
    const main = require('../src/main');

    await main();
    expect(fs.readdir).toHaveBeenCalledTimes(0);
    expect(docker.restoreContainer).toHaveBeenCalledTimes(1);
    expect(docker.restoreContainer).toHaveBeenLastCalledWith('mango');
  });
});