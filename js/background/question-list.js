// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview The QuestionList model layer for the StackTrack extension.
 * @author smus@google.com (Boris Smus)
 * @author e.bidelman@google.com (Eric Bidelman)
 */
var st = st || {};


/**
 * Key of the StackTrack application.
 * @type {string}
 */
st.API_KEY = 'dHa9ci5uMP1DpelMw*c**Q((';


/**
 * Template to get unanswered questions using the QuestionList.
 * @type {string}
 */
st.UNANSWERED_URL = 'https://api.stackexchange.com/2.2/questions/' +
    'unanswered/?site={{root}}&tagged={{tagged}}&pagesize={{pagesize}}' +
    '&jsonp=st.callbacks.{{callback}}&key={{key}}';

/**
 * Default number of questions to get initially.
 * @type {number}
 */
st.INITIAL_QUANTITY = 5;


/**
 * Default number of questions to get during every update.
 * @type {number}
 */
st.UPDATE_QUANTITY = 5;


/**
 * Default update interval.
 * @type {number}
 */
st.UPDATE_INTERVAL = 60 * 1000; // every minute


/**
 * Enum for states that a question can be in.
 * @enum {number}
 */
st.State = {
  NORMAL: 1,
  READ: 2,
  ARCHIVED: 3
};


/**
 * Describes all Stack Exchange networks we are interested in.
 * TODO(smus): Make this auto-populate from an API call.
 * @type {!Object}
 * @const
 */
st.NETWORK_INFO = {
  'stackoverflow': {
    name: 'Stack Overflow',
    root: 'stackoverflow.com'
  },
  'ux': {
    name: 'User Experience',
    root: 'ux.stackexchange.com'
  },
  'gamedev': {
    name: 'Game Development',
    root: 'gamedev.stackexchange.com'
  }
};


/**
 * Namespace for JSONP callbacks.
 * @type {!Object}
 */
st.callbacks = {};



/**
 * Provides a container for stack exchange questions.
 * @constructor
 */
st.QuestionList = function() {
  /**
   * Container for all of the questions known to ths list.
   * @type {!Object}
   * @private
   */
  this.questions_ = {};

  /**
   * Container for all of the SO tags tracked by this list.
   * @type {!Array.<!st.Tag>}
   */
  this.tags = [];

  /**
   * Structure storing which questions were unread, read and archived.
   * @type {!Object}
   * @private
   */
  this.questionState_ = localStorage.getItem('questionState') ?
      JSON.parse(localStorage.getItem('questionState')) : {};

  /**
   * Counter for JSONP callbacks.
   * @type {number}
   * @private
   */
  this.jsonCount_ = 0;
};


/**
 * Sets which tags to monitor.
 * @param {!Array.<!st.Tag>} tags Array of Tags to monitor.
 */
st.QuestionList.prototype.setTags = function(tags) {
  this.tags = tags.map(function(tagData) {
    return new st.Tag(tagData);
  });
};


/**
 * Resets the questions and question state.
 */
st.QuestionList.prototype.reset = function() {
  this.questions_ = {};
  this.questionState_ = {};
};


/**
 * Gets the unanswered questions that you haven't looked at already.
 * @param {string=} opt_sort The param to use when sorting.
 * @param {number=} opt_limit How many results to return.
 * @param {number=} opt_offset Index to start at.
 * @return {!Array.<!st.Question>} Array of questions.
 */
st.QuestionList.prototype.getQuestions =
    function(opt_sort, opt_limit, opt_offset) {
  var out = [];
  for (var id in this.questions_) {
    var q = this.questions_[id];
    // Only add unarchived questions.
    if (q.state != st.State.ARCHIVED) {
      out.push(q);
    }
  }
  if (opt_sort != undefined) {
    var sort = opt_sort;
    // Sort the questions by criteria. -criteria means reversed.
    var mul = sort[0] == '-' ? -1 : 1;
    sort = sort[0] == '-' ? sort.substring(1) : sort;
    out = out.sort(function(a, b) {
      return mul * (b[sort] - a[sort]);
    });
  }
  if (opt_offset != undefined) {
    out = out.slice(opt_offset, out.length);
  }
  if (opt_limit != undefined) {
    // Limit the response.
    out = out.slice(0, opt_limit);
  }
  return out;
};


/**
 * Updates the local cache of questions with new ones that may have been
 * added.
 * @param {number=} opt_quantity How many questions to load.
 */
st.QuestionList.prototype.update = function(opt_quantity) {
  var quantity = opt_quantity != undefined ? opt_quantity :
      st.INITIAL_QUANTITY;
  var ctx = this;
  // Iterate for each tag we watch.
  for (var i = 0; i < this.tags.length; i++) {
    ctx.fetchTagQuestions_(this.tags[i], quantity);
  }
};


