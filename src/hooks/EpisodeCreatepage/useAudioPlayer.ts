/**
 * useAudioPlayer
 * 음악 재생/일시정지, 디스크 변경 시 음악 자동 전환을 관리합니다.
 */

import { useState, useEffect, useMemo, useRef } from "react";
import { disks } from "../../data/EPISODES";

interface UseAudioPlayerOptions {
  onPlayStateChange?: (isPlaying: boolean) => void;
}

export function useAudioPlayer(options?: UseAudioPlayerOptions) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useMemo(() => new Audio(), []);
  const saveSoundRef = useRef<HTMLAudioElement | null>(null);

  // 초기화: 저장 사운드 로드
  useEffect(() => {
    saveSoundRef.current = new Audio("/sounds/episode-submit.mp3");
  }, []);

  // 정리: 오디오 정지 및 메모리 해제
  useEffect(() => {
    return () => {
      audioRef.pause();
      audioRef.src = "";
    };
  }, [audioRef]);

  /**
   * 디스크 클릭 시 음악 재생/일시정지
   */
  const toggleMusic = (musicUrl?: string) => {
    if (!musicUrl) return;

    if (isPlaying) {
      audioRef.pause();
      setIsPlaying(false);
      options?.onPlayStateChange?.(false);
    } else {
      if (audioRef.src !== musicUrl) {
        audioRef.pause();
        audioRef.src = musicUrl;
        audioRef.currentTime = 0;
      }
      audioRef.play();
      setIsPlaying(true);
      options?.onPlayStateChange?.(true);
    }
  };

  /**
   * 새로운 디스크로 변경 (재생 중인 경우)
   */
  const switchDisk = (diskId: string) => {
    if (!isPlaying) return;

    const newDisk = disks.find((d) => d.id === diskId);
    const newUrl = (newDisk as any)?.music_url as string | undefined;

    audioRef.pause();

    if (newUrl) {
      audioRef.src = newUrl;
      audioRef.currentTime = 0;
      audioRef.play();
    } else {
      setIsPlaying(false);
      options?.onPlayStateChange?.(false);
    }
  };

  /**
   * 저장 사운드 재생
   */
  const playSaveSound = () => {
    saveSoundRef.current?.play();
  };

  return {
    isPlaying,
    audioRef,
    saveSoundRef,
    toggleMusic,
    switchDisk,
    playSaveSound,
  };
}
