// IndexedDB implementations still use API prefixes
var indexedDB = window.indexedDB ||    // Use the standard DB API
    window.mozIndexedDB ||             // Or Firefox's early version of it
    window.webkitIndexedDB;            // Or Chrome's early version
// Firefox does not prefix these two:
var IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction;
var IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange;
var DBversion = 4;
const dbName = "Lexicon";
const CSVLocation = "data/Lexicon.csv";
const DBTableName = "GLexicon";

// We'll use this function to log any database errors that occur
function logerr(e) {
    console.log("IndexedDB error" + e.code + ": " + e.message);
} 

// This function asynchronously obtains the database object (creating and
// initializing the database if necessary) and passes it to the function f().
function withDB(f) {
    console.debug('called withDB()');
    var db;
    var request = window.indexedDB.open(dbName,DBversion); // Request the Lexicon database
    request.onerror = logerr;                 // Log any errors
    request.onsuccess = function() {          // Or call this when done
        db = request.result;  // The result of the request is the database
        //DAO.version = db.version;
        var thisDB = db;
        
        request.onversionchange = function(e){
        write("Version change triggered, so closing database connection", e.oldVersion, e.newVersion, thisDB);
        thisDB.close();
        };

        // You can always open a database, even if it doesn't exist.
        // We check the version to find out whether the DB has been created and
        // initialized yet.  If not, we have to go do that. But if the db is
        // already set up, we just pass it to the callback function f().
        f(thisDB);   // If db is inited, pass it to f()
        // Otherwise initialize it first
    }
    request.onupgradeneeded = function(){initdb(request.result,f)};
}

// Given a zip code, find out what city it belongs to and asynchronously 
// pass the name of that city to the specified callback function.
function lookupWord(Key, callback) {
    console.debug('called lookupWord()');
    withDB(function(db) {
        // Create a transaction object for this query
        var transaction = db.transaction([DBTableName],  // Object stores we need
                              IDBTransaction.READ_ONLY, // No updates
                                         0);            // No timeout

        // Get the object store from the transaction
        var objects = transaction.objectStore(DBTableName);

        // Now request the object that matches the specified zipcode key.
        // The lines above were synchronous, but this one is async
        var request = objects.get(Key);

        request.onerror = logerr;          // Log any errors that occur
        request.onsuccess = function() {   // Pass the result to this function
            // The result object is now in the request.result
            var object = request.result;
            if (object)  // If we found a match, pass city and state to callback
                callback(object.Key + ", " + object.POS);
            else         // Otherwise, tell the callback that we failed
                callback("Unknown Lexicon code");
        }
    });
}

// Given the name of a city find all zipcodes for all cities (in any state)
// with that name (case-sensitive).  Asynchronously pass the results, one at
// a time, to the specified callback function
function lookupPOS(POS, callback) {
    console.debug('called lookupPOS()');
    withDB(function(db) {
        // As above, we create a transaction and get the object store
        try {
        var transaction = db.transaction([DBTableName],"readwrite");
        }
        catch (err) {console.log("Caught",err);}
        var store = transaction.objectStore(DBTableName);
        // This time we get the city index of the object store
        var index = store.index("POS");
        
        // This query is likely to have many results, so we have to use a 
        // cursor object to retrieve them all. To create a cursor, we need 
        // a range object that represents the range of keys
        var range = new IDBKeyRange.only(POS);  // A range with only() one key

        // Everything above has been synchronous. 
        // Now we request a cursor, which will be returned asynchronously.
        var request = index.openCursor(range);   // Request the cursor
        request.onerror = logerr;                // Log errors
        request.onsuccess = function() {         // Pass cursor to this function
            // This event handler will be invoked multiple times, once
            // for each record that matches the query, and then once more
            // with a null cursor to indicate that we're done.
            var cursor = request.result    // The cursor is in request.result
            if (!cursor) return;           // No cursor means no more results
            var object = cursor.value      // Get the matching record
            callback(object);              // Pass it to the callback
            cursor.continue();             // Ask for the next matching record
        };
    });
}

