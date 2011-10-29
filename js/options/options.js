// Copyright 2011 Google Inc. All Rights Reserved.

/**
 * @fileoverview View logic for the Stack Track options page.
 * @author smus@google.com (Boris Smus)
 */

// Get background page.
var background = chrome.extension.getBackgroundPage();
var st = background.st;
var questionList = background.questionList;

/**
 * Options view namespace.
 */
st.opt = st.opt || {};

/**
 * Network header template.
 */
st.opt.NETWORK_TEMPLATE = '<h2>{{networkName}}</h2>' +
    '<ul id="{{networkId}}"></ul>';

/**
 * @constructor
 * Main view for the options page.
 */
st.opt.OptionsView = function() {
  // Persist these tags.
  this.tags = this.getSavedTags_();
  // Draw the view.
  this.render();

  var ctx = this;
  // Setup event handlers.
  document.querySelector('#submit').addEventListener('click', function(e) {
    ctx.save.call(ctx);
  });
  document.querySelector('#cancel').addEventListener('click', function(e) {
    window.close();
  });
  document.querySelector('#add').addEventListener('click', function(e) {
    ctx.addTag.call(ctx);
    ctx.render();
  });
  // Draw the dropdown options
  this.renderDropdown_();
};

/**
 * Render the options view to the HTML DOM.
 */
st.opt.OptionsView.prototype.render = function() {
  var ctx = this;
  document.querySelector('#tags').innerHTML = '';
  // Populate the tags input field with the saved tags.
  for (var i = 0; i < this.tags.length; i++) {
    // Check if there's a network in the dom already.
    var tag = this.tags[i];
    var $network = this.getOrRenderNetwork_(tag.network);
    var $tag = document.createElement('li');
    $tag.innerHTML = '<span class="tag">' + tag.name + '</span>';
    $tag.innerHTML += '<a class="cancel-button">' +
        '<img src="res/close.svg" alt=""></a>';
    $network.appendChild($tag);
    (function(index) {
    $tag.querySelector('.cancel-button').addEventListener('click', function(e) {
      ctx.removeTag(index);
      ctx.render();
    });
    })(i);
  }
};

/**
 * Save the tags specified in the page.
 */
st.opt.OptionsView.prototype.save = function() {
  // Get newly inputted tags to track.
  var tagsText = document.querySelector('#tags').value;
  if (tagsText === '') {
    // Validation error.
    alert('You must specify at least one tag');
    return;
  }
  localStorage.tags = JSON.stringify(this.tags);
  questionList.setTags(this.tags);
  questionList.reset();
  questionList.update();

  var $butterBar = document.querySelector('#butterbar');
  var boldTags = this.tags.map(function(t) {
    return '<mark>' + t.name + '</mark>';
  });
  var message = 'Now monitoring ' + boldTags.join(' and ') + ' tags.';
  $butterBar.querySelector('p').innerHTML = message;
  $butterBar.classList.add('shown');
  setTimeout(function() {
    $butterBar.classList.remove('shown');
  }, 2000);
};

/**
 * Add a new tag specified in the page.
 */
st.opt.OptionsView.prototype.addTag = function() {
  var $tagInput = document.querySelector('#tag');
  var tagName = $tagInput.value;
  $tagInput.value = '';
  var $networkInput = document.querySelector('#network');
  var networkName = $networkInput.value;
  this.tags.push(new st.Tag({
    name: tagName,
    network: networkName
  }));
};

/**
 * Remove a tag at this index.
 * @param {number} index The index to remove at.
 */
st.opt.OptionsView.prototype.removeTag = function(index) {
  this.tags.splice(index, 1);
};

/**
 * @private
 * Get the tags that were saved.
 * @return {array} Array of tags that we're monitoring.
 */
st.opt.OptionsView.prototype.getSavedTags_ = function() {
  return JSON.parse(localStorage.tags || '[]');
};

/**
 * @private
 * Render the contents of the select element.
 */
st.opt.OptionsView.prototype.renderDropdown_ = function() {
  var buffer = '';
  for (var networkId in st.NETWORK_INFO) {
    var network = st.NETWORK_INFO[networkId];
    // Write each network as an <options> element.
    buffer += '<option value="' + networkId + '">' + network.name + '</option>';
  }
  var $networkSelect = document.querySelector('#network');
  $networkSelect.innerHTML = buffer;
};

/**
 * @private
 * Gets the element representing the specified network, optionally creating it.
 * @param {string} networkId The ID of the stack exchange network.
 * @return {HTMLElement} HTML elemet of the network column.
 */
st.opt.OptionsView.prototype.getOrRenderNetwork_ = function(networkId) {
  var network = st.NETWORK_INFO[networkId];
  var $tags = document.querySelector('#tags');
  // Check if the network is already there
  var $network = $tags.querySelector('#' + networkId);
  if (!$network) {
    $column = document.createElement('div');
    $column.className = 'column';
    $column.innerHTML = st.opt.NETWORK_TEMPLATE
        .replace('{{networkName}}', network.name)
        .replace('{{networkId}}', networkId);
    $tags.appendChild($column);
    $network = $column.querySelector('ul');
  }
  return $network;
};

var optionsView = new st.opt.OptionsView();
