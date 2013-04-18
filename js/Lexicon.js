/*----------------------------------------------------------------*\
 * Lexicon Database
 *
 * Derived from Flashwords
 * Renamed Classes: Card -> Word,Deck -> WordList
\*----------------------------------------------------------------*/


/*----------------------------Word.js-----------------------------*/
function Word(opts) {
    if (opts == undefined) { opts = {} };
    this.key = (opts.key) ? opts.key : makeKey();
    //set attrs if key is in localStorage
    if (localStorage[this.key]) {
        var c = JSON.parse(localStorage[this.key]);
        this.Key = c.Key;
        this.POS = c.POS;
        this.DictForm = c.DictForm;
        this.Transliteration = c.Transliteration;
        this.Translation = c.Translation;
        this.SpecialTags = c.SpecialTags;
        this.LinkedTo = c.LinkedTo;
        this.Mnemonic = c.Mnemonic;
        this.Chapter = c.Chapter;
        this.DifficultyPreset = c.DifficultyPreset;
        this.Type = c.Type;
        this.Subtype = c.Subtype;
        this.Case_ = c.Case_;
        this.Num = c.Num;
        this.Gender = c.Gender;
        this.Person = c.Person;
        this.Tense = c.Tense;
        this.Voice = c.Voice;
        this.Mood = c.Mood;
        this.points = c.points;
        return;
    }
    
    this.Key = (opts.Key) ? opts.Key : '' ;
    this.POS = (opts.POS) ? opts.POS : '' ;
    this.DictForm = (opts.DictForm) ? opts.DictForm : '' ;
    this.Transliteration = (opts.Transliteration) ? opts.Transliteration : '' ;
    this.Translation = (opts.Translation) ? opts.Translation : '' ;
    this.SpecialTags = (opts.SpecialTags) ? opts.SpecialTags : '' ;
    this.LinkedTo = (opts.LinkedTo) ? opts.LinkedTo : '' ;
    this.Mnemonic = (opts.Mnemonic) ? opts.Mnemonic : '' ;
    this.Chapter = (opts.Chapter) ? opts.Chapter : '' ;
    this.DifficultyPreset = (opts.DifficultyPreset) ? opts.DifficultyPreset : '' ;
    this.Type = (opts.Type) ? opts.Type : '' ;
    this.Subtype = (opts.Subtype) ? opts.Subtype : '' ;
    this.Case_ = (opts.Case_) ? opts.Case_ : '' ;
    this.Num = (opts.Num) ? opts.Num : '' ;
    this.Gender = (opts.Gender) ? opts.Gender : '' ;
    this.Person = (opts.Person) ? opts.Person : '' ;
    this.Tense = (opts.Tense) ? opts.Tense : '' ;
    this.Voice = (opts.Voice) ? opts.Voice : '' ;
    this.Mood = (opts.Mood) ? opts.Mood : '' ;
    this.points = (opts.points) ? opts.points : 0;
}

Word.prototype.pointUp = function () {
    this.points +=1;
}

Word.prototype.pointDown = function () {
    this.points -=1;
}

// save this word in localStorage
Word.prototype.save = function () {
  //convert to js object to save space unless I can find a way to restore
  //in the constructure (i.e. this = JSON.parse..)
  var o = new Object();
  o.key = this.key;
  o.Key = this.Key;
  o.POS = this.POS;
  o.DictForm = this.DictForm;
  o.Transliteration = this.Transliteration;
  o.Translation = this.Translation;
  o.SpecialTags = this.SpecialTags;
  o.LinkedTo = this.LinkedTo;
  o.Mnemonic = this.Mnemonic;
  o.Chapter = this.Chapter;
  o.DifficultyPreset = this.DifficultyPreset;
  o.Type = this.Type;
  o.Subtype = this.Subtype;
  o.Case_ = this.Case_;
  o.Num = this.Num;
  o.Gender = this.Gender;
  o.Person = this.Person;
  o.Tense = this.Tense;
  o.Voice = this.Voice;
  o.Mood = this.Mood;
  localStorage[this.key] = JSON_stringify(o,true)
  
  console.log(JSON_stringify(o,true));
  console.log(o);
}

function JSON_stringify(s, emit_unicode) {
   var json = JSON.stringify(s);
   return emit_unicode ? json : json.replace(/[\u007f-\uffff]/g,
      function(c) { 
        return '\\u'+('0000'+c.charCodeAt(0).toString(16)).slice(-4);
      }
   );
}

