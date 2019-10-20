// Copyright 2011 Google Inc. All Rights Reserved.

/**
 * @fileoverview Main JavaScript executed by the background page.
 * @author smus@google.com (Boris Smus)
 */
var questionList = new st.QuestionList();

chrome.storage.sync.get(['tags'], result => {
  var tags = JSON.parse(result.tags || '[]');
  if (!tags.length) {
    // Open the options page
    chrome.tabs.create({url: 'options.html'});
  }
  questionList.setTags(tags);
  questionList.registerCountCallback(function() {
    var count = questionList.getQuestionCount();
    chrome.browserAction.setBadgeText({
      text: (count > 0 ? count.toString() : '')
    });
  });
  questionList.update();
  questionList.scheduleUpdates();
});