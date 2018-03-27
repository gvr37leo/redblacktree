
namespace BinaryTree{

    //1 a node is either red or black
    //2 the root and nil nodes are black
    //3 if a node is red then its children are black
    //4 all paths from a node to its nil descendants contain the same number of black nodes


    export class RedBlackTree<T>{

        root:RedBlackNode<T> = null

        insert(key:number,val:T){
            if(this.root === null){
                this.root = new RedBlackNode(key,val,Color.black)
            }else{
                RedBlackNode.rbInsert(this.root,new RedBlackNode(key,val,Color.red),this.root)
                this.root = RedBlackNode.getRoot(this.root)
            }
        }

        print(ctxt:CanvasRenderingContext2D,center:number,totalwidth:number){
            var array:RedBlackNode<T>[][] = this.toArray()
            RedBlackNode.print(this.root,ctxt,totalwidth,center,0)
        }

        toArray():RedBlackNode<T>[][]{
            var array:RedBlackNode<T>[][] = []
            RedBlackNode.toArray(this.root,array,0)
            return array
        }
    }

    enum Side{left = 0,right = 1}

    enum Color{red,black,doubleBlack}

    function swapSide(side:Side):Side{
        return 1 - side
    }
    
    class RedBlackNode<T>{
        children:RedBlackNode<T>[] = [null,null]
        parent:RedBlackNode<T>
        key:number
        value:T
        color:Color

        constructor(key:number,value:T,color:Color){
            this.key = key
            this.value = value
            this.color = color
        }

        static getRoot<T>(node:RedBlackNode<T>):RedBlackNode<T>{
            if(node.parent == null){
                return node
            }else{
                return RedBlackNode.getRoot(node.parent)
            }
        }

        static toArray<T>(node:RedBlackNode<T>,array:RedBlackNode<T>[][],depth:number){
            
            if(array[depth] == null){
                array[depth] = []
            }
            if(node == null){
                array[depth].push(null)    
                return
            }

            array[depth].push(node)
            RedBlackNode.toArray(node.get(Side.left),array,depth + 1)
            RedBlackNode.toArray(node.get(Side.right),array,depth + 1)
        }

        static print<T>(self:RedBlackNode<T>,ctxt:CanvasRenderingContext2D,totalwidth:number,x:number,level:number){
            if(self == null){
                return
            }
            var offset = totalwidth / Math.pow(2,level + 2)

            self.draw(ctxt,new Vector2(x,level * 50 + 50),level)

            RedBlackNode.print(self.get(Side.left),ctxt,totalwidth,x - offset,level + 1)
            RedBlackNode.print(self.get(Side.right),ctxt,totalwidth,x + offset,level + 1)
        }
        
        draw(ctxt:CanvasRenderingContext2D, v:Vector2,depth:number){
            ctxt.beginPath()
            if(RedBlackNode.isRed(this)){
                ctxt.fillStyle = 'red'
            }else{
                ctxt.fillStyle = 'black'
            }
            ctxt.arc(v.x,v.y,40 / (Math.pow(2,depth) / (depth + 1 )) + 2,0,2 * Math.PI,false)
            ctxt.fill()
        }

        static insertfix<T>(self:RedBlackNode<T>,root:RedBlackNode<T>){
            
            if(self === root){
                self.color = Color.black
            }else if(RedBlackNode.isRed(self.parent)){
                var parent = self.parent
                var grandparent = parent.parent
                var uncle = parent.getBrother()

                if(RedBlackNode.isRed(uncle)){
                    parent.color = Color.black
                    uncle.color = Color.black
                    grandparent.color = Color.red
                    RedBlackNode.insertfix(grandparent,root)
                }else{//black uncle
                    var cases:Side[] = [parent.isLeftOrRightChild(),self.isLeftOrRightChild()]
                    
                    

                    if(cases[0] == Side.left){
                        if(cases[1] == Side.left){//left-left
                            RedBlackNode.lineRotate(self,Side.right)
                        }else{//left-right
                            RedBlackNode.rotate(parent,Side.left)
                            RedBlackNode.lineRotate(self,Side.right)
                        }
                    }else{
                        if(cases[1] == Side.left){//right-left
                            RedBlackNode.rotate(parent,Side.right)
                            RedBlackNode.lineRotate(self,Side.left)
                        }else{//right-right
                            RedBlackNode.lineRotate(self,Side.left)
                        }
                    }
                }
            }
        }

