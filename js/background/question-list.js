// Copyright 2011 Google Inc. All Rights Reserved.

/**
 * @fileoverview The QuestionList model layer for the StackTrack extension.
 * @author smus@google.com (Boris Smus)
 */
var st = st || {};


/**
 * Key of the StackTrack application.
 * @type {string}
 */
st.API_KEY = 'rVsFMHFCgUKDbmeYIpeaGA';


/**
 * Template to get unanswered questions using the QuestionList.
 * @type {string}
 */
st.UNANSWERED_URL = 'http://api.{{root}}/1.1/questions/' +
    'unanswered/?tagged={{tagged}}&pagesize={{pagesize}}' +
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
  },
  {
    name: 'Super User',
    root: 'superuser.com'
  },
  {
    name: 'Server Fault',
    root: 'serverfault.com'
  },
  {
    name: 'Ask Ubuntu',
    root: 'askubuntu.com'
  },
  {
    name: 'Gaming',
    root: 'gaming.stackexchange.com'
  },
  {
    name: 'Programmers',
    root: 'programmers.stackexchange.com'
  },
  {
    name: 'Mathematics',
    root: 'math.stackexchange.com'
  },
  {
    name: 'Apple',
    root: 'apple.stackexchange.com'
  },
  {
    name: 'English Language and Usage',
    root: 'english.stackexchange.com'
  },
  {
    name: 'TeX - LaTeX',
    root: 'tex.stackexchange.com'
  },
  {
    name: 'Android Enthusiasts',
    root: 'android.stackexchange.com'
  },
  {
    name: 'WordPress',
    root: 'wordpress.stackexchange.com'
  },
  {
    name: 'Unix and Linuxr',
    root: 'unix.stackexchange.com'
  },
  {
    name: 'Web Applications',
    root: 'webapps.stackexchange.com'
  },
  {
    name: 'OnStartups',
    root: 'answers.onstartups.com'
  },
  {
    name: 'SharePoint',
    root: 'sharepoint.stackexchange.com'
  },
  {
    name: 'Webmasters',
    root: 'webmasters.stackexchange.com'
  },
  {
    name: 'Cooking',
    root: 'cooking.stackexchange.com'
  },
  {
    name: 'Statistical Analysis',
    root: 'stats.stackexchange.com'
  },
  {
    name: 'Electrical Engineering',
    root: 'electronics.stackexchange.com'
  },
  {
    name: 'Photography',
    root: 'photo.stackexchange.com'
  },
  {
    name: 'Drupal Answers',
    root: 'drupal.stackexchange.com'
  },
  {
    name: 'GIS',
    root: 'gis.stackexchange.com'
  },
  {
    name: 'Physics',
    root: 'physics.stackexchange.com'
  },
  {
    name: 'Database Administrators',
    root: 'dba.stackexchange.com'
  },
  {
    name: 'Code Review',
    root: 'codereview.stackexchange.com'
  },
  {
    name: 'Home Improvement',
    root: 'diy.stackexchange.com'
  },
  {
    name: 'IT Security',
    root: 'security.stackexchange.com'
  },
  {
    name: 'Theoretical Computer Science',
    root: 'cstheory.stackexchange.com'
  },
  {
    name: 'Personal Finance and Money',
    root: 'money.stackexchange.com'
  },
  {
    name: 'Skeptics',
    root: 'skeptics.stackexchange.com'
  },
  {
    name: 'Role-playing Games',
    root: 'rpg.stackexchange.com'
  },
  {
    name: 'Stack Apps',
    root: 'stackapps.com'
  },
  {
    name: 'Science Fiction and Fantasy',
    root: 'scifi.stackexchange.com'
  },
  {
    name: 'Jewish Life and Learning',
    root: 'judaism.stackexchange.com'
  },
  {
    name: 'Bicycles',
    root: 'bicycles.stackexchange.com'
  },
  {
    name: 'Graphic Design',
    root: 'graphicdesign.stackexchange.com'
  },
  {
    name: 'Fitness and Nutrition',
    root: 'fitness.stackexchange.com'
  },
  {
    name: 'Writers',
    root: 'writers.stackexchange.com'
  },
  {
    name: 'Code Golf',
    root: 'codegolf.stackexchange.com'
  },
  {
    name: 'Board and Card Games',
    root: 'boardgames.stackexchange.com'
  },
  {
    name: 'Homebrew',
    root: 'homebrew.stackexchange.com'
  },
  {
    name: 'Project Management',
    root: 'pm.stackexchange.com'
  },
  {
    name: 'Musical Practice and Performance',
    root: 'music.stackexchange.com'
  },
  {
    name: 'Parenting',
    root: 'parenting.stackexchange.com'
  },
  {
    name: 'Travel',
    root: 'travel.stackexchange.com'
  },
  {
    name: 'Audio-Video Production',
    root: 'avp.stackexchange.com'
  },
  {
    name: 'Quantitative Finance',
    root: 'quant.stackexchange.com'
  },
  {
    name: 'Christianity',
    root: 'christianity.stackexchange.com'
  },
  {
    name: 'Japanese Language and Usage',
    root: 'japanese.stackexchange.com'
  },
  {
    name: 'Software Quality Assurance and Testing',
    root: 'sqa.stackexchange.com'
  },
  {
    name: 'Motor Vehicle Maintenance and Repair',
    root: 'mechanics.stackexchange.com'
  },
  {
    name: 'Personal Productivity',
    root: 'productivity.stackexchange.com'
  },
  {
    name: 'German Language and Usage',
    root: 'german.stackexchange.com'
  },
  {
    name: 'Gardening and Landscaping',
    root: 'gardening.stackexchange.com'
  },
  {
    name: 'Philosophy',
    root: 'philosophy.stackexchange.com'
  },
  {
    name: 'Cryptography',
    root: 'crypto.stackexchange.com'
  },
  {
    name: 'Bitcoin',
    root: 'bitcoin.stackexchange.com'
  },
  {
    name: 'Astronomy',
    root: 'astronomy.stackexchange.com'
  },
  {
    name: 'French Language and Usage',
    root: 'french.stackexchange.com'
  },
  {
    name: 'Theoretical Physics',
    root: 'theoreticalphysics.stackexchange.com'
  },
  {
    name: 'Literature',
    root: 'literature.stackexchange.com'
  },
  {
    name: 'Linguistics',
    root: 'linguistics.stackexchange.com'
  },
  {
    name: 'Signal Processing',
    root: 'dsp.stackexchange.com'
  },
  {
    name: 'LEGO® Answers',
    root: 'bricks.stackexchange.com'
  },
  {
    name: 'History',
    root: 'history.stackexchange.com'
  },
  {
    name: 'Spanish Language and Usage',
    root: 'spanish.stackexchange.com'
  },
  {
    name: 'Economics',
    root: 'economics.stackexchange.com'
  },
  {
    name: 'Computational Science',
    root: 'scicomp.stackexchange.com'
  },
  {
    name: 'Biblical Hermeneutics',
    root: 'hermeneutics.stackexchange.com'
  },
  {
    name: 'Healthcare IT',
    root: 'healthcareit.stackexchange.com'
  },
  {
    name: 'Firearms',
    root: 'firearms.stackexchange.com'
  },
  {
    name: 'Movies',
    root: 'movies.stackexchange.com'
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
  for (var i = 0; i < data.questions.length; i++) {
    var q = new st.Question(data.questions[i], this);
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
