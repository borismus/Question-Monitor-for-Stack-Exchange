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
      "root": "https://3dprinting.stackexchange.com",
      "name": "3D Printing"
  },
  "3dprinting.meta": {
      "root": "https://3dprinting.meta.stackexchange.com",
      "name": "3D Printing Meta"
  },
  "academia": {
      "root": "https://academia.stackexchange.com",
      "name": "Academia"
  },
  "academia.meta": {
      "root": "https://academia.meta.stackexchange.com",
      "name": "Academia Meta"
  },
  "ai": {
      "root": "https://ai.stackexchange.com",
      "name": "Artificial Intelligence"
  },
  "ai.meta": {
      "root": "https://ai.meta.stackexchange.com",
      "name": "Artificial Intelligence Meta"
  },
  "alcohol": {
      "root": "https://alcohol.stackexchange.com",
      "name": "Beer, Wine &amp; Spirits"
  },
  "alcohol.meta": {
      "root": "https://alcohol.meta.stackexchange.com",
      "name": "Beer, Wine &amp; Spirits Meta"
  },
  "android": {
      "root": "https://android.stackexchange.com",
      "name": "Android Enthusiasts"
  },
  "android.meta": {
      "root": "https://android.meta.stackexchange.com",
      "name": "Android Enthusiasts Meta"
  },
  "anime": {
      "root": "https://anime.stackexchange.com",
      "name": "Anime &amp; Manga"
  },
  "anime.meta": {
      "root": "https://anime.meta.stackexchange.com",
      "name": "Anime &amp; Manga Meta"
  },
  "apple": {
      "root": "https://apple.stackexchange.com",
      "name": "Ask Different"
  },
  "apple.meta": {
      "root": "https://apple.meta.stackexchange.com",
      "name": "Ask Different Meta"
  },
  "arduino": {
      "root": "https://arduino.stackexchange.com",
      "name": "Arduino"
  },
  "arduino.meta": {
      "root": "https://arduino.meta.stackexchange.com",
      "name": "Arduino Meta"
  },
  "askubuntu": {
      "root": "https://askubuntu.com",
      "name": "Ask Ubuntu"
  },
  "astronomy": {
      "root": "https://astronomy.stackexchange.com",
      "name": "Astronomy"
  },
  "astronomy.meta": {
      "root": "https://astronomy.meta.stackexchange.com",
      "name": "Astronomy Meta"
  },
  "aviation": {
      "root": "https://aviation.stackexchange.com",
      "name": "Aviation"
  },
  "aviation.meta": {
      "root": "https://aviation.meta.stackexchange.com",
      "name": "Aviation Meta"
  },
  "bicycles": {
      "root": "https://bicycles.stackexchange.com",
      "name": "Bicycles"
  },
  "bicycles.meta": {
      "root": "https://bicycles.meta.stackexchange.com",
      "name": "Bicycles Meta"
  },
  "bioacoustics": {
      "root": "https://bioacoustics.stackexchange.com",
      "name": "Bioacoustics"
  },
  "bioacoustics.meta": {
      "root": "https://bioacoustics.meta.stackexchange.com",
      "name": "Bioacoustics Meta"
  },
  "bioinformatics": {
      "root": "https://bioinformatics.stackexchange.com",
      "name": "Bioinformatics"
  },
  "bioinformatics.meta": {
      "root": "https://bioinformatics.meta.stackexchange.com",
      "name": "Bioinformatics Meta"
  },
  "biology": {
      "root": "https://biology.stackexchange.com",
      "name": "Biology"
  },
  "biology.meta": {
      "root": "https://biology.meta.stackexchange.com",
      "name": "Biology Meta"
  },
  "bitcoin": {
      "root": "https://bitcoin.stackexchange.com",
      "name": "Bitcoin"
  },
  "bitcoin.meta": {
      "root": "https://bitcoin.meta.stackexchange.com",
      "name": "Bitcoin Meta"
  },
  "blender": {
      "root": "https://blender.stackexchange.com",
      "name": "Blender"
  },
  "blender.meta": {
      "root": "https://blender.meta.stackexchange.com",
      "name": "Blender Meta"
  },
  "boardgames": {
      "root": "https://boardgames.stackexchange.com",
      "name": "Board &amp; Card Games"
  },
  "boardgames.meta": {
      "root": "https://boardgames.meta.stackexchange.com",
      "name": "Board &amp; Card Games Meta"
  },
  "bricks": {
      "root": "https://bricks.stackexchange.com",
      "name": "Bricks"
  },
  "bricks.meta": {
      "root": "https://bricks.meta.stackexchange.com",
      "name": "Bricks Meta"
  },
  "buddhism": {
      "root": "https://buddhism.stackexchange.com",
      "name": "Buddhism"
  },
  "buddhism.meta": {
      "root": "https://buddhism.meta.stackexchange.com",
      "name": "Buddhism Meta"
  },
  "cardano": {
      "root": "https://cardano.stackexchange.com",
      "name": "Cardano"
  },
  "cardano.meta": {
      "root": "https://cardano.meta.stackexchange.com",
      "name": "Cardano Meta"
  },
  "chemistry": {
      "root": "https://chemistry.stackexchange.com",
      "name": "Chemistry"
  },
  "chemistry.meta": {
      "root": "https://chemistry.meta.stackexchange.com",
      "name": "Chemistry Meta"
  },
  "chess": {
      "root": "https://chess.stackexchange.com",
      "name": "Chess"
  },
  "chess.meta": {
      "root": "https://chess.meta.stackexchange.com",
      "name": "Chess Meta"
  },
  "chinese": {
      "root": "https://chinese.stackexchange.com",
      "name": "Chinese Language"
  },
  "chinese.meta": {
      "root": "https://chinese.meta.stackexchange.com",
      "name": "Chinese Language Meta"
  },
  "christianity": {
      "root": "https://christianity.stackexchange.com",
      "name": "Christianity"
  },
  "christianity.meta": {
      "root": "https://christianity.meta.stackexchange.com",
      "name": "Christianity Meta"
  },
  "civicrm": {
      "root": "https://civicrm.stackexchange.com",
      "name": "CiviCRM"
  },
  "civicrm.meta": {
      "root": "https://civicrm.meta.stackexchange.com",
      "name": "CiviCRM Meta"
  },
  "codegolf": {
      "root": "https://codegolf.stackexchange.com",
      "name": "Code Golf"
  },
  "codegolf.meta": {
      "root": "https://codegolf.meta.stackexchange.com",
      "name": "Code Golf Meta"
  },
  "codereview": {
      "root": "https://codereview.stackexchange.com",
      "name": "Code Review"
  },
  "codereview.meta": {
      "root": "https://codereview.meta.stackexchange.com",
      "name": "Code Review Meta"
  },
  "coffee": {
      "root": "https://coffee.stackexchange.com",
      "name": "Coffee"
  },
  "coffee.meta": {
      "root": "https://coffee.meta.stackexchange.com",
      "name": "Coffee Meta"
  },
  "communitybuilding": {
      "root": "https://communitybuilding.stackexchange.com",
      "name": "Community Building"
  },
  "communitybuilding.meta": {
      "root": "https://communitybuilding.meta.stackexchange.com",
      "name": "Community Building Meta"
  },
  "computergraphics": {
      "root": "https://computergraphics.stackexchange.com",
      "name": "Computer Graphics"
  },
  "computergraphics.meta": {
      "root": "https://computergraphics.meta.stackexchange.com",
      "name": "Computer Graphics Meta"
  },
  "conlang": {
      "root": "https://conlang.stackexchange.com",
      "name": "Constructed Languages"
  },
  "conlang.meta": {
      "root": "https://conlang.meta.stackexchange.com",
      "name": "Constructed Languages Meta"
  },
  "cooking": {
      "root": "https://cooking.stackexchange.com",
      "name": "Seasoned Advice"
  },
  "cooking.meta": {
      "root": "https://cooking.meta.stackexchange.com",
      "name": "Seasoned Advice Meta"
  },
  "craftcms": {
      "root": "https://craftcms.stackexchange.com",
      "name": "Craft CMS"
  },
  "craftcms.meta": {
      "root": "https://craftcms.meta.stackexchange.com",
      "name": "Craft CMS Meta"
  },
  "crafts": {
      "root": "https://crafts.stackexchange.com",
      "name": "Arts &amp; Crafts"
  },
  "crafts.meta": {
      "root": "https://crafts.meta.stackexchange.com",
      "name": "Arts &amp; Crafts Meta"
  },
  "crypto": {
      "root": "https://crypto.stackexchange.com",
      "name": "Cryptography"
  },
  "crypto.meta": {
      "root": "https://crypto.meta.stackexchange.com",
      "name": "Cryptography Meta"
  },
  "cs": {
      "root": "https://cs.stackexchange.com",
      "name": "Computer Science"
  },
  "cs.meta": {
      "root": "https://cs.meta.stackexchange.com",
      "name": "Computer Science Meta"
  },
  "cs50": {
      "root": "https://cs50.stackexchange.com",
      "name": "CS50"
  },
  "cs50.meta": {
      "root": "https://cs50.meta.stackexchange.com",
      "name": "CS50 Meta"
  },
  "cseducators": {
      "root": "https://cseducators.stackexchange.com",
      "name": "Computer Science Educators"
  },
  "cseducators.meta": {
      "root": "https://cseducators.meta.stackexchange.com",
      "name": "Computer Science Educators Meta"
  },
  "cstheory": {
      "root": "https://cstheory.stackexchange.com",
      "name": "Theoretical Computer Science"
  },
  "cstheory.meta": {
      "root": "https://cstheory.meta.stackexchange.com",
      "name": "Theoretical Computer Science Meta"
  },
  "datascience": {
      "root": "https://datascience.stackexchange.com",
      "name": "Data Science"
  },
  "datascience.meta": {
      "root": "https://datascience.meta.stackexchange.com",
      "name": "Data Science Meta"
  },
  "dba": {
      "root": "https://dba.stackexchange.com",
      "name": "Database Administrators"
  },
  "dba.meta": {
      "root": "https://dba.meta.stackexchange.com",
      "name": "Database Administrators Meta"
  },
  "devops": {
      "root": "https://devops.stackexchange.com",
      "name": "DevOps"
  },
  "devops.meta": {
      "root": "https://devops.meta.stackexchange.com",
      "name": "DevOps Meta"
  },
  "diy": {
      "root": "https://diy.stackexchange.com",
      "name": "Home Improvement"
  },
  "diy.meta": {
      "root": "https://diy.meta.stackexchange.com",
      "name": "Home Improvement Meta"
  },
  "drones": {
      "root": "https://drones.stackexchange.com",
      "name": "Drones and Model Aircraft"
  },
  "drones.meta": {
      "root": "https://drones.meta.stackexchange.com",
      "name": "Drones and Model Aircraft Meta"
  },
  "drupal": {
      "root": "https://drupal.stackexchange.com",
      "name": "Drupal Answers"
  },
  "drupal.meta": {
      "root": "https://drupal.meta.stackexchange.com",
      "name": "Drupal Answers Meta"
  },
  "dsp": {
      "root": "https://dsp.stackexchange.com",
      "name": "Signal Processing"
  },
  "dsp.meta": {
      "root": "https://dsp.meta.stackexchange.com",
      "name": "Signal Processing Meta"
  },
  "earthscience": {
      "root": "https://earthscience.stackexchange.com",
      "name": "Earth Science"
  },
  "earthscience.meta": {
      "root": "https://earthscience.meta.stackexchange.com",
      "name": "Earth Science Meta"
  },
  "ebooks": {
      "root": "https://ebooks.stackexchange.com",
      "name": "Ebooks"
  },
  "ebooks.meta": {
      "root": "https://ebooks.meta.stackexchange.com",
      "name": "Ebooks Meta"
  },
  "economics": {
      "root": "https://economics.stackexchange.com",
      "name": "Economics"
  },
  "economics.meta": {
      "root": "https://economics.meta.stackexchange.com",
      "name": "Economics Meta"
  },
  "electronics": {
      "root": "https://electronics.stackexchange.com",
      "name": "Electrical Engineering"
  },
  "electronics.meta": {
      "root": "https://electronics.meta.stackexchange.com",
      "name": "Electrical Engineering Meta"
  },
  "elementaryos": {
      "root": "https://elementaryos.stackexchange.com",
      "name": "elementary OS"
  },
  "elementaryos.meta": {
      "root": "https://elementaryos.meta.stackexchange.com",
      "name": "elementary OS Meta"
  },
  "ell": {
      "root": "https://ell.stackexchange.com",
      "name": "English Language Learners"
  },
  "ell.meta": {
      "root": "https://ell.meta.stackexchange.com",
      "name": "English Language Learners Meta"
  },
  "emacs": {
      "root": "https://emacs.stackexchange.com",
      "name": "Emacs"
  },
  "emacs.meta": {
      "root": "https://emacs.meta.stackexchange.com",
      "name": "Emacs Meta"
  },
  "engineering": {
      "root": "https://engineering.stackexchange.com",
      "name": "Engineering"
  },
  "engineering.meta": {
      "root": "https://engineering.meta.stackexchange.com",
      "name": "Engineering Meta"
  },
  "english": {
      "root": "https://english.stackexchange.com",
      "name": "English Language &amp; Usage"
  },
  "english.meta": {
      "root": "https://english.meta.stackexchange.com",
      "name": "English Language &amp; Usage Meta"
  },
  "eosio": {
      "root": "https://eosio.stackexchange.com",
      "name": "EOS.IO"
  },
  "eosio.meta": {
      "root": "https://eosio.meta.stackexchange.com",
      "name": "EOS.IO Meta"
  },
  "es.meta.stackoverflow": {
      "root": "https://es.meta.stackoverflow.com",
      "name": "Stack Overflow Meta en espa&#241;ol"
  },
  "es.stackoverflow": {
      "root": "https://es.stackoverflow.com",
      "name": "Stack Overflow en espa&#241;ol"
  },
  "esperanto": {
      "root": "https://esperanto.stackexchange.com",
      "name": "Esperanto Language"
  },
  "esperanto.meta": {
      "root": "https://esperanto.meta.stackexchange.com",
      "name": "Esperanto Language Meta"
  },
  "ethereum": {
      "root": "https://ethereum.stackexchange.com",
      "name": "Ethereum"
  },
  "ethereum.meta": {
      "root": "https://ethereum.meta.stackexchange.com",
      "name": "Ethereum Meta"
  },
  "expatriates": {
      "root": "https://expatriates.stackexchange.com",
      "name": "Expatriates"
  },
  "expatriates.meta": {
      "root": "https://expatriates.meta.stackexchange.com",
      "name": "Expatriates Meta"
  },
  "expressionengine": {
      "root": "https://expressionengine.stackexchange.com",
      "name": "ExpressionEngine&#174; Answers"
  },
  "expressionengine.meta": {
      "root": "https://expressionengine.meta.stackexchange.com",
      "name": "ExpressionEngine&#174; Answers Meta"
  },
  "fitness": {
      "root": "https://fitness.stackexchange.com",
      "name": "Physical Fitness"
  },
  "fitness.meta": {
      "root": "https://fitness.meta.stackexchange.com",
      "name": "Physical Fitness Meta"
  },
  "freelancing": {
      "root": "https://freelancing.stackexchange.com",
      "name": "Freelancing"
  },
  "freelancing.meta": {
      "root": "https://freelancing.meta.stackexchange.com",
      "name": "Freelancing Meta"
  },
  "french": {
      "root": "https://french.stackexchange.com",
      "name": "French Language"
  },
  "french.meta": {
      "root": "https://french.meta.stackexchange.com",
      "name": "French Language Meta"
  },
  "gamedev": {
      "root": "https://gamedev.stackexchange.com",
      "name": "Game Development"
  },
  "gamedev.meta": {
      "root": "https://gamedev.meta.stackexchange.com",
      "name": "Game Development Meta"
  },
  "gaming": {
      "root": "https://gaming.stackexchange.com",
      "name": "Arqade"
  },
  "gaming.meta": {
      "root": "https://gaming.meta.stackexchange.com",
      "name": "Arqade Meta"
  },
  "gardening": {
      "root": "https://gardening.stackexchange.com",
      "name": "Gardening &amp; Landscaping"
  },
  "gardening.meta": {
      "root": "https://gardening.meta.stackexchange.com",
      "name": "Gardening &amp; Landscaping Meta"
  },
  "genealogy": {
      "root": "https://genealogy.stackexchange.com",
      "name": "Genealogy &amp; Family History"
  },
  "genealogy.meta": {
      "root": "https://genealogy.meta.stackexchange.com",
      "name": "Genealogy &amp; Family History Meta"
  },
  "german": {
      "root": "https://german.stackexchange.com",
      "name": "German Language"
  },
  "german.meta": {
      "root": "https://german.meta.stackexchange.com",
      "name": "German Language Meta"
  },
  "gis": {
      "root": "https://gis.stackexchange.com",
      "name": "Geographic Information Systems"
  },
  "gis.meta": {
      "root": "https://gis.meta.stackexchange.com",
      "name": "Geographic Information Systems Meta"
  },
  "graphicdesign": {
      "root": "https://graphicdesign.stackexchange.com",
      "name": "Graphic Design"
  },
  "graphicdesign.meta": {
      "root": "https://graphicdesign.meta.stackexchange.com",
      "name": "Graphic Design Meta"
  },
  "ham": {
      "root": "https://ham.stackexchange.com",
      "name": "Amateur Radio"
  },
  "ham.meta": {
      "root": "https://ham.meta.stackexchange.com",
      "name": "Amateur Radio Meta"
  },
  "hardwarerecs": {
      "root": "https://hardwarerecs.stackexchange.com",
      "name": "Hardware Recommendations"
  },
  "hardwarerecs.meta": {
      "root": "https://hardwarerecs.meta.stackexchange.com",
      "name": "Hardware Recommendations Meta"
  },
  "hermeneutics": {
      "root": "https://hermeneutics.stackexchange.com",
      "name": "Biblical Hermeneutics"
  },
  "hermeneutics.meta": {
      "root": "https://hermeneutics.meta.stackexchange.com",
      "name": "Biblical Hermeneutics Meta"
  },
  "hinduism": {
      "root": "https://hinduism.stackexchange.com",
      "name": "Hinduism"
  },
  "hinduism.meta": {
      "root": "https://hinduism.meta.stackexchange.com",
      "name": "Hinduism Meta"
  },
  "history": {
      "root": "https://history.stackexchange.com",
      "name": "History"
  },
  "history.meta": {
      "root": "https://history.meta.stackexchange.com",
      "name": "History Meta"
  },
  "homebrew": {
      "root": "https://homebrew.stackexchange.com",
      "name": "Homebrewing"
  },
  "homebrew.meta": {
      "root": "https://homebrew.meta.stackexchange.com",
      "name": "Homebrewing Meta"
  },
  "hsm": {
      "root": "https://hsm.stackexchange.com",
      "name": "History of Science and Mathematics"
  },
  "hsm.meta": {
      "root": "https://hsm.meta.stackexchange.com",
      "name": "History of Science and Mathematics Meta"
  },
  "interpersonal": {
      "root": "https://interpersonal.stackexchange.com",
      "name": "Interpersonal Skills"
  },
  "interpersonal.meta": {
      "root": "https://interpersonal.meta.stackexchange.com",
      "name": "Interpersonal Skills Meta"
  },
  "iot": {
      "root": "https://iot.stackexchange.com",
      "name": "Internet of Things"
  },
  "iot.meta": {
      "root": "https://iot.meta.stackexchange.com",
      "name": "Internet of Things Meta"
  },
  "iota": {
      "root": "https://iota.stackexchange.com",
      "name": "Iota"
  },
  "iota.meta": {
      "root": "https://iota.meta.stackexchange.com",
      "name": "Iota Meta"
  },
  "islam": {
      "root": "https://islam.stackexchange.com",
      "name": "Islam"
  },
  "islam.meta": {
      "root": "https://islam.meta.stackexchange.com",
      "name": "Islam Meta"
  },
  "italian": {
      "root": "https://italian.stackexchange.com",
      "name": "Italian Language"
  },
  "italian.meta": {
      "root": "https://italian.meta.stackexchange.com",
      "name": "Italian Language Meta"
  },
  "ja.meta.stackoverflow": {
      "root": "https://ja.meta.stackoverflow.com",
      "name": "スタック・オーバーフローMeta"
  },
  "ja.stackoverflow": {
      "root": "https://ja.stackoverflow.com",
      "name": "スタック・オーバーフロー"
  },
  "japanese": {
      "root": "https://japanese.stackexchange.com",
      "name": "Japanese Language"
  },
  "japanese.meta": {
      "root": "https://japanese.meta.stackexchange.com",
      "name": "Japanese Language Meta"
  },
  "joomla": {
      "root": "https://joomla.stackexchange.com",
      "name": "Joomla"
  },
  "joomla.meta": {
      "root": "https://joomla.meta.stackexchange.com",
      "name": "Joomla Meta"
  },
  "judaism": {
      "root": "https://judaism.stackexchange.com",
      "name": "Mi Yodeya"
  },
  "judaism.meta": {
      "root": "https://judaism.meta.stackexchange.com",
      "name": "Mi Yodeya Meta"
  },
  "korean": {
      "root": "https://korean.stackexchange.com",
      "name": "Korean Language"
  },
  "korean.meta": {
      "root": "https://korean.meta.stackexchange.com",
      "name": "Korean Language Meta"
  },
  "languagelearning": {
      "root": "https://languagelearning.stackexchange.com",
      "name": "Language Learning"
  },
  "languagelearning.meta": {
      "root": "https://languagelearning.meta.stackexchange.com",
      "name": "Language Learning Meta"
  },
  "latin": {
      "root": "https://latin.stackexchange.com",
      "name": "Latin Language"
  },
  "latin.meta": {
      "root": "https://latin.meta.stackexchange.com",
      "name": "Latin Language Meta"
  },
  "law": {
      "root": "https://law.stackexchange.com",
      "name": "Law"
  },
  "law.meta": {
      "root": "https://law.meta.stackexchange.com",
      "name": "Law Meta"
  },
  "lifehacks": {
      "root": "https://lifehacks.stackexchange.com",
      "name": "Lifehacks"
  },
  "lifehacks.meta": {
      "root": "https://lifehacks.meta.stackexchange.com",
      "name": "Lifehacks Meta"
  },
  "linguistics": {
      "root": "https://linguistics.stackexchange.com",
      "name": "Linguistics"
  },
  "linguistics.meta": {
      "root": "https://linguistics.meta.stackexchange.com",
      "name": "Linguistics Meta"
  },
  "literature": {
      "root": "https://literature.stackexchange.com",
      "name": "Literature"
  },
  "literature.meta": {
      "root": "https://literature.meta.stackexchange.com",
      "name": "Literature Meta"
  },
  "magento": {
      "root": "https://magento.stackexchange.com",
      "name": "Magento"
  },
  "magento.meta": {
      "root": "https://magento.meta.stackexchange.com",
      "name": "Magento Meta"
  },
  "martialarts": {
      "root": "https://martialarts.stackexchange.com",
      "name": "Martial Arts"
  },
  "martialarts.meta": {
      "root": "https://martialarts.meta.stackexchange.com",
      "name": "Martial Arts Meta"
  },
  "math": {
      "root": "https://math.stackexchange.com",
      "name": "Mathematics"
  },
  "math.meta": {
      "root": "https://math.meta.stackexchange.com",
      "name": "Mathematics Meta"
  },
  "matheducators": {
      "root": "https://matheducators.stackexchange.com",
      "name": "Mathematics Educators"
  },
  "matheducators.meta": {
      "root": "https://matheducators.meta.stackexchange.com",
      "name": "Mathematics Educators Meta"
  },
  "mathematica": {
      "root": "https://mathematica.stackexchange.com",
      "name": "Mathematica"
  },
  "mathematica.meta": {
      "root": "https://mathematica.meta.stackexchange.com",
      "name": "Mathematica Meta"
  },
  "mathoverflow.net": {
      "root": "https://mathoverflow.net",
      "name": "MathOverflow"
  },
  "mattermodeling": {
      "root": "https://mattermodeling.stackexchange.com",
      "name": "Matter Modeling"
  },
  "mattermodeling.meta": {
      "root": "https://mattermodeling.meta.stackexchange.com",
      "name": "Matter Modeling Meta"
  },
  "mechanics": {
      "root": "https://mechanics.stackexchange.com",
      "name": "Motor Vehicle Maintenance &amp; Repair"
  },
  "mechanics.meta": {
      "root": "https://mechanics.meta.stackexchange.com",
      "name": "Motor Vehicle Maintenance &amp; Repair Meta"
  },
  "medicalsciences": {
      "root": "https://medicalsciences.stackexchange.com",
      "name": "Medical Sciences"
  },
  "medicalsciences.meta": {
      "root": "https://medicalsciences.meta.stackexchange.com",
      "name": "Medical Sciences Meta"
  },
  "meta": {
      "root": "https://meta.stackexchange.com",
      "name": "Meta Stack Exchange"
  },
  "meta.askubuntu": {
      "root": "https://meta.askubuntu.com",
      "name": "Ask Ubuntu Meta"
  },
  "meta.mathoverflow.net": {
      "root": "https://meta.mathoverflow.net",
      "name": "MathOverflow Meta"
  },
  "meta.serverfault": {
      "root": "https://meta.serverfault.com",
      "name": "Meta Server Fault"
  },
  "meta.stackoverflow": {
      "root": "https://meta.stackoverflow.com",
      "name": "Meta Stack Overflow"
  },
  "meta.superuser": {
      "root": "https://meta.superuser.com",
      "name": "Meta Super User"
  },
  "monero": {
      "root": "https://monero.stackexchange.com",
      "name": "Monero"
  },
  "monero.meta": {
      "root": "https://monero.meta.stackexchange.com",
      "name": "Monero Meta"
  },
  "money": {
      "root": "https://money.stackexchange.com",
      "name": "Personal Finance &amp; Money"
  },
  "money.meta": {
      "root": "https://money.meta.stackexchange.com",
      "name": "Personal Finance &amp; Money Meta"
  },
  "movies": {
      "root": "https://movies.stackexchange.com",
      "name": "Movies &amp; TV"
  },
  "movies.meta": {
      "root": "https://movies.meta.stackexchange.com",
      "name": "Movies &amp; TV Meta"
  },
  "music": {
      "root": "https://music.stackexchange.com",
      "name": "Music: Practice &amp; Theory"
  },
  "music.meta": {
      "root": "https://music.meta.stackexchange.com",
      "name": "Music: Practice &amp; Theory Meta"
  },
  "musicfans": {
      "root": "https://musicfans.stackexchange.com",
      "name": "Music Fans"
  },
  "musicfans.meta": {
      "root": "https://musicfans.meta.stackexchange.com",
      "name": "Music Fans Meta"
  },
  "mythology": {
      "root": "https://mythology.stackexchange.com",
      "name": "Mythology &amp; Folklore"
  },
  "mythology.meta": {
      "root": "https://mythology.meta.stackexchange.com",
      "name": "Mythology &amp; Folklore Meta"
  },
  "networkengineering": {
      "root": "https://networkengineering.stackexchange.com",
      "name": "Network Engineering"
  },
  "networkengineering.meta": {
      "root": "https://networkengineering.meta.stackexchange.com",
      "name": "Network Engineering Meta"
  },
  "opendata": {
      "root": "https://opendata.stackexchange.com",
      "name": "Open Data"
  },
  "opendata.meta": {
      "root": "https://opendata.meta.stackexchange.com",
      "name": "Open Data Meta"
  },
  "opensource": {
      "root": "https://opensource.stackexchange.com",
      "name": "Open Source"
  },
  "opensource.meta": {
      "root": "https://opensource.meta.stackexchange.com",
      "name": "Open Source Meta"
  },
  "or": {
      "root": "https://or.stackexchange.com",
      "name": "Operations Research"
  },
  "or.meta": {
      "root": "https://or.meta.stackexchange.com",
      "name": "Operations Research Meta"
  },
  "outdoors": {
      "root": "https://outdoors.stackexchange.com",
      "name": "The Great Outdoors"
  },
  "outdoors.meta": {
      "root": "https://outdoors.meta.stackexchange.com",
      "name": "The Great Outdoors Meta"
  },
  "parenting": {
      "root": "https://parenting.stackexchange.com",
      "name": "Parenting"
  },
  "parenting.meta": {
      "root": "https://parenting.meta.stackexchange.com",
      "name": "Parenting Meta"
  },
  "patents": {
      "root": "https://patents.stackexchange.com",
      "name": "Ask Patents"
  },
  "patents.meta": {
      "root": "https://patents.meta.stackexchange.com",
      "name": "Ask Patents Meta"
  },
  "pets": {
      "root": "https://pets.stackexchange.com",
      "name": "Pets"
  },
  "pets.meta": {
      "root": "https://pets.meta.stackexchange.com",
      "name": "Pets Meta"
  },
  "philosophy": {
      "root": "https://philosophy.stackexchange.com",
      "name": "Philosophy"
  },
  "philosophy.meta": {
      "root": "https://philosophy.meta.stackexchange.com",
      "name": "Philosophy Meta"
  },
  "photo": {
      "root": "https://photo.stackexchange.com",
      "name": "Photography"
  },
  "photo.meta": {
      "root": "https://photo.meta.stackexchange.com",
      "name": "Photography Meta"
  },
  "physics": {
      "root": "https://physics.stackexchange.com",
      "name": "Physics"
  },
  "physics.meta": {
      "root": "https://physics.meta.stackexchange.com",
      "name": "Physics Meta"
  },
  "pm": {
      "root": "https://pm.stackexchange.com",
      "name": "Project Management"
  },
  "pm.meta": {
      "root": "https://pm.meta.stackexchange.com",
      "name": "Project Management Meta"
  },
  "poker": {
      "root": "https://poker.stackexchange.com",
      "name": "Poker"
  },
  "poker.meta": {
      "root": "https://poker.meta.stackexchange.com",
      "name": "Poker Meta"
  },
  "politics": {
      "root": "https://politics.stackexchange.com",
      "name": "Politics"
  },
  "politics.meta": {
      "root": "https://politics.meta.stackexchange.com",
      "name": "Politics Meta"
  },
  "portuguese": {
      "root": "https://portuguese.stackexchange.com",
      "name": "Portuguese Language"
  },
  "portuguese.meta": {
      "root": "https://portuguese.meta.stackexchange.com",
      "name": "Portuguese Language Meta"
  },
  "proofassistants": {
      "root": "https://proofassistants.stackexchange.com",
      "name": "Proof Assistants"
  },
  "proofassistants.meta": {
      "root": "https://proofassistants.meta.stackexchange.com",
      "name": "Proof Assistants Meta"
  },
  "psychology": {
      "root": "https://psychology.stackexchange.com",
      "name": "Psychology &amp; Neuroscience"
  },
  "psychology.meta": {
      "root": "https://psychology.meta.stackexchange.com",
      "name": "Psychology &amp; Neuroscience Meta"
  },
  "pt.meta.stackoverflow": {
      "root": "https://pt.meta.stackoverflow.com",
      "name": "Stack Overflow em Portugu&#234;s Meta"
  },
  "pt.stackoverflow": {
      "root": "https://pt.stackoverflow.com",
      "name": "Stack Overflow em Portugu&#234;s"
  },
  "puzzling": {
      "root": "https://puzzling.stackexchange.com",
      "name": "Puzzling"
  },
  "puzzling.meta": {
      "root": "https://puzzling.meta.stackexchange.com",
      "name": "Puzzling Meta"
  },
  "quant": {
      "root": "https://quant.stackexchange.com",
      "name": "Quantitative Finance"
  },
  "quant.meta": {
      "root": "https://quant.meta.stackexchange.com",
      "name": "Quantitative Finance Meta"
  },
  "quantumcomputing": {
      "root": "https://quantumcomputing.stackexchange.com",
      "name": "Quantum Computing"
  },
  "quantumcomputing.meta": {
      "root": "https://quantumcomputing.meta.stackexchange.com",
      "name": "Quantum Computing Meta"
  },
  "raspberrypi": {
      "root": "https://raspberrypi.stackexchange.com",
      "name": "Raspberry Pi"
  },
  "raspberrypi.meta": {
      "root": "https://raspberrypi.meta.stackexchange.com",
      "name": "Raspberry Pi Meta"
  },
  "retrocomputing": {
      "root": "https://retrocomputing.stackexchange.com",
      "name": "Retrocomputing"
  },
  "retrocomputing.meta": {
      "root": "https://retrocomputing.meta.stackexchange.com",
      "name": "Retrocomputing Meta"
  },
  "reverseengineering": {
      "root": "https://reverseengineering.stackexchange.com",
      "name": "Reverse Engineering"
  },
  "reverseengineering.meta": {
      "root": "https://reverseengineering.meta.stackexchange.com",
      "name": "Reverse Engineering Meta"
  },
  "robotics": {
      "root": "https://robotics.stackexchange.com",
      "name": "Robotics"
  },
  "robotics.meta": {
      "root": "https://robotics.meta.stackexchange.com",
      "name": "Robotics Meta"
  },
  "rpg": {
      "root": "https://rpg.stackexchange.com",
      "name": "Role-playing Games"
  },
  "rpg.meta": {
      "root": "https://rpg.meta.stackexchange.com",
      "name": "Role-playing Games Meta"
  },
  "ru.meta.stackoverflow": {
      "root": "https://ru.meta.stackoverflow.com",
      "name": "Stack Overflow на русском Meta"
  },
  "ru.stackoverflow": {
      "root": "https://ru.stackoverflow.com",
      "name": "Stack Overflow на русском"
  },
  "rus": {
      "root": "https://rus.stackexchange.com",
      "name": "Русский язык"
  },
  "rus.meta": {
      "root": "https://rus.meta.stackexchange.com",
      "name": "Русский язык Meta"
  },
  "russian": {
      "root": "https://russian.stackexchange.com",
      "name": "Russian Language"
  },
  "russian.meta": {
      "root": "https://russian.meta.stackexchange.com",
      "name": "Russian Language Meta"
  },
  "salesforce": {
      "root": "https://salesforce.stackexchange.com",
      "name": "Salesforce"
  },
  "salesforce.meta": {
      "root": "https://salesforce.meta.stackexchange.com",
      "name": "Salesforce Meta"
  },
  "scicomp": {
      "root": "https://scicomp.stackexchange.com",
      "name": "Computational Science"
  },
  "scicomp.meta": {
      "root": "https://scicomp.meta.stackexchange.com",
      "name": "Computational Science Meta"
  },
  "scifi": {
      "root": "https://scifi.stackexchange.com",
      "name": "Science Fiction &amp; Fantasy"
  },
  "scifi.meta": {
      "root": "https://scifi.meta.stackexchange.com",
      "name": "Science Fiction &amp; Fantasy Meta"
  },
  "security": {
      "root": "https://security.stackexchange.com",
      "name": "Information Security"
  },
  "security.meta": {
      "root": "https://security.meta.stackexchange.com",
      "name": "Information Security Meta"
  },
  "serverfault": {
      "root": "https://serverfault.com",
      "name": "Server Fault"
  },
  "sharepoint": {
      "root": "https://sharepoint.stackexchange.com",
      "name": "SharePoint"
  },
  "sharepoint.meta": {
      "root": "https://sharepoint.meta.stackexchange.com",
      "name": "SharePoint Meta"
  },
  "sitecore": {
      "root": "https://sitecore.stackexchange.com",
      "name": "Sitecore"
  },
  "sitecore.meta": {
      "root": "https://sitecore.meta.stackexchange.com",
      "name": "Sitecore Meta"
  },
  "skeptics": {
      "root": "https://skeptics.stackexchange.com",
      "name": "Skeptics"
  },
  "skeptics.meta": {
      "root": "https://skeptics.meta.stackexchange.com",
      "name": "Skeptics Meta"
  },
  "softwareengineering": {
      "root": "https://softwareengineering.stackexchange.com",
      "name": "Software Engineering"
  },
  "softwareengineering.meta": {
      "root": "https://softwareengineering.meta.stackexchange.com",
      "name": "Software Engineering Meta"
  },
  "softwarerecs": {
      "root": "https://softwarerecs.stackexchange.com",
      "name": "Software Recommendations"
  },
  "softwarerecs.meta": {
      "root": "https://softwarerecs.meta.stackexchange.com",
      "name": "Software Recommendations Meta"
  },
  "solana": {
      "root": "https://solana.stackexchange.com",
      "name": "Solana"
  },
  "solana.meta": {
      "root": "https://solana.meta.stackexchange.com",
      "name": "Solana Meta"
  },
  "sound": {
      "root": "https://sound.stackexchange.com",
      "name": "Sound Design"
  },
  "sound.meta": {
      "root": "https://sound.meta.stackexchange.com",
      "name": "Sound Design Meta"
  },
  "space": {
      "root": "https://space.stackexchange.com",
      "name": "Space Exploration"
  },
  "space.meta": {
      "root": "https://space.meta.stackexchange.com",
      "name": "Space Exploration Meta"
  },
  "spanish": {
      "root": "https://spanish.stackexchange.com",
      "name": "Spanish Language"
  },
  "spanish.meta": {
      "root": "https://spanish.meta.stackexchange.com",
      "name": "Spanish Language Meta"
  },
  "sports": {
      "root": "https://sports.stackexchange.com",
      "name": "Sports"
  },
  "sports.meta": {
      "root": "https://sports.meta.stackexchange.com",
      "name": "Sports Meta"
  },
  "sqa": {
      "root": "https://sqa.stackexchange.com",
      "name": "Software Quality Assurance &amp; Testing"
  },
  "sqa.meta": {
      "root": "https://sqa.meta.stackexchange.com",
      "name": "Software Quality Assurance &amp; Testing Meta"
  },
  "stackapps": {
      "root": "https://stackapps.com",
      "name": "Stack Apps"
  },
  "stackoverflow": {
      "root": "https://stackoverflow.com",
      "name": "Stack Overflow"
  },
  "stats": {
      "root": "https://stats.stackexchange.com",
      "name": "Cross Validated"
  },
  "stats.meta": {
      "root": "https://stats.meta.stackexchange.com",
      "name": "Cross Validated Meta"
  },
  "stellar": {
      "root": "https://stellar.stackexchange.com",
      "name": "Stellar"
  },
  "stellar.meta": {
      "root": "https://stellar.meta.stackexchange.com",
      "name": "Stellar Meta"
  },
  "substrate": {
      "root": "https://substrate.stackexchange.com",
      "name": "Substrate and Polkadot"
  },
  "substrate.meta": {
      "root": "https://substrate.meta.stackexchange.com",
      "name": "Substrate and Polkadot Meta"
  },
  "superuser": {
      "root": "https://superuser.com",
      "name": "Super User"
  },
  "sustainability": {
      "root": "https://sustainability.stackexchange.com",
      "name": "Sustainable Living"
  },
  "sustainability.meta": {
      "root": "https://sustainability.meta.stackexchange.com",
      "name": "Sustainable Living Meta"
  },
  "tex": {
      "root": "https://tex.stackexchange.com",
      "name": "TeX - LaTeX"
  },
  "tex.meta": {
      "root": "https://tex.meta.stackexchange.com",
      "name": "TeX - LaTeX Meta"
  },
  "tezos": {
      "root": "https://tezos.stackexchange.com",
      "name": "Tezos"
  },
  "tezos.meta": {
      "root": "https://tezos.meta.stackexchange.com",
      "name": "Tezos Meta"
  },
  "tor": {
      "root": "https://tor.stackexchange.com",
      "name": "Tor"
  },
  "tor.meta": {
      "root": "https://tor.meta.stackexchange.com",
      "name": "Tor Meta"
  },
  "travel": {
      "root": "https://travel.stackexchange.com",
      "name": "Travel"
  },
  "travel.meta": {
      "root": "https://travel.meta.stackexchange.com",
      "name": "Travel Meta"
  },
  "tridion": {
      "root": "https://tridion.stackexchange.com",
      "name": "Tridion"
  },
  "tridion.meta": {
      "root": "https://tridion.meta.stackexchange.com",
      "name": "Tridion Meta"
  },
  "ukrainian": {
      "root": "https://ukrainian.stackexchange.com",
      "name": "Ukrainian Language"
  },
  "ukrainian.meta": {
      "root": "https://ukrainian.meta.stackexchange.com",
      "name": "Ukrainian Language Meta"
  },
  "unix": {
      "root": "https://unix.stackexchange.com",
      "name": "Unix &amp; Linux"
  },
  "unix.meta": {
      "root": "https://unix.meta.stackexchange.com",
      "name": "Unix &amp; Linux Meta"
  },
  "ux": {
      "root": "https://ux.stackexchange.com",
      "name": "User Experience"
  },
  "ux.meta": {
      "root": "https://ux.meta.stackexchange.com",
      "name": "User Experience Meta"
  },
  "vegetarianism": {
      "root": "https://vegetarianism.stackexchange.com",
      "name": "Veganism &amp; Vegetarianism"
  },
  "vegetarianism.meta": {
      "root": "https://vegetarianism.meta.stackexchange.com",
      "name": "Veganism &amp; Vegetarianism Meta"
  },
  "vi": {
      "root": "https://vi.stackexchange.com",
      "name": "Vi and Vim"
  },
  "vi.meta": {
      "root": "https://vi.meta.stackexchange.com",
      "name": "Vi and Vim Meta"
  },
  "video": {
      "root": "https://video.stackexchange.com",
      "name": "Video Production"
  },
  "video.meta": {
      "root": "https://video.meta.stackexchange.com",
      "name": "Video Production Meta"
  },
  "webapps": {
      "root": "https://webapps.stackexchange.com",
      "name": "Web Applications"
  },
  "webapps.meta": {
      "root": "https://webapps.meta.stackexchange.com",
      "name": "Web Applications Meta"
  },
  "webmasters": {
      "root": "https://webmasters.stackexchange.com",
      "name": "Webmasters"
  },
  "webmasters.meta": {
      "root": "https://webmasters.meta.stackexchange.com",
      "name": "Webmasters Meta"
  },
  "woodworking": {
      "root": "https://woodworking.stackexchange.com",
      "name": "Woodworking"
  },
  "woodworking.meta": {
      "root": "https://woodworking.meta.stackexchange.com",
      "name": "Woodworking Meta"
  },
  "wordpress": {
      "root": "https://wordpress.stackexchange.com",
      "name": "WordPress Development"
  },
  "wordpress.meta": {
      "root": "https://wordpress.meta.stackexchange.com",
      "name": "WordPress Development Meta"
  },
  "workplace": {
      "root": "https://workplace.stackexchange.com",
      "name": "The Workplace"
  },
  "workplace.meta": {
      "root": "https://workplace.meta.stackexchange.com",
      "name": "The Workplace Meta"
  },
  "worldbuilding": {
      "root": "https://worldbuilding.stackexchange.com",
      "name": "Worldbuilding"
  },
  "worldbuilding.meta": {
      "root": "https://worldbuilding.meta.stackexchange.com",
      "name": "Worldbuilding Meta"
  },
  "writing": {
      "root": "https://writing.stackexchange.com",
      "name": "Writing"
  },
  "writing.meta": {
      "root": "https://writing.meta.stackexchange.com",
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
