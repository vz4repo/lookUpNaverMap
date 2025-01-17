(async () => {
  try {
    // WebAssembly 모듈 로드 (chrome.runtime.getURL로 경로 생성)
    const wasmModuleUrl = chrome.runtime.getURL('pkg/search_for_naver_map.js');
    const wasm = await import(wasmModuleUrl);

    // 메시지 처리
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === "processQuery") {
        const processedQuery = wasm.process_query(message.query);

        const url = `https://map.naver.com/v5/search/${processedQuery}`;
        window.open(url, "_blank");
        sendResponse({ success: true });
      }
    });
  } catch (error) {
    console.error("Error loading WebAssembly module:", error);
  }
})();
