type SendResponse = (response?: any) => void;

export class Messenger {
  on(type: string, callback: (data: any, sendResponse: SendResponse) => void) {
    chrome.runtime.onMessage.addListener(function (request, _, sendResponse) {
      if (request.type === type) {
        callback(request, sendResponse);
      }
    });
  }

  async sendMessage(data: any) {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage(data, function (response) {
        resolve(response);
      });
    });
  }
}
