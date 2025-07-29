// UX 톤 변환 패턴 정의
interface TonePattern {
  pattern: string;
  replacement: string;
  description: string;
  category: 'action' | 'ending' | 'expression';
}

// UX Writing 패턴들
const UX_PATTERNS: TonePattern[] = [
  { pattern: "확인해보세요", replacement: "확인하기", description: "친근한 어조", category: "action" },
  { pattern: "이용해보세요", replacement: "이용하기", description: "간결한 표현", category: "action" },
  { pattern: "참여해보세요", replacement: "참여하기", description: "직접적 유도", category: "action" },
  { pattern: "신청해보세요", replacement: "신청하기", description: "간편함 강조", category: "action" },
  { pattern: "문의해보세요", replacement: "문의하기", description: "쉬운 접근", category: "action" },
  { pattern: "됩니다", replacement: "돼요", description: "친근한 확인", category: "ending" },
  { pattern: "입니다", replacement: "이에요", description: "부드러운 설명", category: "ending" },
  { pattern: "있습니다", replacement: "있어요", description: "친근한 안내", category: "ending" },
  { pattern: "하시면", replacement: "하면", description: "간결한 조건", category: "expression" },
  { pattern: "하십시오", replacement: "해주세요", description: "정중한 요청", category: "expression" },
  // 추가 어미 패턴들
  { pattern: "하세요", replacement: "하기", description: "간결한 행동 유도", category: "action" },
  { pattern: "해보세요", replacement: "해보기", description: "친근한 시도 유도", category: "action" },
  { pattern: "확인하세요", replacement: "확인하기", description: "직접적 확인 요청", category: "action" },
  { pattern: "이용하세요", replacement: "이용하기", description: "간편한 이용 안내", category: "action" },
  { pattern: "참여하세요", replacement: "참여하기", description: "적극적 참여 유도", category: "action" },
  { pattern: "신청하세요", replacement: "신청하기", description: "쉬운 신청 안내", category: "action" }
];

// 감정 톤 분석 타입
type EmotionTone = 'neutral' | 'enthusiastic' | 'friendly' | 'professional' | 'playful';

// 문장 스타일 분석 타입
type SentenceStyle = 'declarative' | 'interrogative' | 'imperative' | 'exclamatory';

// 텍스트 분석 결과 인터페이스
interface TextAnalysis {
  originalText: string;
  emotion: EmotionTone;
  sentenceStyle: SentenceStyle;
  keywords: string[];
  suggestedChanges: Array<{
    original: string;
    suggested: string;
    description: string;
    category: string;
  }>;
  toneProfile: {
    formality: 'formal' | 'casual';
    friendliness: 'cold' | 'neutral' | 'warm';
    directness: 'indirect' | 'moderate' | 'direct';
  };
}

// 감정 톤 분석 함수
function analyzeEmotion(text: string): EmotionTone {
  const emotionKeywords = {
    enthusiastic: ['설렘', '최고', '특가', '대박', '놀라운', '환상', '완벽', '!', '!!', '!!!'],
    friendly: ['함께', '나만의', '여러분', '친구', '가족', '편안', '따뜻', '반가워', '안녕'],
    professional: ['서비스', '품질', '전문', '안전', '신뢰', '보장', '관리', '제공', '지원'],
    playful: ['재미', '즐거운', 'ㅋ', '귀여운', '신나는', '웃음', '놀이', '깜짝', '와우']
  };

  let scores = {
    enthusiastic: 0,
    friendly: 0,
    professional: 0,
    playful: 0
  };

  for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
    for (const keyword of keywords) {
      if (text.includes(keyword)) {
        scores[emotion as keyof typeof scores]++;
      }
    }
  }

  const maxEmotion = Object.entries(scores).reduce((a, b) => 
    scores[a[0] as keyof typeof scores] > scores[b[0] as keyof typeof scores] ? a : b
  )[0] as EmotionTone;

  return scores[maxEmotion as keyof typeof scores] > 0 ? maxEmotion : 'neutral';
}

// 문장 스타일 분석 함수
function analyzeSentenceStyle(text: string): SentenceStyle {
  if (text.includes('?') || text.includes('까요') || text.includes('나요')) {
    return 'interrogative';
  }
  if (text.includes('!') || text.includes('세요') || text.includes('하기') || text.includes('하십시오')) {
    return text.includes('!') ? 'exclamatory' : 'imperative';
  }
  return 'declarative';
}

// 키워드 추출 함수
function extractKeywords(text: string): string[] {
  const commonWords = ['은', '는', '이', '가', '을', '를', '에', '에서', '로', '으로', '와', '과', '도', '만', '부터', '까지', '의', '입니다', '됩니다', '있습니다'];
  const words = text.replace(/[^\w\s가-힣]/g, ' ').split(/\s+/);
  
  return words
    .filter(word => word.length > 1 && !commonWords.includes(word))
    .reduce((acc: string[], word) => {
      if (!acc.includes(word)) acc.push(word);
      return acc;
    }, [])
    .slice(0, 5); // 상위 5개 키워드만 반환
}

