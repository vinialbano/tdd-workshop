import { resolve } from 'node:path';
import { DockerComposeEnvironment, Wait } from 'testcontainers';

async function globalSetup(): Promise<void> {
  console.log('Starting docker-compose services with Testcontainers...');
  
  const composeFilePath = resolve(__dirname, '../..');
  const baseComposeFile = 'docker-compose.base.yml';
  const testComposeFile = 'docker-compose.test.yml';

  const environment = await new DockerComposeEnvironment(composeFilePath, [baseComposeFile, testComposeFile])
    .withWaitStrategy('postgres', Wait.forHealthCheck())
    .withWaitStrategy('api', Wait.forHealthCheck())
    .withWaitStrategy('web', Wait.forHealthCheck())
    .up();

  global.__TESTCONTAINERS__ = environment;
}

export default globalSetup; 