        static lineRotate<T>(self:RedBlackNode<T>,side:Side){
            var parent = self.parent
            var grandparent = parent.parent

            RedBlackNode.rotate(grandparent,side)
            var temp = grandparent.color
            grandparent.color = parent.color
            parent.color = temp
        }

        static isBlack<T>(node:RedBlackNode<T>):boolean{
            return !RedBlackNode.isRed(node)
        }

        static isRed<T>(node:RedBlackNode<T>):boolean{
            return node !== null && node.color == Color.red
        }

        getBrother():RedBlackNode<T>{
            return this.parent.get(swapSide(this.isLeftOrRightChild()))
        }

        isLeftOrRightChild<T>():Side{
            if(this === this.parent.get(Side.left)){
                return Side.left
            }else{
                return Side.right
            }
        }

        static rbInsert<T>(self:RedBlackNode<T>,newNode:RedBlackNode<T>,root:RedBlackNode<T>){
            RedBlackNode.insert(self,newNode)
            RedBlackNode.insertfix(newNode,root)
        }

        private static insert<T>(self:RedBlackNode<T>,newNode:RedBlackNode<T>):RedBlackNode<T>{
            return RedBlackNode.switchPath(newNode.key - self.key,
                () => RedBlackNode.insertHelper(self,newNode,Side.left),
                () => RedBlackNode.insertHelper(self,newNode,Side.right),
                () => self
            )
        }

        private static insertHelper<T>(self:RedBlackNode<T>,newNode:RedBlackNode<T>,side:Side):RedBlackNode<T>{
            if(self.children[side] === null){
                newNode.parent = self
                self.children[side] = newNode
                return self.children[side]
            }else{
                return RedBlackNode.insert(self.children[side],newNode)
            }
        }

        static search<T>(self:RedBlackNode<T>,key:number):RedBlackNode<T>{
            if(self === null){
                return null
            }
            return RedBlackNode.switchPath(key - self.key,
                () => RedBlackNode.search(self.get(Side.left),key),
                () => RedBlackNode.search(self.get(Side.right),key),
                () => self
            )
        }

        static rbRemove<T>(self:RedBlackNode<T>,key:number,root:RedBlackNode<T>){
            var outArray:RedBlackNode<T>[] = []
            var removedNode = RedBlackNode.remove(self,key,outArray)
            var replacementNode:RedBlackNode<T> = outArray[0];
            RedBlackNode.removeFix(replacementNode,removedNode,root)
        }

        static removeFix<T>(replacementNode:RedBlackNode<T>,removedNode:RedBlackNode<T>,root:RedBlackNode<T>){
            if(RedBlackNode.isRed(replacementNode) || RedBlackNode.isRed(removedNode)){
                replacementNode.color = Color.black
            }else if(RedBlackNode.isBlack(replacementNode) && RedBlackNode.isBlack(removedNode)){//3
                replacementNode.color = Color.doubleBlack//3.1
                RedBlackNode.doubleBlackFix(replacementNode,root)//3.2
            }
        }

