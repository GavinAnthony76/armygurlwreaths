import './config/env.js'; // validate env first
import { createApp } from './index.js';
import { env } from './config/env.js';

const app = createApp();

app.listen(env.PORT, () => {
  console.log(`🚀 ArmyGurlWreaths API running on http://localhost:${env.PORT}`);
  console.log(`   Environment: ${env.NODE_ENV}`);
});
