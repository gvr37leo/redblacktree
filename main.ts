/// <reference path="binaryTree.ts" />
/// <reference path="redblackTree.ts" />

var binaryTree = new BinaryTree.BinaryTree()

var keys:number[] = [32,100,49,3,11,95]

for(var key of keys){
    binaryTree.insert(key,0)
}

var result = binaryTree.search(100)
result = binaryTree.search(13)
var height = binaryTree.getHeight()
binaryTree.remove(13)
binaryTree.remove(11)
binaryTree.search(11)
