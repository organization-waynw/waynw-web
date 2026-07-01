<div id="top"></div>

<!-- PROJECT LOGO -->
<br />
<div align="center">
    <img src="./docs/images/logo.svg" alt="Logo" width="80" height="80">

  <h3 align="center">WAYNW (1.0.0)</h3>

  <p align="center">
    페르소나 생성및 AI 대화연습 서비스
  </p>

</div>
<br />

사용자가 특정 인물에 대한 AI 페르소나를 생성하고, 그 인물과의 관계 속에서 발생한 대화와 사건을
에피소드 형태로 기록하며, AI를 통해 대화 전 정리와 대화 후 피드백을 받을 수 있는 웹 서비스입니다.

<br>

## 화면

### 에피소드

페르소나와 있었던 사건을 노드(대화 조각) 단위 타임라인으로 기록합니다.

### 페르소나 채팅

AI가 페르소나와의 대화·사건을 제3자 시점에서 분석하고, 상담하듯 스트리밍으로 응답합니다.

<br>

## 기술 스택

| 구분            | 기술                                                 |
| --------------- | ---------------------------------------------------- |
| 프레임워크      | React + TypeScript                                   |
| 스타일링        | Tailwind CSS                                         |
| 백엔드/DB       | Supabase (PostgreSQL, Auth, Storage, Edge Functions) |
| AI              | OpenAI API                                           |
| 실시간 통신     | WebSocket (스트리밍 채팅)                            |
| 마크다운 렌더링 | React Markdown                                       |
| 외부 지식 API   | OpenAlex, Semantic Scholar, NCBI, KCI                |

<br>

## 핵심 기능

### 1. 페르소나 생성 (2단계 플로우)

- **Step 1**: 이름/한줄 소개 등 기본 정보와 추가 정보(sub info)를 입력하고, 프로필 이미지를 직접 업로드하거나 AI 자동 생성을 선택합니다. 입력값은 `sessionStorage`에 임시 저장해 다음 단계로 넘깁니다.
- **Step 2**: 분위기·표정·소지품·상징 등 4가지 카테고리의 질문에 이미지 카드로 답합니다. 각 답변은 `__mood__`, `__expression__`, `__item__`, `__vibe__`처럼 고정 프리픽스가 붙은 키(`promptKey`)로 변환되어, 사용자가 직접 입력한 정보(`subInfos`)와 합쳐져 `personas.extra_info`(jsonb)에 함께 저장됩니다. 사용자 입력과 AI 프롬프트용 키워드를 같은 배열 안에서 구분해 관리하는 방식입니다.

### 2. 에피소드 & 노드 타임라인

- 페르소나와의 사건/대화를 `episodes` 단위로 기록하고, 각 에피소드는 여러 개의 `episode_node`(이름, 한줄 설명, 본문)로 구성된 타임라인을 가집니다.

### 3. AI 페르소나 채팅 (WebSocket 스트리밍)

- AI는 페르소나와의 기록(에피소드/노드)을 바탕으로 제3자 시점에서 상황을 분석하고 조언하는 역할을 합니다.
- 사용자가 AI에 과도하게 의존하지 않도록 유도하는 안내 모달을 두어, 기술적 기능 외에 서비스 방향성(확답을 주지 않고 스스로 생각하게 만드는 것)까지 UI 차원에서 반영했습니다.

### 4. 외부 지식 API 연동

- OpenAlex, Semantic Scholar, NCBI, KCI 등 학술 데이터 소스를 연동하여 AI 답변에 사용할수 있도록 하였습니다.

<br>
