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

/*-------------------------Controller.js--------------------------*/
/*
 * controller.js
 * Controls the state of the flashcard app using an instance of a Deck
 * requires makeKey() function defined in cards.js
 */

// Contoller globals
var WORDLISTMGR;

//check for proper html5 support
if (!Modernizr.localstorage) {
  setMsg('Your browser does not support cool features of HTML5 like localstorage, therefore cannot use this app.');
}

// only get URL when necessary in case BlobBuilder.js hasn't defined it yet
get_blob_builder = function() {
    return document.BlobBuilder || document.WebKitBlobBuilder || document.MozBlobBuilder;
}

//show add form
function add() {
  hide('option-container');
  hotkeyDisable();
  document.getElementById('key').value = '';
  //document.getElementById('button-save').onclick = save;
  resetDisplay();
  show('modal-container');
  show('phrase-form');
  document.getElementById('phrase-1').focus();
}

//reset form fields
function cancel() {
  document.getElementById('phrase-1').value = '';
  document.getElementById('phrase-2').value = '';
  hotkeyEnable();
  resetDisplay();
  show('card-container');
  hide('option-container');
  updateDisplay();
}

//do action for a given hotkey
function checkHotkey(e) {
  var key = (window.event) ? event : e;
  //alert(key.keyCode);
  switch(key.keyCode) {
    case 32:
      flip();
      break;
    case 37:
      prev();
      break;
    case 39:
      next();
      break;
    case 40:
    case 38:
      flip();
      break;
  }
}

//return a html option node
function createOptionNode(value, text, is_selected) {
    var opt = document.createElement('option');
    opt.setAttribute('value', value);
    if (is_selected) {
        opt.setAttribute('selected', 'selected');
    }
    opt.appendChild(document.createTextNode(text));
    return opt;
}

//show conf screen for deleting a deck
function deckDelete() {
    hide('deck-choices');
    document.getElementById('deck-delete-name').innerHTML = WORDLISTMGR.active().name;
    document.getElementById('deck-delete-count').innerHTML = WORDLISTMGR.active().length();
    show('deck-delete-conf');
}

//generate drop down list for decks
function deckListCreate() {
    var elm = document.getElementById('deck-list');
    //clear previous entries
    elm.innerHTML = '';
    //static entries
    elm.appendChild(createOptionNode('add', 'Add new'));
    elm.appendChild(createOptionNode('', '----------------'));
    
    //dynamic entries
    for (var i=0 ; i<WORDLISTMGR.length() ; i++) {
        var d = WORDLISTMGR.deck_at_index(i);
        elm.appendChild(createOptionNode(i, d.name+' ('+d.length()+')', (d.key == WORDLISTMGR.active().key)));
    }
}

//show option form for current deck
function deckRename() {
    hide('deck-choices');
    show('deck-form');
    document.getElementById('deck-form-value').focus();
}

//a deck was selected from the dropdown
//do add operation if value='add' was passed
//do nothing if value is blank or current deck is already selected
function deckSelect(value) {
    var current = 'default';
    hide('deck-form');
    switch(value) {
        case '':
        case current:
            //do nothing
            return;
            break;
        case 'add':
            //add operation
            document.getElementById('deck-key').value = '';
            document.getElementById('deck-form-value').value = '';
            hide('deck-choices');
            show('deck-form');
            document.getElementById('deck-form-value').focus();
            break;
        default:
            WORDLISTMGR.deck_load(value);
            updateDisplay();
    }
}

function del() {
  document.getElementById('conf-msg').innerHTML = 'Are you sure you want to delete this card?';
  document.getElementById('conf-yes').onclick = delYes;
  document.getElementById('conf-no').onclick = delNo;
  hide('msg-container');
  optionsClose();
  show('conf');
}

//delete active deck and all cards
function delDeckYes() {
    WORDLISTMGR.deck_delete();
    if (WORDLISTMGR.length() <= 0) {
        init();
    }
    saveDeckCancel();
    updateDisplay();
}

function delNo() {
  hide('conf');
}

function delYes() {
    WORDLISTMGR.active().deleteCard();
    updateDisplay();
    hide('conf');
}

