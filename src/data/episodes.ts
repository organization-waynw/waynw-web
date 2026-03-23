// interface는 추후 types로 분리
export interface Episode {
  id: string;
  persona_id: string;
  name: string;
  one_line_explanation: string;
  sub_info?: string;
  disk_id: string;
  created_at: string;
}

export type DiskName =
  | "red"
  | "pink"
  | "gold"
  | "yellow"
  | "purple"
  | "turquoise";

export interface DiskInfo {
  music?: {
    title: string;
    artist: string;
    artist_channel?: string;
  };
  license?: {
    name: string;
    type: string;
  };
  links?: {
    download?: string;
    youtube?: string;
  };
  source?: string;
}

export interface EpisodeNode {
  id: number;
  name?: string;
  one_line_explanation?: string;
  content?: string;
  episode_id?: string;
  created_at: string;
}

export interface Disk {
  id: string;
  name: DiskName;
  img_url: string;
  disk_info: DiskInfo;
  emotion: string[];
  music_url: string; // 추가
  created_at: string;
}

export const disks: Disk[] = [
  {
    id: "1f4c9459-db24-4e59-8083-c83b8f89ac15",
    name: "pink",
    img_url:
      "https://tigdknqewhaomwtxbzxq.supabase.co/storage/v1/object/public/disk_img/pink.png",
    disk_info: {
      links: {
        youtube: "https://www.youtube.com/watch?v=b6jK2t3lcRs",
        download: "https://www.audiolibrary.com.co/konte...",
      },
      music: {
        title: "Buddha",
        artist: "Kontekst",
        artist_channel: "kontekstmusic",
      },
      source: "Audio Library",
      license: {
        name: "Creative Commons — Attribution-ShareAlike 3.0 Unported",
        type: "CC BY-SA 3.0",
      },
    },
    music_url:
      "https://tigdknqewhaomwtxbzxq.supabase.co/storage/v1/object/public/disk_music/pink.mp3",
    created_at: "2026-03-23 00:05:54.150122+00",
    emotion: ["설렘", "포근함", "부드러운 기쁨", "조용한 애정"],
  },
  {
    id: "5357ae75-a9af-46d3-bd8e-291b20a65a0e",
    name: "red",
    img_url:
      "https://tigdknqewhaomwtxbzxq.supabase.co/storage/v1/object/public/disk_img/red.png",
    disk_info: {
      links: {
        youtube: "https://www.youtube.com/watch?v=tJdcn6cGdC0",
        download: "https://audiolibrary.com.co/joshua-mo...",
      },
      music: {
        title: "Night Ride",
        artist: "Joshua Moses",
        artist_channel: "joshuamosesmusic",
      },
      source: "Audio Library",
      license: {
        name: "Creative Commons — Attribution-NonCommercial-ShareAlike 3.0 Unported",
        type: "CC BY-NC-SA 3.0",
      },
    },
    music_url:
      "https://tigdknqewhaomwtxbzxq.supabase.co/storage/v1/object/public/disk_music/red.mp3",
    created_at: "2026-03-23 00:02:34.82082+00",
    emotion: [
      "은근히 올라오는 열감",
      "조금 날이 선 기분",
      "참고 있지만 남아있는 긴장",
      "속에서 맴도는 불편함",
    ],
  },
  {
    id: "1c20e1aa-f375-4b44-ad8c-836e8e1823e7",
    name: "turquoise",
    img_url:
      "https://tigdknqewhaomwtxbzxq.supabase.co/storage/v1/object/public/disk_img/turquoise.png",
    disk_info: {
      links: {
        youtube: "https://www.youtube.com/watch?v=MkNeIUgNPQ8",
        download: "http://bit.ly/2Pj0MtT",
      },
      music: {
        title: "Adventures",
        artist: "A Himitsu",
        artist_channel: "a-himitsu",
      },
      source: "Audio Library",
      license: {
        name: "Creative Commons — Attribution 3.0 Unported",
        type: "CC BY 3.0",
      },
    },
    music_url:
      "https://tigdknqewhaomwtxbzxq.supabase.co/storage/v1/object/public/disk_music/turquoise.mp3",
    created_at: "2026-03-23 00:08:09.271559+00",
    emotion: ["차분함", "맑은 느낌", "여유로움", "은은한 안정감"],
  },
  {
    id: "a4a7ad41-63ea-45d5-afdb-05815c3abe34",
    name: "gold",
    img_url:
      "https://tigdknqewhaomwtxbzxq.supabase.co/storage/v1/object/public/disk_img/gold.png",
    disk_info: {
      links: {
        youtube: "https://www.youtube.com/watch?v=NIlzYKUJabs",
        download: "https://audiolibrary.com.co/sakura-gi...",
      },
      music: {
        title: "I like you",
        artist: "Sakura Girl",
        artist_channel: "sakuragirl_official",
      },
      source: "Audio Library",
      license: {
        name: "Creative Commons — Attribution 3.0 Unported",
        type: "CC BY 3.0",
      },
    },
    music_url:
      "https://tigdknqewhaomwtxbzxq.supabase.co/storage/v1/object/public/disk_music/gold.mp3",
    created_at: "2026-03-23 00:09:35.563278+00",
    emotion: ["풍요로움", "은근한 자신감", "빛나는 느낌", "여유 있는 만족"],
  },
  {
    id: "6bb0e9d4-865d-4f43-947b-738a50df084e",
    name: "yellow",
    img_url:
      "https://tigdknqewhaomwtxbzxq.supabase.co/storage/v1/object/public/disk_img/yellow.png",
    disk_info: {
      links: {
        youtube: "https://www.youtube.com/watch?v=EWAMl7yD8Wc",
        download: "https://audiolibrary.com.co/roa-music...",
      },
      music: {
        title: "Beloved",
        artist: "Roa",
        artist_channel: "roa_music1031",
      },
      source: "Audio Library",
      license: {
        name: "Creative Commons — Attribution 3.0 Unported",
        type: "CC BY 3.0",
      },
    },
    music_url:
      "https://tigdknqewhaomwtxbzxq.supabase.co/storage/v1/object/public/disk_music/yellow.mp3",
    created_at: "2026-03-23 00:11:00.560781+00",
    emotion: ["밝음", "가벼운 기쁨", "희망적인 느낌", "산뜻함"],
  },
  {
    id: "b3bcb096-c8f1-4eb4-b48d-a4fb125a7c98",
    name: "purple",
    img_url:
      "https://tigdknqewhaomwtxbzxq.supabase.co/storage/v1/object/public/disk_img/purple.png",
    disk_info: {
      links: {
        youtube: "https://www.youtube.com/watch?v=CMLnB526kkY",
        download: "https://www.audiolibrary.com.co/broke...",
      },
      music: {
        title: "Imaginary",
        artist: "Broken Elegance & Nomyn",
        artist_channel: "brokenelegance",
      },
      source: "Audio Library",
      license: {
        name: "Creative Commons — Attribution 3.0 Unported",
        type: "CC BY 3.0",
      },
    },
    music_url:
      "https://tigdknqewhaomwtxbzxq.supabase.co/storage/v1/object/public/disk_music/purple.mp3",
    created_at: "2026-03-23 00:12:27.49909+00",
    emotion: ["신비로움", "차분한 깊이", "은근한 집중", "고요한 분위기"],
  },
];

