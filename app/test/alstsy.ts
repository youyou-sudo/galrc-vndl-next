import { db } from "@/lib/kysely";

export const GET = async () => {
  const alistData = await db
    .selectFrom("galrc_search_nodes")
    .select(["name"]) // 只选 name 字段
    .execute();

  const results: { vid?: string; other?: string; id: string }[] = [];

  // 正则表达式匹配 vndb、other 的 ID
  const idPattern = /\[(vndb-(v\d+)|other-(\w+))\]/g;

  for (const item of alistData) {
    const matches = item.name.matchAll(idPattern);

    const record: { vid?: string; other?: string } = {};

    for (const match of matches) {
      if (match[2]) record.vid = match[2]; // vndb-vxxx
      if (match[3]) record.other = match[3]; // other-xxx
    }

    // 只收集至少有一个字段的项
    if (Object.keys(record).length > 0) {
      // 拼接 id 字段
      let id = "";
      if (record.vid && record.other) {
        id = `${record.vid}-${record.other}`;
      } else if (record.vid) {
        id = record.vid;
      } else if (record.other) {
        id = record.other;
      }
      results.push({ ...record, id });
    }
  }

  // 使用 Map 根据 vid 去重（优先保留第一个出现的）
  const dedupedMap = new Map<
    string,
    { vid?: string; other?: string; id: string }
  >();
  for (const item of results) {
    const key = item.vid || crypto.randomUUID(); // 没有 vid 时使用 UUID 防止被覆盖
    if (!dedupedMap.has(key)) {
      dedupedMap.set(key, item);
    }
  }

  const dedupedResults = Array.from(dedupedMap.values());

  await db.transaction().execute(async (trx) => {
    await trx.deleteFrom("galrc_alistb").execute();
    await trx.insertInto("galrc_alistb").values(dedupedResults).execute();
  });

  return Response.json(dedupedResults);
};
