/// <reference path="binaryTree.ts" />
/// <reference path="redblackTree.ts" />

var redblackTree = new BinaryTree.RedBlackTree()

var keys:number[] = [0,1,2,3,4,5,6,7,8,9]

for(var key of keys){
    redblackTree.insert(key,0)
    console.clear()
    for(var arr of redblackTree.toArray()){
        console.log(arr.map((node) => `${node.key},${node.isRed}`))
    }
}

// redblackTree