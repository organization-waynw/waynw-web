//기타 항목
import otherItems from "../assets/images/persona/create/question/other_items.png";

// question 1
import mood1 from "../assets/images/persona/create/question/1/cozy_afternoon_sunlight.png";
import mood2 from "../assets/images/persona/create/question/1/city_of_cold_dawn.png";
import mood3 from "../assets/images/persona/create/question/1/a_night_where_neon_signs_spread.png";
import mood4 from "../assets/images/persona/create/question/1/the_forest_after_the_rain.png";
import mood5 from "../assets/images/persona/create/question/1/memories_of_a_faded_photo_album.png";
import mood6 from "../assets/images/persona/create/question/1/dreamlike_walking_in_a_dream.png";
import mood7 from "../assets/images/persona/create/question/1/midday_heat.png";

// question 2
import exp1 from "../assets/images/persona/create/question/2/gentle_smile.png";
import exp2 from "../assets/images/persona/create/question/2/expressionless_seriousness.png";
import exp3 from "../assets/images/persona/create/question/2/sharp_and_sharp_eyes.png";
import exp4 from "../assets/images/persona/create/question/2/worried_look.png";
import exp5 from "../assets/images/persona/create/question/2/confident_smile.png";

// question 3
import item1 from "../assets/images/persona/create/question/3/warm_coffee_cup.png";
import item2 from "../assets/images/persona/create/question/3/thick_books_or_glasses.png";
import item3 from "../assets/images/persona/create/question/3/latest_laptop_or_smart_device.png";
import item4 from "../assets/images/persona/create/question/3/a_bundle_of_complicated_documents.png";
import item5 from "../assets/images/persona/create/question/3/clean_empty_space.png";
import item6 from "../assets/images/persona/create/question/3/fine_jewelry.png";
import item7 from "../assets/images/persona/create/question/3/a_camera_or_map_containing_traces_of_the_trip.png";

// question 4
import vibe1 from "../assets/images/persona/create/question/4/a_sense_of_security_you_want_to_rely_on.png";
import vibe2 from "../assets/images/persona/create/question/4/warm_melting_spring_sunshine.png";
import vibe3 from "../assets/images/persona/create/question/4/inspiring_muse.png";
import vibe4 from "../assets/images/persona/create/question/4/a_high_mountain_that_is_difficult_to_cross.png";
import vibe5 from "../assets/images/persona/create/question/4/fog_holding_a_secret.png";
import vibe6 from "../assets/images/persona/create/question/4/the_endlessly_stretching_horizon.png";
import vibe7 from "../assets/images/persona/create/question/4/north_star_of_the_silent_night.png";

