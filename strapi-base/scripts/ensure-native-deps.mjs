import { existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

if (process.env.SKIP_ENSURE_NATIVE_DEPS === '1') {
    process.exit(0);
}

// This is primarily to protect Linux CI/container builds where the install step
// can be cached (e.g. Railpack) and optional native deps were previously omitted.
if (process.platform !== 'linux') {
    process.exit(0);
}

const arch = process.arch;
const hasPnpmLock = existsSync(new URL('../pnpm-lock.yaml', import.meta.url));

function run(cmd, extraEnv = {}) {
    execSync(cmd, {
        stdio: 'inherit',
        env: {
            ...process.env,
            ...extraEnv,
        },
    });
}

function isMusl() {
    try {
        const report = process.report?.getReport?.();
        const glibc = report?.header?.glibcVersionRuntime;
        return !glibc;
    } catch {
        return false;
    }
}

const musl = isMusl();

// Map to the most common native packages used by Strapi's admin tooling.
// Rollup:
const rollupPackage =
    arch === 'x64'
        ? (musl ? '@rollup/rollup-linux-x64-musl' : '@rollup/rollup-linux-x64-gnu')
        : arch === 'arm64'
            ? (musl ? '@rollup/rollup-linux-arm64-musl' : '@rollup/rollup-linux-arm64-gnu')
            : null;

// SWC:
const swcPackage =
    arch === 'x64'
        ? (musl ? '@swc/core-linux-x64-musl' : '@swc/core-linux-x64-gnu')
        : arch === 'arm64'
            ? (musl ? '@swc/core-linux-arm64-musl' : '@swc/core-linux-arm64-gnu')
            : null;

function isModulePresent(pkgName) {
    if (!pkgName) return true;
    try {
        require.resolve(pkgName);
        return true;
    } catch {
        return false;
    }
}

// Fallback for cases where require.resolve isn't reliable due to partial installs.
function isPackageDirPresent(pkgName) {
    if (!pkgName) return true;
    const path = new URL(`../node_modules/${pkgName}/package.json`, import.meta.url);
    return existsSync(path);
}

const missing = [];
if (!isModulePresent(rollupPackage) && !isPackageDirPresent(rollupPackage)) missing.push(rollupPackage);
if (!isModulePresent(swcPackage) && !isPackageDirPresent(swcPackage)) missing.push(swcPackage);

if (missing.length === 0) {
    process.exit(0);
}

console.log(`[ensure-native-deps] Missing native optional deps on linux/${arch}: ${missing.join(', ')}`);
const baseEnv = {
    // Ensure optional deps are not omitted.
    NPM_CONFIG_OPTIONAL: 'true',
};

if (hasPnpmLock) {
    console.log('[ensure-native-deps] Running pnpm install to repair optional native deps...');
    run('pnpm install --no-frozen-lockfile --prefer-offline', baseEnv);
} else {
    console.log('[ensure-native-deps] Running npm install to repair optional native deps...');
    run('npm install --no-audit --no-fund', baseEnv);
}

const stillMissing = [];
if (!isModulePresent(rollupPackage) && !isPackageDirPresent(rollupPackage)) stillMissing.push(rollupPackage);
if (!isModulePresent(swcPackage) && !isPackageDirPresent(swcPackage)) stillMissing.push(swcPackage);

if (stillMissing.length === 0) {
    process.exit(0);
}

// Some CI/container caches keep optional deps missing after a regular install.
// Retry once with a forced reinstall using the same package manager.
if (hasPnpmLock) {
    console.log('[ensure-native-deps] Retrying with pnpm install --force...');
    run('pnpm install --force --no-frozen-lockfile --prefer-offline', baseEnv);
} else {
    console.log('[ensure-native-deps] Retrying with npm install --force...');
    run('npm install --force --no-audit --no-fund', baseEnv);
}

const finalMissing = [];
if (!isModulePresent(rollupPackage) && !isPackageDirPresent(rollupPackage)) finalMissing.push(rollupPackage);
if (!isModulePresent(swcPackage) && !isPackageDirPresent(swcPackage)) finalMissing.push(swcPackage);

if (finalMissing.length > 0) {
    console.error(`[ensure-native-deps] Still missing after repair: ${finalMissing.join(', ')}`);
    process.exit(1);
}
