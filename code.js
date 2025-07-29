"use strict";
// 톤 변환 규칙들
const TONE_RULES = [
    // 행동 유도 패턴 (~해보세요 → ~하기)
    {
        pattern: /확인해보세요/g,
        replacement: '확인하기',
        description: '친근한 어조'
    },
    {
        pattern: /이용해보세요/g,
        replacement: '이용하기',
        description: '간결한 표현'
    },
    {
        pattern: /참여해보세요/g,
        replacement: '참여하기',
        description: '직접적 유도'
    },
    {
        pattern: /신청해보세요/g,
        replacement: '신청하기',
        description: '간편함 강조'
    },
    {
        pattern: /문의해보세요/g,
        replacement: '문의하기',
        description: '쉬운 접근'
    },
    {
        pattern: /사용해보세요/g,
        replacement: '사용하기',
        description: '간단한 표현'
    },
    {
        pattern: /클릭해보세요/g,
        replacement: '클릭하기',
        description: '직관적 유도'
    },
    // 격식체 → 친근한 표현
    {
        pattern: /됩니다/g,
        replacement: '돼요',
        description: '친근한 확인'
    },
    {
        pattern: /입니다/g,
        replacement: '이에요',
        description: '부드러운 설명'
    },
    {
        pattern: /있습니다/g,
        replacement: '있어요',
        description: '친근한 안내'
    },
    {
        pattern: /습니다/g,
        replacement: '어요',
        description: '격식체를 친근한 톤으로 변경'
    },
    // 조건문 및 요청 표현
    {
        pattern: /하시면/g,
        replacement: '하면',
        description: '간결한 조건'
    },
    {
        pattern: /하십시오/g,
        replacement: '해주세요',
        description: '정중한 요청'
    },
    // 일반 어미 패턴
    {
        pattern: /하세요/g,
        replacement: '하기',
        description: '친근한 유도'
    },
    {
        pattern: /확인하세요/g,
        replacement: '확인하기',
        description: '간단한 확인'
    },
    {
        pattern: /이용하세요/g,
        replacement: '이용하기',
        description: '편리한 이용'
    },
    {
        pattern: /참여하세요/g,
        replacement: '참여하기',
        description: '적극적 참여'
    },
    {
        pattern: /신청하세요/g,
        replacement: '신청하기',
        description: '쉬운 신청'
    },
    // 추가 유용한 패턴들
    {
        pattern: /가능합니다/g,
        replacement: '가능해요',
        description: '친근한 안내'
    },
    {
        pattern: /제공합니다/g,
        replacement: '제공해요',
        description: '부드러운 제공'
    },
    {
        pattern: /진행됩니다/g,
        replacement: '진행돼요',
        description: '친근한 진행'
    },
    {
        pattern: /완료됩니다/g,
        replacement: '완료돼요',
        description: '친근한 완료'
    }
];
// 감정 톤 분석 함수
function analyzeEmotion(text) {
    const emotionKeywords = {
        enthusiastic: ['설렘', '최고', '특가', '대박', '놀라운', '환상', '완벽', '!', '!!', '와!', '대단한'],
        friendly: ['함께', '나만의', '여러분', '친구', '가족', '편안', '따뜻', '어요', '이에요', '하기', '해요'],
        professional: ['서비스', '품질', '전문', '안전', '신뢰', '보장', '관리', '습니다', '됩니다', '제공'],
        playful: ['재미', '즐거운', 'ㅋ', '귀여운', '신나는', '웃음', '놀이', '~', 'ㅎㅎ', '헤헤']
    };
    let maxScore = 0;
    let dominantEmotion = 'neutral';
    // 각 감정 카테고리별 점수 계산
    Object.entries(emotionKeywords).forEach(([emotionType, keywords]) => {
        let score = 0;
        keywords.forEach(keyword => {
            const matches = (text.match(new RegExp(keyword, 'g')) || []).length;
            score += matches;
        });
        if (score > maxScore) {
            maxScore = score;
            dominantEmotion = emotionType;
        }
    });
    return { emotion: dominantEmotion, score: maxScore };
}
// 텍스트 분석 함수
function analyzeText(text) {
    // 문장 타입 분석
    let sentenceType = 'declarative';
    if (text.includes('?') || text.includes('까요')) {
        sentenceType = 'interrogative';
    }
    else if (text.includes('!') || text.includes('세요') || text.includes('하기')) {
        sentenceType = 'imperative';
    }
    else if (text.includes('!')) {
        sentenceType = 'exclamatory';
    }
    // 개선된 감정 톤 분석
    const emotionResult = analyzeEmotion(text);
    // 키워드 추출 (특수문자 제거 및 의미있는 단어 필터링)
    const keywords = text
        .replace(/[^\w\s가-힣]/g, ' ') // 특수문자 제거
        .split(/\s+/)
        .filter(word => word.length > 1 && !['이', '가', '을', '를', '에', '의', '와', '과', '으로', '로'].includes(word))
        .slice(0, 5);
    return {
        sentenceType,
        emotion: emotionResult.emotion,
        keywords,
        length: text.length,
        emotionScore: emotionResult.score
    };
}
// 톤 프로파일 생성
function createToneProfile(text) {
    const analysis = analyzeText(text);
    const recommendedChanges = [];
    // 각 규칙을 적용해서 변경 사항 찾기
    TONE_RULES.forEach(rule => {
        const matches = text.match(rule.pattern);
        if (matches) {
            matches.forEach(match => {
                recommendedChanges.push({
                    original: match,
                    suggested: match.replace(rule.pattern, rule.replacement),
                    rule: rule.description
                });
            });
        }
    });
    let currentTone = '중립적';
    if (analysis.emotion === 'friendly') {
        currentTone = '친근함';
    }
    else if (analysis.emotion === 'enthusiastic') {
        currentTone = '열정적';
    }
    else if (analysis.emotion === 'professional') {
        currentTone = '전문적';
    }
    else if (analysis.emotion === 'playful') {
        currentTone = '장난스러운';
    }
    return {
        currentTone,
        recommendedChanges,
        analysis
    };
}
// 텍스트 변환 적용
function applyToneChanges(text, selectedChanges) {
    let result = text;
    TONE_RULES.forEach((rule, index) => {
        if (!selectedChanges || selectedChanges.includes(index.toString())) {
            result = result.replace(rule.pattern, rule.replacement);
        }
    });
    return result;
}
// 플러그인 메인 로직
figma.showUI(__html__, {
    width: 400,
    height: 600,
    title: "ux톤 적용하기"
});
// UI로부터 메시지 받기
figma.ui.onmessage = (msg) => {
    if (msg.type === 'analyze-selection') {
        const selection = figma.currentPage.selection;
        if (selection.length === 0) {
            figma.ui.postMessage({
                type: 'error',
                message: '텍스트 노드를 선택해주세요.'
            });
            return;
        }
        const textNodes = selection.filter(node => node.type === 'TEXT');
        if (textNodes.length === 0) {
            figma.ui.postMessage({
                type: 'error',
                message: '선택된 노드 중 텍스트 노드가 없습니다.'
            });
            return;
        }
        // 첫 번째 텍스트 노드 분석
        const textNode = textNodes[0];
        const text = textNode.characters;
        const profile = createToneProfile(text);
        figma.ui.postMessage({
            type: 'analysis-result',
            data: {
                originalText: text,
                profile: profile,
                nodeId: textNode.id
            }
        });
    }
    if (msg.type === 'apply-changes') {
        const { nodeId, selectedChanges } = msg;
        try {
            const node = figma.getNodeById(nodeId);
            if (node && node.type === 'TEXT') {
                // 폰트 로드 필요
                figma.loadFontAsync(node.fontName).then(() => {
                    const newText = applyToneChanges(node.characters, selectedChanges);
                    node.characters = newText;
                    figma.ui.postMessage({
                        type: 'success',
                        message: '텍스트가 성공적으로 변경되었습니다.'
                    });
                });
            }
        }
        catch (error) {
            figma.ui.postMessage({
                type: 'error',
                message: '텍스트 변경 중 오류가 발생했습니다.'
            });
        }
    }
    if (msg.type === 'close-plugin') {
        figma.closePlugin();
    }
};
// 초기 선택된 텍스트 노드가 있다면 자동 분석
const initialSelection = figma.currentPage.selection;
const initialTextNodes = initialSelection.filter(node => node.type === 'TEXT');
if (initialTextNodes.length > 0) {
    const textNode = initialTextNodes[0];
    const text = textNode.characters;
    const profile = createToneProfile(text);
    // UI가 로드된 후 분석 결과 전송
    setTimeout(() => {
        figma.ui.postMessage({
            type: 'analysis-result',
            data: {
                originalText: text,
                profile: profile,
                nodeId: textNode.id
            }
        });
    }, 100);
}
