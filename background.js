// 국가별 언어 코드 텍스트 정의
const menuTitles = {
  ko: "네이버 지도에서 '%s' 검색",
  ja: "'%s' をネイバーマップで検索",
  en: "Search NaverMap for '%s'" // 기본값 (영어)
};

// 브라우저 언어 감지
const userLanguage = navigator.language.split('-')[0]; // "ko", "ja", "en"
const menuTitle = menuTitles[userLanguage] || menuTitles["en"]; // 기본값 영어로 설정

// 컨텍스트 메뉴 생성
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "searchNaverMap",
    title: menuTitle,
    contexts: ["selection"], // 텍스트 선택 시에만 표시
  });
});

// 컨텍스트 메뉴 클릭 이벤트 처리
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "searchNaverMap" && info.selectionText) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: processQueryAndOpenTab,
      args: [info.selectionText]
    });
  }
});

// 컨텍스트 메뉴 클릭 시 실행될 함수
function processQueryAndOpenTab(selectionText) {
  const processQuery = (query) => query.trim().replace(" ", "+");
  const processedQuery = processQuery(selectionText);
  const url = `https://map.naver.com/v5/search/${processedQuery}`;
  window.open(url, "_blank");
}
