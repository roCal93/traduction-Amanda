## Summary

- Implements identity alignment (N→N) on hover and click for the `TranslationBlock` component.
- Removes the legacy `alignmentMapping` field from schemas and docs.
- Adds unit tests for the identity behavior and updates docs.
- Removes duplicate test from the block library (keeps single canonical test in the client package).
- Switches Vitest environment to `happy-dom` to avoid jsdom ESM/require issues in most environments.
- Proposes `pnpm.overrides` pins for `html-encoding-sniffer`, `parse5` and `@exodus/bytes` to restore CommonJS-compatible versions where necessary.

## Rationale
Some transitive dependencies (parse5, html-encoding-sniffer, @exodus/bytes) have moved to ESM-only entry points which cause `ERR_REQUIRE_ESM` inside Vitest worker forks in environments that still use CommonJS require. The PR attempts to mitigate by:

- Using `happy-dom` for test environment (less dependent on jsdom internals), and
- Suggesting pinned package versions via `pnpm.overrides` so that CI and local installs select compatible versions.

If the maintainers prefer, we can instead upgrade pipeline to run tests in an ESM-friendly environment or update the dependency chain.

## Notes for reviewers / CI checklist
- Run `pnpm install` then `pnpm test` locally and in CI.
- Verify the new tests in `src/components/blocks/__tests__/TranslationBlock.identity.test.tsx` and the docs in `docs/translation-block.md`.
- If CI fails with ERR_REQUIRE_ESM, consider: pinning/downgrading jsdom/parse5/html-encoding-sniffer/@exodus/bytes or upgrading Node/Vitest to handle ESM interop in forks.

## Files changed
- `nextjs-base/src/components/blocks/TranslationBlock.tsx` (behavior)
- `nextjs-base/src/components/blocks/__tests__/TranslationBlock.identity.test.tsx` (tests)
- `docs/translation-block.md` (docs)
- `nextjs-base/vitest.config.ts` (test env)
- `nextjs-base/package.json` (pnpm.overrides proposal)

---

If you want, I can also:
- Try to pin exact package versions and verify that `pnpm install && pnpm test` passes in CI (optionally in a temporary branch), or
- Revert the `pnpm.overrides` and instead update CI Node/Vitest configuration to ESM mode.
