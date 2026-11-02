import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import OpenTimestamps from 'opentimestamps';
import { finalizeEvent, verifyEvent } from 'nostr-tools/pure';
import { nip19 } from 'nostr-tools';

// Target file is the third argument: node script.js <targetFile>
const targetFile = process.argv[2];
if (!targetFile) {
  console.error("❌ Target file path argument missing.");
  process.exit(1);
}

const isCheckOnly = process.argv.includes('--check-only');

const baseName = path.basename(targetFile);
const dirName = path.dirname(targetFile);
const otsPath = path.join(dirName, `${baseName}.ots`);
const jsonPath = path.join(dirName, `${baseName}.provenance.json`);

// Pre-flight check: If files aren't compiled yet, we must fail validation to build them
if (!fs.existsSync(targetFile) || !fs.existsSync(otsPath) || !fs.existsSync(jsonPath)) {
  console.log("ℹ️ Core artifacts missing or incomplete. Signaling full compilation pipeline...");
  process.exit(2); 
}

async function verifyAuditPipeline() {
  try {
    const fileBuffer = fs.readFileSync(targetFile);
    const actualHash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

    // 1. Audit Pillar: Integrity (JSON Check)
    const cert = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    const expectedTag = cert.tags.find(t => t[0] === 'x');
    if (!expectedTag || actualHash !== expectedTag[1]) {
      throw new Error("Integrity mismatch: PDF hash does not match Nostr metadata value.");
    }

    // 2. Audit Pillar: Identity (Nostr Cryptography Check)
    const isSigValid = verifyEvent(cert);
    if (!isSigValid) {
      throw new Error("Identity failure: Schnorr signature on JSON certificate is invalid.");
    }

    // 3. Audit Pillar: Timechain Matrix Structure
    const otsBytes = fs.readFileSync(otsPath);
    const detached = OpenTimestamps.DetachedTimestampFile.deserialize(otsBytes);
    const otsHashHex = Buffer.from(detached.timestamp.msg).toString('hex');
    if (actualHash !== otsHashHex) {
      throw new Error("Time mismatch: Inner OpenTimestamps payload footprint altered.");
    }

    console.log("✅ CRITICAL AUDIT PASSED: Integrity, Identity, and Time signatures are fully synchronized.");
    return true;
  } catch (auditError) {
    console.log(`⚠️ AUDIT FAILED: ${auditError.message}`);
    return false;
  }
}

async function run() {
  if (isCheckOnly) {
    const passed = await verifyAuditPipeline();
    process.exit(passed ? 0 : 2); 
  }

  // --- STANDARD GENERATION MODE ---
  let nsecEnv = process.env.NOSTR_NSEC;
  if (!nsecEnv) {
    console.error("❌ NOSTR_NSEC environment variable is missing.");
    process.exit(1);
  }

  let privateKeyBytes = nsecEnv.startsWith('nsec') ? nip19.decode(nsecEnv).data : Buffer.from(nsecEnv, 'hex');
  const fileBuffer = fs.readFileSync(targetFile);
  const hashHex = crypto.createHash('sha256').update(fileBuffer).digest('hex');
  const hashBytes = crypto.createHash('sha256').update(fileBuffer).digest();

  // Generate updated Nostr Event Signature (Kind 1040)
  console.log(`🚀 Updating Nostr Provenance Signature for latest build of ${baseName}...`);
  const unsignedEvent = {
    kind: 1040,
    created_at: Math.floor(Date.now() / 1000),
    tags: [['x', hashHex], ['filename', baseName]],
    content: "D-Trinity Proof of Provenance via GitHub Actions"
  };

  const signedEvent = finalizeEvent(unsignedEvent, privateKeyBytes);
  fs.writeFileSync(jsonPath, JSON.stringify(signedEvent, null, 2));
  console.log(`📁 Validated Nostr JSON Profile written to: ${jsonPath}`);

  // Perform OpenTimestamps synchronization
  if (fs.existsSync(otsPath)) {
    console.log(`⏳ Querying OpenTimestamps calendars for confirmations...`);
    try {
      const otsBytes = fs.readFileSync(otsPath);
      const detachedFile = OpenTimestamps.DetachedTimestampFile.deserialize(otsBytes);
      const isUpgraded = await OpenTimestamps.upgrade(detachedFile);
      const upgradedData = detachedFile.serializeToBytes();
      fs.writeFileSync(otsPath, Buffer.from(upgradedData));
      console.log(isUpgraded ? `✅ Bitcoin confirmation appended successfully.` : `ℹ️ Proof status unchanged.`);
    } catch (err) {
      console.error(`⚠️ OTS synchronization error: ${err.message}`);
    }
  } else {
    console.log(`🚀 Forging baseline OpenTimestamps envelope entry...`);
    const detachedFile = OpenTimestamps.DetachedTimestampFile.fromHash(new OpenTimestamps.Ops.OpSHA256(), hashBytes);
    await OpenTimestamps.stamp(detachedFile);
    fs.writeFileSync(otsPath, Buffer.from(detachedFile.serializeToBytes()));
    console.log(`📁 Fresh pending OTS stamp safely written to disk.`);
  }
}

run().catch(err => { console.error(err); process.exit(1); });