/**
 * Fetches questions corresponding to a specified tag.
 * @param {!st.Tag} tag The tag to fetch questions for.
 * @param {number} quantity The number of items to fetch.
 * @private
 */
st.QuestionList.prototype.fetchTagQuestions_ = function(tag, quantity) {
  var url = st.UNANSWERED_URL.
      replace('{{root}}', tag.getNetwork().root).
      replace('{{tagged}}', tag.name).
      replace('{{pagesize}}', quantity).
      replace('{{key}}', st.API_KEY);
  var ctx = this;
  this.makeJSONPRequest_(url, function(data) {
    ctx.parseResults_.call(ctx, data, tag);
  });
};


/**
 * Parses results from a StackOverflow API request and puts them inside the
 * this.questions_ object.
 * @param {!Object} data Response from the SO server.
 * @param {!st.Tag} tag The tag for which the response came.
 * @private
 */
st.QuestionList.prototype.parseResults_ = function(data, tag) {
  var didCountChange = false;
  for (var i = 0; i < data.items.length; i++) {
    var q = new st.Question(data.items[i], this);
    // See if an existing StackOverflowQuestion with same doesn't exist, or this
    // one is newer, update.
    var existingQ = this.questions_[q.questionId];
    if (!existingQ || q.lastActivityDate > existingQ.lastActivityDate) {
      this.questions_[q.questionId] = q;
      // If it's a new question, and there's a count callback, fire it.
      if (!existingQ) {
        didCountChange = true;
      }
    }
    // Mark read if necessary.
    q.state = this.questionState_[q.questionId] || st.State.NORMAL;
    // Add tag information.
    q.mainTag = tag;
  }
  if (didCountChange && this.countCallback) {
    this.countCallback();
  }
};


/**
 * Helper method for enabling JSONP requests.
 * @param {string} url Url to the JSONP endpoint.
 * @param {function} callback Called with the result when request succeeds.
 * @private
 */
st.QuestionList.prototype.makeJSONPRequest_ = function(url, callback) {
  // Create a temporary callback function
  var cbName = 'json' + this.jsonCount_++;
  st.callbacks[cbName] = callback;
  url = url.replace('{{callback}}', cbName);
  // Append the script to the main body.
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = url;
  document.getElementsByTagName('body')[0].appendChild(script);
};


/**
 * Sets up a timer to update unread count at a regular interval.
 * @param {number=} opt_period How often (in ms) to poll the StackOverflow API.
 * @param {number=} opt_quantity How many items to get.
 */
st.QuestionList.prototype.scheduleUpdates = function(opt_period, opt_quantity) {
  var period = opt_period != undefined ? opt_period : st.UPDATE_INTERVAL;
  var quantity = opt_quantity != undefined ? opt_quantity : st.UPDATE_QUANTITY;

  var ctx = this;
  this.timer = setInterval(function() {
    ctx.update.call(ctx, quantity);
  }, period);
};


/**
 * Persists the read/unread question state to a localStorage database.
 */
st.QuestionList.prototype.saveQuestionState = function() {
  localStorage.setItem('questionState', JSON.stringify(this.questionState_));
};


/**
 * Registers a callback that is to be fired when the number of unread
 * questions changes.
 * @param {function} callback The function to call when the number of unread
 * questions changes.
 */
st.QuestionList.prototype.registerCountCallback = function(callback) {
  this.countCallback = callback;
};


/**
 * Gets the number of questions of a given state.
 * @param {number=} opt_state Optional parameter to specify the state.
 * @return {number} Number of unread questions.
 */
st.QuestionList.prototype.getQuestionCount = function(opt_state) {
  var state = opt_state == undefined ? st.State.NORMAL : opt_state;
  var questions = this.getQuestions();
  var count = 0;
  for (var i = 0; i < questions.length; i++) {
    if (questions[i].state == state) {
      count++;
    }
  }
  return count;
};


/**
 * Iterates all questions and archives the read ones.
 */
st.QuestionList.prototype.archiveRead = function() {
  var questions = this.getQuestions();
  for (var i = 0; i < questions.length; i++) {
    var q = questions[i];
    if (q.state == st.State.READ) {
      q.state = st.State.ARCHIVED;
    }
    this.questionState_[q.questionId] = q.state;
  }

  // Then save the state.
  this.saveQuestionState();

  // Callback since count may have changed.
  if (this.countCallback) {
    this.countCallback();
  }
};


/**
 * Marks each of the questions in the specified array as read.
 * @param {!Array.<!st.Question>} questions Array of questions to operate on.
 */
st.QuestionList.prototype.markRead = function(questions) {
  for (var i = 0; i < questions.length; i++) {
    var q = questions[i];
    q.state = st.State.READ;
    this.questionState_[q.questionId] = q.state;
  }

  // Then save the state.
  this.saveQuestionState();

  // Callback since count may have changed.
  if (this.countCallback) {
    this.countCallback();
  }
};
