// Copyright 2011 Google Inc. All Rights Reserved.

/**
 * @fileoverview View logic for the Stack Track popup page.
 * @author smus@google.com (Boris Smus)
 */

// Get background page.
var background = chrome.extension.getBackgroundPage();
var st = background.st;
var questionList = background.questionList;

/**
 * Establish the popup namespace.
 */
st.popup = st.popup || {};

/**
 * @constructor
 * Top level view in the popup.
 */
st.popup.PopupView = function() {
  this.questionList = questionList;
  this.questionListView = new st.popup.QuestionListView(questionList);

  // Setup event handlers.
  this.handlers = {
    archive: this.archiveRead,
    refresh: this.refresh,
    next: this.goNext,
    prev: this.goPrev,
    options: this.openOptions
  };
  var ctx = this;
  for (var id in this.handlers) {
    // Closure for this loop.
    (function(handler) {
      document.getElementById(id).addEventListener('click', function(e) {
        handler.call(ctx);
      });
    })(this.handlers[id]);
  }
};

/**
 * Renders the popup view.
 */
st.popup.PopupView.prototype.render = function() {
  this.questionListView.render();
};

/**
 * Archive all of the questions marked as read.
 */
st.popup.PopupView.prototype.archiveRead = function() {
  var count = this.questionList.getQuestionCount(st.State.READ);
  this.questionList.archiveRead();
  var newCount = this.questionList.getQuestionCount(st.State.READ);
  this.questionListView.setPage(0);
  this.questionListView.render();
  var diff = count - newCount;
  if (diff) {
    this.notify_('Archived ' + diff + ' read questions.');
  } else {
    this.notify_('No read questions to archive.');
  }
};

/**
 * Mark all of the questions on this page as read.
 */
st.popup.PopupView.prototype.refresh = function() {
  this.questionList.update();
  this.notify_('Fetched latest questions from Stack Exchange.');
};

/**
 * Go to the previous page.
 */
st.popup.PopupView.prototype.goPrev = function() {
  this.questionListView.prev();
  this.questionListView.render();
};


/**
 * Go to the next page.
 */
st.popup.PopupView.prototype.goNext = function() {
  this.questionListView.next();
  this.questionListView.render();
};

/**
 * Load the options page.
 */
st.popup.PopupView.prototype.openOptions = function() {
  window.open('options.html');
};

/**
 * @private
 * Show a temporary butterbar.
 * @param {string} message The message to display.
 */
st.popup.PopupView.prototype.notify_ = function(message) {
  var butterBar = document.querySelector('#butterbar');
  butterBar.querySelector('p').innerText = message;
  butterBar.classList.add('shown');
  setTimeout(function() {
    butterBar.classList.remove('shown');
  }, 2000);
};