//set form to edit the current card
function edit() {
  var card = WORDLISTMGR.active().current();
  hotkeyDisable();
  resetDisplay();
  document.getElementById('phrase-1').value = card.phrase1;
  document.getElementById('phrase-2').value = card.phrase2;
  document.getElementById('key').value = card.key;
  show('phrase-form');
  document.getElementById('phrase-1').focus();
}

function export_csv() {
    var d = window.open('', 'export '+WORDLISTMGR.active().name);
    d.document.open('text/csv');
    d.document.write('<html><textarea style="margin-top: 2px; margin-bottom: 2px; height: 287px; margin-left: 2px; margin-right: 2px; width: 462px; ">');
    for (var i=0 ; i<WORDLISTMGR.active().length() ; i++) {
        var c = WORDLISTMGR.active().current();
        d.document.write('"'+c.phrase1+'","'+c.phrase2+'"\n');
        WORDLISTMGR.active().next();
    }
    d.document.write('</textarea></html>');
    d.document.close();
    return true;
}

//generate and prompt browser to download a .csv of
//current deck of cards
function eximExport() {
    var bb = new BlobBuilder;
    bb.append("Hello, world!");
    saveAs(bb.getBlob("text/plain;charset=utf-8"), "hello world.txt");
}

function eximImport() {
    hide('exim-button-container');
    show('exim-import-container');
}

// cancel file import
function eximImportCancel() {
    hide('exim-import-container');
    show('exim-button-container');
}

//display alternate phrase
function flip() {
    if (WORDLISTMGR.mode_animations) {
        hotkeyDisable()
        if (document.getElementById('main').style.display == 'none') {
            $('#main-alt').toggle("slide", { direction: "down" }, 300);
            setTimeout("$('#main').toggle('slide', {direction: 'up'}, 300)",300);      
        } else {
            $('#main').toggle("slide", { direction: "up" }, 300);
            setTimeout("$('#main-alt').toggle('slide', {direction: 'down'}, 300)",300);
        }
        setTimeout('hotkeyEnable()', 300);
    } else {
        toggle('main');
        toggle('main-alt');
    }
}

function flipReset() {
    if (WORDLISTMGR.mode_reverse) {
        document.getElementById('main').style.display = 'none';
        document.getElementById('main-alt').style.display = '';
    } else {
        document.getElementById('main').style.display = '';
        document.getElementById('main-alt').style.display = 'none';
    }
}

function hide(id) {
  document.getElementById(id).style.display = 'none';
}

function hotkeyDisable() {
  document.onkeydown = null;
}

function hotkeyEnable() {
  document.onkeydown = checkHotkey;
}

function init() {
  WORDLISTMGR = new DeckMGR('deckmgr');
  //if deckmgr is empty it could be first run or need to be migrated
  if (WORDLISTMGR.length() <= 0) {
    migrationCheck();
    //if still empty, add a default deck
    if (WORDLISTMGR.length() <= 0) {
        var ndx = WORDLISTMGR.createDeck('default');
        WORDLISTMGR.deck_load(ndx);
    }
  }
  updateDisplay();
}

//return false if id is display:none
function isVisible(id) {
    return document.getElementById(id).style.display != 'none';
}

//migrate a previous schema to current if needed
function migrationCheck() {
    
    //prior to OO design
    var c = localStorage["cards"];
    if (c) {
        var deck = new Deck('deck');
        var cards = JSON.parse(localStorage["cards"]);
        for (var ndx=0; ndx < cards.length; ndx++) {
            var oldCard = JSON.parse(localStorage[cards[ndx]]);
            var newCard = new Card({'phrase1':oldCard['1'], 'phrase2':oldCard['2'], 'points':oldCard['points']});
            newCard.save();
            deck.add(newCard);
            localStorage.removeItem(cards[ndx]);
        }
        deck.save();
        localStorage.removeItem("cards");
    }
    
    //migrate to DeckMGR >= 0.6.2
    var deck = localStorage['deck'];
    if (deck) {
        WORDLISTMGR = new DeckMGR('deckmgr');
        
        //copy deck to new format
        var key = 'deck-'+makeKey();
        localStorage[key] = deck;
        
        //set the name
        var d = new Deck(key);
        d.name = 'default';
        d.save();
        
        //add to mgr and cleanup
        WORDLISTMGR.deck_add(key);
        WORDLISTMGR.deck_load(0);
        WORDLISTMGR.save();
        localStorage.removeItem('deck');
    }
}