// This function is used by an onchange callback in the document below
// It makes a DB request and displays the result
function displayCity(zip) {
    console.debug('called displayCity()');
    lookupCity(zip, function(s) { document.getElementById('city').value = s; });
}

// This is another onchange callback used in the document below.
// It makes a DB request and displays the results
function displayPOS(pos) {
    console.debug('called displayPOS()');
    var output = document.getElementById(DBTableName);
    output.innerHTML = "Matching zipcodes:";
    lookupPOS(pos, function(o) {
        var div = document.createElement("div");
        var text = o.DictForm + ": " + o.Translation + ", " + o.POS;
        div.appendChild(document.createTextNode(text));
        output.appendChild(div);
    });
}

// Set up the structure of the database and populate it with data, then pass
// the database to the function f(). withDB() calls this function if the 
// database has not been initialized yet. This is the trickiest part of the
// program, so we've saved it for last.
function initdb(db, f) {
    console.debug('called initdb()');
    /* Downloading zipcode data and storing it in the database can take
    // a while the first time a user runs this application.  So we have to
    // provide notification while that is going on.*/
    var statusline = document.createElement("div");
    statusline.style.cssText =
        "position:fixed; left:0px; top:0px; width:100%;" +
        "color:white; background-color: black; font: bold 18pt sans-serif;" +
        "padding: 10px; ";
    document.body.appendChild(statusline);
    function status(msg) { statusline.innerHTML = msg.toString(); };
    status("Initializing Lexicon database");
    /*// The only time you can define or alter the structure of an IndexedDB 
    // database is in the onsucess handler of a setVersion request.
    var request = db.setVersion("1");       // Try to update the DB version
    request.onerror = status;               // Display status on fail
    request.onsuccess  = function() {       // Otherwise call this function
        // Our zipcode database includes only one object store.  
        // It will hold objects that look like this: {
        //    zipcode: "02134",   // send it to Zoom! :-)
        //    city: "Allston",
        //    state: "MA",
        //    latitude: "42.355147",
        //    longitude: "-71.13164"
        // }
        // 
        // We'll use the "zipcode" property as the database key
        // And we'll also create an index using the city name

        // Create the object store, specifying a name for the store and
        // an options object that includes the "key path" specifying the
        // property name of the key field for this store. (If we omit the 
        // key path, IndexedDB will define its own unique integer key.)*/
    try{
    blah = db.deleteObjectStore(DBTableName)
    }
    catch(err){console.log("Caught: "+err);}
    var store = db.createObjectStore(DBTableName, { keyPath: "Key" });
    /* Now index the object store by city name as well as by zipcode.
        // With this method the key path string is passed directly as a
        // required argument rather than as part of an options object.*/
    store.createIndex("Key", "POS");
    /*// Now we need to download our zipcode data, parse it into objects
        // and store those objects in object store we created above.
        // 
        // Our file of raw data contains lines formatted like this:
        // 
        //   02130,Jamaica Plain,MA,42.309998,-71.11171
        //   02131,Roslindale,MA,42.284678,-71.13052
        //   02132,West Roxbury,MA,42.279432,-71.1598
        //   02133,Boston,MA,42.338947,-70.919635
        //   02134,Allston,MA,42.355147,-71.13164
        //
        // Surprisingly, the US Postal Service does not make this data freely
        // available, so we use out-of-date census-based zipcode data from:
        // http://mappinghacks.com/2008/04/28/civicspace-zip-code-database/

        // We use XMLHttpRequest to download the data.  But use the new XHR2
        // onload and onprogress events to process it as it arrives
        var xhr = new XMLHttpRequest();   // An XHR to download the data
        xhr.open("GET", CSVLocation);  // HTTP GET for this URL
        xhr.send();                       // Start right away
        xhr.onerror = status;             // Display any error codes
        var lastChar = 0, numlines = 0;   // How much have we already processed?

        // Handle the database file in chunks as it arrives
        xhr.onprogress = xhr.onload = function(e) {  // Two handlers in one!
            // We'll process the chunk between lastChar and the last newline
            // that we've received.  (We need to look for newlines so we don't
            // process partial records)
            var lastNewline = xhr.responseText.lastIndexOf("\n");
            if (lastNewline > lastChar) {
                var chunk = xhr.responseText.substring(lastChar, lastNewline)
                lastChar = lastNewline + 1;   // Where to start next time

                // Now break the new chunk of data into individual lines
                var lines = chunk.split("\n");
                numlines += lines.length;*/
    /* In order to insert zipcode data into the database we need a
                // transaction object. All the database insertions we make
                // using this object will be commited to the database when this
                // function returns and the browser goes back to the event
                // loop.  To create our transaction object, we need to specify
                // which object stores we'll be using (we only have one) and we
                // need to tell it that we'll be doing writes to the database,
                // not just reads:*/    
    var transaction = db.transaction([DBTableName], IDBTransaction.READ_WRITE);
    // Get our object store from the transaction
    var store = transaction.objectStore(DBTableName);

    var file= CSVLocation
    var reader = $.get(file,function(inData){
    var csv = inData;
    var data = $.csv.toArrays(csv);
    var numlines = 0;
    for(var fields in data) {
        numlines=numlines+1;  
        var record = {           // This is the object we'll store
                        Key: fields[0],  // All properties are string
                        POS: fields[1], 
                        DictForm: fields[2],
                        Transliteration: fields[3], 
                        Translation: fields[4],
                        SpecialTags: fields[5],
                        LinkedTo: fields[6],
                        Mnemonic: fields[7],
                        Chapter: fields[8],
                        DifficultyPreset: fields[9],
                        Type: fields[10],
                        Subtype: fields[11],
                        Case_: fields[12],
                        Num: fields[13],
                        Gender: fields[14],
                        Person: fields[15],
                        Tense: fields[16],
                        Voice: fields[17],
                        Mood: fields[18]
                };        
        store.put(record);
    }});
    reader.onerror = function(){ alert('Unable to read ' + file.fileName); };           
    /* Now loop through the lines of the zipcode file, create
                // objects for them, and add them to the object store.
                for(var i = 0; i < lines.length; i++) {
                    var fields = lines[i].split(","); // Comma-separated values
                    var record = {           // This is the object we'll store
                        Key: fields[0],  // All properties are string
                        POS: fields[1], 
                        DictForm: fields[2],
                        Transliteration: fields[3], 
                        Translation: fields[4],
                        SpecialTags: fields[5],
                        LinkedTo: fields[6],
                        Mnemonic: fields[7],
                        Chapter: fields[8],
                        DifficultyPreset: fields[9],
                        Type: fields[10],
                        Subtype: fields[11],
                        Case_: fields[12],
                        Num: fields[13],
                        Gender: fields[14],
                        Person: fields[15],
                        Tense: fields[16],
                        Voice: fields[17],
                        Mood: fields[18]
                    };

                    // The best part about the IndexedDB API is that object
                    // stores are *really* simple.  Here's how we add a record:
                    store.put(record);   // Or use add() to avoid overwriting
                }*/
    status("Initializing Lexicon database: loaded " + numlines + " records.");
    if (e.type == "load") { 
                // If this was the final load event, then we've sent all our
                // zipcode data to the database.  But since we've just blasted
                // it with some 40,000 records, it may still be processing.
                // So we'll make a simple query. When it succeeds, we know
                // that the database is ready to go, and we can then remove
                // the status line and finally call the function f() that was
                // passed to withDB() so long ago
                lookupWord("42", function(s) {  // diakonos
                    document.body.removeChild(statusline);
                    withDB(f);
                });
            }
}
    



//THIS IS IMPORTANT - It shows how to use an HTML5 Cached .csv file
//printTable('data/Lexicon.csv')
function printTable(file) {
    //$('#list').append(file+'<br>');
    var reader = $.get(file,function(inData){
      var csv = inData;
      //$('#list').append(csv+'<br>'); //This will print the file
      var data = $.csv.toArrays(csv);
      var html = '';
      for(var row in data) {
        html += '<tr><br />';
        for(var item in data[row]) {
          html += '<td>' + data[row][item] + '</td>\r\n';
        }
        html += '</tr><br/>';
      }
      $('#contents').append(html);
      //$('#list').append(html);
    });
    reader.onerror = function(){ alert('Unable to read ' + file.fileName); };
}