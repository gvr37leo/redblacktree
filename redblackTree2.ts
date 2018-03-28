/// <reference path="AbstractBinaryTree.ts" />


class RedBlackNode<T> extends BinaryTreeNode<T>{
    red:boolean

    static isRed<T>(node:RedBlackNode<T>):boolean{
        return node !== null && node.red
    }

    static isBlack<T>(node:RedBlackNode<T>):boolean{
        return !RedBlackNode.isRed(node)
    }

    static insert<T>(node:BinaryTreeNode<T>,newNode:BinaryTreeNode<T>):BinaryTreeNode<T>{
        var insertedNode = super.insert(node,newNode)

        return insertedNode
    }

    static insertFix(){
        
    }

    static remove<T>(self:RedBlackNode<T>,key:number,root:RedBlackNode<T>){
        var outArray:RedBlackNode<T>[] = []
        var removedNode = super.remove(self,key,outArray) as RedBlackNode<T>
        var replacementNode:RedBlackNode<T> = outArray[0];
        RedBlackNode.removeFix(replacementNode,removedNode,root)
    }

    static removeFix<T>(replacementNode:RedBlackNode<T>,removedNode:RedBlackNode<T>,root:RedBlackNode<T>){

    }

    static 
}