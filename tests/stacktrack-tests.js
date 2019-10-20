// Test
// Setup st.QuestionList to look at a specific set of questions
// Ensure that the set is stored.
QUnit.test('Ensure that question set is retained', function(assert) {
  var tags = [
      {name: 'google-chrome', network: 'stackoverflow'},
      {name: 'html5', network: 'stackoverflow'},
      {name: 'html5', network: 'gamedev'}
  ];
  var ql = new st.QuestionList();
  ql.setTags(tags);
  assert.equal(ql.tags.length, 3, 'Correct number of tags');
  assert.equal(ql.tags[0].name, 'google-chrome', 'Tag names do match');
  assert.equal(ql.tags[0].getNetwork().root, 'stackoverflow.com',
      'Root URLs match');
});


// Test
// Get a list of 5 unanswered questions from StackOverflow with the
// google-chrome tag. Ensure that there are in fact 5 questions.
QUnit.test('Test question list limit', function(assert) {
  var done = assert.async();

  var tags = [{name: 'google-chrome', network: 'stackoverflow'}];
  var ql = new st.QuestionList();
  ql.setTags(tags);
  ql.update(5);
  ql.registerCountCallback(function() {
    var questions = ql.getQuestions(undefined, 5, 0);
    var count = 0;
    for (var i = 0; i < questions.length; i++) {
      assert.ok(parseInt(questions[i].questionId) > 0, 'Valid ID');
      count += 1;
    }
    assert.equal(count, 5, 'Number of questions matches');
    done();
  });
});


// Test
// Get a list of 10 unanswered questions from StackOverflow and sort them by
// views. Ensure that they are sorted.
QUnit.test('Sorting by view count', function(assert) {
  var done = assert.async();

  var tags = [{name: 'google-chrome', network: 'stackoverflow'}];
  var ql = new st.QuestionList();
  ql.setTags(tags);
  ql.update(10);
  ql.registerCountCallback(function() {
    var questions = ql.getQuestions('viewCount', 10, 0);
    for (var i = 0; i < questions.length - 1; i++) {
      var q1 = questions[i];
      var q2 = questions[i+1];
      assert.ok(q1.viewCount >= q2.viewCount, 'Order: high views to low views');
    }
    done();
  });
});

QUnit.test('Reverse sorting by answer count', function(assert) {
  var done = assert.async();
  var tags = [{name: 'google-chrome', network: 'stackoverflow'}];
  var ql = new st.QuestionList();
  ql.setTags(tags);
  ql.update(10);
  ql.registerCountCallback(function() {
    var questions = ql.getQuestions('-answerCount', 10, 0);
    for (var i = 0; i < questions.length - 1; i++) {
      var q1 = questions[i];
      var q2 = questions[i+1];
      assert.ok(q1.answerCount <= q2.answerCount,
          'Order: high answers to low answers');
    }
    done();
  });
});


// Test
// Get a list of questions, do an immediate update and ensure that nothing
// changed (ie. no difference in number of questions)
QUnit.test('Adjacent updates do not change question list', function(assert) {
  var done = assert.async();
  var tags = [{name: 'google-chrome', network: 'stackoverflow'}];
  var ql = new st.QuestionList();
  ql.setTags(tags);
  ql.update();
  var count = 0;
  ql.registerCountCallback(function() {
    count = questionCounter();
    assert.equal(count, 5, 'Question count is valid');
    ql.update();
    stop();
    setTimeout(function() {
      assert.equal(questionCounter(), count,
          'Question count is unchanged after update()');
      done();
    }, 500);
  });

  function questionCounter() {
    var count = 0;
    var questions = ql.getQuestions(undefined, 5, 0);
    for (var i = 0; i < questions.length; i++) {
      count += 1;
    }
    return count;
  }
});


// Test
// Save the question state. Check that the question state was saved in the
// localStorage.
QUnit.test('Test question state serialization', function(assert) {
  var done = assert.async();
  // Start with an empty localStorage.
  localStorage.clear();
  var tags = [{name: 'google-chrome', network: 'stackoverflow'}];
  var ql = new st.QuestionList();
  ql.setTags(tags);
  ql.update(10);
  // Using a timeout here since registerCountCallback gets called by markRead, which
  // would cause an infinite loop.
  setTimeout(function() {
    ql.saveQuestionState();
    var questionState = JSON.parse(localStorage.getItem('questionState'));
    // Ensure the questionState is empty.
    assert.deepEqual(typeof questionState, 'object', "Question state is an object");
    assert.deepEqual(questionState, {}, "Question state initially empty");
    var questions = ql.getQuestions();
    // Set the first question to be read.
    var q = questions[0];
    ql.markRead([q]);
    // Ensure that the questionState now lists q as read.
    questionState = JSON.parse(localStorage.getItem('questionState'));
    assert.equal(questionState[q.questionId], st.State.READ,
        'Question state says first question is read');
    assert.equal(questionState[questions[1]], undefined, 'Other questions are unread');
    done();
  }, 500);
});
// NOSUBMIT: Force git5 to add this file to CL
