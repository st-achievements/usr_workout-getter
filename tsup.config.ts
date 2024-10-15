import { tsupConfig } from '@st-api/config';
import { defineConfig } from 'tsup';

export default defineConfig({
  ...tsupConfig,
  dts: false,
  experimentalDts: false,
  external: ['vitest'],
  plugins: tsupConfig.plugins?.filter((plugin) => plugin.name !== 'dts-fix'),
});
