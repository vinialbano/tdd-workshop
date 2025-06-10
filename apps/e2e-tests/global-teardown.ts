async function globalTeardown(): Promise<void> {
  console.log('Stopping docker-compose services with Testcontainers...');
  
  if (global.__TESTCONTAINERS__) {
    await global.__TESTCONTAINERS__.down();
  }
}

export default globalTeardown; 