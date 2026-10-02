import { existsSync } from 'node:fs';
import type { PlaywrightTestConfig } from '@playwright/test';
const config: PlaywrightTestConfig = {
 testDir:'./e2e', timeout:240000, workers:1,
 use:{viewport:{width:1920,height:1080},baseURL:'http://127.0.0.1:4187',channel:process.env.PLAYWRIGHT_CHANNEL || (existsSync('/Applications/Google Chrome.app') ? 'chrome' : undefined)},
 webServer:{command:'npm run preview -- --port 4187',url:'http://127.0.0.1:4187',reuseExistingServer:false,timeout:120000},
};
export default config;
