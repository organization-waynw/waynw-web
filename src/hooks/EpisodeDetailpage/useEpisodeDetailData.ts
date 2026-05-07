import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { getEpisodeById, getDisks, getEpisodeNodes } from "../../api/episodes";
import { Episode, EpisodeNode } from "../../types/Episodes/episodes";
import { Disk } from "../../types/Disk/disk";

export function useEpisodeDetailData(episodeId?: string) {
  const [episode, setEpisode] = useState<Episode | null>(null);
  const [disks, setDisks] = useState<Disk[]>([]);
  const [initialNodes, setInitialNodes] = useState<EpisodeNode[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!episodeId) return;

    (async () => {
      try {
        const [ep, diskList, nodeList] = await Promise.all([
          getEpisodeById(episodeId),
          getDisks(),
          getEpisodeNodes(episodeId),
        ]);
        setEpisode(ep);
        setDisks(diskList);
        setInitialNodes(nodeList);
      } catch (e) {
        console.error(e);
        toast.error("데이터를 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    })();
  }, [episodeId]);

  return { episode, disks, initialNodes, isLoading };
}
