// Copyright 2011 Google Inc. All Rights Reserved.

/**
 * @fileoverview View logic for a QuestionListView, which knows how to render
 * arrays of st.Questions.
 * @author smus@google.com (Boris Smus)
 */

/**
 * Establish the popup namespace.
 */
st.popup = st.popup || {};

/**
 * Number of results to show per page.
 */
st.popup.PAGE_RESULTS = 7;

/**
 * @constructor
 * View representing a list of questions.
 * @param {object} questionList All of the questions.
 */
st.popup.QuestionListView = function(questionList) {
  this.sortOrder = 'creationDate';
  this.page = 0;
  this.questionList = questionList;
};

/**
 * Renders the contents of the list.
 */
st.popup.QuestionListView.prototype.render = function() {
  var questions = this.getQuestionsOnPage();

  var $ul = document.createElement('ul');
  for (var i = 0; i < questions.length; i++) {
    var question = questions[i];
    var qview = new st.popup.QuestionView(question, this);
    $ul.appendChild(qview.render());
  }
  // Add the list to the questions div.
  var $qs = document.querySelector('#questions');
  $qs.innerHTML = '';
  $qs.appendChild($ul);

  if (questions.length > 1) {
    // Add a "mark read" button to the end of the questions list
    var $read = document.createElement('div');
    $read.innerHTML = '<a id="page-read" class="kd-button" ' +
      'style="-webkit-user-select: none;">Mark page read</a>';
    var ctx = this;
    $read.querySelector('a').addEventListener('click', function() {
      ctx.questionList.markRead(questions);
      ctx.render();
    });
    $qs.appendChild($read);
  }

  this.renderPaginator_();
};

/**
 * Goes to the next page of questions.
 */
st.popup.QuestionListView.prototype.next = function() {
  this.setPage(this.page + 1);
};

/**
 * Goes to the next page of questions.
 */
st.popup.QuestionListView.prototype.prev = function() {
  this.setPage(this.page - 1);
};

/**
 * Get the questions on the current page.
 * @return {array} Questions visible on the current page.
 */
st.popup.QuestionListView.prototype.getQuestionsOnPage = function() {
  return this.questionList.getQuestions(
      this.sortOrder,
      st.popup.PAGE_RESULTS,
      this.page * st.popup.PAGE_RESULTS);
};

/**
 * Whether or not the view should show tags.
 * @return {boolean} True if there are multiple tags.
 */
st.popup.QuestionListView.prototype.shouldShowTags = function() {
  return this.questionList.tags.length > 1;
};

/**
 * @private
 * Helper function for updating the look of the paginator widget.
 */
st.popup.QuestionListView.prototype.renderPaginator_ = function() {
  var page = this.page;
  var pageResults = st.popup.PAGE_RESULTS;
  var total = this.questionList.getQuestionCount(st.State.READ) +
      this.questionList.getQuestionCount(st.State.NORMAL);
  var lastPage = Math.max(0, Math.ceil(total / pageResults) - 1);
  var start = page * pageResults + 1;
  var end = (page == lastPage ? total : start + pageResults - 1);
  var pageString = (total === 0 ?
                    '0 of 0' : start + '-' + end + ' of ' + total);
  document.querySelector('.kd-count').innerText = pageString;
  // Also, disable paginators if on first or last page.
  var $left = document.querySelector('.paginator .left').classList;
  var $right = document.querySelector('.paginator .right').classList;
  $left.remove('disabled'); $right.remove('disabled');
  if (page === 0) {
    $left.add('disabled');
  }
  if (page == lastPage) {
    $right.add('disabled');
  }
};

/**
 * Set the current page number. If out of bounds, sets to min or max page,
 * depending on the bound.
 * @param {number} page The page to go to.
 */
st.popup.QuestionListView.prototype.setPage = function(page) {
  var lastPage = Math.ceil((this.questionList.getQuestionCount(st.State.READ) +
                           this.questionList.getQuestionCount(st.State.NORMAL)) /
                           st.popup.PAGE_RESULTS) - 1;
  if (page < 0) {
    this.page = 0;
  } else if (page > lastPage) {
    this.page = lastPage;
  } else {
    this.page = page;
  }
};
