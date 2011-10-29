// Copyright 2011 Google Inc. All Rights Reserved.

/**
 * @fileoverview The Tag model layer for the StackTrack extension.
 * @author smus@google.com (Boris Smus)
 */
var st = st || {};


/**
 * A single stack exchange tag that includes the name of the tag and the
 * stack exchange root URL.
 * @param {!Object} params Object with tag name and stackexchange network.
 * @constructor
 */
st.Tag = function(params) {
  /**
   * The tag's name.
   * @type {string}
   */
  this.name = params.name;

  /**
   * The tag's network (key into st.NETWORK_INFO).
   * @type {string}
   */
  this.network = params.network;
};


/**
 * Returns the tag's network information.
 * @return {!Object} Network info.
 */
st.Tag.prototype.getNetwork = function() {
  return st.NETWORK_INFO[this.network];
};
