import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import OpenTimestamps from 'opentimestamps';
import { getPublicKey, finishEvent } from 'nostr-tools';
import { nip19 } from 'nostr-tools';

// Target file provided via command argument
const targetFile = process.argv[2];
if (!targetFile || !fs.existsSync(targetFile)) {
  console.error("❌ Target file missing or invalid.");
  process.exit(1);
}

const baseName = path.basename(targetFile);
const dirName = path.dirname(targetFile);
const otsPath = path.join(dirName, `${baseName}.ots`);
const jsonPath = path.join(dirName, `${baseName}.provenance.json`);

// 1. Resolve the Secret Key safely from GitHub Environment
let nsecEnv = process.env.NOSTR_NSEC;
if (!nsecEnv) {
  console.error("❌ NOSTR_NSEC environment variable is missing.");
  process.exit(1);
}
if (nsecEnv.startsWith('nsec')) {
  nsecEnv = nip19.decode(nsecEnv).data; // Converts nsec1... string to Uint8Array hex bytes
}
const privateKeyBytes = typeof nsecEnv === 'string' ? Buffer.from(nsecEnv, 'hex') : nsecEnv;

async function run() {
  const fileBuffer = fs.readFileSync(targetFile);
  const hashHex = crypto.createHash('sha256').update(fileBuffer).digest('hex');
  const hashBytes = crypto.createHash('sha256').update(fileBuffer).digest();

  // --- MODE A: UPGRADE EXISTING OTS ---
  if (fs.existsSync(otsPath)) {
    console.log(`⏳ Found existing proof. Attempting to query Bitcoin calendars to upgrade...`);
    try {
      const otsBytes = fs.readFileSync(otsPath);
      const detached = OpenTimestamps.DetachedTimestampFile.deserialize(otsBytes);
      
      const isUpgraded = await OpenTimestamps.upgrade(detached);
      const upgradedData = detached.serializeToBytes();

      if (isUpgraded || upgradedData.length > otsBytes.length) {
        fs.writeFileSync(otsPath, Buffer.from(upgradedData));
        console.log(`✅ Success! Bitcoin block confirmation found and merged into ${otsPath}`);
      } else {
        console.log(`ℹ️ Stamp is still pending confirmation or already fully upgraded. Checked calendars.`);
      }
    } catch (err) {
      console.error(`⚠️ Upgrade failed: ${err.message}`);
    }
    return;
  }

  // --- MODE B: INITIAL SEEDING (JSON & OTS GENERATION) ---
  console.log(`🚀 Starting initial stamping for ${baseName}...`);

  // 1. OpenTimestamps Detached Timestamp
  const detached = OpenTimestamps.DetachedTimestampFile.fromHash(new OpenTimestamps.Ops.OpSHA256(), hashBytes);
  await OpenTimestamps.stamp(detached);
  const fullOtsFile = detached.serializeToBytes();
  fs.writeFileSync(otsPath, Buffer.from(fullOtsFile));
  console.log(`📁 Generated temporary pending OTS: ${otsPath}`);

  // 2. Nostr Event Signing (Kind 1040)
  const unsignedEvent = {
    kind: 1040,
    created_at: Math.floor(Date.now() / 1000),
    tags: [['x', hashHex], ['filename', baseName]],
    content: "D-Trinity Proof of Provenance via GitHub Actions"
  };

  const signedEvent = finishEvent(unsignedEvent, privateKeyBytes);
  fs.writeFileSync(jsonPath, JSON.stringify(signedEvent, null, 2));
  console.log(`📁 Generated Signed Nostr Metadata: ${jsonPath}`);
}

run().catch(console.error);
