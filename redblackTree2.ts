/// <reference path="AbstractBinaryTree.ts" />


class RedBlackNode<T>{
    node:BinaryTreeNode<T>
    red:boolean

    static isRed<T>(node:RedBlackNode<T>):boolean{
        return node !== null && node.red
    }

    static isBlack<T>(node:RedBlackNode<T>):boolean{
        return !RedBlackNode.isRed(node)
    }

    static insert<T>(node:BinaryTreeNode<T>,newNode:BinaryTreeNode<T>):BinaryTreeNode<T>{
        var insertedNode = BinaryTreeNode.insert(node,newNode)

        return insertedNode
    }

    static insertFix(){
        
    }

    static remove<T>(self:RedBlackNode<T>,key:number,root:RedBlackNode<T>,outReplacementNode:RedBlackNode<T>[]):RedBlackNode<T>{
        var outArray:BinaryTreeNode<T>[] = []
        var removedNode = BinaryTreeNode.remove(self.node,key,root.node,outArray)
        var replacementNode:RedBlackNode<T> = outArray[0];
        RedBlackNode.removeFix(replacementNode,removedNode,root)
        return null
    }

    static removeFix<T>(replacementNode:RedBlackNode<T>,removedNode:RedBlackNode<T>,root:RedBlackNode<T>){
        if(RedBlackNode.isRed(replacementNode) || RedBlackNode.isRed(removedNode)){
            replacementNode.red = true
        }else if(RedBlackNode.isBlack(replacementNode) && RedBlackNode.isBlack(removedNode)){//3
            // replacementNode.color = Color.doubleBlack//3.1
            RedBlackNode.doubleBlackFix(replacementNode,removedNode.getSibling(),removedNode.parent,root)//3.2
        }
    }

    static doubleBlackFix<T>(doubleBlackNode:RedBlackNode<T>,sibling:RedBlackNode<T>,parent:RedBlackNode<T>,root:RedBlackNode<T>){
                
        if(RedBlackNode.isBlack(sibling)){//3.2 a b
            var sideOfSibling = sibling.isLeftOrRightChild()
            var sides = [sideOfSibling]
            

            if(RedBlackNode.isRed(sibling.getChild(Side.left)) && RedBlackNode.isRed(sibling.getChild(Side.right))){//both red
                sides.push(sideOfSibling)
            }else if(RedBlackNode.isRed(sibling.getChild(Side.left))){//left red
                sides.push(Side.left)
            }else if(RedBlackNode.isRed(sibling.getChild(Side.right))){//right red
                sides.push(Side.right)
            }else{//both black
                sibling.red = true
                if(RedBlackNode.isBlack(parent)){
                    RedBlackNode.doubleBlackFix(parent,parent.getSibling(),parent.parent,root)
                }else{
                    doubleBlackNode.parent.red = false
                }
            }

            function swapSide(side:Side):Side{
                return 1 - side
            }

            function rbTriangleRotate(side:Side){
                sibling.red = true
                redChild.red = false
                RedBlackNode.rotate(sibling,swapSide(side))
                RedBlackNode.rotate(sibling.parent,side)
            }

            var redChild = sibling.getChild(sides[1])
            if(sides[0] == Side.left){
                if(sides[1] == Side.left){//l-l
                    RedBlackNode.rotate(parent,Side.right)
                    redChild.red = false
                }else{//l-r
                    rbTriangleRotate(Side.right)   
                }
            }else{
                if(sides[1] == Side.left){//r-l
                    rbTriangleRotate(Side.left)
                }else{//r-r
                    RedBlackNode.rotate(parent,Side.left)
                    redChild.red = false
                }
            }

            



        }else{//3.2 c  sibling is red
            doubleBlackNode.parent.red = true
            sibling.red = false
            if(sibling.isLeftOrRightChild() == Side.left){//3.2 c i
                RedBlackNode.rotate(doubleBlackNode.parent,Side.right)
            }else{//3.2 c ii
                RedBlackNode.rotate(doubleBlackNode.parent,Side.left)
            }
            // RedBlackNode.doubleBlackFix() //recur for double black
        }
    }
}