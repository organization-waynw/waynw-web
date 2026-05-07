// utils/episodeNodeDnD.ts

import { EpisodeNode } from "../types/Episodes/episodes";

export function reorderNodes(
  list: EpisodeNode[],
  startIndex: number,
  endIndex: number,
) {
  const result = [...list];

  const [removed] = result.splice(startIndex, 1);

  result.splice(endIndex, 0, removed);

  return result;
}

export function getClosestNodeIndex(
  mouseY: number,
  nodes: EpisodeNode[],
  refs: Record<number, HTMLDivElement | null>,
) {
  for (let i = 0; i < nodes.length; i++) {
    const el = refs[nodes[i].id];

    if (!el) continue;

    const rect = el.getBoundingClientRect();

    const middleY = rect.top + rect.height / 2;

    if (mouseY < middleY) {
      return i;
    }
  }

  return nodes.length;
}
