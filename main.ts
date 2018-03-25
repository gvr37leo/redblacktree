/// <reference path="binaryTree.ts" />
/// <reference path="redblackTree.ts" />

var redblackTree = new BinaryTree.RedBlackTree()
var width = 800
var height = 800

var crret = createCanvas(width,height)
var canvas = crret.canvas
var ctxt = crret.ctxt


for (let key = 0; key < 100; key++) {
    redblackTree.insert(key,0)
    
    ctxt.clearRect(0,0,width,height)
    redblackTree.print(ctxt,(width - 100) / 2,width - 100)   
    
}