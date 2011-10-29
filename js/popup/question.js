// Copyright 2011 Google Inc. All Rights Reserved.

/**
 * @fileoverview View logic for a QuestionView, which knows how to render a
 * st.Question model.
 * @author smus@google.com (Boris Smus)
 */

/**
 * Establish the popup namespace.
 */
st.popup = st.popup || {};

/**
 * The template used to render a single question
 */
st.popup.QUESTION_TEMPLATE =
'<li class="question {{className}}" data-question-id="{{questionId}}">' +
  '<div class="numbers">' +
    '<span class="view_count visible">{{viewCount}}</span>' +
    '<span class="up_vote_count">{{upVoteCount}}</span>' +
    '<span class="answer_count">{{answerCount}}</span>' +
  '</div>' +
  '<div class="buttons">' +
    '<a class="kd-button mini mark-read" style="-webkit-user-select: none;">' +
        'mark read</a>' +
    '<a class="kd-button mini mark-unread"' +
        'style="-webkit-user-select: none;">mark unread</a>' +
  '</div>' +
  '<div class="name">{{title}}</div>' +
  '<div class="more">' +
    '<span class="tags">{{tags}}</span>&nbsp;' +
    '<span class="creation_date">Asked {{creationDate}}</span>&nbsp;by&nbsp;' +
    '<span class="owner_display_name">{{ownerDisplayName}}</span>' +
    ' (<span class="owner_reputation">{{ownerReputation}}</span>)' +
  '</div>' +
'</li>';

/**
 * What the counts mean.
 */
st.popup.COUNT_TYPES = ['viewCount', 'upVoteCount', 'answerCount'];

/**
 * Labels for the counts.
 */
st.popup.COUNT_LABELS = {
  upVoteCount: 'Votes',
  viewCount: 'Views',
  answerCount: 'Answers'
};

/**
 * @constructor
 * A view representing a single question.
 * @param {object} question Corresponding Question object.
 * @param {st.popup.QuestionListView} parentView Parent view.
 */
st.popup.QuestionView = function(question, parentView) {
  this.question = question;
  this.countType = 0;
  this.parentView = parentView;
};

/**
 * Renders the question into a DOM element, and affixes proper event handlers.
 * @return {object} DOMElement.
 */
st.popup.QuestionView.prototype.render = function() {
  var data = {};
  for (var key in this.question) {
    var value = this.question[key];
    if (typeof value != 'function') {
      data[key] = value;
    }
  }
  data.creationDate = this.formatDate_(new Date(data.creationDate * 1000));
  data.lastActivityDate = this.formatDate_(
      new Date(data.lastActivityDate * 1000));
  data.ownerDisplayName = data.owner.displayName;
  data.ownerReputation = data.owner.reputation;
  data.className = this.question.state == st.State.READ && 'read' || '';
  data.tags = (this.parentView.shouldShowTags() ?
               this.formatTag_(this.question.mainTag) : '');

  var html = this.renderTemplate_(st.popup.QUESTION_TEMPLATE, data);
  var el = this.makeElement_(html);

  var ctx = this;
  // Setup the click handler for the question.
  el.addEventListener('click', function(e) {
    ctx.click();
  });

  // Setup the event handlers for the number on the left part of the question.
  var number = el.querySelector('.numbers');
  number.addEventListener('click', function(e) {
    e.stopPropagation();
    ctx.numberClick();
  });
  number.addEventListener('mouseover', function(e) {
    ctx.numberOver(e);
  });
  number.addEventListener('mouseout', function(e) {
    ctx.numberOut(e);
  });

  el.querySelector('.buttons').addEventListener('click', function(e) {
    e.stopPropagation();
  });
  el.querySelector('.mark-read').addEventListener('click', function(e) {
    ctx.markRead();
  });
  el.querySelector('.mark-unread').addEventListener('click', function(e) {
    ctx.markUnread();
  });

  this.el = el;
  return el;
};

/**
 * Handler for when the question is clicked.
 * Opens the question on SO and marks the question as read.
 */
st.popup.QuestionView.prototype.click = function() {
  var id = this.question.questionId;
  // Mark the question as read.
  this.question.setState(st.State.READ);
  // Open the question in a new tab.
  chrome.tabs.create({url: this.question.getURL()});
  // Close the popup.
  window.close();
};