function msgClose() {
  document.getElementById('msg-container').style.display = 'none';
}

function navShow(){
  show('bottom-panel');
  show('button-delete');
  show('button-edit');
  show('meter');
  show('options-container');
  show('stats');
}

function navHide() {
  hide('add-another');
  hide('bottom-panel');
  hide('button-delete');
  hide('button-edit');
  hide('meter');
  hide('options-container');
  hide('stats');
}

//display next card
function next() {
    hotkeyDisable();
    WORDLISTMGR.active().next();
    if (WORDLISTMGR.mode_animations) {
        if (isVisible('main')) {
            $('#main').hide("slide", { direction: "left" }, 300, function () {updateDisplay()});
        } else {
            $('#main-alt').hide("slide", { direction: "left" }, 300, function () {updateDisplay()});
        }
    } else {
        hide('main');
        updateDisplay();
    }
    //updateDisplay();
}

//hide edit/del options
function optionHide() {
    hide('option-del');
    hide('option-edit');
}

//show edit/del options
function optionShow() {
    show('option-del');
    show('option-edit');
    show('deck-choices');
}

function options() {
    hotkeyDisable();
    hide('phrase-form');
    hide('deck-delete-conf');
    deckListCreate();
    show('modal-container');
    show('option-container');
}

function optionsClose() {
    hotkeyEnable();
    cancel();
    hide('deck-form');
    hide('option-container');
    hide('phrase-form');
    hide('modal-container');
}

//adjust point of card
function pointDown() {
    var card = WORDLISTMGR.active().current();
    card.pointDown();
    card.save();
    next();
}

function pointUp() {
    var card = WORDLISTMGR.active().current();
    card.pointUp();
    card.save();
    next();
}

//display previous card
function prev() {
    hotkeyDisable();
    WORDLISTMGR.active().prev();
    if (WORDLISTMGR.mode_animations) {
        if (isVisible('main')) {
            $('#main').hide("slide", { direction: "right" }, 200, function () {updateDisplay({'direction':'left'})});
        } else {
            $('#main-alt').hide("slide", { direction: "right" }, 200, function () {updateDisplay({'direction':'left'})});
        }
    } else {
        hide('main');
        updateDisplay({'direction':'left'});
    }
}

function reset() {
  document.getElementById('conf-msg').innerHTML = 'Are you sure you want to reset everything?';
  document.getElementById('conf-yes').onclick = resetYes;
  document.getElementById('conf-no').onclick = resetNo;
  hide('msg-container');
  show('conf');
  document.getElementById('conf-no').focus();
}

//clear all blocks that may be showing in the main display
function resetDisplay() {
  hide('add-another');
  hide('card-container');
  hide('option-container');
  hide('phrase-form');
}

function resetYes() {
  localStorage.clear();
  setMsg('Reset settings');
  initDeck();
  hide('conf');
}

function resetNo() {
  setMsg('Reset canceled');
  hide('conf');
}

// save card form
function save() {
  var phrase1 = document.getElementById('phrase-1').value;
  var phrase2 = document.getElementById('phrase-2').value;
  
  if (!phrase1 || !phrase2) {
    return;
  }
  
  var key = document.getElementById('key').value;
  var card;
  var msg = '';
  //key is set -> edit
  if (key) {
    card = new Card({'key':key});
    card.phrase1 = phrase1;
    card.phrase2 = phrase2;
    card.save();
    //msg = 'Card updated';
  } else {
    card = new Card({'phrase1':phrase1,'phrase2':phrase2});
    card.save();
    WORDLISTMGR.active().add(card);
    WORDLISTMGR.active().save();
  }
  
  cancel();
  updateDisplay();
  resetDisplay();
  show('add-another');
  document.getElementById('button-add-another').focus();
  hotkeyEnable();
  setTimeout("msgClose()", 5000);
}

