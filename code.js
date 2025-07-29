"use strict";
// 톤 변환 규칙들
const TONE_RULES = [
    {
        pattern: /확인해보세요/g,
        replacement: '확인하기',
        description: '명령형을 친근한 톤으로 변경'
    },
    {
        pattern: /이용해보세요/g,
        replacement: '이용하기',
        description: '명령형을 친근한 톤으로 변경'
    },
    {
        pattern: /사용해보세요/g,
        replacement: '사용하기',
        description: '명령형을 친근한 톤으로 변경'
    },
    {
        pattern: /클릭해보세요/g,
        replacement: '클릭하기',
        description: '명령형을 친근한 톤으로 변경'
    },
    {
        pattern: /됩니다/g,
        replacement: '돼요',
        description: '격식체를 친근한 톤으로 변경'
    },
    {
        pattern: /입니다/g,
        replacement: '이에요',
        description: '격식체를 친근한 톤으로 변경'
    },
    {
        pattern: /습니다/g,
        replacement: '어요',
        description: '격식체를 친근한 톤으로 변경'
    },
    {
        pattern: /해주세요/g,
        replacement: '해주기',
        description: '명령형을 친근한 톤으로 변경'
    },
    {
        pattern: /가능합니다/g,
        replacement: '가능해요',
        description: '격식체를 친근한 톤으로 변경'
    },
    {
        pattern: /제공합니다/g,
        replacement: '제공해요',
        description: '격식체를 친근한 톤으로 변경'
    }
];
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
    // 감정 톤 분석
    let emotion = 'professional';
    if (text.includes('어요') || text.includes('이에요') || text.includes('하기')) {
        emotion = 'friendly';
    }
    else if (text.includes('습니다') || text.includes('됩니다')) {
        emotion = 'formal';
    }
    else if (text.includes('야') || text.includes('아')) {
        emotion = 'casual';
    }
    // 키워드 추출
    const keywords = text
        .split(/\s+/)
        .filter(word => word.length > 1)
        .slice(0, 5);
    return {
        sentenceType,
        emotion,
        keywords,
        length: text.length
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
    let currentTone = '격식적';
    if (analysis.emotion === 'friendly') {
        currentTone = '친근함';
    }
    else if (analysis.emotion === 'casual') {
        currentTone = '캐주얼';
    }
    else if (analysis.emotion === 'formal') {
        currentTone = '매우 격식적';
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