        static doubleBlackFix<T>(replacementNode:RedBlackNode<T>,root:RedBlackNode<T>){
            var sibling = replacementNode.getBrother()
            var parent = replacementNode.parent
                    
            if(RedBlackNode.isBlack(sibling)){//3.2 a b
                var sideOfSibling = sibling.isLeftOrRightChild()
                var sides = [sideOfSibling]
                

                if(RedBlackNode.isRed(sibling.get(Side.left)) && RedBlackNode.isRed(sibling.get(Side.right))){//both red
                    sides.push(sideOfSibling)
                }else if(RedBlackNode.isRed(sibling.get(Side.left))){//left red
                    sides.push(Side.left)
                }else if(RedBlackNode.isRed(sibling.get(Side.right))){//right red
                    sides.push(Side.right)
                }else{//both black
                    sibling.color = Color.red
                    if(replacementNode.parent.color == Color.black){
                        sibling.color = Color.red
                        replacementNode.parent.color = Color.doubleBlack
                        RedBlackNode.doubleBlackFix(replacementNode.parent,root)
                    }else{
                        replacementNode.parent.color = Color.black
                    }
                }


                function rbLineRotate(side:Side){
                    sibling.color = Color.red
                    redChild.color = Color.black
                    RedBlackNode.rotate(sibling,swapSide(side))
                    RedBlackNode.rotate(sibling.parent,side)
                }

                var redChild = sibling.get(sides[1])
                if(sides[0] == Side.left){
                    if(sides[1] == Side.left){//l-l
                        RedBlackNode.rotate(parent,Side.right)
                        redChild.color = Color.black
                    }else{//l-r
                        rbLineRotate(Side.right)   
                    }
                }else{
                    if(sides[1] == Side.left){//r-l
                        rbLineRotate(Side.left)
                    }else{//r-r
                        RedBlackNode.rotate(parent,Side.left)
                        redChild.color = Color.black
                    }
                }

                



            }else{//3.2 c  sibling is red
                replacementNode.parent.color = Color.red
                sibling.color = Color.black
                if(sibling.isLeftOrRightChild() == Side.left){//3.2 c i
                    RedBlackNode.rotate(replacementNode.parent,Side.right)
                }else{//3.2 c ii
                    RedBlackNode.rotate(replacementNode.parent,Side.left)
                }
                // RedBlackNode.doubleBlackFix() //recur for double black
            }
        }

        static remove<T>(self:RedBlackNode<T>,key:number,replacementNode:RedBlackNode<T>[]):RedBlackNode<T>{
            var nodeToRemove:RedBlackNode<T> = RedBlackNode.search(self,key)
            if(nodeToRemove === null){
                return null
            }
            var parent = nodeToRemove.parent
            var side = nodeToRemove.parent.get(Side.left) == nodeToRemove ? Side.left : Side.right
    
            var removeHelper = (side:Side,empty:() => void,full:() => void) => {
                if(nodeToRemove.get(side) == null){
                    empty()
                }else{
                    full()
                }
            }

            var removeLeave = (side2remove:Side) => {
                var child = nodeToRemove.children[side2remove]
                child.parent = nodeToRemove.parent
                parent.children[side] = child
            }
    
            removeHelper(Side.left,
                () => removeHelper(Side.right,
                    () => parent.children[side] = null,//empty-empty
                    () => removeLeave(Side.right)//empty-full
                ),
                () => removeHelper(Side.right,
                    () => removeLeave(Side.left),//full-empty
                    () => {//full-full
                        var leftchild = nodeToRemove.get(Side.left)
                        var rightchild = nodeToRemove.get(Side.right)
                        var middleNode = nodeToRemove.get(Side.left).findExtreme(Side.right)

                        middleNode.parent = parent
                        middleNode.set(Side.left,leftchild)
                        middleNode.set(Side.right,rightchild)
                        leftchild.set(Side.right,null)
                        leftchild.parent = middleNode
                        rightchild.parent = middleNode
                        parent.children[side] = middleNode
                    }
                ),
            )
            return nodeToRemove
        }

        findExtreme(side:Side):RedBlackNode<T>{
            if(this.get(side) == null){
                return this
            }
            return this.findExtreme(side)
        }

        static switchPath<T>(switcher:number,small:() => T,big:() => T,equal:() => T):T{
            if(switcher < 0){
                return small()
            }else if(switcher > 0){
                return big()
            }else{
                return equal()
            }
        }

        static rotate<T>(node:RedBlackNode<T>, side:Side){
            var oppositeSide:Side = swapSide(side)
            var parent:RedBlackNode<T> = node.parent
            var child:RedBlackNode<T> = node.get(oppositeSide)
            var grandchild:RedBlackNode<T> = child.get(side)

            child.parent = parent
            node.set(oppositeSide,grandchild)
            if(grandchild){
                grandchild.parent = node
            }
            if(parent){
                parent.set(node.isLeftOrRightChild(), child)
            }
            child.set(side,node)
            node.parent = child
        }

        get(side:Side):RedBlackNode<T>{
            return this.children[side]
        }

        set(side:Side,node:RedBlackNode<T>){
            this.children[side] = node
        }
    }
}