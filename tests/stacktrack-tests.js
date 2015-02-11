// Test
// Setup st.QuestionList to look at a specific set of questions
// Ensure that the set is stored.
test('Ensure that question set is retained', function() {
  var tags = [
      {name: 'google-chrome', network: 'stackoverflow'},
      {name: 'html5', network: 'stackoverflow'},
      {name: 'html5', network: 'gamedev'}
  ];
  var ql = new st.QuestionList();
  ql.setTags(tags);
  equal(ql.tags.length, 3, 'Correct number of tags');
  equal(ql.tags[0].name, 'google-chrome', 'Tag names do match');
  equal(ql.tags[0].getNetwork().root, 'stackoverflow.com',
      'Root URLs match');
});


test('Ensure that question titles are escaped correctly', function(){
  //questionData from /2.2/questions/26227103?order=desc&sort=activity&site=stackoverflow
  var questionData = {
      "tags": [
        "html",
        "mysql",
        "sql",
        "sql-server",
        "coldfusion"
      ],
      "owner": {
        "reputation": 45,
        "user_id": 3966081,
        "user_type": "registered",
        "profile_image": "https://www.gravatar.com/avatar/0c50e0796b30018d74703a3f4c997004?s=128&d=identicon&r=PG&f=1",
        "display_name": "Grimdari",
        "link": "http://stackoverflow.com/users/3966081/grimdari"
      },
      "is_answered": true,
      "view_count": 96,
      "accepted_answer_id": 26228641,
      "answer_count": 2,
      "score": 1,
      "last_activity_date": 1413053818,
      "creation_date": 1412643854,
      "last_edit_date": 1412696446,
      "question_id": 26227103,
      "link": "http://stackoverflow.com/questions/26227103/sql-query-inner-join-tables-print-to-html-select-tag",
      "title": "SQL query inner join tables, print to HTML &lt;select&gt; tag",
      "mainTag":{
        "network":"Stack Overflow",
        "name":"ColdFusion"
      }
  },
  mockParentView = {shouldShowTags:function(){return true;}},
  //this.state = st.State.NORMAL;
  //this.collection = collection;  
  question = new st.popup.QuestionView(questionData,mockParentView),
  el=question.render(),
  pattern=/<select>/,
  HTMLMatches=el.innerHTML.match(pattern),
  textMatches=el.innerText.match(pattern);
  
  console.log(el.innerHTML);
  console.log(el.innerText);

  //Assert that there were no <select>s in the HTML
  ok(!HTMLMatches,'<select> tag from Title is appearing in rendered HTML');
  //Assert that <select> was rendered as text
  ok(textMatches.length===1,'<select> tag from Title is NOT appearing in rendered text');
});

// Test
// Get a list of 5 unanswered questions from StackOverflow with the
// google-chrome tag. Ensure that there are in fact 5 questions.
asyncTest('Test question list limit', function() {
  var tags = [{name: 'google-chrome', network: 'stackoverflow'}];
  var ql = new st.QuestionList();
  ql.setTags(tags);
  ql.update(5);
  ql.registerCountCallback(function() {
    start();
    var questions = ql.getQuestions(undefined, 5, 0);
    var count = 0;
    for (var i = 0; i < questions.length; i++) {
      ok(parseInt(questions[i].questionId) > 0, 'Valid ID');
      count += 1;
    }
    equal(count, 5, 'Number of questions matches');
  });
});


// Test
// Get a list of 10 unanswered questions from StackOverflow and sort them by
// views. Ensure that they are sorted.
asyncTest('Sorting by view count', function() {
  var tags = [{name: 'google-chrome', network: 'stackoverflow'}];
  var ql = new st.QuestionList();
  ql.setTags(tags);
  ql.update(10);
  ql.registerCountCallback(function() {
    start();
    var questions = ql.getQuestions('viewCount', 10, 0);
    for (var i = 0; i < questions.length - 1; i++) {
      var q1 = questions[i];
      var q2 = questions[i+1];
      ok(q1.viewCount >= q2.viewCount, 'Order: high views to low views');
    }
  });
});

asyncTest('Reverse sorting by answer count', function() {
  var tags = [{name: 'google-chrome', network: 'stackoverflow'}];
  var ql = new st.QuestionList();
  ql.setTags(tags);
  ql.update(10);
  ql.registerCountCallback(function() {
    start();
    var questions = ql.getQuestions('-answerCount', 10, 0);
    for (var i = 0; i < questions.length - 1; i++) {
      var q1 = questions[i];
      var q2 = questions[i+1];
      ok(q1.answerCount <= q2.answerCount,
          'Order: high answers to low answers');
    }
  });
});


// Test
// Get a list of questions, do an immediate update and ensure that nothing
// changed (ie. no difference in number of questions)
asyncTest('Adjacent updates do not change question list', function() {
  var tags = [{name: 'google-chrome', network: 'stackoverflow'}];
  var ql = new st.QuestionList();
  ql.setTags(tags);
  ql.update();
  var count = 0;
  ql.registerCountCallback(function() {
    start();
    count = questionCounter();
    equal(count, 5, 'Question count is valid');
    ql.update();
    stop();
    setTimeout(function() {
      start();
      equal(questionCounter(), count,
          'Question count is unchanged after update()');
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
asyncTest('Test question state serialization', function() {
  // Start with an empty localStorage.
  localStorage.clear();
  var tags = [{name: 'google-chrome', network: 'stackoverflow'}];
  var ql = new st.QuestionList();
  ql.setTags(tags);
  ql.update(10);
  // Using a timeout here since registerCountCallback gets called by markRead, which
  // would cause an infinite loop.
  setTimeout(function() {
    start();
    ql.saveQuestionState();
    var questionState = JSON.parse(localStorage.getItem('questionState'))
    // Ensure the questionState is empty.
    deepEqual(typeof questionState, 'object', "Question state is an object");
    deepEqual(questionState, {}, "Question state initially empty");
    var questions = ql.getQuestions();
    // Set the first question to be read.
    var q = questions[0];
    ql.markRead([q]);
    // Ensure that the questionState now lists q as read.
    var questionState = JSON.parse(localStorage.getItem('questionState'))
    equal(questionState[q.questionId], st.State.READ,
        'Question state says first question is read');
    equal(questionState[questions[1]], undefined, 'Other questions are unread');
  }, 500);
});
// NOSUBMIT: Force git5 to add this file to CL
