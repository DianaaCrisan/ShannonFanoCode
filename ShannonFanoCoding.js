var newList = [];
var doneMakingTree = 0;
var count = 0;

function Node(char, freq, right, left, children) {
    this.name = char;
    this.freq = freq;
    this.code = '';
    this.right = right;
    this.left = left;
    this.children = children;
}

Node.prototype = {
    isLeaf: function() {
        return this.right == null && this.left == null;
    }
}

function ShannonFanoCoding() {
    this.input; 
    this.list;
    this.table;
    this.root; 
}

ShannonFanoCoding.prototype = {
    init: function(str) {
        this.input = str;
        this.list = this.createTable();
        this.table = this.sortObject();
        this.root = this.createTree()[0];
        /*
        this.createCode();
        this.codes = this.getCodes();
        this.stat = this.stat();
        this.encodedMessage = this.createOutput();
        */
    },

    // create a list of objects {name, freq}
    createTable: function() {
        var str = this.input;
        var list = {};
        for (var i = str.length - 1; i >= 0; i--) {
            char = str[i];
            if (list[char] == undefined) {
                list[char] = 1;
            } else {
                list[char] = ++list[char];
            }
        }
        return list;
    },

    // create a sorted list of objects {name, freq} descending freq
    sortObject: function() {
        var list = [];

        //add all obj {name, freq} in the list array as node object
        for (var key in this.list) {
            if (this.list.hasOwnProperty(key)) {
                list.push(new Node(key, this.list[key], null, null, null));
            }
        }

        //sort list of nodes based on frequency ascending 
        list.sort(function(a, b) {
            if (a.freq < b.freq) return -1;
            if (a.freq > b.freq) return 1;
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
        });

        return list.reverse(); 
    },

    // create the tree
    createTree: function() {
        var list = [].concat(this.table);
        var index = 0;
        var left = [];
        var right = [];

        if (list.length == 1) {
            var x = list.pop();
            list.push(new Node(x.name, x.freq, null, x, x))
        }
        else {
            index = this.findMiddleIndex(list);
            left = this.getChildren(list, index)[0];
            right = this.getChildren(list, index)[1];
            
            var parent = new Node(this.getNamesFrequencies(list)[0], 
                this.getNamesFrequencies(list)[1], 
                right, left, [right, left]);
            newList.push(parent)
            this.recursiveSnannonFano(parent)
        }
        return newList;
    },

    recursiveSnannonFano: function(parent) {
        if (!this.hasLeftLeaf(parent)) {
            leftIndex = this.findMiddleIndex(parent.left)
            left_left = this.getChildren(parent.left, leftIndex)[0]
            left_right = this.getChildren(parent.left, leftIndex)[1]

            parent.left.left = left_left;
            parent.left.right = left_right;
            
            parent.children.push(parent.left)
            parent.left.children = [left_left, left_right];
            this.recursiveSnannonFano(parent.left);
        }

        if (this.hasLeftLeaf(parent) && this.hasRightLeaf(parent)) {
            return;
        }

        if (!this.hasRightLeaf(parent)) {
            rightIndex = this.findMiddleIndex(parent.right)
            right_left = this.getChildren(parent.right, rightIndex)[0]
            right_right = this.getChildren(parent.right, rightIndex)[1]
            
            parent.right.left = right_left;
            parent.right.right = right_right;

            parent.children.push(parent.right)
            parent.right.children = [right_left, right_right];
            this.recursiveSnannonFano(parent.right);
        }
    },

    // create the codes for each character
    createCode: function() {
        (function generating(node, s) {
            if (node == null) return;
            if (node.isLeaf()) {
                node.code = s;
                return;
            }
            generating(node.left, s + '0');
            generating(node.right, s + '1');
        })(this.root[0], '');
    },

    // make a list of objects {char, code}
    getCodes: function() {
        var chars = [];
        var codes = [];
        var list = {};

        //add all obj {name, freq} in the list array as node object
        for (var i = 0; i < this.table.length; i++) {
            chars.push(this.table[i].name);
            codes.push(this.table[i].code);
        }

        for (var i = 0; i < chars.length; i++) {
            list[chars[i]] = codes[i];
        }
        return [chars, codes, list];
    },

    // return the first index of the Node in list for which 
    // the sum of freq to the left >= sum freq right
    findMiddleIndex(list) {
        var freqSum = 0
        var totalFreq = list.reduce((accumulator, object) => {
            return accumulator + object.freq;
        }, 0)

        var index = 0;
        while(freqSum < totalFreq/2) {
            freqSum = freqSum + list[index].freq
            index = index + 1
        }
        return index-1;
    },

    // return 2 sublists obtained by separating the list at index
    getChildren(list, index) {
        var left = []
        var right = []

        for (var i = 0; i <= index; i++) {
            right.push(list[i])
        }

        for (var i = index+1; i < list.length; i++) {
            left.push(list[i])
        }
        return [right, left];
    },

    // concatenates the names and add freq of all nodes in list
    getNamesFrequencies(list) {
        var names = '';
        var freq = 0;

        for (var i = 0; i < list.length; i++) {
            names = names + list[i].name;
            freq = freq + list[i].freq;
        }
        return [names, freq];
    },

    // check if the left child is a leaf
    hasLeftLeaf: function(parent) {
        return parent.left.length == 1;
    },

    // check if the right child is a leaf
    hasRightLeaf: function(parent) {
        return parent.right.length == 1;
    },

    find: function(name) {
        var list = this.table;
        for (var i = 0; i < list.length; i++) {
            if (list[i].name == name) {
                return list[i]
            }
        };
        return false;
    },

    createOutput: function() {
        var str = this.input;
        var list = [];
        for (var i = 0; i < str.length; i++) {
            var node = this.find(str[i]);
            if (node) {
                var code = node.code;
                list.push(code);
            }
        };
        return list;
    },

    stat: function() {
        var result = {
            'totalBitsUncompressed': this.input.length * 8 /* char * ASCII bit*/ ,
            'totalBitsCompressed': 0 /* Total Binary bits */
        }
        result.totalBitsCompressed = this.createOutput().join('').length;

        result['compressionRatio'] = 1 - result.totalBitsCompressed/ result.totalBitsUncompressed;
        return result;
    }
}