// 톤 프로파일 분석 함수
function analyzeToneProfile(text: string): TextAnalysis['toneProfile'] {
  const formalIndicators = ['됩니다', '입니다', '있습니다', '하십시오', '하시면'];
  // const casualIndicators = ['돼요', '이에요', '있어요', '해주세요', '하면'];
  
  const coldIndicators = ['확인하십시오', '준수하십시오', '금지'];
  const warmIndicators = ['함께', '편안', '따뜻', '친근', '반가워'];
  
  const indirectIndicators = ['해보세요', '어떠세요', '괜찮으시다면'];
  const directIndicators = ['하기', '하세요', '필수', '반드시'];

  const formality = formalIndicators.some(indicator => text.includes(indicator)) ? 'formal' : 'casual';
  
  let friendliness: 'cold' | 'neutral' | 'warm' = 'neutral';
  if (warmIndicators.some(indicator => text.includes(indicator))) friendliness = 'warm';
  else if (coldIndicators.some(indicator => text.includes(indicator))) friendliness = 'cold';
  
  let directness: 'indirect' | 'moderate' | 'direct' = 'moderate';
  if (directIndicators.some(indicator => text.includes(indicator))) directness = 'direct';
  else if (indirectIndicators.some(indicator => text.includes(indicator))) directness = 'indirect';

  return { formality, friendliness, directness };
}

// 텍스트 분석 및 변환 제안 함수
function analyzeText(text: string): TextAnalysis {
  const emotion = analyzeEmotion(text);
  const sentenceStyle = analyzeSentenceStyle(text);
  const keywords = extractKeywords(text);
  const toneProfile = analyzeToneProfile(text);
  
  const suggestedChanges = UX_PATTERNS
    .filter(pattern => text.includes(pattern.pattern))
    .map(pattern => ({
      original: pattern.pattern,
      suggested: pattern.replacement,
      description: pattern.description,
      category: pattern.category
    }));

  return {
    originalText: text,
    emotion,
    sentenceStyle,
    keywords,
    suggestedChanges,
    toneProfile
  };
}

// 텍스트 변환 적용 함수
function applyToneConversion(text: string, selectedPatterns?: string[]): string {
  let convertedText = text;
  
  const patternsToApply = selectedPatterns 
    ? UX_PATTERNS.filter(p => selectedPatterns.includes(p.pattern))
    : UX_PATTERNS;
  
  for (const pattern of patternsToApply) {
    const regex = new RegExp(pattern.pattern, 'g');
    convertedText = convertedText.replace(regex, pattern.replacement);
  }
  
  return convertedText;
}

// 선택된 텍스트 노드 가져오기 함수
function getSelectedTextNodes(): TextNode[] {
  const selectedNodes = figma.currentPage.selection;
  const textNodes: TextNode[] = [];
  
  for (const node of selectedNodes) {
    if (node.type === 'TEXT') {
      textNodes.push(node);
    } else if ('children' in node) {
      // 그룹이나 프레임 내의 텍스트 노드들도 찾기
      const findTextNodes = (parent: BaseNode): void => {
        if ('children' in parent) {
          for (const child of parent.children) {
            if (child.type === 'TEXT') {
              textNodes.push(child);
            } else if ('children' in child) {
              findTextNodes(child);
            }
          }
        }
      };
      findTextNodes(node);
    }
  }
  
  return textNodes;
}

// 메시지 타입 정의
interface PluginMessage {
  type: 'analyze-text' | 'apply-conversion' | 'apply-selected-patterns';
  data?: unknown;
}

// 플러그인 초기화
function initPlugin(): void {
  const textNodes = getSelectedTextNodes();
  
  if (textNodes.length === 0) {
    figma.notify('텍스트 노드를 선택해주세요!');
    figma.closePlugin();
    return;
  }
  
  // UI 표시
  figma.showUI(__html__, { width: 400, height: 600 });
  
  // 선택된 텍스트들 분석하여 UI로 전송
  const analyses = textNodes.map(node => ({
    nodeId: node.id,
    analysis: analyzeText(node.characters)
  }));
  
  figma.ui.postMessage({
    type: 'initial-analysis',
    data: analyses
  });
}

// UI로부터 메시지 처리
figma.ui.onmessage = (msg: PluginMessage) => {
  switch (msg.type) {
    case 'analyze-text': {
      // 텍스트 재분석 요청 처리
      const textNodes = getSelectedTextNodes();
      const analyses = textNodes.map(node => ({
        nodeId: node.id,
        analysis: analyzeText(node.characters)
      }));
      
      figma.ui.postMessage({
        type: 'analysis-result',
        data: analyses
      });
      break;
    }
      
          case 'apply-conversion': {
        // 전체 변환 적용
        const allTextNodes = getSelectedTextNodes();
        let changeCount = 0;
      
      for (const node of allTextNodes) {
        const originalText = node.characters;
        const convertedText = applyToneConversion(originalText);
        
        if (originalText !== convertedText) {
          // 폰트 로드 후 텍스트 변경
          figma.loadFontAsync(node.fontName as FontName).then(() => {
            node.characters = convertedText;
          });
          changeCount++;
        }
      }
      
              figma.notify(`${changeCount}개의 텍스트가 변환되었습니다.`);
        figma.closePlugin();
        break;
      }
      
          case 'apply-selected-patterns': {
        // 선택된 패턴만 적용
        const { selectedPatterns, nodeId } = msg.data as { selectedPatterns: string[], nodeId: string };
        const selectedTextNodes = getSelectedTextNodes();
      const targetNode = selectedTextNodes.find(node => node.id === nodeId);
      
      if (targetNode) {
        const originalText = targetNode.characters;
        const convertedText = applyToneConversion(originalText, selectedPatterns);
        
        if (originalText !== convertedText) {
          figma.loadFontAsync(targetNode.fontName as FontName).then(() => {
            targetNode.characters = convertedText;
            figma.notify('선택된 패턴이 적용되었습니다.');
          });
        } else {
          figma.notify('변경할 내용이 없습니다.');
        }
      }
      break;
    }
  }
};

// 플러그인 시작
initPlugin();