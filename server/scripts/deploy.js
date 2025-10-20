#!/usr/bin/env node

import { execSync } from 'child_process';
import { logger } from '../src/logger.js';

async function deploy() {
  try {
    logger.info('Starting deployment process...');
    
    // Generate Prisma client
    logger.info('Generating Prisma client...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    
    // Push database schema
    logger.info('Pushing database schema...');
    execSync('npx prisma db push', { stdio: 'inherit' });
    
    logger.info('Deployment process completed successfully!');
  } catch (error) {
    logger.error('Deployment failed:', error);
    process.exit(1);
  }
}

deploy();