export const episodes: Episode[] = [
  {
    id: "e1",
    persona_id: "1",
    name: "설레는 첫 만남",
    one_line_explanation: "처음으로 가까워지며 설렘을 느꼈던 순간",
    disk_id: "1f4c9459-db24-4e59-8083-c83b8f89ac15", // pink
    created_at: "2024-01-15T10:00:00Z",
  },
  {
    id: "e2",
    persona_id: "1",
    name: "감정이 올라온 날",
    one_line_explanation: "서로 예민해져서 긴장감이 돌았던 순간",
    disk_id: "5357ae75-a9af-46d3-bd8e-291b20a65a0e", // red
    created_at: "2024-01-16T10:00:00Z",
  },
  {
    id: "e3",
    persona_id: "1",
    name: "잔잔한 대화",
    one_line_explanation: "차분하게 서로의 이야기를 나눴던 시간",
    disk_id: "1c20e1aa-f375-4b44-ad8c-836e8e1823e7", // cyan
    created_at: "2024-01-17T10:00:00Z",
  },
  {
    id: "e4",
    persona_id: "1",
    name: "성취의 순간",
    one_line_explanation: "함께 무언가를 이루고 만족감을 느꼈던 순간",
    disk_id: "a4a7ad41-63ea-45d5-afdb-05815c3abe34", // gold
    created_at: "2024-01-18T10:00:00Z",
  },
  {
    id: "e5",
    persona_id: "1",
    name: "밝은 하루",
    one_line_explanation: "가볍고 기분 좋게 웃으며 보낸 시간",
    disk_id: "6bb0e9d4-865d-4f43-947b-738a50df084e", // yellow
    created_at: "2024-01-19T10:00:00Z",
  },
  {
    id: "e6",
    persona_id: "1",
    name: "깊은 생각",
    one_line_explanation: "조용하고 깊이 있는 감정을 나눴던 순간",
    disk_id: "b3bcb096-c8f1-4eb4-b48d-a4fb125a7c98", // purple
    created_at: "2024-01-20T10:00:00Z",
  },
  {
    id: "e7",
    persona_id: "1",
    name: "깊은 생각",
    one_line_explanation: "조용하고 깊이 있는 감정을 나눴던 순간",
    disk_id: "b3bcb096-c8f1-4eb4-b48d-a4fb125a7c98", // purple
    created_at: "2024-01-20T10:00:00Z",
  },
];

