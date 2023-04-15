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
  "3dprinting": {
      "root": "3dprinting.stackexchange.com",
      "name": "3D Printing"
  },
  "3dprinting.meta": {
      "root": "3dprinting.meta.stackexchange.com",
      "name": "3D Printing Meta"
  },
  "academia": {
      "root": "academia.stackexchange.com",
      "name": "Academia"
  },
  "academia.meta": {
      "root": "academia.meta.stackexchange.com",
      "name": "Academia Meta"
  },
  "ai": {
      "root": "ai.stackexchange.com",
      "name": "Artificial Intelligence"
  },
  "ai.meta": {
      "root": "ai.meta.stackexchange.com",
      "name": "Artificial Intelligence Meta"
  },
  "alcohol": {
      "root": "alcohol.stackexchange.com",
      "name": "Beer, Wine &amp; Spirits"
  },
  "alcohol.meta": {
      "root": "alcohol.meta.stackexchange.com",
      "name": "Beer, Wine &amp; Spirits Meta"
  },
  "android": {
      "root": "android.stackexchange.com",
      "name": "Android Enthusiasts"
  },
  "android.meta": {
      "root": "android.meta.stackexchange.com",
      "name": "Android Enthusiasts Meta"
  },
  "anime": {
      "root": "anime.stackexchange.com",
      "name": "Anime &amp; Manga"
  },
  "anime.meta": {
      "root": "anime.meta.stackexchange.com",
      "name": "Anime &amp; Manga Meta"
  },
  "apple": {
      "root": "apple.stackexchange.com",
      "name": "Ask Different"
  },
  "apple.meta": {
      "root": "apple.meta.stackexchange.com",
      "name": "Ask Different Meta"
  },
  "arduino": {
      "root": "arduino.stackexchange.com",
      "name": "Arduino"
  },
  "arduino.meta": {
      "root": "arduino.meta.stackexchange.com",
      "name": "Arduino Meta"
  },
  "askubuntu": {
      "root": "askubuntu.com",
      "name": "Ask Ubuntu"
  },
  "astronomy": {
      "root": "astronomy.stackexchange.com",
      "name": "Astronomy"
  },
  "astronomy.meta": {
      "root": "astronomy.meta.stackexchange.com",
      "name": "Astronomy Meta"
  },
  "aviation": {
      "root": "aviation.stackexchange.com",
      "name": "Aviation"
  },
  "aviation.meta": {
      "root": "aviation.meta.stackexchange.com",
      "name": "Aviation Meta"
  },
  "bicycles": {
      "root": "bicycles.stackexchange.com",
      "name": "Bicycles"
  },
  "bicycles.meta": {
      "root": "bicycles.meta.stackexchange.com",
      "name": "Bicycles Meta"
  },
  "bioacoustics": {
      "root": "bioacoustics.stackexchange.com",
      "name": "Bioacoustics"
  },
  "bioacoustics.meta": {
      "root": "bioacoustics.meta.stackexchange.com",
      "name": "Bioacoustics Meta"
  },
  "bioinformatics": {
      "root": "bioinformatics.stackexchange.com",
      "name": "Bioinformatics"
  },
  "bioinformatics.meta": {
      "root": "bioinformatics.meta.stackexchange.com",
      "name": "Bioinformatics Meta"
  },
  "biology": {
      "root": "biology.stackexchange.com",
      "name": "Biology"
  },
  "biology.meta": {
      "root": "biology.meta.stackexchange.com",
      "name": "Biology Meta"
  },
  "bitcoin": {
      "root": "bitcoin.stackexchange.com",
      "name": "Bitcoin"
  },
  "bitcoin.meta": {
      "root": "bitcoin.meta.stackexchange.com",
      "name": "Bitcoin Meta"
  },
  "blender": {
      "root": "blender.stackexchange.com",
      "name": "Blender"
  },
  "blender.meta": {
      "root": "blender.meta.stackexchange.com",
      "name": "Blender Meta"
  },
  "boardgames": {
      "root": "boardgames.stackexchange.com",
      "name": "Board &amp; Card Games"
  },
  "boardgames.meta": {
      "root": "boardgames.meta.stackexchange.com",
      "name": "Board &amp; Card Games Meta"
  },
  "bricks": {
      "root": "bricks.stackexchange.com",
      "name": "Bricks"
  },
  "bricks.meta": {
      "root": "bricks.meta.stackexchange.com",
      "name": "Bricks Meta"
  },
  "buddhism": {
      "root": "buddhism.stackexchange.com",
      "name": "Buddhism"
  },
  "buddhism.meta": {
      "root": "buddhism.meta.stackexchange.com",
      "name": "Buddhism Meta"
  },
  "cardano": {
      "root": "cardano.stackexchange.com",
      "name": "Cardano"
  },
  "cardano.meta": {
      "root": "cardano.meta.stackexchange.com",
      "name": "Cardano Meta"
  },
  "chemistry": {
      "root": "chemistry.stackexchange.com",
      "name": "Chemistry"
  },
  "chemistry.meta": {
      "root": "chemistry.meta.stackexchange.com",
      "name": "Chemistry Meta"
  },
  "chess": {
      "root": "chess.stackexchange.com",
      "name": "Chess"
  },
  "chess.meta": {
      "root": "chess.meta.stackexchange.com",
      "name": "Chess Meta"
  },
  "chinese": {
      "root": "chinese.stackexchange.com",
      "name": "Chinese Language"
  },
  "chinese.meta": {
      "root": "chinese.meta.stackexchange.com",
      "name": "Chinese Language Meta"
  },
  "christianity": {
      "root": "christianity.stackexchange.com",
      "name": "Christianity"
  },
  "christianity.meta": {
      "root": "christianity.meta.stackexchange.com",
      "name": "Christianity Meta"
  },
  "civicrm": {
      "root": "civicrm.stackexchange.com",
      "name": "CiviCRM"
  },
  "civicrm.meta": {
      "root": "civicrm.meta.stackexchange.com",
      "name": "CiviCRM Meta"
  },
  "codegolf": {
      "root": "codegolf.stackexchange.com",
      "name": "Code Golf"
  },
  "codegolf.meta": {
      "root": "codegolf.meta.stackexchange.com",
      "name": "Code Golf Meta"
  },
  "codereview": {
      "root": "codereview.stackexchange.com",
      "name": "Code Review"
  },
  "codereview.meta": {
      "root": "codereview.meta.stackexchange.com",
      "name": "Code Review Meta"
  },
  "coffee": {
      "root": "coffee.stackexchange.com",
      "name": "Coffee"
  },
  "coffee.meta": {
      "root": "coffee.meta.stackexchange.com",
      "name": "Coffee Meta"
  },
  "communitybuilding": {
      "root": "communitybuilding.stackexchange.com",
      "name": "Community Building"
  },
  "communitybuilding.meta": {
      "root": "communitybuilding.meta.stackexchange.com",
      "name": "Community Building Meta"
  },
  "computergraphics": {
      "root": "computergraphics.stackexchange.com",
      "name": "Computer Graphics"
  },
  "computergraphics.meta": {
      "root": "computergraphics.meta.stackexchange.com",
      "name": "Computer Graphics Meta"
  },
  "conlang": {
      "root": "conlang.stackexchange.com",
      "name": "Constructed Languages"
  },
  "conlang.meta": {
      "root": "conlang.meta.stackexchange.com",
      "name": "Constructed Languages Meta"
  },
  "cooking": {
      "root": "cooking.stackexchange.com",
      "name": "Seasoned Advice"
  },
  "cooking.meta": {
      "root": "cooking.meta.stackexchange.com",
      "name": "Seasoned Advice Meta"
  },
  "craftcms": {
      "root": "craftcms.stackexchange.com",
      "name": "Craft CMS"
  },
  "craftcms.meta": {
      "root": "craftcms.meta.stackexchange.com",
      "name": "Craft CMS Meta"
  },
  "crafts": {
      "root": "crafts.stackexchange.com",
      "name": "Arts &amp; Crafts"
  },
  "crafts.meta": {
      "root": "crafts.meta.stackexchange.com",
      "name": "Arts &amp; Crafts Meta"
  },
  "crypto": {
      "root": "crypto.stackexchange.com",
      "name": "Cryptography"
  },
  "crypto.meta": {
      "root": "crypto.meta.stackexchange.com",
      "name": "Cryptography Meta"
  },
  "cs": {
      "root": "cs.stackexchange.com",
      "name": "Computer Science"
  },
  "cs.meta": {
      "root": "cs.meta.stackexchange.com",
      "name": "Computer Science Meta"
  },
  "cs50": {
      "root": "cs50.stackexchange.com",
      "name": "CS50"
  },
  "cs50.meta": {
      "root": "cs50.meta.stackexchange.com",
      "name": "CS50 Meta"
  },
  "cseducators": {
      "root": "cseducators.stackexchange.com",
      "name": "Computer Science Educators"
  },
  "cseducators.meta": {
      "root": "cseducators.meta.stackexchange.com",
      "name": "Computer Science Educators Meta"
  },
  "cstheory": {
      "root": "cstheory.stackexchange.com",
      "name": "Theoretical Computer Science"
  },
  "cstheory.meta": {
      "root": "cstheory.meta.stackexchange.com",
      "name": "Theoretical Computer Science Meta"
  },
  "datascience": {
      "root": "datascience.stackexchange.com",
      "name": "Data Science"
  },
  "datascience.meta": {
      "root": "datascience.meta.stackexchange.com",
      "name": "Data Science Meta"
  },
  "dba": {
      "root": "dba.stackexchange.com",
      "name": "Database Administrators"
  },
  "dba.meta": {
      "root": "dba.meta.stackexchange.com",
      "name": "Database Administrators Meta"
  },
  "devops": {
      "root": "devops.stackexchange.com",
      "name": "DevOps"
  },
  "devops.meta": {
      "root": "devops.meta.stackexchange.com",
      "name": "DevOps Meta"
  },
  "diy": {
      "root": "diy.stackexchange.com",
      "name": "Home Improvement"
  },
  "diy.meta": {
      "root": "diy.meta.stackexchange.com",
      "name": "Home Improvement Meta"
  },
  "drones": {
      "root": "drones.stackexchange.com",
      "name": "Drones and Model Aircraft"
  },
  "drones.meta": {
      "root": "drones.meta.stackexchange.com",
      "name": "Drones and Model Aircraft Meta"
  },
  "drupal": {
      "root": "drupal.stackexchange.com",
      "name": "Drupal Answers"
  },
  "drupal.meta": {
      "root": "drupal.meta.stackexchange.com",
      "name": "Drupal Answers Meta"
  },
  "dsp": {
      "root": "dsp.stackexchange.com",
      "name": "Signal Processing"
  },
  "dsp.meta": {
      "root": "dsp.meta.stackexchange.com",
      "name": "Signal Processing Meta"
  },
  "earthscience": {
      "root": "earthscience.stackexchange.com",
      "name": "Earth Science"
  },
  "earthscience.meta": {
      "root": "earthscience.meta.stackexchange.com",
      "name": "Earth Science Meta"
  },
  "ebooks": {
      "root": "ebooks.stackexchange.com",
      "name": "Ebooks"
  },
  "ebooks.meta": {
      "root": "ebooks.meta.stackexchange.com",
      "name": "Ebooks Meta"
  },
  "economics": {
      "root": "economics.stackexchange.com",
      "name": "Economics"
  },
  "economics.meta": {
      "root": "economics.meta.stackexchange.com",
      "name": "Economics Meta"
  },
  "electronics": {
      "root": "electronics.stackexchange.com",
      "name": "Electrical Engineering"
  },
  "electronics.meta": {
      "root": "electronics.meta.stackexchange.com",
      "name": "Electrical Engineering Meta"
  },
  "elementaryos": {
      "root": "elementaryos.stackexchange.com",
      "name": "elementary OS"
  },
  "elementaryos.meta": {
      "root": "elementaryos.meta.stackexchange.com",
      "name": "elementary OS Meta"
  },
  "ell": {
      "root": "ell.stackexchange.com",
      "name": "English Language Learners"
  },
  "ell.meta": {
      "root": "ell.meta.stackexchange.com",
      "name": "English Language Learners Meta"
  },
  "emacs": {
      "root": "emacs.stackexchange.com",
      "name": "Emacs"
  },
  "emacs.meta": {
      "root": "emacs.meta.stackexchange.com",
      "name": "Emacs Meta"
  },
  "engineering": {
      "root": "engineering.stackexchange.com",
      "name": "Engineering"
  },
  "engineering.meta": {
      "root": "engineering.meta.stackexchange.com",
      "name": "Engineering Meta"
  },
  "english": {
      "root": "english.stackexchange.com",
      "name": "English Language &amp; Usage"
  },
  "english.meta": {
      "root": "english.meta.stackexchange.com",
      "name": "English Language &amp; Usage Meta"
  },
  "eosio": {
      "root": "eosio.stackexchange.com",
      "name": "EOS.IO"
  },
  "eosio.meta": {
      "root": "eosio.meta.stackexchange.com",
      "name": "EOS.IO Meta"
  },
  "es.meta.stackoverflow": {
      "root": "es.meta.stackoverflow.com",
      "name": "Stack Overflow Meta en espa&#241;ol"
  },
  "es.stackoverflow": {
      "root": "es.stackoverflow.com",
      "name": "Stack Overflow en espa&#241;ol"
  },
  "esperanto": {
      "root": "esperanto.stackexchange.com",
      "name": "Esperanto Language"
  },
  "esperanto.meta": {
      "root": "esperanto.meta.stackexchange.com",
      "name": "Esperanto Language Meta"
  },
  "ethereum": {
      "root": "ethereum.stackexchange.com",
      "name": "Ethereum"
  },
  "ethereum.meta": {
      "root": "ethereum.meta.stackexchange.com",
      "name": "Ethereum Meta"
  },
  "expatriates": {
      "root": "expatriates.stackexchange.com",
      "name": "Expatriates"
  },
  "expatriates.meta": {
      "root": "expatriates.meta.stackexchange.com",
      "name": "Expatriates Meta"
  },
  "expressionengine": {
      "root": "expressionengine.stackexchange.com",
      "name": "ExpressionEngine&#174; Answers"
  },
  "expressionengine.meta": {
      "root": "expressionengine.meta.stackexchange.com",
      "name": "ExpressionEngine&#174; Answers Meta"
  },
  "fitness": {
      "root": "fitness.stackexchange.com",
      "name": "Physical Fitness"
  },
  "fitness.meta": {
      "root": "fitness.meta.stackexchange.com",
      "name": "Physical Fitness Meta"
  },
  "freelancing": {
      "root": "freelancing.stackexchange.com",
      "name": "Freelancing"
  },
  "freelancing.meta": {
      "root": "freelancing.meta.stackexchange.com",
      "name": "Freelancing Meta"
  },
  "french": {
      "root": "french.stackexchange.com",
      "name": "French Language"
  },
  "french.meta": {
      "root": "french.meta.stackexchange.com",
      "name": "French Language Meta"
  },
  "gamedev": {
      "root": "gamedev.stackexchange.com",
      "name": "Game Development"
  },
  "gamedev.meta": {
      "root": "gamedev.meta.stackexchange.com",
      "name": "Game Development Meta"
  },
  "gaming": {
      "root": "gaming.stackexchange.com",
      "name": "Arqade"
  },
  "gaming.meta": {
      "root": "gaming.meta.stackexchange.com",
      "name": "Arqade Meta"
  },
  "gardening": {
      "root": "gardening.stackexchange.com",
      "name": "Gardening &amp; Landscaping"
  },
  "gardening.meta": {
      "root": "gardening.meta.stackexchange.com",
      "name": "Gardening &amp; Landscaping Meta"
  },
  "genealogy": {
      "root": "genealogy.stackexchange.com",
      "name": "Genealogy &amp; Family History"
  },
  "genealogy.meta": {
      "root": "genealogy.meta.stackexchange.com",
      "name": "Genealogy &amp; Family History Meta"
  },
  "german": {
      "root": "german.stackexchange.com",
      "name": "German Language"
  },
  "german.meta": {
      "root": "german.meta.stackexchange.com",
      "name": "German Language Meta"
  },
  "gis": {
      "root": "gis.stackexchange.com",
      "name": "Geographic Information Systems"
  },
  "gis.meta": {
      "root": "gis.meta.stackexchange.com",
      "name": "Geographic Information Systems Meta"
  },
  "graphicdesign": {
      "root": "graphicdesign.stackexchange.com",
      "name": "Graphic Design"
  },
  "graphicdesign.meta": {
      "root": "graphicdesign.meta.stackexchange.com",
      "name": "Graphic Design Meta"
  },
  "ham": {
      "root": "ham.stackexchange.com",
      "name": "Amateur Radio"
  },
  "ham.meta": {
      "root": "ham.meta.stackexchange.com",
      "name": "Amateur Radio Meta"
  },
  "hardwarerecs": {
      "root": "hardwarerecs.stackexchange.com",
      "name": "Hardware Recommendations"
  },
  "hardwarerecs.meta": {
      "root": "hardwarerecs.meta.stackexchange.com",
      "name": "Hardware Recommendations Meta"
  },
  "hermeneutics": {
      "root": "hermeneutics.stackexchange.com",
      "name": "Biblical Hermeneutics"
  },
  "hermeneutics.meta": {
      "root": "hermeneutics.meta.stackexchange.com",
      "name": "Biblical Hermeneutics Meta"
  },
  "hinduism": {
      "root": "hinduism.stackexchange.com",
      "name": "Hinduism"
  },
  "hinduism.meta": {
      "root": "hinduism.meta.stackexchange.com",
      "name": "Hinduism Meta"
  },
  "history": {
      "root": "history.stackexchange.com",
      "name": "History"
  },
  "history.meta": {
      "root": "history.meta.stackexchange.com",
      "name": "History Meta"
  },
  "homebrew": {
      "root": "homebrew.stackexchange.com",
      "name": "Homebrewing"
  },
  "homebrew.meta": {
      "root": "homebrew.meta.stackexchange.com",
      "name": "Homebrewing Meta"
  },
  "hsm": {
      "root": "hsm.stackexchange.com",
      "name": "History of Science and Mathematics"
  },
  "hsm.meta": {
      "root": "hsm.meta.stackexchange.com",
      "name": "History of Science and Mathematics Meta"
  },
  "interpersonal": {
      "root": "interpersonal.stackexchange.com",
      "name": "Interpersonal Skills"
  },
  "interpersonal.meta": {
      "root": "interpersonal.meta.stackexchange.com",
      "name": "Interpersonal Skills Meta"
  },
  "iot": {
      "root": "iot.stackexchange.com",
      "name": "Internet of Things"
  },
  "iot.meta": {
      "root": "iot.meta.stackexchange.com",
      "name": "Internet of Things Meta"
  },
  "iota": {
      "root": "iota.stackexchange.com",
      "name": "Iota"
  },
  "iota.meta": {
      "root": "iota.meta.stackexchange.com",
      "name": "Iota Meta"
  },
  "islam": {
      "root": "islam.stackexchange.com",
      "name": "Islam"
  },
  "islam.meta": {
      "root": "islam.meta.stackexchange.com",
      "name": "Islam Meta"
  },
  "italian": {
      "root": "italian.stackexchange.com",
      "name": "Italian Language"
  },
  "italian.meta": {
      "root": "italian.meta.stackexchange.com",
      "name": "Italian Language Meta"
  },
  "ja.meta.stackoverflow": {
      "root": "ja.meta.stackoverflow.com",
      "name": "スタック・オーバーフローMeta"
  },
  "ja.stackoverflow": {
      "root": "ja.stackoverflow.com",
      "name": "スタック・オーバーフロー"
  },
  "japanese": {
      "root": "japanese.stackexchange.com",
      "name": "Japanese Language"
  },
  "japanese.meta": {
      "root": "japanese.meta.stackexchange.com",
      "name": "Japanese Language Meta"
  },
  "joomla": {
      "root": "joomla.stackexchange.com",
      "name": "Joomla"
  },
  "joomla.meta": {
      "root": "joomla.meta.stackexchange.com",
      "name": "Joomla Meta"
  },
  "judaism": {
      "root": "judaism.stackexchange.com",
      "name": "Mi Yodeya"
  },
  "judaism.meta": {
      "root": "judaism.meta.stackexchange.com",
      "name": "Mi Yodeya Meta"
  },
  "korean": {
      "root": "korean.stackexchange.com",
      "name": "Korean Language"
  },
  "korean.meta": {
      "root": "korean.meta.stackexchange.com",
      "name": "Korean Language Meta"
  },
  "languagelearning": {
      "root": "languagelearning.stackexchange.com",
      "name": "Language Learning"
  },
  "languagelearning.meta": {
      "root": "languagelearning.meta.stackexchange.com",
      "name": "Language Learning Meta"
  },
  "latin": {
      "root": "latin.stackexchange.com",
      "name": "Latin Language"
  },
  "latin.meta": {
      "root": "latin.meta.stackexchange.com",
      "name": "Latin Language Meta"
  },
  "law": {
      "root": "law.stackexchange.com",
      "name": "Law"
  },
  "law.meta": {
      "root": "law.meta.stackexchange.com",
      "name": "Law Meta"
  },
  "lifehacks": {
      "root": "lifehacks.stackexchange.com",
      "name": "Lifehacks"
  },
  "lifehacks.meta": {
      "root": "lifehacks.meta.stackexchange.com",
      "name": "Lifehacks Meta"
  },
  "linguistics": {
      "root": "linguistics.stackexchange.com",
      "name": "Linguistics"
  },
  "linguistics.meta": {
      "root": "linguistics.meta.stackexchange.com",
      "name": "Linguistics Meta"
  },
  "literature": {
      "root": "literature.stackexchange.com",
      "name": "Literature"
  },
  "literature.meta": {
      "root": "literature.meta.stackexchange.com",
      "name": "Literature Meta"
  },
  "magento": {
      "root": "magento.stackexchange.com",
      "name": "Magento"
  },
  "magento.meta": {
      "root": "magento.meta.stackexchange.com",
      "name": "Magento Meta"
  },
  "martialarts": {
      "root": "martialarts.stackexchange.com",
      "name": "Martial Arts"
  },
  "martialarts.meta": {
      "root": "martialarts.meta.stackexchange.com",
      "name": "Martial Arts Meta"
  },
  "math": {
      "root": "math.stackexchange.com",
      "name": "Mathematics"
  },
  "math.meta": {
      "root": "math.meta.stackexchange.com",
      "name": "Mathematics Meta"
  },
  "matheducators": {
      "root": "matheducators.stackexchange.com",
      "name": "Mathematics Educators"
  },
  "matheducators.meta": {
      "root": "matheducators.meta.stackexchange.com",
      "name": "Mathematics Educators Meta"
  },
  "mathematica": {
      "root": "mathematica.stackexchange.com",
      "name": "Mathematica"
  },
  "mathematica.meta": {
      "root": "mathematica.meta.stackexchange.com",
      "name": "Mathematica Meta"
  },
  "mathoverflow.net": {
      "root": "mathoverflow.net",
      "name": "MathOverflow"
  },
  "mattermodeling": {
      "root": "mattermodeling.stackexchange.com",
      "name": "Matter Modeling"
  },
  "mattermodeling.meta": {
      "root": "mattermodeling.meta.stackexchange.com",
      "name": "Matter Modeling Meta"
  },
  "mechanics": {
      "root": "mechanics.stackexchange.com",
      "name": "Motor Vehicle Maintenance &amp; Repair"
  },
  "mechanics.meta": {
      "root": "mechanics.meta.stackexchange.com",
      "name": "Motor Vehicle Maintenance &amp; Repair Meta"
  },
  "medicalsciences": {
      "root": "medicalsciences.stackexchange.com",
      "name": "Medical Sciences"
  },
  "medicalsciences.meta": {
      "root": "medicalsciences.meta.stackexchange.com",
      "name": "Medical Sciences Meta"
  },
  "meta": {
      "root": "meta.stackexchange.com",
      "name": "Meta Stack Exchange"
  },
  "meta.askubuntu": {
      "root": "meta.askubuntu.com",
      "name": "Ask Ubuntu Meta"
  },
  "meta.mathoverflow.net": {
      "root": "meta.mathoverflow.net",
      "name": "MathOverflow Meta"
  },
  "meta.serverfault": {
      "root": "meta.serverfault.com",
      "name": "Meta Server Fault"
  },
  "meta.stackoverflow": {
      "root": "meta.stackoverflow.com",
      "name": "Meta Stack Overflow"
  },
  "meta.superuser": {
      "root": "meta.superuser.com",
      "name": "Meta Super User"
  },
  "monero": {
      "root": "monero.stackexchange.com",
      "name": "Monero"
  },
  "monero.meta": {
      "root": "monero.meta.stackexchange.com",
      "name": "Monero Meta"
  },
  "money": {
      "root": "money.stackexchange.com",
      "name": "Personal Finance &amp; Money"
  },
  "money.meta": {
      "root": "money.meta.stackexchange.com",
      "name": "Personal Finance &amp; Money Meta"
  },
  "movies": {
      "root": "movies.stackexchange.com",
      "name": "Movies &amp; TV"
  },
  "movies.meta": {
      "root": "movies.meta.stackexchange.com",
      "name": "Movies &amp; TV Meta"
  },
  "music": {
      "root": "music.stackexchange.com",
      "name": "Music: Practice &amp; Theory"
  },
  "music.meta": {
      "root": "music.meta.stackexchange.com",
      "name": "Music: Practice &amp; Theory Meta"
  },
  "musicfans": {
      "root": "musicfans.stackexchange.com",
      "name": "Music Fans"
  },
  "musicfans.meta": {
      "root": "musicfans.meta.stackexchange.com",
      "name": "Music Fans Meta"
  },
  "mythology": {
      "root": "mythology.stackexchange.com",
      "name": "Mythology &amp; Folklore"
  },
  "mythology.meta": {
      "root": "mythology.meta.stackexchange.com",
      "name": "Mythology &amp; Folklore Meta"
  },
  "networkengineering": {
      "root": "networkengineering.stackexchange.com",
      "name": "Network Engineering"
  },
  "networkengineering.meta": {
      "root": "networkengineering.meta.stackexchange.com",
      "name": "Network Engineering Meta"
  },
  "opendata": {
      "root": "opendata.stackexchange.com",
      "name": "Open Data"
  },
  "opendata.meta": {
      "root": "opendata.meta.stackexchange.com",
      "name": "Open Data Meta"
  },
  "opensource": {
      "root": "opensource.stackexchange.com",
      "name": "Open Source"
  },
  "opensource.meta": {
      "root": "opensource.meta.stackexchange.com",
      "name": "Open Source Meta"
  },
  "or": {
      "root": "or.stackexchange.com",
      "name": "Operations Research"
  },
  "or.meta": {
      "root": "or.meta.stackexchange.com",
      "name": "Operations Research Meta"
  },
  "outdoors": {
      "root": "outdoors.stackexchange.com",
      "name": "The Great Outdoors"
  },
  "outdoors.meta": {
      "root": "outdoors.meta.stackexchange.com",
      "name": "The Great Outdoors Meta"
  },
  "parenting": {
      "root": "parenting.stackexchange.com",
      "name": "Parenting"
  },
  "parenting.meta": {
      "root": "parenting.meta.stackexchange.com",
      "name": "Parenting Meta"
  },
  "patents": {
      "root": "patents.stackexchange.com",
      "name": "Ask Patents"
  },
  "patents.meta": {
      "root": "patents.meta.stackexchange.com",
      "name": "Ask Patents Meta"
  },
  "pets": {
      "root": "pets.stackexchange.com",
      "name": "Pets"
  },
  "pets.meta": {
      "root": "pets.meta.stackexchange.com",
      "name": "Pets Meta"
  },
  "philosophy": {
      "root": "philosophy.stackexchange.com",
      "name": "Philosophy"
  },
  "philosophy.meta": {
      "root": "philosophy.meta.stackexchange.com",
      "name": "Philosophy Meta"
  },
  "photo": {
      "root": "photo.stackexchange.com",
      "name": "Photography"
  },
  "photo.meta": {
      "root": "photo.meta.stackexchange.com",
      "name": "Photography Meta"
  },
  "physics": {
      "root": "physics.stackexchange.com",
      "name": "Physics"
  },
  "physics.meta": {
      "root": "physics.meta.stackexchange.com",
      "name": "Physics Meta"
  },
  "pm": {
      "root": "pm.stackexchange.com",
      "name": "Project Management"
  },
  "pm.meta": {
      "root": "pm.meta.stackexchange.com",
      "name": "Project Management Meta"
  },
  "poker": {
      "root": "poker.stackexchange.com",
      "name": "Poker"
  },
  "poker.meta": {
      "root": "poker.meta.stackexchange.com",
      "name": "Poker Meta"
  },
  "politics": {
      "root": "politics.stackexchange.com",
      "name": "Politics"
  },
  "politics.meta": {
      "root": "politics.meta.stackexchange.com",
      "name": "Politics Meta"
  },
  "portuguese": {
      "root": "portuguese.stackexchange.com",
      "name": "Portuguese Language"
  },
  "portuguese.meta": {
      "root": "portuguese.meta.stackexchange.com",
      "name": "Portuguese Language Meta"
  },
  "proofassistants": {
      "root": "proofassistants.stackexchange.com",
      "name": "Proof Assistants"
  },
  "proofassistants.meta": {
      "root": "proofassistants.meta.stackexchange.com",
      "name": "Proof Assistants Meta"
  },
  "psychology": {
      "root": "psychology.stackexchange.com",
      "name": "Psychology &amp; Neuroscience"
  },
  "psychology.meta": {
      "root": "psychology.meta.stackexchange.com",
      "name": "Psychology &amp; Neuroscience Meta"
  },
  "pt.meta.stackoverflow": {
      "root": "pt.meta.stackoverflow.com",
      "name": "Stack Overflow em Portugu&#234;s Meta"
  },
  "pt.stackoverflow": {
      "root": "pt.stackoverflow.com",
      "name": "Stack Overflow em Portugu&#234;s"
  },
  "puzzling": {
      "root": "puzzling.stackexchange.com",
      "name": "Puzzling"
  },
  "puzzling.meta": {
      "root": "puzzling.meta.stackexchange.com",
      "name": "Puzzling Meta"
  },
  "quant": {
      "root": "quant.stackexchange.com",
      "name": "Quantitative Finance"
  },
  "quant.meta": {
      "root": "quant.meta.stackexchange.com",
      "name": "Quantitative Finance Meta"
  },
  "quantumcomputing": {
      "root": "quantumcomputing.stackexchange.com",
      "name": "Quantum Computing"
  },
  "quantumcomputing.meta": {
      "root": "quantumcomputing.meta.stackexchange.com",
      "name": "Quantum Computing Meta"
  },
  "raspberrypi": {
      "root": "raspberrypi.stackexchange.com",
      "name": "Raspberry Pi"
  },
  "raspberrypi.meta": {
      "root": "raspberrypi.meta.stackexchange.com",
      "name": "Raspberry Pi Meta"
  },
  "retrocomputing": {
      "root": "retrocomputing.stackexchange.com",
      "name": "Retrocomputing"
  },
  "retrocomputing.meta": {
      "root": "retrocomputing.meta.stackexchange.com",
      "name": "Retrocomputing Meta"
  },
  "reverseengineering": {
      "root": "reverseengineering.stackexchange.com",
      "name": "Reverse Engineering"
  },
  "reverseengineering.meta": {
      "root": "reverseengineering.meta.stackexchange.com",
      "name": "Reverse Engineering Meta"
  },
  "robotics": {
      "root": "robotics.stackexchange.com",
      "name": "Robotics"
  },
  "robotics.meta": {
      "root": "robotics.meta.stackexchange.com",
      "name": "Robotics Meta"
  },
  "rpg": {
      "root": "rpg.stackexchange.com",
      "name": "Role-playing Games"
  },
  "rpg.meta": {
      "root": "rpg.meta.stackexchange.com",
      "name": "Role-playing Games Meta"
  },
  "ru.meta.stackoverflow": {
      "root": "ru.meta.stackoverflow.com",
      "name": "Stack Overflow на русском Meta"
  },
  "ru.stackoverflow": {
      "root": "ru.stackoverflow.com",
      "name": "Stack Overflow на русском"
  },
  "rus": {
      "root": "rus.stackexchange.com",
      "name": "Русский язык"
  },
  "rus.meta": {
      "root": "rus.meta.stackexchange.com",
      "name": "Русский язык Meta"
  },
  "russian": {
      "root": "russian.stackexchange.com",
      "name": "Russian Language"
  },
  "russian.meta": {
      "root": "russian.meta.stackexchange.com",
      "name": "Russian Language Meta"
  },
  "salesforce": {
      "root": "salesforce.stackexchange.com",
      "name": "Salesforce"
  },
  "salesforce.meta": {
      "root": "salesforce.meta.stackexchange.com",
      "name": "Salesforce Meta"
  },
  "scicomp": {
      "root": "scicomp.stackexchange.com",
      "name": "Computational Science"
  },
  "scicomp.meta": {
      "root": "scicomp.meta.stackexchange.com",
      "name": "Computational Science Meta"
  },
  "scifi": {
      "root": "scifi.stackexchange.com",
      "name": "Science Fiction &amp; Fantasy"
  },
  "scifi.meta": {
      "root": "scifi.meta.stackexchange.com",
      "name": "Science Fiction &amp; Fantasy Meta"
  },
  "security": {
      "root": "security.stackexchange.com",
      "name": "Information Security"
  },
  "security.meta": {
      "root": "security.meta.stackexchange.com",
      "name": "Information Security Meta"
  },
  "serverfault": {
      "root": "serverfault.com",
      "name": "Server Fault"
  },
  "sharepoint": {
      "root": "sharepoint.stackexchange.com",
      "name": "SharePoint"
  },
  "sharepoint.meta": {
      "root": "sharepoint.meta.stackexchange.com",
      "name": "SharePoint Meta"
  },
  "sitecore": {
      "root": "sitecore.stackexchange.com",
      "name": "Sitecore"
  },
  "sitecore.meta": {
      "root": "sitecore.meta.stackexchange.com",
      "name": "Sitecore Meta"
  },
  "skeptics": {
      "root": "skeptics.stackexchange.com",
      "name": "Skeptics"
  },
  "skeptics.meta": {
      "root": "skeptics.meta.stackexchange.com",
      "name": "Skeptics Meta"
  },
  "softwareengineering": {
      "root": "softwareengineering.stackexchange.com",
      "name": "Software Engineering"
  },
  "softwareengineering.meta": {
      "root": "softwareengineering.meta.stackexchange.com",
      "name": "Software Engineering Meta"
  },
  "softwarerecs": {
      "root": "softwarerecs.stackexchange.com",
      "name": "Software Recommendations"
  },
  "softwarerecs.meta": {
      "root": "softwarerecs.meta.stackexchange.com",
      "name": "Software Recommendations Meta"
  },
  "solana": {
      "root": "solana.stackexchange.com",
      "name": "Solana"
  },
  "solana.meta": {
      "root": "solana.meta.stackexchange.com",
      "name": "Solana Meta"
  },
  "sound": {
      "root": "sound.stackexchange.com",
      "name": "Sound Design"
  },
  "sound.meta": {
      "root": "sound.meta.stackexchange.com",
      "name": "Sound Design Meta"
  },
  "space": {
      "root": "space.stackexchange.com",
      "name": "Space Exploration"
  },
  "space.meta": {
      "root": "space.meta.stackexchange.com",
      "name": "Space Exploration Meta"
  },
  "spanish": {
      "root": "spanish.stackexchange.com",
      "name": "Spanish Language"
  },
  "spanish.meta": {
      "root": "spanish.meta.stackexchange.com",
      "name": "Spanish Language Meta"
  },
  "sports": {
      "root": "sports.stackexchange.com",
      "name": "Sports"
  },
  "sports.meta": {
      "root": "sports.meta.stackexchange.com",
      "name": "Sports Meta"
  },
  "sqa": {
      "root": "sqa.stackexchange.com",
      "name": "Software Quality Assurance &amp; Testing"
  },
  "sqa.meta": {
      "root": "sqa.meta.stackexchange.com",
      "name": "Software Quality Assurance &amp; Testing Meta"
  },
  "stackapps": {
      "root": "stackapps.com",
      "name": "Stack Apps"
  },
  "stackoverflow": {
      "root": "stackoverflow.com",
      "name": "Stack Overflow"
  },
  "stats": {
      "root": "stats.stackexchange.com",
      "name": "Cross Validated"
  },
  "stats.meta": {
      "root": "stats.meta.stackexchange.com",
      "name": "Cross Validated Meta"
  },
  "stellar": {
      "root": "stellar.stackexchange.com",
      "name": "Stellar"
  },
  "stellar.meta": {
      "root": "stellar.meta.stackexchange.com",
      "name": "Stellar Meta"
  },
  "substrate": {
      "root": "substrate.stackexchange.com",
      "name": "Substrate and Polkadot"
  },
  "substrate.meta": {
      "root": "substrate.meta.stackexchange.com",
      "name": "Substrate and Polkadot Meta"
  },
  "superuser": {
      "root": "superuser.com",
      "name": "Super User"
  },
  "sustainability": {
      "root": "sustainability.stackexchange.com",
      "name": "Sustainable Living"
  },
  "sustainability.meta": {
      "root": "sustainability.meta.stackexchange.com",
      "name": "Sustainable Living Meta"
  },
  "tex": {
      "root": "tex.stackexchange.com",
      "name": "TeX - LaTeX"
  },
  "tex.meta": {
      "root": "tex.meta.stackexchange.com",
      "name": "TeX - LaTeX Meta"
  },
  "tezos": {
      "root": "tezos.stackexchange.com",
      "name": "Tezos"
  },
  "tezos.meta": {
      "root": "tezos.meta.stackexchange.com",
      "name": "Tezos Meta"
  },
  "tor": {
      "root": "tor.stackexchange.com",
      "name": "Tor"
  },
  "tor.meta": {
      "root": "tor.meta.stackexchange.com",
      "name": "Tor Meta"
  },
  "travel": {
      "root": "travel.stackexchange.com",
      "name": "Travel"
  },
  "travel.meta": {
      "root": "travel.meta.stackexchange.com",
      "name": "Travel Meta"
  },
  "tridion": {
      "root": "tridion.stackexchange.com",
      "name": "Tridion"
  },
  "tridion.meta": {
      "root": "tridion.meta.stackexchange.com",
      "name": "Tridion Meta"
  },
  "ukrainian": {
      "root": "ukrainian.stackexchange.com",
      "name": "Ukrainian Language"
  },
  "ukrainian.meta": {
      "root": "ukrainian.meta.stackexchange.com",
      "name": "Ukrainian Language Meta"
  },
  "unix": {
      "root": "unix.stackexchange.com",
      "name": "Unix &amp; Linux"
  },
  "unix.meta": {
      "root": "unix.meta.stackexchange.com",
      "name": "Unix &amp; Linux Meta"
  },
  "ux": {
      "root": "ux.stackexchange.com",
      "name": "User Experience"
  },
  "ux.meta": {
      "root": "ux.meta.stackexchange.com",
      "name": "User Experience Meta"
  },
  "vegetarianism": {
      "root": "vegetarianism.stackexchange.com",
      "name": "Veganism &amp; Vegetarianism"
  },
  "vegetarianism.meta": {
      "root": "vegetarianism.meta.stackexchange.com",
      "name": "Veganism &amp; Vegetarianism Meta"
  },
  "vi": {
      "root": "vi.stackexchange.com",
      "name": "Vi and Vim"
  },
  "vi.meta": {
      "root": "vi.meta.stackexchange.com",
      "name": "Vi and Vim Meta"
  },
  "video": {
      "root": "video.stackexchange.com",
      "name": "Video Production"
  },
  "video.meta": {
      "root": "video.meta.stackexchange.com",
      "name": "Video Production Meta"
  },
  "webapps": {
      "root": "webapps.stackexchange.com",
      "name": "Web Applications"
  },
  "webapps.meta": {
      "root": "webapps.meta.stackexchange.com",
      "name": "Web Applications Meta"
  },
  "webmasters": {
      "root": "webmasters.stackexchange.com",
      "name": "Webmasters"
  },
  "webmasters.meta": {
      "root": "webmasters.meta.stackexchange.com",
      "name": "Webmasters Meta"
  },
  "woodworking": {
      "root": "woodworking.stackexchange.com",
      "name": "Woodworking"
  },
  "woodworking.meta": {
      "root": "woodworking.meta.stackexchange.com",
      "name": "Woodworking Meta"
  },
  "wordpress": {
      "root": "wordpress.stackexchange.com",
      "name": "WordPress Development"
  },
  "wordpress.meta": {
      "root": "wordpress.meta.stackexchange.com",
      "name": "WordPress Development Meta"
  },
  "workplace": {
      "root": "workplace.stackexchange.com",
      "name": "The Workplace"
  },
  "workplace.meta": {
      "root": "workplace.meta.stackexchange.com",
      "name": "The Workplace Meta"
  },
  "worldbuilding": {
      "root": "worldbuilding.stackexchange.com",
      "name": "Worldbuilding"
  },
  "worldbuilding.meta": {
      "root": "worldbuilding.meta.stackexchange.com",
      "name": "Worldbuilding Meta"
  },
  "writing": {
      "root": "writing.stackexchange.com",
      "name": "Writing"
  },
  "writing.meta": {
      "root": "writing.meta.stackexchange.com",
      "name": "Writing Meta"
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
st.QuestionList = function () {
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
st.QuestionList.prototype.setTags = function (tags) {
  this.tags = tags.map(function (tagData) {
    return new st.Tag(tagData);
  });
};


/**
 * Resets the questions and question state.
 */
st.QuestionList.prototype.reset = function () {
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
  function (opt_sort, opt_limit, opt_offset) {
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
      out = out.sort(function (a, b) {
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
st.QuestionList.prototype.update = function (opt_quantity) {
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
st.QuestionList.prototype.fetchTagQuestions_ = function (tag, quantity) {
  var url = st.UNANSWERED_URL.
    replace('{{root}}', tag.getNetwork().root).
    replace('{{tagged}}', tag.name).
    replace('{{pagesize}}', quantity).
    replace('{{key}}', st.API_KEY);
  var ctx = this;
  this.makeJSONPRequest_(url, function (data) {
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
st.QuestionList.prototype.parseResults_ = function (data, tag) {
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
st.QuestionList.prototype.makeJSONPRequest_ = function (url, callback) {
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
st.QuestionList.prototype.scheduleUpdates = function (opt_period, opt_quantity) {
  var period = opt_period != undefined ? opt_period : st.UPDATE_INTERVAL;
  var quantity = opt_quantity != undefined ? opt_quantity : st.UPDATE_QUANTITY;

  var ctx = this;
  this.timer = setInterval(function () {
    ctx.update.call(ctx, quantity);
  }, period);
};


/**
 * Persists the read/unread question state to a localStorage database.
 */
st.QuestionList.prototype.saveQuestionState = function () {
  localStorage.setItem('questionState', JSON.stringify(this.questionState_));
};


/**
 * Registers a callback that is to be fired when the number of unread
 * questions changes.
 * @param {function} callback The function to call when the number of unread
 * questions changes.
 */
st.QuestionList.prototype.registerCountCallback = function (callback) {
  this.countCallback = callback;
};


/**
 * Gets the number of questions of a given state.
 * @param {number=} opt_state Optional parameter to specify the state.
 * @return {number} Number of unread questions.
 */
st.QuestionList.prototype.getQuestionCount = function (opt_state) {
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
st.QuestionList.prototype.archiveRead = function () {
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
st.QuestionList.prototype.markRead = function (questions) {
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