// return a random string that is not currently used in localStorage as a key
function makeKey() {
    var text = "";
    var max = 10;
    var count = 0;
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  do {
    text ="";
    count += 1;
    for( var i=0; i < 10; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
  } while (localStorage[text] == undefined && count < max);
    return text;
}
/*----------------------------------------------------------------*/


/*---------------------------WordList.js------------------------------*/
/*
 * wordlist.js
 * Defines a WordList class to represent a wordlist of flashwords. A wordlist holds references to
 * Word objects and viewing states
 */

//wordlist constructor
function WordList(key) {
    this.key = key;
    var d;
    //load saved state or set defaults
    if (localStorage[key]) {
        d = JSON.parse(localStorage[key]);
    } else {
        d = {};
    }
    this.name = (d.name) ? d.name : this.key;
    //this.index = (d.index) ? d.index : 0;
    this.index = 0;
    //master_set contains all words in order that they were added
    //this might get deprecated, might just use a single list
    this.master_set = (d.master_set) ? d.master_set : new Array();
    //words is the current ordering based on mutation options, like shuffle
    this.words = this.master_set.slice();

}

//add word to back of wordlist
WordList.prototype.add = function (word) {
    this.master_set.push(word.key);
    this.words.push(word.key);
}

//return current word in wordlist
WordList.prototype.current = function () {
    //if no words in wordlist
    if (this.length() <= 0) {
        return null;
    }
    
    //if index is out of range
    if (this.index < 0) {
        this.index = 0;
    }
    if (this.index >= this.length()) {
        this.index = this.length() -1;
    }
    
    return new Word({'key':this.currentKey()});
}

//return the storage key to the current word
WordList.prototype.currentKey = function () {
    return this.words[this.index];
}

//delete all words in wordlist
WordList.prototype.deleteAllWords = function () {
    while(this.length() > 0) {
        this.deleteWord();
        this.next();
    }
    
    this.save();
}

//delete the current word
WordList.prototype.deleteWord = function () {
    if (this.length() <= 0) {
        return;
    }
    //rm from storage
    localStorage.removeItem(this.currentKey());
    
    //rm from index arrays
    this.master_set.splice(this.master_set.indexOf(this.currentKey()),1);
    this.words.splice(this.index, 1);
    
    //if any filter options are on, and the list is empty
    //restore master_set and clear options
    if (this.words <= 0) {
        this.words = this.master_set.slice();
    }
    this.save();
}

//return number of words in wordlist
WordList.prototype.length = function  () {
    return this.words.length;
}

//update index to next word
WordList.prototype.next = function () {
    this.index +=1;
    if (this.index >= this.length()) {
      this.index = 0;
    }
}

//update index to previous word
WordList.prototype.prev = function () {
    this.index -= 1;
    if (this.index < 0) {
      this.index = this.length() - 1;
    }
}

//mixes up order of words
WordList.prototype.shuffle = function () {
    this.words.sort(function() {return 0.5 - Math.random()});
}

//save this wordlist in localstorage
WordList.prototype.save = function () {
    localStorage[this.key] = JSON_stringify(this,true);
}

function JSON_stringify(s, emit_unicode) {
   var json = JSON.stringify(s);
   return emit_unicode ? json : json.replace(/[\u007f-\uffff]/g,
      function(c) { 
        return '\\u'+('0000'+c.charCodeAt(0).toString(16)).slice(-4);
      }
   );
}
/*----------------------------------------------------------------*/


/*---------------------------wordlistmgr.js---------------------------*/
/*
 * wordlistmgr.js
 * Defines a WordList Manager class to manage wordlists of flashwords. The wordlistmgr holds references to wordlists
 * and holds the viewing preferences
 */

//wordlist constructor
function WordListMGR(key) {
    this.key = key;
    var d;
    //load saved state or set defaults
    if (localStorage[key]) {
        d = JSON.parse(localStorage[key]);
    } else {
        d = {};
        d.mode_animations = true;
    }
    //array to hold references to wordlists
    this.wordlists = (d.wordlists) ? d.wordlists : new Array();
    
    //index of active wordlist in wordlists array
    this.index = (d.index) ? d.index : 0;

    //view option settings
    this.mode_animations = (d.mode_animations) ? true : false;
    this.mode_reverse = (d.mode_reverse) ? true : false;
    
    this.current_wordlist = undefined;
    //set current wordlist, must be done last since it saves at end
    this.wordlist_load(this.index);
}

//return the active wordlist as a wordlist object
WordListMGR.prototype.active = function () {
    return this.current_wordlist;
}

//create a new wordlist to manage with name
//return index where it was added
WordListMGR.prototype.createWordList = function (name) {
    var key = 'wordlist-'+makeKey();
    var d = new WordList(key);
    d.name = name;
    d.save()
    this.wordlist_add(key);
    this.save();
    return this.wordlists.indexOf(key);
}

//add wordlist key to mgr
WordListMGR.prototype.wordlist_add = function (key) {
    this.wordlists.push(key)
}

//delete active wordlist and and words in it
WordListMGR.prototype.wordlist_delete = function () {
    this.active().deleteAllWords();
    //rm wordlist
    localStorage.removeItem(this.active().key);
    this.wordlists.splice(this.index,1);
    this.wordlist_load(0);
    this.save();
}

//return wordlist object at given index
WordListMGR.prototype.wordlist_at_index = function (index) {
    if (index < 0 || index >= this.length()) {
        //index out of range, do nothing
        return null;
    }
    return new WordList(this.wordlists[index]);
}

//set active wordlist to wordlist at index
WordListMGR.prototype.wordlist_load = function (index) {
    if (index < 0 || index >= this.length()) {
        //index out of range, do nothing
        return;
    }
    this.index = index;
    this.current_wordlist = new WordList(this.wordlists[index]);
    this.save();
    
}

//return number of wordlists being managed
WordListMGR.prototype.length = function () {
    return this.wordlists.length;
}

//toggle the mode_animations option
WordListMGR.prototype.toggleAnimation = function () {
    this.mode_animations = (this.mode_animations) ? false : true;
    this.save();
}

//toggle the mode_reverse option
WordListMGR.prototype.toggleReverse = function () {
    this.mode_reverse = (this.mode_reverse) ? false : true;
    this.save();
}

//save the state of this object in localStorage
WordListMGR.prototype.save = function () {
    localStorage[this.key] = JSON_stringify(this, true);
}


function JSON_stringify(s, emit_unicode) {
   var json = JSON.stringify(s);
   return emit_unicode ? json : json.replace(/[\u007f-\uffff]/g,
      function(c) { 
        return '\\u'+('0000'+c.charCodeAt(0).toString(16)).slice(-4);
      }
   );
}
/*----------------------------------------------------------------*/


/*-----------------------Population-------------------------------*/
function initLexicon(file) {
  var Name = "Main_Lexicon";
 // var phrase2 = document.getElementById('phrase-2').value;
  	var reader = $.get(file,function(inData){
		var csv = inData;
		var data = $.csv.toArrays(csv);
		
		for(var row in data) {

			/*
			var phrase1 = '';
			var phrase2 = '';
			*/
			
			var key = document.getElementById('key').value;
			var word;
			var msg = '';
			//key is set -> edit
			if (key) {
			word = new Word({'key':key});
			
			/* //Original Populate:
			//word.phrase1 = phrase1;
			//word.phrase2 = phrase2;
            */
            
            word.Key = data[row][0]; 
            word.POS = data[row][1]; 
            word.DictForm = data[row][2];
            word.Transliteration = data[row][3]; 
            word.Translation = data[row][4];
            word.SpecialTags = data[row][5];
            word.LinkedTo = data[row][6];
            word.Mnemonic = data[row][7];
            word.Chapter = data[row][8];
            word.DifficultyPreset = data[row][9];
            word.Type = data[row][10];
            word.Subtype = data[row][11];
            word.Case_ = data[row][12];
            word.Num = data[row][13];
            word.Gender = data[row][14];
            word.Person = data[row][15];
            word.Tense = data[row][16];
            word.Voice = data[row][17];
            word.Mood = data[row][18];

			word.save();
			//msg = 'Word updated';
			} else {
			word = new Word({
                'Key':data[row][0],
                'POS':data[row][1],
                'DictForm':data[row][2],
                'Transliteration':data[row][3],
                'Translation':data[row][4],
                'SpecialTags':data[row][5],
                'LinkedTo':data[row][6],
                'Mnemonic':data[row][7],
                'Chapter':data[row][8],
                'DifficultyPreset':data[row][9],
                'Type':data[row][10],
                'Subtype':data[row][11],
                'Case_':data[row][12],
                'Num':data[row][13],
                'Gender':data[row][14],
                'Person':data[row][15],
                'Tense':data[row][16],
                'Voice':data[row][17],
                'Mood':data[row][18]
			});
			word.save();
			WORDLISTMGR.active().add(word);
			WORDLISTMGR.active().save();
			}
			
			
			/* Filtering checks
			if (data[row][8] == chapt){
			*/
				
			//phrase1 = data[row][2];
			//phrase2 = data[row][4];

			//Empty Field Check 
			/* should probably check key,POS,etc...
				if (!phrase1 || !phrase2) {
					return;
				}*/
				
				
				
			/*
			}//Filter Check End
			*/
			
		}
	});
	
	reader.onerror = function(){ alert('Unable to read ' + file.fileName);};

  //cancel();
  //updateDisplay();
  //resetDisplay();
  //show('add-another');
  //document.getElementById('button-add-another').focus();
  //hotkeyEnable();
  //setTimeout("msgClose()", 5000);
}
/*----------------------------------------------------------------*/




/*------------------------MAIN------------------------------------*/


var localStorage = new Object();
localStorage.removeItem = function (key) {
    delete this[key];
}

