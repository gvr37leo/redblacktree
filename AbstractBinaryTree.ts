/// <reference path="node_modules/vectorx/vector.ts" />


enum Side{left = 0,right = 1}

class BinaryTree<T>{
    root:BinaryTreeNode<T> = null
    size:number = 0

    constructor(){

    }

    insert(key:number,val:T){
        var newNode = new BinaryTreeNode(key,val,null)
        if(this.root === null){
            this.root = newNode
            this.size++
        }else{
            var nodeLocatedAtKey = BinaryTreeNode.insert(this.root,newNode)
            if(newNode == nodeLocatedAtKey){
                this.size++
            }
        }
    }

    search(key:number):T{
        var foundNode = BinaryTreeNode.search(this.root,key)
        if(foundNode === null){
            return null
        } else {
            return foundNode.value
        }
    }

    remove(key:number){
        var removedNode = BinaryTreeNode.remove(this.root,key,[])
        if(removedNode === null){

        }else{
            this.size--
        }
    }

    getHeight(){
        return 0
    }

    draw(ctxt:CanvasRenderingContext2D,center:number,totalwidth:number){
        var array:BinaryTreeNode<T>[][] = []
        BinaryTreeNode.toArray(this.root,array,0)
        BinaryTreeNode.print(this.root,ctxt,totalwidth,center,0)
    }
}

function swapSide(side:Side):Side{
    return 1 - side
}

class BinaryTreeNode<T>{
    key:number
    value:T
    parent:BinaryTreeNode<T>
    children:BinaryTreeNode<T>[] = [null,null]

    constructor(key:number,value:T,parent:BinaryTreeNode<T>){
        this.key = key
        this.value = value
        this.parent = parent
    }

    static print<T>(self:BinaryTreeNode<T>,ctxt:CanvasRenderingContext2D,totalwidth:number,x:number,level:number){
        if(self == null){
            return
        }
        var offset = totalwidth / Math.pow(2,level + 2)

        self.draw(ctxt,new Vector2(x,level * 50 + 50),level)

        BinaryTreeNode.print(self.getChild(Side.left),ctxt,totalwidth,x - offset,level + 1)
        BinaryTreeNode.print(self.getChild(Side.right),ctxt,totalwidth,x + offset,level + 1)
    }

    draw(ctxt:CanvasRenderingContext2D,v:Vector2,depth:number){
        ctxt.beginPath()

        ctxt.fillStyle = 'black'
        ctxt.arc(v.x,v.y, 20,0,2 * Math.PI,false)
        ctxt.fill()
        ctxt.fillStyle = 'white'
        ctxt.fillText(`${this.key}`,v.x,v.y)
    }

    getChild(side:Side):BinaryTreeNode<T>{
        return this.children[side]
    }

    setChild(side:Side,node:BinaryTreeNode<T>){
        this.children[side] = node
    }

    isLeftOrRightChild<T>():Side{
        if(this === this.parent.getChild(Side.left)){
            return Side.left
        }else{
            return Side.right
        }
    }

    getSibling():BinaryTreeNode<T>{
        return this.parent.getChild(swapSide(this.isLeftOrRightChild()))
    }

    getUncle():BinaryTreeNode<T>{
        return this.parent.getSibling()
    }

    findExtreme(side:Side):BinaryTreeNode<T>{
        if(this.getChild(side) == null){
            return this
        }
        return this.findExtreme(side)
    }

    static insert<T>(node:BinaryTreeNode<T>,newNode:BinaryTreeNode<T>):BinaryTreeNode<T>{
        if(newNode.key - node.key < 0){
            return BinaryTreeNode.insertHelper(node,newNode,Side.left)
        }else if(newNode.key - node.key > 0){
            return BinaryTreeNode.insertHelper(node,newNode,Side.right)
        }else{
            return node
        }
    }

    private static insertHelper<T>(self:BinaryTreeNode<T>,newNode:BinaryTreeNode<T>,side:Side):BinaryTreeNode<T>{
        if(self.children[side] === null){
            newNode.parent = self
            self.children[side] = newNode
            return self.children[side]
        }else{
            return BinaryTreeNode.insert(self.children[side],newNode)
        }
    }

    static search<T>(self:BinaryTreeNode<T>,key:number):BinaryTreeNode<T>{
        if(self === null){
            return null
        }
        
        if(key - self.key < 0){
            return BinaryTreeNode.search(self.getChild(Side.left),key);
        }else if(key - self.key > 0){
            return BinaryTreeNode.search(self.getChild(Side.right),key);
        }else{
            return self
        }
    }

    static rotate<T>(node:BinaryTreeNode<T>, side:Side){
        var oppositeSide:Side = swapSide(side)
        var parent:BinaryTreeNode<T> = node.parent
        var child:BinaryTreeNode<T> = node.getChild(oppositeSide)
        var grandchild:BinaryTreeNode<T> = child.getChild(side)

        child.parent = parent
        node.setChild(oppositeSide,grandchild)
        if(grandchild){
            grandchild.parent = node
        }
        if(parent){
            parent.setChild(node.isLeftOrRightChild(), child)
        }
        child.setChild(side,node)
        node.parent = child
    }

    static remove<T>(self:BinaryTreeNode<T>,key:number,root:BinaryTreeNode<T>,outReplacementNode:BinaryTreeNode<T>[]):BinaryTreeNode<T>{
        var nodeToRemove:BinaryTreeNode<T> = BinaryTreeNode.search(self,key)
        if(nodeToRemove === null){
            return null
        }
        var parent = nodeToRemove.parent
        var side = nodeToRemove.parent.getChild(Side.left) == nodeToRemove ? Side.left : Side.right

        var removeLeave = (side2remove:Side) => {
            var child = nodeToRemove.children[side2remove]
            child.parent = nodeToRemove.parent
            parent.children[side] = child
        }

        if(nodeToRemove.getChild(Side.left) == null){
            if(nodeToRemove.getChild(Side.right) == null){
                parent.children[side]
            }else{
                removeLeave(Side.right)
            }
        }else{
            if(nodeToRemove.getChild(Side.right) == null){
                removeLeave(Side.left)
            }else{
                var leftchild = nodeToRemove.getChild(Side.left)
                var rightchild = nodeToRemove.getChild(Side.right)
                var middleNode = nodeToRemove.getChild(Side.left).findExtreme(Side.right)

                middleNode.parent = parent
                middleNode.setChild(Side.left,leftchild)
                middleNode.setChild(Side.right,rightchild)
                leftchild.setChild(Side.right,null)
                leftchild.parent = middleNode
                rightchild.parent = middleNode
                parent.children[side] = middleNode
            }
        }

        return nodeToRemove
    }

    static toArray<T>(node:BinaryTreeNode<T>,array:BinaryTreeNode<T>[][],depth:number){
            
        if(array[depth] == null){
            array[depth] = []
        }
        if(node == null){
            array[depth].push(null)    
            return
        }

        array[depth].push(node)
        RedBlackNode.toArray(node.getChild(Side.left),array,depth + 1)
        RedBlackNode.toArray(node.getChild(Side.right),array,depth + 1)
    }
}

