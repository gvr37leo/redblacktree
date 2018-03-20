/// <reference path="node_modules/utilsx/utils.ts" />


namespace BinaryTree{
    
    export class BinaryTree<T>{
        root:Node<T> = null
        size:number = 0

        constructor(){

        }

        insert(key:number,val:T){
            var newNode = new Node(key,val,null)
            if(this.root === null){
                this.root = newNode
                this.size++
            }else{
                var nodeLocatedAtKey = Node.insert(this.root,newNode)
                if(newNode == nodeLocatedAtKey){
                    this.size++
                }
            }
        }

        search(key:number):T{
            var foundNode = Node.search(this.root,key)
            if(foundNode === null){
                return null
            } else {
                return foundNode.val
            }
        }

        remove(key:number){
            var removedNode = Node.remove(this.root,key)
            if(removedNode === null){

            }else{
                this.size--
            }
        }

        getHeight(){
            return Node.getHeight(this.root)
        }

        toArray(){
            var array:Node<T>[] = []
            this.root.toArray(array)
            return array
        }
    }

    enum Side{left = 0,right = 1}

    class Node<T>{
        key:number
        val:T
        children:Node<T>[] = [null,null]
        parent:Node<T>

        constructor(key:number,val:T,parent:Node<T>){
            this.key = key
            this.val = val
            this.parent = parent
        }

        toArray(array:Node<T>[]){
            this.get(Side.left).toArray(array)
            array.push(this)
            this.get(Side.right).toArray(array)
        }

        findExtreme(side:Side):Node<T>{
            if(this.get(side) == null){
                return this
            }
            return this.findExtreme(side)
        }

        get(side:Side):Node<T>{
            return this.children[side]
        }

        set(side:Side,node:Node<T>){
            this.children[side] = node
        }

        static getHeight<T>(self:Node<T>):number{
            if(self == null){
                return -1
            }
            var heights = [Node.getHeight(self.get(Side.left)),Node.getHeight(self.get(Side.right))]
            return heights[findbestIndex(heights, v => v)] + 1
        }

        static insert<T>(self:Node<T>,newNode:Node<T>):Node<T>{
            return Node.switchPath(newNode.key - self.key,
                () => Node.insertHelper(self,newNode,Side.left),
                () => Node.insertHelper(self,newNode,Side.right),
                () => self
            )
        }

        private static insertHelper<T>(self:Node<T>,newNode:Node<T>,side:Side):Node<T>{
            if(self.children[side] === null){
                newNode.parent = self
                self.children[side] = newNode
                return self.children[side]
            }else{
                return Node.insert(self.children[side],newNode)
            }
        }

        static search<T>(self:Node<T>,key:number):Node<T>{
            if(self === null){
                return null
            }
            return Node.switchPath(key - self.key,
                () => Node.search(self.get(Side.left),key),
                () => Node.search(self.get(Side.right),key),
                () => self
            )
        }

        static remove<T>(self:Node<T>,key:number):Node<T>{
            var nodeToRemove:Node<T> = Node.search(self,key)
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

        private static switchPath<T>(switcher:number,small:() => T,big:() => T,equal:() => T):T{
            if(switcher < 0){
                return small()
            }else if(switcher > 0){
                return big()
            }else{
                return equal()
            }
        }
    }
}