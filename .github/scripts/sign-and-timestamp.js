import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import OpenTimestamps from 'opentimestamps';
import { finalizeEvent } from 'nostr-tools/pure';
import { nip19 } from 'nostr-tools';

const targetFile = process.argv[2];
if (!targetFile || !fs.existsSync(targetFile)) {
  console.error("❌ Target file missing or invalid.");
  process.exit(1);
}

const baseName = path.basename(targetFile);
const dirName = path.dirname(targetFile);
const otsPath = path.join(dirName, `${baseName}.ots`);
const jsonPath = path.join(dirName, `${baseName}.provenance.json`);

let nsecEnv = process.env.NOSTR_NSEC;
if (!nsecEnv) {
  console.error("❌ NOSTR_NSEC environment variable is missing.");
  process.exit(1);
}

let privateKeyBytes;
if (nsecEnv.startsWith('nsec')) {
  privateKeyBytes = nip19.decode(nsecEnv).data;
} else {
  privateKeyBytes = Buffer.from(nsecEnv, 'hex');
}

async function run() {
  const fileBuffer = fs.readFileSync(targetFile);
  const hashHex = crypto.createHash('sha256').update(fileBuffer).digest('hex');
  const hashBytes = crypto.createHash('sha256').update(fileBuffer).digest();

  // 1. ALWAYS RE-GENERATE NOSTR SIGNATURE WITH CURRENT HASH (Fixes your issue)
  console.log(`🚀 Updating Nostr Provenance Signature for latest build of ${baseName}...`);
  const unsignedEvent = {
    kind: 1040,
    created_at: Math.floor(Date.now() / 1000),
    tags: [['x', hashHex], ['filename', baseName]],
    content: "D-Trinity Proof of Provenance via GitHub Actions"
  };

  const signedEvent = finalizeEvent(unsignedEvent, privateKeyBytes);
  fs.writeFileSync(jsonPath, JSON.stringify(signedEvent, null, 2));
  console.log(`📁 Generated New Signed Nostr Metadata: ${jsonPath}`);

  // 2. LOGICAL FORK FOR OPENTIMESTAMPS ENGINES
  if (fs.existsSync(otsPath)) {
    console.log(`⏳ Found existing proof. Querying Bitcoin calendars to upgrade...`);
    try {
      const otsBytes = fs.readFileSync(otsPath);
      const detached = OpenTimestamps.DetachedTimestampFile.deserialize(otsBytes);
      
      const isUpgraded = await OpenTimestamps.upgrade(detached);
      const upgradedData = detached.serializeToBytes();

      if (isUpgraded || upgradedData.length > otsBytes.length) {
        fs.writeFileSync(otsPath, Buffer.from(upgradedData));
        console.log(`✅ Success! Bitcoin block confirmation found and merged into ${otsPath}`);
      } else {
        console.log(`ℹ️ Stamp is still pending confirmation or already fully upgraded.`);
      }
    } catch (err) {
      console.error(`⚠️ Upgrade failed: ${err.message}`);
    }
  } else {
    // ONLY INITIAL SEED IF NO OTS LOG HAS EVER BEEN RECORDED
    console.log(`🚀 Seeding initial OpenTimestamps record for ${baseName}...`);
    const detached = OpenTimestamps.DetachedTimestampFile.fromHash(new OpenTimestamps.Ops.OpSHA256(), hashBytes);
    await OpenTimestamps.stamp(detached);
    const fullOtsFile = detached.serializeToBytes();
    fs.writeFileSync(otsPath, Buffer.from(fullOtsFile));
    console.log(`📁 Generated temporary pending OTS: ${otsPath}`);
  }
}

run().catch(console.error);
