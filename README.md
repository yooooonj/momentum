# 🎨 UX톤 적용하기 - Figma Plugin

한국어 텍스트를 친근한 UX Writing 톤으로 자동 변환하는 피그마 플러그인입니다.

## ✨ 주요 기능

- **텍스트 분석**: 선택된 텍스트의 감정 톤, 문장 스타일, 키워드를 분석
- **톤 프로파일**: 격식성, 친근함, 직접성 등을 측정하여 현재 톤 상태를 확인
- **자동 변환**: 미리 정의된 UX Writing 패턴으로 텍스트를 친근한 톤으로 변환
- **선택적 적용**: 제안된 변경사항 중 원하는 것만 선택하여 적용

## 🔄 변환 패턴

### 행동 유도 (Action)
- `확인해보세요` → `확인하기` (친근한 어조)
- `이용해보세요` → `이용하기` (간결한 표현)
- `참여해보세요` → `참여하기` (직접적 유도)
- `신청해보세요` → `신청하기` (간편함 강조)
- `문의해보세요` → `문의하기` (쉬운 접근)

### 어미 변환 (Ending)
- `됩니다` → `돼요` (친근한 확인)
- `입니다` → `이에요` (부드러운 설명)
- `있습니다` → `있어요` (친근한 안내)

### 표현 방식 (Expression)
- `하시면` → `하면` (간결한 조건)
- `하십시오` → `해주세요` (정중한 요청)

## 🚀 설치 및 사용법

### 개발 환경 설정

1. **필수 요구사항**
   - Node.js (v14 이상)
   - npm 또는 yarn
   - Figma Desktop App

2. **의존성 설치**
   ```bash
   npm install
   ```

3. **빌드**
   ```bash
   npm run build
   ```

4. **개발 모드 (watch)**
   ```bash
   npm run dev
   ```

### Figma에서 플러그인 설치

1. Figma Desktop App을 열고 파일을 생성하거나 엽니다
2. 상단 메뉴에서 **Plugins > Development > Import plugin from manifest...**를 선택
3. 이 프로젝트의 `manifest.json` 파일을 선택합니다

### 사용법

1. **텍스트 선택**: Figma에서 변환하고 싶은 텍스트 노드를 선택합니다
2. **플러그인 실행**: **Plugins > Development > ux톤 적용하기**를 실행합니다
3. **분석 확인**: 텍스트의 톤 분석 결과와 제안된 변경사항을 확인합니다
4. **변경사항 적용**: 
   - **선택적 적용**: 원하는 변경사항만 체크하고 "선택된 변경사항 적용" 클릭
   - **전체 적용**: "모든 변경사항 적용" 버튼으로 모든 제안사항을 한번에 적용

## 📊 분석 기능

### 감정 톤 분석
- **중성적 (Neutral)**: 일반적인 톤
- **열정적 (Enthusiastic)**: 설렘, 최고, 특가 등의 키워드 포함
- **친근함 (Friendly)**: 함께, 나만의, 여러분 등의 키워드 포함
- **전문적 (Professional)**: 서비스, 품질, 전문 등의 키워드 포함
- **장난스러움 (Playful)**: 재미, 즐거운, ㅋ 등의 키워드 포함

### 문장 스타일 분석
- **서술문**: 정보를 전달하는 문장
- **의문문**: 질문 형태의 문장
- **명령문**: 행동을 요구하는 문장
- **감탄문**: 감정을 표현하는 문장

### 톤 프로파일
- **격식성**: 격식적 ↔ 캐주얼
- **친근함**: 차가움 ↔ 중성적 ↔ 따뜻함
- **직접성**: 간접적 ↔ 보통 ↔ 직접적

## 🛠️ 개발

### 프로젝트 구조
```
├── manifest.json          # 플러그인 매니페스트
├── code.ts                # 메인 플러그인 로직 (TypeScript)
├── code.js                # 컴파일된 JavaScript
├── ui.html                # 플러그인 UI
├── package.json           # 프로젝트 설정
├── tsconfig.json          # TypeScript 설정
├── .eslintrc.js          # ESLint 설정
└── README.md             # 문서
```

### 개발 스크립트
- `npm run build`: TypeScript를 JavaScript로 컴파일
- `npm run watch`: 파일 변경을 감시하며 자동 컴파일
- `npm run dev`: 개발 모드 (watch와 동일)
- `npm run lint`: 코드 린팅
- `npm run lint:fix`: 린팅 오류 자동 수정

### 패턴 확장
새로운 변환 패턴을 추가하려면 `code.ts`의 `UX_PATTERNS` 배열에 새 패턴을 추가하세요:

```typescript
const UX_PATTERNS: TonePattern[] = [
  // 기존 패턴들...
  { 
    pattern: "새로운패턴", 
    replacement: "변환된패턴", 
    description: "설명", 
    category: "action" | "ending" | "expression" 
  }
];
```

## 🎯 사용 예시

### Before (격식적 톤)
```
"서비스를 이용해보세요. 
문의사항이 있으시면 연락해주십시오.
확인해보세요."
```

### After (친근한 UX 톤)
```
"서비스를 이용하기.
문의사항이 있으면 연락해주세요.
확인하기."
```

## 🔧 트러블슈팅

### 텍스트가 변경되지 않는 경우
1. 텍스트 노드가 올바르게 선택되었는지 확인
2. 선택된 텍스트에 변환 가능한 패턴이 포함되어 있는지 확인
3. 폰트가 로드되지 않은 경우, 잠시 후 다시 시도

### 플러그인이 로드되지 않는 경우
1. `code.js` 파일이 존재하는지 확인
2. `npm run build`를 실행하여 TypeScript를 컴파일
3. Figma Desktop App에서 플러그인을 다시 import

## 📝 라이선스

MIT License

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 문의

프로젝트에 대한 질문이나 제안사항이 있으시면 이슈를 생성해주세요.

---

**UX Writing을 더 친근하고 접근하기 쉽게! 🎨✨**