export const QUESTIONS = [
  {
    id: 1,
    question: "해당 사람을 볼 때 당신은 어떤 장면(무드)을 떠올리나요?",
    promptKey: "mood",
    useImage: true,
    columns: 4,
    options: [
      {
        label: "포근한 오후의 햇살",
        promptKeywords:
          "warm golden hour lighting, soft backlight, beige and wood tones, film grain, cozy atmosphere",
        imagePath: mood1,
      },
      {
        label: "차가운 새벽의 도시",
        promptKeywords:
          "monochromatic, cool blue tones, sharp contrast, urban city morning, minimalist, elegant shadows",
        imagePath: mood2,
      },
      {
        label: "네온 사인이 번지는 밤",
        promptKeywords:
          "vibrant neon lights, purple and blue hues, street photography style, high energy, grainy night texture",
        imagePath: mood3,
      },
      {
        label: "비 개인 뒤의 숲",
        promptKeywords:
          "deep green and earthy tones, misty atmosphere, wet textures, foggy forest, calm and serene",
        imagePath: mood4,
      },
      {
        label: "바랜 사진첩의 기억",
        promptKeywords:
          "sepia tone, vintage paper texture, retro aesthetic, classic portrait lighting, nostalgic mood",
        imagePath: mood5,
      },
      {
        label: "꿈속을 걷는 몽환",
        promptKeywords:
          "pastel pink and sky blue, dreamy surrealism, Lo-fi aesthetic, fluffy clouds, soft focus",
        imagePath: mood6,
      },
      {
        label: "한낮의 뜨거운 열기",
        promptKeywords:
          "intense red and orange, dynamic composition, dramatic lighting, bold brushstrokes, high heat mood",
        imagePath: mood7,
      },
      { label: "기타", promptKeywords: "", imagePath: null, isCustom: true },
    ],
  },

  {
    id: 2,
    question: "그 사람은 보통 어떠한 표정을 짓고 있나요?",
    promptKey: "expression",
    useImage: true,
    columns: 3,
    options: [
      {
        label: "온화한 미소",
        promptKeywords: "gentle smile, kind eyes, approachable expression",
        imagePath: exp1,
      },
      {
        label: "무표정한 진지함",
        promptKeywords: "stoic face, serious expression, calm look",
        imagePath: exp2,
      },
      {
        label: "날카롭고 예리한 눈빛",
        promptKeywords: "sharp piercing eyes, intense gaze, confident look",
        imagePath: exp3,
      },
      {
        label: "걱정스러운 시선",
        promptKeywords:
          "concerned expression, empathetic eyes, slightly furrowed brow",
        imagePath: exp4,
      },
      {
        label: "자신만만한 웃음",
        promptKeywords: "smirk, charismatic smile, bold expression",
        imagePath: exp5,
      },
      { label: "기타", promptKeywords: "", imagePath: null, isCustom: true },
    ],
  },

  {
    id: 3,
    question: "그 사람 곁에 항상 있을 것 같은 물건이 있다면 무엇일까요?",
    promptKey: "item",
    useImage: true,
    columns: 4,
    options: [
      {
        label: "따뜻한 커피잔",
        promptKeywords: "holding a steaming coffee cup, cafe table setting",
        imagePath: item1,
      },
      {
        label: "두꺼운 책이나 안경",
        promptKeywords:
          "thick hardcover books, vintage glasses, intellectual vibe",
        imagePath: item2,
      },
      {
        label: "최신형 노트북/스마트기기",
        promptKeywords:
          "modern laptop, digital glow, professional tech environment",
        imagePath: item3,
      },
      {
        label: "복잡한 서류 뭉치",
        promptKeywords: "scattered documents, messy desk, busy work life",
        imagePath: item4,
      },
      {
        label: "깔끔한 빈 공간",
        promptKeywords: "empty space, minimalist setting, no distractions",
        imagePath: item5,
      },
      {
        label: "고급 장신구",
        promptKeywords: "Exquisite fine jewelry, Glamorous lighting",
        imagePath: item6,
      },
      {
        label: "여행의 흔적이 담긴 카메라 또는 지도",
        promptKeywords:
          "vintage film camera, developed photos, travel map, nostalgic memories, adventurous vibe, weathered leather strap",
        imagePath: item7,
      },
      { label: "기타", promptKeywords: "", imagePath: null, isCustom: true },
    ],
  },

  {
    id: 4,
    question: "그 사람을 보면 어떤 생각이 떠오르나요?",
    promptKey: "vibe",
    useImage: true,
    columns: 4,
    options: [
      {
        label: "의지하고 싶은 든든함",
        promptKeywords: "stable composition, reliable mood, grounded feel",
        imagePath: vibe1,
      },
      {
        label: "따스하게 녹여주는 봄볕",
        promptKeywords:
          "healing warmth, radiant sunshine, comforting embrace, soft yellow and gold hues, gentle restoration",
        imagePath: vibe2,
      },
      {
        label: "영감을 주는 뮤즈",
        promptKeywords: "ethereal glow, creative sparks, artistic blur",
        imagePath: vibe3,
      },
      {
        label: "높은 산",
        promptKeywords: "majestic presence, low angle shot, distant and grand",
        imagePath: vibe4,
      },
      {
        label: "비밀을 간직한 안개",
        promptKeywords: "mysterious vibes, hazy details, hidden elements",
        imagePath: vibe5,
      },
      {
        label: "끝없이 펼쳐진 수평선",
        promptKeywords:
          "endless horizon, vast ocean, liberation, serene blue gradients, infinite possibilities, calm expansion",
        imagePath: vibe6,
      },
      {
        label: "고요한 밤의 북극성",
        promptKeywords:
          "guiding star, polaris, clear direction, deep midnight blue, steady light, reliable compass",
        imagePath: vibe7,
      },
      { label: "기타", promptKeywords: "", imagePath: null, isCustom: true },
    ],
  },
];
