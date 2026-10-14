// Prefixes public-folder paths with the deployment base path. Next adds the
// base path to links automatically, but not to <Image> sources, metadata
// icons, or URLs loaded by WebGL.
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function asset(path: `/${string}`) {
  return `${BASE_PATH}${path}`;
}
