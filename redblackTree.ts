
namespace BinaryTree{

    //1 a node is either red or black
    //2 the root and nil nodes are black
    //3 if a node is red then its children are black
    //4 all paths from a node to its nil descendants contain the same number of black nodes


    export class RedBlackTree<T>{

        root:RedBlackNode<T> = null

        insert(key:number,val:T){
            if(this.root === null){
                this.root = new RedBlackNode(key,val,false)
            }else{
                RedBlackNode.rbInsert(this.root,new RedBlackNode(key,val,true),this.root)
                this.root = RedBlackNode.getRoot(this.root)
            }
        }

        toArray():RedBlackNode<T>[][]{
            var array:RedBlackNode<T>[][] = []
            RedBlackNode.toArray(this.root,array,0)
            return array
        }
    }

    enum Side{left = 0,right = 1}

    function swapSide(side:Side):Side{
        return 1 - side
    }
    
    class RedBlackNode<T>{
        children:RedBlackNode<T>[] = [null,null]
        parent:RedBlackNode<T>
        key:number
        value:T
        isRed:boolean
        isDoubleBlack:boolean = false

        constructor(key:number,value:T,isRed:boolean){
            this.key = key
            this.value = value
            this.isRed = isRed
        }

        static getRoot<T>(node:RedBlackNode<T>):RedBlackNode<T>{
            if(node.parent == null){
                return node
            }else{
                return RedBlackNode.getRoot(node.parent)
            }
        }

        static toArray<T>(node:RedBlackNode<T>,array:RedBlackNode<T>[][],depth:number){
            if(node == null){
                return
            }
            if(array[depth] == null){
                array[depth] = []
            }

            array[depth].push(node)
            RedBlackNode.toArray(node.get(Side.left),array,depth + 1)
            RedBlackNode.toArray(node.get(Side.right),array,depth + 1)
        }

        static fix<T>(self:RedBlackNode<T>,root:RedBlackNode<T>){
            
            if(self === root){
                self.isRed = false
            }else if(RedBlackNode.isRed(self.parent)){
                var parent = self.parent
                var grandparent = parent.parent
                var uncle = parent.getBrother()

                if(RedBlackNode.isRed(uncle)){
                    parent.isRed = false
                    uncle.isRed = false
                    grandparent.isRed = true
                    RedBlackNode.fix(grandparent,root)
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
            var temp = grandparent.isRed
            grandparent.isRed = parent.isRed
            parent.isRed = temp
        }

        static isBlack<T>(node:RedBlackNode<T>):boolean{
            return !RedBlackNode.isRed(node)
        }

        static isRed<T>(node:RedBlackNode<T>):boolean{
            return node !== null && node.isRed
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
            RedBlackNode.fix(newNode,root)
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
            var removedNode = RedBlackNode.remove(self,key)
            var replacementNode:RedBlackNode<T>;
            RedBlackNode.removeFix(replacementNode,removedNode,root)
        }

        static removeFix<T>(replacementNode:RedBlackNode<T>,removedNode:RedBlackNode<T>,root:RedBlackNode<T>){
            if(replacementNode.isRed || removedNode.isRed){

            }else if(!replacementNode.isRed && !removedNode.isRed){
                replacementNode.isDoubleBlack = true

                if(replacementNode.isDoubleBlack && replacementNode != root){

                    var sibling = replacementNode.getBrother()
                    
                    if(!sibling.isRed && (sibling.get(Side.left).isRed || sibling.get(Side.right).isRed)){

                    }
                }
            }
        }

        static remove<T>(self:RedBlackNode<T>,key:number):RedBlackNode<T>{
            return null
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