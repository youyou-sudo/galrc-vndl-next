import { mkdir, copyFile, stat, readdir } from "fs/promises";
import path from "path";

async function copyRecursive(src: string, dest: string): Promise<void> {
  const stats = await stat(src);

  if (stats.isDirectory()) {
    await mkdir(dest, { recursive: true });
    const entries = await readdir(src);
    for (const entry of entries) {
      await copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
  } else {
    await mkdir(path.dirname(dest), { recursive: true });
    await copyFile(src, dest);
  }
}

async function main() {
  const baseDir = process.cwd();

  const copyJobs = [
    {
      from: path.join(baseDir, "public"),
      to: path.join(baseDir, ".next", "standalone", "public"),
    },
    {
      from: path.join(baseDir, ".next", "static"),
      to: path.join(baseDir, ".next", "standalone", ".next", "static"),
    },
    {
      from: path.join(baseDir, "scripts"),
      to: path.join(baseDir, ".next", "standalone", "scripts"),
    },
  ];

  for (const { from, to } of copyJobs) {
    try {
      await copyRecursive(from, to);
      console.log(`✅ Copied ${from} -> ${to}`);
    } catch (err) {
      console.error(`❌ Failed to copy ${from} -> ${to}`, err);
    }
  }
}

main();
