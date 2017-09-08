//https://en.wikipedia.org/wiki/Trie

function trieNode(letter){
	this.letter = letter;
	this.parent = null;
	this.children = {};
	this.end = false;
}

function trie(){
	this.root = new trieNode(null);
}

trie.prototype.insert = function(word){
	var node = this.root;
	for (var i = 0; i < word.length; i++){
		if (!node.children[word[i]]){
			node.children[word[i]] = new trieNode(word[i]);
			node.children[word[i]].parent = node;
		}

		node = node.children[word[i]];

		if (word.length - 1 == i){
			node.end = true;
		}
	}
}

trie.prototype.find = function(word){
	var node = this.root;
	for (var i = 0; i < word.length; i++){
		if (node.children[word[i]]){
			node = node.children[word[i]];
		} else {
			return false;
		}
	}

	return node.end;
}
/*
var trie = new trie();
//https://raw.githubusercontent.com/dwyl/english-words/master/words.txt
//C:\\Users\\Nathan Lee\\Documents\\Programming\\Shiritori\\words.txt
$.get('https://raw.githubusercontent.com/dwyl/english-words/master/words.txt',  function(contents){
	var lines = contents.split("\n");

	$.each(lines, function(n, elem){
		trie.insert(elem);
	});

	console.log(trie.find("hello"));
});

*/