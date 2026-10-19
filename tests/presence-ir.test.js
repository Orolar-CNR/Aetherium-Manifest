import fs from 'fs';
import path from 'path';
import assert from 'assert';
import {
  parseAndClampCandidateVector,
  evaluateMinimalGovernorA,
  encapsulatePresenceIR,
  isValidUint64String
} from '../runtime/presence-ir.js';

console.log('Starting Phase 1 Presence IR & Minimal Governor A Conformance Tests...\n');

// Load Fixture Collection (F-01 through F-10)
const fixturePath = path.resolve('tests/fixtures/presence-ir-fixtures.json');
const fixtureData = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));
const fixtures = fixtureData.fixtures;

assert.strictEqual(fixtures.length, 10, 'Must have exactly 10 golden fixtures (F-01 through F-10)');

fixtures.forEach((fix) => {
  console.log(`Testing Fixture ${fix.id}: ${fix.name}...`);

  const result = evaluateMinimalGovernorA(fix.candidate);

  assert.strictEqual(result.status, fix.expected_status, `[${fix.id}] Status mismatch`);
  assert.strictEqual(result.action, fix.expected_action, `[${fix.id}] Action mismatch`);

  if (fix.expected_status === 'ACCEPTED') {
    assert.strictEqual(result.isClamped, fix.expected_clamped, `[${fix.id}] Clamped flag mismatch`);
    assert.deepStrictEqual(result.vector, fix.expected_vector, `[${fix.id}] Vector mismatch`);

    // Step 3: Encapsulate envelope and test transport schema rules
    const traceOpts = fix.trace_options || {};
    const envelope = encapsulatePresenceIR(result, traceOpts);

    assert.strictEqual(envelope.ir_version, '0.1.0', `[${fix.id}] IR version must be 0.1.0`);
    assert.ok(isValidUint64String(envelope.tick), `[${fix.id}] tick must be valid uint64 decimal string`);
    assert.ok(isValidUint64String(envelope.state_version), `[${fix.id}] state_version must be valid uint64 decimal string`);
    assert.ok(isValidUint64String(envelope.timestamp_ns), `[${fix.id}] timestamp_ns must be valid uint64 decimal string`);

    if (traceOpts.parent_trace_id) {
      assert.strictEqual(envelope.parent_trace_id, traceOpts.parent_trace_id, `[${fix.id}] Single-parent lineage trace ID mismatch`);
    } else {
      assert.strictEqual(envelope.parent_trace_id, null, `[${fix.id}] Root trace parent_trace_id must be null`);
    }

    assert.strictEqual(typeof envelope.integrity_hash, 'string', `[${fix.id}] Integrity hash string required`);
    assert.ok(envelope.integrity_hash.length > 0, `[${fix.id}] Integrity hash must not be empty`);
  } else {
    // Rejected candidates cannot be encapsulated
    assert.throws(
      () => encapsulatePresenceIR(result),
      /Cannot encapsulate unaccepted or rejected governance result/,
      `[${fix.id}] Rejected result encapsulation must throw`
    );
  }

  console.log(`✅ Fixture ${fix.id} passed (${result.action})`);
});

console.log('\nTesting Transport & Lineage Rejection Edge Cases...');

// Edge case 1: Raw JSON numeric literal for uint64 tick
assert.strictEqual(isValidUint64String(100), false, 'Raw numbers for uint64 must be rejected');
assert.strictEqual(isValidUint64String('-1'), false, 'Negative uint64 strings must be rejected');
assert.strictEqual(isValidUint64String('1.5'), false, 'Fractional uint64 strings must be rejected');
assert.strictEqual(isValidUint64String('1e10'), false, 'Exponent uint64 strings must be rejected');
assert.strictEqual(isValidUint64String('0'), true, 'Zero uint64 string accepted');
assert.strictEqual(isValidUint64String('18446744073709551615'), true, 'Max uint64 string accepted');

// Edge case 2: Invalid parent_trace_id type (e.g., array representing multi-parent lineage in v0.1)
assert.throws(
  () => encapsulatePresenceIR({ status: 'ACCEPTED', vector: fixtures[0].expected_vector, isClamped: false }, { parent_trace_id: ['parent-1', 'parent-2'] }),
  /parent_trace_id must be a string or null/,
  'Multi-parent array in parent_trace_id must be rejected in v0.1'
);

console.log('✅ Transport & Lineage Edge Cases passed');
console.log('\nAll 10 Presence IR Fixture Conformance Tests Passed Successfully! 🎉');