export const episodeNodes: EpisodeNode[] = [
  {
    id: 1,
    episode_id: "e1",
    name: "처음 마주친 순간",
    one_line_explanation: "서로를 처음 보고 어색하게 인사를 나눈 순간",
    content:
      "처음으로 서로를 마주했을 때, 짧은 눈인사와 함께 어색한 공기가 흘렀다. 무슨 말을 해야 할지 몰라서 웃기만 했지만, 그 순간 자체가 기억에 남았다.",
    created_at: "2024-01-15T10:01:00Z",
  },
  {
    id: 2,
    episode_id: "e1",
    name: "어색한 첫 대화",
    one_line_explanation: "서로 공통점을 찾으려 노력했던 대화",
    content:
      "날씨 이야기부터 시작해서 학교, 취미 같은 이야기를 꺼냈다. 대화는 조금 끊기기도 했지만 서로 이어가려고 노력하는 게 느껴졌다.",
    created_at: "2024-01-15T10:05:00Z",
  },
  {
    id: 3,
    episode_id: "e1",
    name: "작은 웃음 포인트",
    one_line_explanation: "사소한 말 한마디에 같이 웃었던 순간",
    content:
      "별거 아닌 실수였는데 둘 다 웃음을 터뜨렸다. 그때부터 분위기가 조금 더 편해졌고, 긴장이 풀리기 시작했다.",
    created_at: "2024-01-15T10:08:00Z",
  },
  {
    id: 4,
    episode_id: "e1",
    name: "편해진 분위기",
    one_line_explanation: "조금씩 자연스럽게 이어진 대화",
    content:
      "대화가 점점 자연스러워졌고, 서로 질문도 편하게 주고받았다. 처음의 어색함이 조금씩 사라지고 있었다.",
    created_at: "2024-01-15T10:12:00Z",
  },
  {
    id: 5,
    episode_id: "e1",
    name: "헤어지기 아쉬운 순간",
    one_line_explanation: "시간이 빨리 지나간 것을 느낀 순간",
    content:
      "대화를 하다 보니 시간이 금방 지나 있었다. 헤어져야 할 시간이 다가오자, 왠지 모르게 아쉬운 감정이 들었다.",
    created_at: "2024-01-15T10:20:00Z",
  },
];
