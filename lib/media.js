// Newsletter covers + news lead photos stored in Neon (table media, db/newsletters.sql §7) and served at /media/<key>.jpg.
// Keys are versioned with a short content hash (issue-9-og-1a2b3c4d), so a key's bytes never change → immutable cache.
// bytea goes through base64 in SQL so it works the same over the Neon HTTP driver.
export const MEDIA_KEY = /^[a-z0-9][a-z0-9-]{2,90}$/;
export const MAX_MEDIA_BYTES = 400 * 1024;
export const isJpeg = (buf) => buf && buf.length > 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff;
export const mediaPath = (key) => `/media/${key}.jpg`;

export async function getMedia(s, key) {
  const rows = await s.query(`select content_type, encode(bytes, 'base64') as b64 from media where key = $1 limit 1`, [key]);
  if (!rows.length) return null;
  return { contentType: rows[0].content_type, bytes: Buffer.from(rows[0].b64, "base64") };
}

// → { key, path, bytes }. Same key again = same content (hash in the key), so it just refreshes the metadata.
export async function putMedia(s, { key, bytes, width = null, height = null, credit = null, licence = null }) {
  const b64 = Buffer.from(bytes).toString("base64");
  await s.query(
    `insert into media (key, content_type, bytes, width, height, credit, licence)
     values ($1, 'image/jpeg', decode($2, 'base64'), $3, $4, $5, $6)
     on conflict (key) do update set bytes = excluded.bytes, width = excluded.width, height = excluded.height,
       credit = excluded.credit, licence = excluded.licence`,
    [key, b64, width, height, credit, licence]);
  return { key, path: mediaPath(key), bytes: bytes.length };
}
