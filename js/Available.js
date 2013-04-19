/*----------------------------Available.js----------------------*\
Purpose:
This file is essentially a library for <select> population calls
It is to be updated as features or words are added to the project

Potential Improvements:
It is possible to make the data source a .json file rather than straight arrays here; see:
http://stackoverflow.com/questions/815103/jquery-best-practice-to-populate-drop-down
\*--------------------------------------------------------------*/

A_Chapter= [
{text: '(All)',value: '0'},
{text: 'Chapter 3',value: '3'},
{text: 'Chapter 4',value: '4'},
{text: 'Chapter 5',value: '5'},
{text: 'Chapter 6',value: '6'},
{text: 'Chapter 7',value: '7'},
{text: 'Chapter 8',value: '8'},
{text: 'Chapter 9',value: '9'},
{text: 'Chapter 10',value: '10'},
{text: 'Chapter 11',value: '11'},
{text: 'Chapter 12',value: '12'},
{text: 'Chapter 13',value: '13'},
{text: 'Chapter 14',value: '14'},
{text: 'Chapter 15',value: '15'},
{text: 'Chapter 16',value: '16'},
{text: 'Chapter 17',value: '17'},
{text: 'Chapter 18',value: '18'}];

A_POS=[
{text: '(All)',value: '0'},
{text: 'Adjective',value: 'A'},
{text: 'Adverb',value: 'B'},
{text: 'Conjunction',value: 'C'},
{text: 'Interjection',value: 'I'},
{text: 'Particle',value: 'L'},
{text: 'Noun',value: 'N'},
{text: 'Preposition',value: 'P'},
{text: 'Pronoun',value: 'R'},
{text: 'Definite Article',value: 'T'},
{text: 'Verb',value: 'V'},
{text: 'Indeclinable',value: 'Z'}];

A_Case=[
{text: '(All)',value: '0'},
{text: 'Accusative',value: 'A'},
{text: 'Dative',value: 'D'},
{text: 'Genitive',value: 'G'},
{text: 'Nominative',value: 'N'}];

A_Number=[
{text: '(All)',value: '0'},
{text: 'Singular',value: '1'},
{text: 'Plural',value: '2'}];

A_Gender=[
{text: '(All)',value: '0'},
{text: 'Masculine',value: 'M'},
{text: 'Feminine',value: 'F'},
{text: 'Neuter',value: 'N'}];

A_Tense=[
{text: '(All)',value: '0'},
{text: 'Aorist',value: 'A'},
{text: 'Second Aorist',value: 'A2'},
{text: 'Future',value: 'F'},
{text: 'Second Future',value: 'F2'},
{text: 'Imperfect',value: 'I'},
{text: 'Pluperfect',value: 'L'},
{text: 'Second Pluperfect',value: 'L2'},
{text: 'Present',value: 'P'},
{text: 'Perfect',value: 'R'},
{text: 'Second Perfect',value: 'R2'},
{text: 'Adverbial Imperative',value: 'V'},
{text: 'No Voice Stated',value: 'X'}];

A_Voice=[
{text: '(All)',value: '0'},
{text: 'Active',value: 'A'},
{text: 'Middle Deponent',value: 'D'},
{text: 'Either Middle or Passive',value: 'E'},
{text: 'Middle',value: 'M'},
{text: 'Middle or Passive Deponent',value: 'N'},
{text: 'Passive Deponent',value: 'O'},
{text: 'Passive',value: 'P'},
{text: 'Impersonal Active',value: 'Q'},
{text: 'No Voice Stated',value: 'X'}];

A_Mood=[
{text: '(All)',value: '0'},
{text: 'Indicative',value: 'I'},
{text: 'Imperative',value: 'M'},
{text: 'Infinitive',value: 'N'},
{text: 'Optative',value: 'O'},
{text: 'Participle',value: 'P'},
{text: 'Imperative-Sense Participle',value: 'R'},
{text: 'Subjunctive',value: 'S'}];

A_Type=[]; //Type Column is dependent on POS
function get_Type(POS,f){
switch(POS)
{
case 'N': //If Noun, Declension
    A_Type=[
    {text: '(All)',value: '0'},
    {text: 'First Declension',value: '1'},
    {text: 'Second Declension',value: '2'},
    {text: 'Third Declension',value: '3'}];
    break;
case 'A': //If Adjective
case 'B': //If Adverb
case 'L': //If Particle
    A_Type=[
    {text: '(All)',value: '0'},
    {text: 'Comparative',value: 'C'},
    {text: 'Interrogative',value: 'I'},
    {text: 'Negative',value: 'N'},
    {text: 'Superlative',value: 'S'}];
    break;
case 'P': //If Preposition
    A_Type=[
    {text: '(All)',value: '0'},
    {text: 'Single Termination',value: '1'},
    {text: 'Double Termination',value: '2'},
    {text: 'Triple Termination',value: '3'}];
    break;
case 'R': //If Noun
    A_Type=[
    {text: '(All)',value: '0'},
    {text: 'Reciprocal',value: 'C'},
    {text: 'Demonstrative',value: 'D'},
    {text: 'Reflexive',value: 'F'},
    {text: 'Interrogative',value: 'I'},
    {text: 'Correlative',value: 'K'},
    {text: 'Personal',value: 'P'},
    {text: 'Correlative or Interrogative',value: 'Q'},
    {text: 'Relative',value: 'R'},
    {text: 'Posessive',value: 'S'},
    {text: 'Indefinite',value: 'X'}];
    break;
default: //If Verb or otherwise
    break;
}
f(A_Type)
}


function loadSel(name,data) { //Load a select tag "item" with array "data"
    var o = null, i = 0;
    var selBox = name;
    for (var i=0; i < data.length; i++) {
    //Probably need to spell it out better, step by step
        selBox.append( $("<option />").text(data[i].text).val(data[i].value) )
    }
    $(selBox).dropdownchecklist({emptyText: "Please select ..." , width: 150 , firstItemChecksAll: true , maxDropHeight: 150 });// { width: 150 } );
}

//This enumerates selected options
//ITEM=selPOS;outS="{"+ITEM.name+"{";for (var i=0;i<ITEM.selectedOptions.length;i++){outS+=ITEM.selectedOptions[i].value+","};outS+="}}"


function dev_UpdateSummary(name) {
    var outS = '';
    var x=document.getElementById(name);
    for (var i=0;i<x.length;i++){
        var temp=x.elements[i].value
        outS+=temp=x.elements[i].name+"["
        for (var j=0;j<temp.length;j++){
            outS+=$("#"+x.elements[i].name+":selected").val()
        }
        outS+="],"
    }
    return outS;
}

