
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

        getBrother():RedBlackNode<T>{
            if(this === this.parent.children[0]){
                return this.parent.children[1]
            }else{
                return this.parent.children[0]
            }
        }

        static insert<T>(self:RedBlackNode<T>,newNode:RedBlackNode<T>){
            var parent = self.parent
            var grandparent = parent.parent
            var uncle = parent.getBrother()
            if(uncle.isRed){
                //recolor
            }else{
                if(false){//black triangle
                    //rotate z's parent in specific direction
                }else{//black line
                    //rotate z's grandparent in a specific direction & recolor
                }
            }
        }

        static search(){

        }

        static remove(){

        }

        static rotate<T>(self:RedBlackNode<T>, side:Side){
            var oppositeSide:Side = 1 - side
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