function save_chapt(file) {
  var chapt = document.getElementById('phrase-2').value;
 // var phrase2 = document.getElementById('phrase-2').value;
  	var reader = $.get(file,function(inData){
		var csv = inData;
		var data = $.csv.toArrays(csv);
		
		for(var row in data) {

			var phrase1 = '';
			var phrase2 = '';
			
			if (data[row][8] == chapt){
				
				phrase1 = data[row][2];
				phrase2 = data[row][4];

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
				DECKMGR.active().add(card);
				DECKMGR.active().save();
				}
			}
		}
	});
	
	reader.onerror = function(){ alert('Unable to read ' + file.fileName);};

  cancel();
  updateDisplay();
  resetDisplay();
  show('add-another');
  document.getElementById('button-add-another').focus();
  hotkeyEnable();
  setTimeout("msgClose()", 5000);
}



