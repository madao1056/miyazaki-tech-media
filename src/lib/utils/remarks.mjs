import { execSync } from "node:child_process";
import { statSync } from "node:fs";
import getReadingTime from "reading-time";
import { toString as ConvertToString } from "mdast-util-to-string";

function isGitAvailable() {
  try {
    execSync("git --version", { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

function isGitRepo() {
  try {
    execSync("git rev-parse --is-inside-work-tree", { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

export function modifiedTime() {
  return (_, file) => {
    const filepath = file.history[0];
    let lastModified;

    if (isGitAvailable() && isGitRepo()) {
      try {
        const gitResult = execSync(
          `git log -1 --pretty="format:%cI" "${filepath}"`,
          { stdio: ["ignore", "pipe", "ignore"] },
        )
          .toString()
          .trim();

        if (gitResult) {
          lastModified = gitResult;
        }
      } catch {
        // اگر فایل در Git track نشده باشد، به fallback می‌رویم
      }
    }

    if (!lastModified) {
      // fallback به سیستم فایل
      const stats = statSync(filepath);
      lastModified = stats.mtime.toISOString();
    }

    file.data.astro.frontmatter.lastModified = lastModified;
  };
}

export function readingTime() {
  return (tree, { data }) => {
    const textOnPage = ConvertToString(tree);
    const readingTime = getReadingTime(textOnPage, { wordsPerMinute: 650 });
    // Convert to Japanese format (e.g., "3 min read" -> "3分で読めます")
    const minutes = Math.ceil(readingTime.minutes);
    data.astro.frontmatter.minutesRead = `${minutes}分で読めます`;
  };
}
