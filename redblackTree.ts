
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
            }
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

        constructor(key:number,value:T,isRed:boolean){
            this.key = key
            this.value = value
            this.isRed = isRed
        }

        

        

        static fix<T>(self:RedBlackNode<T>,root:RedBlackNode<T>){
            
            if(self === root){
                self.isRed = false
            }else if(self.parent.isRed){
                var parent = self.parent
                var grandparent = parent.parent
                var uncle = parent.getBrother()

                if(uncle.isRed){
                    parent.isRed = false
                    uncle.isRed = false
                    grandparent.isRed = true
                    RedBlackNode.fix(grandparent,root)
                }else{//black uncle
                    var cases:Side[] = [self.isLeftOrRightChild(),parent.isLeftOrRightChild()]


                }
            }
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
            RedBlackNode.fix(self,root)
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

        static rotate<T>(self:RedBlackNode<T>, side:Side){
            var oppositeSide:Side = swapSide(side)
            var child:RedBlackNode<T> = self.get(oppositeSide)
            var grandchild:RedBlackNode<T> = child.get(side)
            var parent = self.parent

            self.children[oppositeSide] = grandchild
            self.parent = child
            child.parent = parent
            child.children[side] = self
            grandchild.parent = self
        }

        get(side:Side):RedBlackNode<T>{
            return this.children[side]
        }

        set(side:Side,node:RedBlackNode<T>){
            this.children[side] = node
        }
    }
}