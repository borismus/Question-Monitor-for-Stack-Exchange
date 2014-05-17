// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview The Question model layer for the StackTrack extension.
 * @author smus@google.com (Boris Smus)
 * @author e.bidelman@google.com (Eric Bidelman)
 */

var st = st || {};


/**
 * A single stack overflow post.
 * @param {!Object} params Parameters for creating this question.
 * @param {!st.QuestionList} collection Collection of questions.
 * @constructor
 */
st.Question = function(params, collection) {
  /**
   * Title of the question.
   * @type {string}
   */
  this.title = params.title;

  /**
   * When the question was created.
   * @type {string}
   */
  this.creationDate = params.creation_date;

  /**
   * When the question was last active.
   * @type {string}
   */
  this.lastActivityDate = params.last_activity_date;

  /**
   * Number of up votes.
   * @type {number}
   */
  this.upVoteCount = params.up_vote_count;

  /**
   * Number of views.
   * @type {number}
   */
  this.viewCount = params.view_count;

  /**
   * Number of answers.
   * @type {number}
   */
  this.answerCount = params.answer_count;

  /**
   * Unique question identifier.
   * @type {number}
   */
  this.questionId = params.question_id;

  /**
   * URL where the question resides.
   * @type {string}
   */
  this.questionAnswersUrl = params.link

  /**
   * Information about the user who asked the question.
   * @type {!Object}
   */
  this.owner = params.owner ? {
        displayName: params.owner.display_name,
        reputation: params.owner.reputation
      } : {
        displayName: 'unknown',
        reputation: 0
      };

  /**
   * Semicolon-separated tags with which the question is tagged.
   * @type {string}
   */
  this.tags = params.tags;

  /**
   * The state (unread, read, archived) of the question.
   * @type {number}
   */
  this.state = st.State.NORMAL;

  /**
   * The QuestionList to which the question belongs.
   * @type {!st.QuestionList}
   */
  this.collection = collection;
};

/**
 * The primary tag this question is tagged with (set after reloading question
 * states from the localStorage).
 * @type {st.Tag}
 */
st.Question.prototype.mainTag = null;

/**
 * @return {string} Network specific URL to the question.
 */
st.Question.prototype.getURL = function() {
  //return 'http://' + this.mainTag.getNetwork().root + this.questionAnswersUrl;
  return this.questionAnswersUrl;
};

/**
 * Sets the state of the question and updates the collection.
 * @param {number} state The new state.
 */
st.Question.prototype.setState = function(state) {
  if (state != this.state) {
    this.state = state;
    // Callback since count may have changed.
    if (this.collection.countCallback) {
      this.collection.countCallback();
    }
  }
};
