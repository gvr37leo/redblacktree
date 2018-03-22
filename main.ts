/// <reference path="binaryTree.ts" />
/// <reference path="redblackTree.ts" />

var redblackTree = new BinaryTree.RedBlackTree()

for (let key = 0; key < 100; key++) {
    redblackTree.insert(key,0)
    console.clear()
    for(var arr of redblackTree.toArray()){
        console.log(arr.map((node) => `${node.key},${node.isRed}`))
    }
}
// redblackTree