//save deck
function saveDeck() {
    var name = document.getElementById('deck-form-value').value;
    if (!name) {
        return;
    }
    
    var index = document.getElementById('deck-key').value;
    
    var d;
    if (index) {
        //edit
        d = WORDLISTMGR.deck_at_index(index);
        d.name = name;
        d.save();
    } else {
        //add new
        index = WORDLISTMGR.createDeck(name);
    }
    
    //must load to update deckmgr instance
    WORDLISTMGR.deck_load(index);
    
    //update list
    updateDisplay();
    saveDeckCancel();
}

//cancel save operation, redo display
function saveDeckCancel() {
    show('deck-choices');
    hide('deck-form');
    hide('deck-delete-conf');
}

function show(id) {
  document.getElementById(id).style.display = '';
}

//shuffles the deck
function shuffle() {
    WORDLISTMGR.active().shuffle();
    updateDisplay();
}

//show a message dialog
function setMsg(msg, handler) {
  var elm = document.getElementById('msg')
  if (handler) {
    elm.onclick = handler;
  } else {
    elm.onclick = function () {msgClose();};
  }
  elm.innerHTML = msg;
  hide('conf');
  show('msg-container');
}

function setStats(msg) {
  document.getElementById('stats').innerHTML = msg;
}

//toggle visibility of an id
function toggle(id) {
  if (document.getElementById(id).style.display == 'none') {
    document.getElementById(id).style.display = '';
  } else {
    document.getElementById(id).style.display = 'none';
  }
}

function toggleOption(elm) {
    //find option and do work
    switch(elm.id) {
      case 'lows':
        WORDLISTMGR.active().toggleLow();
        break;
      case 'highs':
        WORDLISTMGR.active().toggleHigh();
        break;
      case 'option-animation':
        WORDLISTMGR.toggleAnimation();
        break;
      case 'option-reverse':
        WORDLISTMGR.toggleReverse();
        break;
    }
  updateDisplay();
}

//show/hide the options
function toggleOptionsShow() {
  toggle('options');
  //change container class to show state
  var elm = document.getElementById('options-container');
  if (elm.className == 'on') {
    elm.className = 'off';
  } else {
    elm.className = 'on';
  }
}

//set display for the current card
function updateDisplay(opts) {
    if (opts == undefined) {
        opts = {'direction':'right'};
    }
    flipReset();
    hide('conf');
    var card = WORDLISTMGR.active().current();
    if (!card) {
        // set help text for first run.
        //navHide();
        //hide edit/del options when there are 0 cards
        setMsg('no cards in this deck, click here to add', function () {add();});
        optionHide();
        document.getElementById('main').innerHTML = 'Click here to toggle';
        document.getElementById('main-alt').innerHTML = 'Now add some';
        //document.getElementById('button-add').focus();
        setStats('0 cards');
        show('card-container');
    } else {
        //navShow();
        hide('msg-container');
        optionShow();
        document.getElementById('main').innerHTML = card.phrase1;
        document.getElementById('main-alt').innerHTML = encodeURI(card.phrase2);
        //document.getElementById('meter').innerHTML = card.points;
        document.getElementById('key').value = card.key;
        
        setStats((WORDLISTMGR.active().index+1) + ' / ' + WORDLISTMGR.active().length());
    }
    
    if (WORDLISTMGR.mode_reverse) {
        if (WORDLISTMGR.mode_animations) {
            $('#main-alt').show("slide", { direction: opts['direction'] }, 200);
        } else {
            show('main-alt');
        }
        
    } else {
        if (WORDLISTMGR.mode_animations) {
            $('#main').show("slide", { direction: opts['direction'] }, 200);
        } else {
            show('main');
        }
    }
    
    updateOptions();
    hotkeyEnable();
}

//update the state of the options to show current state
function updateOptions() {
    deckListCreate();
    document.getElementById('deck-key').value = WORDLISTMGR.index;
    document.getElementById('deck-form-value').value = WORDLISTMGR.active().name;
    document.getElementById('option-animation').className = (WORDLISTMGR.mode_animations) ? 'switch-on' : 'switch-off';
    document.getElementById('option-reverse').className = (WORDLISTMGR.mode_reverse) ? 'switch-on' : 'switch-off';
}

/*----------------------------------------------------------------*/

/*------------------------MAIN------------------------------------*/


var localStorage = new Object();
localStorage.removeItem = function (key) {
    delete this[key];
}

