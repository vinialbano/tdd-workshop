import type { StartedDockerComposeEnvironment } from 'testcontainers';

declare global {
  var __TESTCONTAINERS__: StartedDockerComposeEnvironment;
} 