/**
 * Handler for when the number is clicked.
 * Toggles between number types.
 * @param {object} e Event payload.
 */
st.popup.QuestionView.prototype.numberClick = function(e) {
  this.countType = (this.countType + 1) % st.popup.COUNT_TYPES.length;
  var id = st.popup.COUNT_TYPES[this.countType];
  var label = st.popup.COUNT_LABELS[id];
  // Update the visible number.
  var nodes = this.el.querySelector('.numbers').childNodes;
  for (var i = 0; i < nodes.length; i++) {
    var node = nodes[i];
    if (i == this.countType) {
      node.classList.add('visible');
    } else {
      node.classList.remove('visible');
    }
  }
  // Update the tooltip label.
  var tooltip = document.querySelector('#tooltip-text');
  tooltip.innerText = label;
};

/**
 * Handler for when the number is hovered over.
 * Shows the label near the mouse.
 * @param {object} e Event payload.
 */
st.popup.QuestionView.prototype.numberOver = function(e) {
  var tooltip = document.getElementById('kd-tooltip');
  tooltip.classList.add('visible');
  // Position the tooltip accordingly.
  tooltip.style.left = '20px';
  // Don't let it flow over the page bounds.
  tooltip.style.top = Math.min((e.clientY + 15), document.height - 30) + 'px';
  // Update the tooltip label.
  var id = st.popup.COUNT_TYPES[this.countType];
  var label = st.popup.COUNT_LABELS[id];
  var tooltipText = document.querySelector('#tooltip-text');
  tooltipText.innerText = label;
};

/**
 * Handler for when the number is hovered out of.
 * Hides the label.
 */
st.popup.QuestionView.prototype.numberOut = function() {
  var tooltip = document.getElementById('kd-tooltip');
  tooltip.classList.remove('visible');
};

/**
 * Handler for when the mark unread button is clicked.
 */
st.popup.QuestionView.prototype.markUnread = function() {
  this.question.setState(st.State.NORMAL);
  this.parentView.render();
};

/**
 * Handler for when the mark read button is clicked.
 */
st.popup.QuestionView.prototype.markRead = function() {
  this.question.setState(st.State.READ);
  this.parentView.render();
};

/**
 * @private
 * Helper function for formatting Date objects into relative dates
 * @param {object} date Date object.
 * @return {string} Formatted time.
 */
st.popup.QuestionView.prototype.formatDate_ = function(date) {
  var diff = ((new Date()).getTime() - date.getTime()) / 1000;
  var dayDiff = Math.floor(diff / 86400);
  if (isNaN(dayDiff) || dayDiff < 0) {
    return;
  }
  return dayDiff === 0 && (
      diff < 60 && 'just now' ||
      diff < 120 && '1 minute ago' ||
      diff < 3600 && Math.floor(diff / 60) + ' minutes ago' ||
      diff < 7200 && '1 hour ago' ||
      diff < 86400 && Math.floor(diff / 3600) + ' hours ago') ||
      dayDiff == 1 && 'yesterday' ||
      dayDiff < 7 && dayDiff + ' days ago' ||
      dayDiff < 31 && Math.ceil(dayDiff / 7) + ' weeks ago' ||
      'over a month ago';
};

/**
 * @private
 * Helper function for creating an element out of an HTML string.
 * @param {string} html Markup string.
 * @return {object} Newly created DOM element.
 */
st.popup.QuestionView.prototype.makeElement_ = function(html) {
  var div = document.createElement('div');
  div.innerHTML = html;
  return div.childNodes[0];
};

/**
 * @private
 * Helper function to populate a template with data.
 * @param {string} template The template to use.
 * @param {object} data The data to populate with.
 * @return {string} Resulting string.
 */
st.popup.QuestionView.prototype.renderTemplate_ = function(template, data) {
  var out = template;
  for (var key in data) {
    var value = data[key];
    // Strip the markup from the key (if present).
    var tmp = document.createElement('div');
    tmp.innerHTML = value;
    value = tmp.textContent;
    out = out.replace('{{' + key + '}}', value);
  }
  return out;
};

/**
 * @private
 * @param {SOTag} tag The tag.
 * @return {string} markup for the given tag.
 */
st.popup.QuestionView.prototype.formatTag_ = function(tag) {
  return '[' + tag.network + ':' + tag.name + ']';
};
